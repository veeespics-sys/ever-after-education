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

test('Phase 3 Suite: High School Math Modules Loading & 4-Option MCQ Verification (Grades 8, 9, 10)', async () => {
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
  
  // Verify 4-option MCQ structure with diagnostic explanations
  const step1 = g8Prob.steps[0];
  assert.equal(step1.options.length, 4, 'Each step must contain exactly 4 options');
  const correctOpt = step1.options.find(o => o.isCorrect);
  assert.ok(correctOpt, 'Must have one correct option');
  assert.ok(correctOpt.explanation);
  const wrongOpt = step1.options.find(o => !o.isCorrect);
  assert.ok(wrongOpt, 'Must have distractors');
  assert.ok(wrongOpt.explanation, 'Distractor must contain pedagogical misconception explanation');

  // Verify 3-tier hints
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
  const g9Prob = g9Res.body.problems.find(p => p.id === 'g9_exp_01');
  assert.ok(g9Prob, 'Grade 9 exponent problem exists');
  assert.equal(g9Prob.steps[0].options.length, 4);

  // 3. Fetch Grade 10
  const g10Res = await request(app)
    .get('/api/lessons?grade=Grade%2010')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(g10Res.status, 200);
  assert.equal(g10Res.body.count, 4);
  const g10Prob = g10Res.body.problems.find(p => p.id === 'g10_quad_01');
  assert.ok(g10Prob);
  assert.equal(g10Prob.steps[0].options.length, 4);

  // 4. Fetch all lessons
  const allRes = await request(app)
    .get('/api/lessons')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(allRes.status, 200);
  assert.equal(allRes.body.count, 12, 'Total of 12 problems across Grades 8, 9, 10');
});

test('Phase 3 Suite: Misconception-Driven Step Validation (Correct vs Trap Distractor)', async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const token = loginRes.body.token;

  // Test 1: Grade 8 Step 1 Selecting Correct Option ('opt_1a')
  const valCorrect = await request(app)
    .post('/api/lessons/validate-step')
    .set('Authorization', `Bearer ${token}`)
    .send({
      problemId: 'g8_alg_01',
      stepNumber: 1,
      optionId: 'opt_1a'
    });
  assert.equal(valCorrect.status, 200);
  assert.equal(valCorrect.body.isCorrect, true);
  assert.ok(valCorrect.body.explanation.includes('3 outside multiplies both'));

  // Test 2: Grade 8 Step 1 Selecting Distractor ('opt_1b' - Partial distribution trap)
  const valTrap = await request(app)
    .post('/api/lessons/validate-step')
    .set('Authorization', `Bearer ${token}`)
    .send({
      problemId: 'g8_alg_01',
      stepNumber: 1,
      optionId: 'opt_1b'
    });
  assert.equal(valTrap.status, 200);
  assert.equal(valTrap.body.isCorrect, false);
  assert.ok(valTrap.body.explanation.includes('Partial Distribution Trap'));

  // Test 3: Backward compatible typed text input
  const valTyped = await request(app)
    .post('/api/lessons/validate-step')
    .set('Authorization', `Bearer ${token}`)
    .send({
      problemId: 'g8_alg_01',
      stepNumber: 1,
      learnerInput: '6x - 12 + 5'
    });
  assert.equal(valTyped.status, 200);
  assert.equal(valTyped.body.isCorrect, true);
});

test('Phase 3 Suite: Gamification State & Milestone Badge Unlocks', async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const token = loginRes.body.token;

  // 1. Submit problem completion with 0 hints -> earns base XP + bonus XP
  const subRes = await request(app)
    .post('/api/lessons/submit')
    .set('Authorization', `Bearer ${token}`)
    .send({
      learner_id: 'lrn_kamohelo_01',
      problem_id: 'g8_alg_01',
      hints_used: 0,
      attempts_count: 1
    });
  assert.equal(subRes.status, 200);
  assert.ok(subRes.body.gamification);
  assert.ok(subRes.body.gamification.xpEarned >= 75, 'Should earn base + bonus XP');
  assert.equal(subRes.body.progress.status, 'mastered');

  // Verify milestone badges unlocked
  const unlockedBadges = subRes.body.gamification.badges.map(b => b.id);
  assert.ok(unlockedBadges.includes('badge_first_step'), 'Must unlock First Equation Solved badge');
  assert.ok(unlockedBadges.includes('badge_term_tamer'), 'Must unlock Term Tamer badge for Grade 8');
  assert.ok(unlockedBadges.includes('badge_hint_free'), 'Must unlock Hint-Free Master badge');

  // 2. Fetch Gamification state via API
  const gamRes = await request(app)
    .get('/api/lessons/gamification/lrn_kamohelo_01')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(gamRes.status, 200);
  assert.ok(gamRes.body.gamification.xp >= 75);
  assert.ok(gamRes.body.gamification.badges.length >= 3);
  assert.equal(gamRes.body.gamification.current_streak, 1);
});

test('Phase 3 Suite: Print-Ready Resource Generator Endpoint (Worksheets, Memos, Formulas)', async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const token = loginRes.body.token;

  // Fetch Grade 9 printable resources
  const resPrint = await request(app)
    .get('/api/lessons/resources/Grade%209')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(resPrint.status, 200);
  assert.ok(resPrint.body.resources);
  
  // Formula sheet check
  assert.ok(resPrint.body.resources.formulaSheet.title.includes('Grade 9'));
  assert.ok(resPrint.body.resources.formulaSheet.sections.length > 0);

  // Student worksheet check
  assert.equal(resPrint.body.resources.worksheet.problems.length, 4);
  assert.ok(resPrint.body.resources.worksheet.problems[0].steps.length > 0);

  // Teacher/Parent memo check
  assert.equal(resPrint.body.resources.memo.problems.length, 4);
  assert.ok(resPrint.body.resources.memo.problems[0].solution.length > 0);
  assert.ok(resPrint.body.resources.memo.problems[0].stepBreakdown[0].keyMisconceptionTraps.length > 0);
});

test('Phase 3 Suite: Multi-Family Isolation and Role Protection', async () => {
  // Molefe family login
  const molefeLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'thabo@molefe.co.za', password: 'MolefePass2026!' });
  const molefeToken = molefeLogin.body.token;

  // Liam Van der Merwe is in a different family
  // Cross-family submission attempt
  const crossSub = await request(app)
    .post('/api/lessons/submit')
    .set('Authorization', `Bearer ${molefeToken}`)
    .send({
      learner_id: 'lrn_liam_03',
      problem_id: 'g9_fact_03',
      hints_used: 0
    });
  assert.equal(crossSub.status, 403, 'Cross-family progress submission must return HTTP 403');

  // Cross-family gamification view attempt
  const crossGam = await request(app)
    .get('/api/lessons/gamification/lrn_liam_03')
    .set('Authorization', `Bearer ${molefeToken}`);
  assert.equal(crossGam.status, 403, 'Cross-family gamification inspection must return HTTP 403');
});
