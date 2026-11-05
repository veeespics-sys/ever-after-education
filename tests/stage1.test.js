import './testEnv.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../server/app.js';
import { runSeed } from '../server/db/seed.js';
import { db, DB_PATH } from '../server/db/database.js';

// Setup fresh seed before tests run — strictly isolated to test database
test.before(() => {
  assert.ok(DB_PATH.endsWith('thuto_test.db'), `Tests MUST run on thuto_test.db, but found: ${DB_PATH}`);
  assert.ok(!DB_PATH.endsWith('thuto_dev.db'), 'CRITICAL ERROR: Tests attempted to run on development database!');
  runSeed();
});

test('Stage 1 Suite: System Health & Base Endpoints', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.equal(res.body.platform, 'ThutoBridge (CAPS Adaptive Learning Platform)');
});

test('Stage 1 Suite: Unauthenticated Requests are Blocked', async () => {
  // Accessing protected endpoints without token must return 401
  const learnersRes = await request(app).get('/api/learners');
  assert.equal(learnersRes.status, 401);
  assert.match(learnersRes.body.error, /Authentication required/i);

  const familyRes = await request(app).get('/api/family');
  assert.equal(familyRes.status, 401);
});

test('Stage 1 Suite: User Authentication & Login Verification', async () => {
  // Test invalid login
  const invalidRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'WrongPassword123!' });
  assert.equal(invalidRes.status, 401);

  // Test valid login for Family 1 (Molefe)
  const molefeLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  assert.equal(molefeLogin.status, 200);
  assert.ok(molefeLogin.body.token);
  assert.equal(molefeLogin.body.user.email, 'thabo@molefe.co.za');
  assert.equal(molefeLogin.body.user.role, 'parent');
  assert.equal(molefeLogin.body.user.family_id, 'fam_molefe_01');

  // Test valid login for Family 2 (Van der Merwe)
  const merweLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'annelize@vandermerwe.co.za', password: 'MerwePass2026!' });
  assert.equal(merweLogin.status, 200);
  assert.equal(merweLogin.body.user.family_id, 'fam_vandermerwe_02');
});

test('Stage 1 Suite: New Family & Parent Registration', async () => {
  const uniqueEmail = `parent_${Date.now()}@example.co.za`;
  const regRes = await request(app)
    .post('/api/auth/register')
    .send({
      email: uniqueEmail,
      password: 'SecurePass987!',
      displayName: 'Sipho Zulu',
      familyName: 'Zulu Family'
    });

  assert.equal(regRes.status, 201);
  assert.ok(regRes.body.token);
  assert.equal(regRes.body.user.email, uniqueEmail);
  assert.equal(regRes.body.family.name, 'Zulu Family');
  assert.ok(regRes.body.user.family_id.startsWith('fam_'));
});

test('Stage 1 Suite: CRITICAL — Multi-Family Data Isolation & Tampering Protection', async () => {
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

  // 1. Parent 1 accesses their own learners (Kamohelo and Lesedi)
  const molefeLearners = await request(app)
    .get('/api/learners')
    .set('Authorization', `Bearer ${molefeToken}`);
  assert.equal(molefeLearners.status, 200);
  const molefeNames = molefeLearners.body.learners.map(l => l.first_name);
  assert.ok(molefeNames.includes('Kamohelo'));
  assert.ok(molefeNames.includes('Lesedi'));
  assert.ok(!molefeNames.includes('Liam'), 'Parent 1 MUST NOT see Parent 2 learner in list');

  // 2. Parent 1 attempts to directly fetch Liam (lrn_liam_03) by tampering with the URL ID
  const directTamperGet = await request(app)
    .get('/api/learners/lrn_liam_03')
    .set('Authorization', `Bearer ${molefeToken}`);
  assert.equal(directTamperGet.status, 403, 'Cross-family learner access MUST return HTTP 403 Forbidden');
  assert.match(directTamperGet.body.error, /permission/i);

  // 3. Parent 1 attempts to tamper/edit Liam's record
  const directTamperPut = await request(app)
    .put('/api/learners/lrn_liam_03')
    .set('Authorization', `Bearer ${molefeToken}`)
    .send({ firstName: 'Hacked Liam', grade: 'Grade 12' });
  assert.equal(directTamperPut.status, 403, 'Cross-family learner edit MUST return HTTP 403 Forbidden');

  // Verify in DB that Liam was NOT modified
  const liamCheck = db.prepare('SELECT first_name, grade FROM learners WHERE id = ?').get('lrn_liam_03');
  assert.equal(liamCheck.first_name, 'Liam');
  assert.equal(liamCheck.grade, 'Grade 9');

  // 4. Parent 1 attempts to tamper with Liam's subject enrolments
  const directTamperEnrol = await request(app)
    .post('/api/learners/lrn_liam_03/subjects')
    .set('Authorization', `Bearer ${molefeToken}`)
    .send({ subjectCodes: ['CAPS-FP-MATH'] });
  assert.equal(directTamperEnrol.status, 403, 'Cross-family subject enrolment MUST return HTTP 403 Forbidden');

  // 5. Parent 2 accesses Liam cleanly
  const liamAuthorized = await request(app)
    .get('/api/learners/lrn_liam_03')
    .set('Authorization', `Bearer ${merweToken}`);
  assert.equal(liamAuthorized.status, 200);
  assert.equal(liamAuthorized.body.learner.first_name, 'Liam');
});

test('Stage 1 Suite: Learner Creation and Grade Selection', async () => {
  const molefeAuth = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const token = molefeAuth.body.token;

  // Validation failure on empty first name
  const failRes = await request(app)
    .post('/api/learners')
    .set('Authorization', `Bearer ${token}`)
    .send({ firstName: '', grade: 'Grade 2' });
  assert.equal(failRes.status, 400);

  // Successful creation of a new learner
  const createRes = await request(app)
    .post('/api/learners')
    .set('Authorization', `Bearer ${token}`)
    .send({
      firstName: 'Tebogo',
      preferredName: 'Tebi',
      grade: 'Grade 1',
      avatarCode: 'cub',
      learningNotes: 'Foundation phase numeracy learner',
      initialSubjectCodes: ['CAPS-FP-MATH']
    });

  assert.equal(createRes.status, 201);
  assert.equal(createRes.body.learner.first_name, 'Tebogo');
  assert.equal(createRes.body.learner.grade, 'Grade 1');
  assert.equal(createRes.body.learner.family_id, 'fam_molefe_01');
});

test('Stage 1 Suite: Subject Enrolment & History Preservation (No Silent Loss)', async () => {
  const molefeAuth = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const token = molefeAuth.body.token;

  // Enrol Kamohelo in English First Additional Language
  const enrolRes = await request(app)
    .post('/api/learners/lrn_kamohelo_01/subjects')
    .set('Authorization', `Bearer ${token}`)
    .send({ subjectCodes: ['CAPS-IP-ENG'] });
  assert.equal(enrolRes.status, 200);

  // Check subjects
  const subjectsRes = await request(app)
    .get('/api/learners/lrn_kamohelo_01/subjects')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(subjectsRes.status, 200);
  const enrolledCodes = subjectsRes.body.enrolments.filter(e => e.status === 'active').map(e => e.subject_code);
  assert.ok(enrolledCodes.includes('CAPS-IP-ENG'));

  // Now deactivate (un-enrol) CAPS-IP-ENG
  const unEnrolRes = await request(app)
    .put('/api/learners/lrn_kamohelo_01/subjects/CAPS-IP-ENG')
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'inactive', reason: 'Focusing on Mathematics this term' });

  assert.equal(unEnrolRes.status, 200);
  assert.match(unEnrolRes.body.message, /Historical learning records remain preserved/i);

  // Verify that the record was NOT erased from the database
  const historyCheck = db.prepare(`
    SELECT * FROM learner_enrolment_history 
    WHERE learner_id = 'lrn_kamohelo_01' AND subject_code = 'CAPS-IP-ENG' AND new_status = 'inactive'
  `).get();
  assert.ok(historyCheck, 'Enrolment history record must exist');
  assert.equal(historyCheck.action, 'status_changed');

  // Verify that the enrolment row still exists with status = 'inactive' (no hard delete)
  const enrolmentRow = db.prepare(`
    SELECT * FROM learner_subject_enrolments 
    WHERE learner_id = 'lrn_kamohelo_01' AND subject_code = 'CAPS-IP-ENG'
  `).get();
  assert.ok(enrolmentRow, 'Enrolment row must not be wiped');
  assert.equal(enrolmentRow.status, 'inactive');
});

test('Stage 1 Suite: CAPS Curriculum Filtering by Grade', async () => {
  // Query Grade 4 subjects
  const grade4Res = await request(app).get('/api/curriculum/subjects?grade=Grade 4');
  assert.equal(grade4Res.status, 200);
  const grade4Codes = grade4Res.body.subjects.map(s => s.code);
  assert.ok(grade4Codes.includes('CAPS-IP-MATH'), 'Grade 4 should include Intermediate Maths');
  assert.ok(grade4Codes.includes('CAPS-IP-NST'), 'Grade 4 should include Intermediate NST');
  assert.ok(!grade4Codes.includes('CAPS-FET-MATH'), 'Grade 4 must NOT include FET Phase Maths');

  // Query Grade 11 subjects
  const grade11Res = await request(app).get('/api/curriculum/subjects?grade=Grade 11');
  assert.equal(grade11Res.status, 200);
  const grade11Codes = grade11Res.body.subjects.map(s => s.code);
  assert.ok(grade11Codes.includes('CAPS-FET-MATH'));
  assert.ok(grade11Codes.includes('CAPS-FET-PHYS'));
  assert.ok(!grade11Codes.includes('CAPS-FP-MATH'));
});
