import './testEnv.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../server/app.js';
import { runSeed } from '../server/db/seed.js';
import { db, DB_PATH } from '../server/db/database.js';

test.before(() => {
  assert.ok(DB_PATH.endsWith('thuto_test.db'), `Tests MUST run on thuto_test.db, but found: ${DB_PATH}`);
  assert.ok(!DB_PATH.endsWith('thuto_dev.db'), 'CRITICAL ERROR: Tests attempted to run on development database!');
  runSeed();
});

test('Phase 3 Suite: High School Math Modules Loading & Structure Verification (Grades 8, 9, 10)', async () => {
  // Login as Family 1 parent
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  assert.equal(loginRes.status, 200);
  const token = loginRes.body.token;

  // 1. Fetch Grade 8
  const g8Res = await request(app)
    .get('/api/lessons?grade=Grade%208')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(g8Res.status, 200);
  assert.equal(g8Res.body.count, 4);
  const g8Prob = g8Res.body.problems[0];
  assert.equal(g8Prob.grade, 'Grade 8');
  assert.equal(g8Prob.topic, 'Algebraic Expressions & Equations');
  assert.ok(Array.isArray(g8Prob.steps) && g8Prob.steps.length > 0);
  assert.ok(Array.isArray(g8Prob.solution) && g8Prob.solution.length > 0);
  assert.equal(g8Prob.hints.length, 3, 'Must provide 3 tiers of hints');
  assert.equal(g8Prob.hints[0].tier, 1);
  assert.equal(g8Prob.hints[1].tier, 2);
  assert.equal(g8Prob.hints[2].tier, 3);

  // 2. Fetch Grade 9
  const g9Res = await request(app)
    .get('/api/lessons?grade=Grade%209')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(g9Res.status, 200);
  assert.equal(g9Res.body.count, 4);
  const g9Prob = g9Res.body.problems.find(p => p.id === 'g9_fact_03');
  assert.ok(g9Prob, 'Grade 9 DOTS problem should exist');
  assert.equal(g9Prob.topic, 'Exponents & Factorisation');

  // 3. Fetch Grade 10
  const g10Res = await request(app)
    .get('/api/lessons?grade=Grade%2010')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(g10Res.status, 200);
  assert.equal(g10Res.body.count, 4);
  const g10Prob = g10Res.body.problems.find(p => p.id === 'g10_quad_01');
  assert.ok(g10Prob, 'Grade 10 Quadratic equation problem should exist');
  assert.equal(g10Prob.topic, 'Functions & Quadratic Equations');

  // 4. Fetch all lessons (unfiltered)
  const allRes = await request(app)
    .get('/api/lessons')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(allRes.status, 200);
  assert.equal(allRes.body.count, 12, 'Total of 12 problems across Grades 8, 9, 10');
});

test('Phase 3 Suite: Multi-Step Real-time Answer Validation with Spacing and Commutativity', async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const token = loginRes.body.token;

  // Test 1: Grade 8 Step 1 correct input with flexible spacing
  const val1 = await request(app)
    .post('/api/lessons/validate-step')
    .set('Authorization', `Bearer ${token}`)
    .send({
      problemId: 'g8_alg_01',
      stepNumber: 1,
      learnerInput: '  6x   -  12 + 5  '
    });
  assert.equal(val1.status, 200);
  assert.equal(val1.body.isCorrect, true);

  // Test 2: Grade 8 Step 1 incorrect algebraic input
  const valFail = await request(app)
    .post('/api/lessons/validate-step')
    .set('Authorization', `Bearer ${token}`)
    .send({
      problemId: 'g8_alg_01',
      stepNumber: 1,
      learnerInput: '5x - 10 + 5'
    });
  assert.equal(valFail.status, 200);
  assert.equal(valFail.body.isCorrect, false);
  assert.ok(valFail.body.hint);

  // Test 3: Factorisation commutativity (x - 5)(x + 2) = 0 vs (x + 2)(x - 5) = 0
  const valComm = await request(app)
    .post('/api/lessons/validate-step')
    .set('Authorization', `Bearer ${token}`)
    .send({
      problemId: 'g10_quad_01',
      stepNumber: 1,
      learnerInput: '(x + 2)(x - 5) = 0'
    });
  assert.equal(valComm.status, 200);
  assert.equal(valComm.body.isCorrect, true, 'Commutative factor ordering must be accepted');

  // Test 4: "or" solution commutativity
  const valOr = await request(app)
    .post('/api/lessons/validate-step')
    .set('Authorization', `Bearer ${token}`)
    .send({
      problemId: 'g10_quad_01',
      stepNumber: 3,
      learnerInput: 'x = -2 or x = 5'
    });
  assert.equal(valOr.status, 200);
  assert.equal(valOr.body.isCorrect, true, 'Commutative root order must be accepted');
});

test('Phase 3 Suite: Lesson Submission & Mastery Score Calculation with Hint Penalties', async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const token = loginRes.body.token;

  // Case A: Perfect completion (0 hints used) -> 100% score, 'mastered' status
  const subA = await request(app)
    .post('/api/lessons/submit')
    .set('Authorization', `Bearer ${token}`)
    .send({
      learner_id: 'lrn_kamohelo_01',
      problem_id: 'g8_alg_01',
      hints_used: 0,
      attempts_count: 1
    });
  assert.equal(subA.status, 200);
  assert.equal(subA.body.progress.score, 100);
  assert.equal(subA.body.progress.status, 'mastered');

  // Verify stored in DB
  const dbRecA = db.prepare('SELECT * FROM learner_lesson_progress WHERE learner_id = ? AND problem_id = ?')
    .get('lrn_kamohelo_01', 'g8_alg_01');
  assert.ok(dbRecA);
  assert.equal(dbRecA.score, 100);
  assert.equal(dbRecA.status, 'mastered');

  // Case B: Completed with 2 hints used -> 80% score
  const subB = await request(app)
    .post('/api/lessons/submit')
    .set('Authorization', `Bearer ${token}`)
    .send({
      learner_id: 'lrn_kamohelo_01',
      problem_id: 'g8_alg_02',
      hints_used: 2,
      attempts_count: 2
    });
  assert.equal(subB.status, 200);
  assert.equal(subB.body.progress.score, 80);
  assert.equal(subB.body.progress.status, 'completed');
});

test('Phase 3 Suite: Multi-Family Isolation and Role Protection on Submissions', async () => {
  // Molefe family login
  const molefeLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const molefeToken = molefeLogin.body.token;

  // Van der Merwe family learner is 'lrn_liam_03'
  // Thabo Molefe attempts to submit progress for Liam Van der Merwe -> must be rejected with 403
  const crossSub = await request(app)
    .post('/api/lessons/submit')
    .set('Authorization', `Bearer ${molefeToken}`)
    .send({
      learner_id: 'lrn_liam_03',
      problem_id: 'g9_fact_03',
      hints_used: 0
    });
  assert.equal(crossSub.status, 403, 'Cross-family progress submission must return HTTP 403');

  // Thabo Molefe attempts to view Liam Van der Merwe's progress -> must be rejected with 403
  const crossView = await request(app)
    .get('/api/lessons/progress/lrn_liam_03')
    .set('Authorization', `Bearer ${molefeToken}`);
  assert.equal(crossView.status, 403, 'Cross-family progress inspection must return HTTP 403');
});

test('Phase 3 Suite: Learner Progress Summary & Mastery Telemetry Retrieval', async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const token = loginRes.body.token;

  // Retrieve Kamohelo's progress
  const progRes = await request(app)
    .get('/api/lessons/progress/lrn_kamohelo_01')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(progRes.status, 200);
  assert.ok(progRes.body.summary);
  assert.ok(progRes.body.summary.totalCompleted >= 2);
  assert.ok(progRes.body.summary.averageScore >= 80);
  assert.ok(Array.isArray(progRes.body.records));
});
