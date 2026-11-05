import './testEnv.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import crypto from 'crypto';
import { app } from '../server/app.js';
import { runSeed } from '../server/db/seed.js';
import { db, DB_PATH } from '../server/db/database.js';

test.before(() => {
  assert.ok(DB_PATH.endsWith('thuto_test.db'), `Tests MUST run on thuto_test.db, but found: ${DB_PATH}`);
  assert.ok(!DB_PATH.endsWith('thuto_dev.db'), 'CRITICAL ERROR: Tests attempted to run on development database!');
  runSeed();
});

test('Phase 2 Suite: Parent Generates Secure Invitation with Token Hash', async () => {
  // 1. Log in as Parent of Family 1 (Molefe)
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  assert.equal(loginRes.status, 200);
  const token = loginRes.body.token;

  // 2. Generate invitation for Kamohelo (lrn_kamohelo_01)
  const inviteRes = await request(app)
    .post('/api/invitations')
    .set('Authorization', `Bearer ${token}`)
    .send({ learnerId: 'lrn_kamohelo_01', expiresInDays: 7 });

  assert.equal(inviteRes.status, 201);
  assert.ok(inviteRes.body.invitation);
  assert.equal(inviteRes.body.invitation.learner_id, 'lrn_kamohelo_01');
  assert.equal(inviteRes.body.invitation.status, 'pending');

  // Verify rawToken format: 64 hex characters (32 bytes entropy)
  const rawToken = inviteRes.body.rawToken;
  assert.ok(rawToken);
  assert.equal(rawToken.length, 64);
  assert.match(rawToken, /^[0-9a-f]{64}$/);

  // 3. Verify in database: Raw token must NOT be stored, only SHA-256 hash
  const expectedHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const dbInvite = db.prepare('SELECT * FROM learner_invitations WHERE id = ?').get(inviteRes.body.invitation.id);
  assert.ok(dbInvite, 'Invitation must exist in DB');
  assert.equal(dbInvite.token_hash, expectedHash, 'Database must store SHA-256 hash');
  assert.notEqual(dbInvite.token_hash, rawToken, 'Raw token must never be stored in plain text');
});

test('Phase 2 Suite: Cross-Family Invitation Generation and Revocation Protection', async () => {
  // Log in as Parent of Family 1 (Molefe)
  const molefeAuth = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const molefeToken = molefeAuth.body.token;

  // Log in as Parent of Family 2 (Van der Merwe)
  const merweAuth = await request(app)
    .post('/api/auth/login')
    .send({ email: 'annelize@vandermerwe.co.za', password: 'MerwePass2026!' });
  const merweToken = merweAuth.body.token;

  // 1. Parent 1 attempts to invite Family 2's learner Liam -> HTTP 403
  const crossInviteRes = await request(app)
    .post('/api/invitations')
    .set('Authorization', `Bearer ${molefeToken}`)
    .send({ learnerId: 'lrn_liam_03' });
  assert.equal(crossInviteRes.status, 403, 'Cross-family invitation creation must return 403');

  // 2. Parent 2 creates valid invitation for Liam
  const liamInviteRes = await request(app)
    .post('/api/invitations')
    .set('Authorization', `Bearer ${merweToken}`)
    .send({ learnerId: 'lrn_liam_03' });
  assert.equal(liamInviteRes.status, 201);
  const liamInviteId = liamInviteRes.body.invitation.id;

  // 3. Parent 1 attempts to revoke Parent 2's invitation -> HTTP 404 (not in Family 1)
  const tamperRevokeRes = await request(app)
    .delete(`/api/invitations/${liamInviteId}`)
    .set('Authorization', `Bearer ${molefeToken}`);
  assert.equal(tamperRevokeRes.status, 404);

  // Liam's invitation must still be pending
  const liamCheck = db.prepare('SELECT status FROM learner_invitations WHERE id = ?').get(liamInviteId);
  assert.equal(liamCheck.status, 'pending');
});

test('Phase 2 Suite: Public Invitation Verification and Expiry/Revocation Rejection', async () => {
  const molefeAuth = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const token = molefeAuth.body.token;

  // 1. Create invitation for Lesedi
  const inviteRes = await request(app)
    .post('/api/invitations')
    .set('Authorization', `Bearer ${token}`)
    .send({ learnerId: 'lrn_lesedi_02', expiresInDays: 3 });
  assert.equal(inviteRes.status, 201);
  const rawToken = inviteRes.body.rawToken;
  const inviteId = inviteRes.body.invitation.id;

  // 2. Public verification with valid token
  const verifyRes = await request(app).get(`/api/invitations/verify/${rawToken}`);
  assert.equal(verifyRes.status, 200);
  assert.equal(verifyRes.body.valid, true);
  assert.equal(verifyRes.body.learner.firstName, 'Lesedi');
  assert.equal(verifyRes.body.learner.grade, 'Grade 7');
  assert.equal(verifyRes.body.familyName, 'Molefe Family');

  // 3. Verification with non-existent token -> 404
  const fakeRes = await request(app).get('/api/invitations/verify/0000000000000000000000000000000000000000000000000000000000000000');
  assert.equal(fakeRes.status, 404);

  // 4. Revocation workflow: Parent revokes the invitation
  const revokeRes = await request(app)
    .delete(`/api/invitations/${inviteId}`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(revokeRes.status, 200);

  // 5. Verification on revoked token -> 410 Gone with REVOKED code
  const verifyRevokedRes = await request(app).get(`/api/invitations/verify/${rawToken}`);
  assert.equal(verifyRevokedRes.status, 410);
  assert.equal(verifyRevokedRes.body.code, 'REVOKED');

  // 6. Test Expiry: manually set expires_at in the past
  const expiredInvite = await request(app)
    .post('/api/invitations')
    .set('Authorization', `Bearer ${token}`)
    .send({ learnerId: 'lrn_lesedi_02', expiresInDays: 1 });
  const expRawToken = expiredInvite.body.rawToken;
  db.prepare(`UPDATE learner_invitations SET expires_at = datetime('now', '-2 days') WHERE id = ?`).run(expiredInvite.body.invitation.id);

  const verifyExpiredRes = await request(app).get(`/api/invitations/verify/${expRawToken}`);
  assert.equal(verifyExpiredRes.status, 410);
  assert.equal(verifyExpiredRes.body.code, 'EXPIRED');
});

test('Phase 2 Suite: Learner Onboarding, PIN Setup & Single-Use Enforcement', async () => {
  const molefeAuth = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const token = molefeAuth.body.token;

  // Generate invitation for Kamohelo
  const inviteRes = await request(app)
    .post('/api/invitations')
    .set('Authorization', `Bearer ${token}`)
    .send({ learnerId: 'lrn_kamohelo_01' });
  const rawToken = inviteRes.body.rawToken;

  // 1. PIN Validation Failure: non-numeric or short PIN
  const failPinRes = await request(app)
    .post('/api/invitations/accept')
    .send({ token: rawToken, pin: '12' });
  assert.equal(failPinRes.status, 400);

  // 2. Valid Acceptance with 4-digit PIN '4589'
  const acceptRes = await request(app)
    .post('/api/invitations/accept')
    .send({ token: rawToken, pin: '4589' });
  assert.equal(acceptRes.status, 200);
  assert.ok(acceptRes.body.token);
  assert.equal(acceptRes.body.user.role, 'learner');
  assert.equal(acceptRes.body.learner.firstName, 'Kamohelo');

  // 3. Database verification: PIN is hashed, not plain text
  const creds = db.prepare('SELECT * FROM learner_auth_credentials WHERE learner_id = ?').get('lrn_kamohelo_01');
  assert.ok(creds, 'Credentials row must exist');
  assert.notEqual(creds.pin_hash, '4589');
  assert.ok(creds.pin_hash.startsWith('$2')); // bcrypt prefix

  // 4. Single-use enforcement: Attempting to accept the SAME token again must be rejected
  const reAcceptRes = await request(app)
    .post('/api/invitations/accept')
    .send({ token: rawToken, pin: '4589' });
  assert.equal(reAcceptRes.status, 410, 'Single-use violation must return 410');
  assert.match(reAcceptRes.body.error, /already been used/i);
});

test('Phase 2 Suite: Learner PIN Login, Rate Limiting & 5-Attempt Lockout Protection', async () => {
  // Kamohelo has PIN '4589' from previous test
  // 1. Failed attempt 1
  const fail1 = await request(app)
    .post('/api/auth/learner-login')
    .send({ learnerId: 'lrn_kamohelo_01', pin: '0000' });
  assert.equal(fail1.status, 401);
  assert.equal(fail1.body.remainingAttempts, 4);

  // 2. Failed attempt 2, 3, 4
  await request(app).post('/api/auth/learner-login').send({ learnerId: 'lrn_kamohelo_01', pin: '0000' });
  await request(app).post('/api/auth/learner-login').send({ learnerId: 'lrn_kamohelo_01', pin: '0000' });
  await request(app).post('/api/auth/learner-login').send({ learnerId: 'lrn_kamohelo_01', pin: '0000' });

  // 3. 5th failed attempt -> Triggers lockout
  const fail5 = await request(app)
    .post('/api/auth/learner-login')
    .send({ learnerId: 'lrn_kamohelo_01', pin: '0000' });
  assert.equal(fail5.status, 429);
  assert.equal(fail5.body.locked, true);

  // 4. While locked, even correct PIN '4589' is locked out with 429
  const lockedRes = await request(app)
    .post('/api/auth/learner-login')
    .send({ learnerId: 'lrn_kamohelo_01', pin: '4589' });
  assert.equal(lockedRes.status, 429);
  assert.equal(lockedRes.body.locked, true);

  // 5. Simulate lock expiry and verify successful login
  db.prepare(`UPDATE learner_auth_credentials SET locked_until = NULL, failed_attempts = 0 WHERE learner_id = 'lrn_kamohelo_01'`).run();

  const successLogin = await request(app)
    .post('/api/auth/learner-login')
    .send({ learnerId: 'lrn_kamohelo_01', pin: '4589' });
  assert.equal(successLogin.status, 200);
  assert.ok(successLogin.body.token);
  assert.equal(successLogin.body.user.role, 'learner');
  assert.equal(successLogin.body.learner.firstName, 'Kamohelo');

  // Verify learner JWT can access their own subjects
  const learnerToken = successLogin.body.token;
  const subjectsRes = await request(app)
    .get('/api/learners/lrn_kamohelo_01/subjects')
    .set('Authorization', `Bearer ${learnerToken}`);
  assert.equal(subjectsRes.status, 200);
  assert.ok(subjectsRes.body.enrolments);
});
