import './testEnv.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import Database from 'better-sqlite3';
import { app } from '../server/app.js';
import { runSeed } from '../server/db/seed.js';
import { db, DB_PATH } from '../server/db/database.js';

test.before(() => {
  assert.ok(DB_PATH.endsWith('thuto_test.db'), `Tests MUST run on thuto_test.db, but found: ${DB_PATH}`);
  assert.ok(!DB_PATH.endsWith('thuto_dev.db'), 'CRITICAL ERROR: Tests attempted to run on development database!');
  runSeed();
});

test('Learner Edit Suite: Authorized Edit Updates and Enriched Fields Persist', async () => {
  // 1. Log in as Parent of Family 1 (Molefe)
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  assert.equal(loginRes.status, 200);
  const token = loginRes.body.token;

  // 2. Perform an authorized edit on Kamohelo
  const editRes = await request(app)
    .put('/api/learners/lrn_kamohelo_01')
    .set('Authorization', `Bearer ${token}`)
    .send({
      firstName: 'Kamohelo Updated',
      preferredName: 'Kamo Champ',
      grade: 'Grade 5',
      avatarCode: 'explorer',
      learningNotes: 'Completed Grade 4 curriculum with mastery; progressing to Grade 5.'
    });

  assert.equal(editRes.status, 200);
  assert.equal(editRes.body.message, 'Learner profile updated successfully.');
  assert.equal(editRes.body.gradeChanged, true);

  // Verify enriched payload returned from PUT
  const updatedLearner = editRes.body.learner;
  assert.equal(updatedLearner.id, 'lrn_kamohelo_01');
  assert.equal(updatedLearner.first_name, 'Kamohelo Updated');
  assert.equal(updatedLearner.preferred_name, 'Kamo Champ');
  assert.equal(updatedLearner.grade, 'Grade 5');
  assert.equal(updatedLearner.learning_notes, 'Completed Grade 4 curriculum with mastery; progressing to Grade 5.');
  assert.ok(updatedLearner.active_subject_count !== undefined, 'PUT must return active_subject_count');
  assert.ok(updatedLearner.activity_state !== undefined, 'PUT must return activity_state');

  // 3. Verify single learner fetch GET /api/learners/:id
  const getSingleRes = await request(app)
    .get('/api/learners/lrn_kamohelo_01')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(getSingleRes.status, 200);
  assert.equal(getSingleRes.body.learner.first_name, 'Kamohelo Updated');
  assert.equal(getSingleRes.body.learner.grade, 'Grade 5');

  // 4. Verify family learners list GET /api/learners
  const getListRes = await request(app)
    .get('/api/learners')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(getListRes.status, 200);
  const found = getListRes.body.learners.find(l => l.id === 'lrn_kamohelo_01');
  assert.ok(found, 'Updated learner must be present in family list');
  assert.equal(found.first_name, 'Kamohelo Updated');
  assert.equal(found.grade, 'Grade 5');
  assert.equal(found.preferred_name, 'Kamo Champ');

  // 5. Verify direct database row
  const dbRow = db.prepare('SELECT first_name, preferred_name, grade, learning_notes FROM learners WHERE id = ?').get('lrn_kamohelo_01');
  assert.equal(dbRow.first_name, 'Kamohelo Updated');
  assert.equal(dbRow.preferred_name, 'Kamo Champ');
  assert.equal(dbRow.grade, 'Grade 5');

  // 6. Verify audit log was recorded for the grade transition
  const auditRow = db.prepare(`
    SELECT action, details FROM audit_logs 
    WHERE family_id = 'fam_molefe_01' AND action = 'grade_changed'
    ORDER BY created_at DESC LIMIT 1
  `).get();
  assert.ok(auditRow, 'Grade change must produce an audit log entry');
  assert.match(auditRow.details, /Grade 4 to Grade 5/i);
});

test('Learner Edit Suite: Edits Persist Across Simulated Server & Database Restart', async () => {
  // Simulate complete application restart by opening a brand new Database connection to the file
  const freshDbConnection = new Database(DB_PATH);
  try {
    const persisted = freshDbConnection.prepare(`
      SELECT id, first_name, preferred_name, grade, learning_notes 
      FROM learners 
      WHERE id = 'lrn_kamohelo_01'
    `).get();

    assert.ok(persisted, 'Record must exist in re-opened database');
    assert.equal(persisted.first_name, 'Kamohelo Updated');
    assert.equal(persisted.grade, 'Grade 5');
    assert.equal(persisted.preferred_name, 'Kamo Champ');
  } finally {
    freshDbConnection.close();
  }
});

test('Learner Edit Suite: Edits Persist Across Re-login and Token Regeneration', async () => {
  // Log in afresh to simulate user logging out and logging back in
  const freshLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  assert.equal(freshLogin.status, 200);
  const newToken = freshLogin.body.token;

  // Retrieve learners with fresh session token
  const learnersRes = await request(app)
    .get('/api/learners')
    .set('Authorization', `Bearer ${newToken}`);
  assert.equal(learnersRes.status, 200);

  const kamo = learnersRes.body.learners.find(l => l.id === 'lrn_kamohelo_01');
  assert.ok(kamo);
  assert.equal(kamo.first_name, 'Kamohelo Updated');
  assert.equal(kamo.grade, 'Grade 5');
});

test('Learner Edit Suite: Cross-Family Tamper Rejection on Edit', async () => {
  // Family 1 parent attempts to edit Family 2's learner Liam
  const molefeAuth = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const token = molefeAuth.body.token;

  const tamperRes = await request(app)
    .put('/api/learners/lrn_liam_03')
    .set('Authorization', `Bearer ${token}`)
    .send({ firstName: 'Tampered Liam', grade: 'Grade 12' });

  assert.equal(tamperRes.status, 403);
  assert.match(tamperRes.body.error, /permission|another family/i);

  // Liam must remain untouched in the database
  const liam = db.prepare('SELECT first_name, grade FROM learners WHERE id = ?').get('lrn_liam_03');
  assert.equal(liam.first_name, 'Liam');
  assert.equal(liam.grade, 'Grade 9');
});
