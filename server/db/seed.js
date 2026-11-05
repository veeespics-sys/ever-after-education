import bcrypt from 'bcryptjs';
import { db, initDatabase } from './database.js';
import { CAPS_SUBJECTS } from '../curriculum/capsSubjects.js';

export function runSeed() {
  console.log('[Seed] Initializing database schema...');
  initDatabase();

  // 1. Seed CAPS Curriculum Subjects
  console.log('[Seed] Seeding CAPS curriculum subjects...');
  const insertSubject = db.prepare(`
    INSERT OR REPLACE INTO curriculum_subjects (
      code, title, phase, min_grade, max_grade, description, caps_doc_ref, is_core, verification_status, review_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertManySubjects = db.transaction((subjects) => {
    for (const sub of subjects) {
      insertSubject.run(
        sub.code,
        sub.title,
        sub.phase,
        sub.min_grade,
        sub.max_grade,
        sub.description,
        sub.caps_doc_ref,
        sub.is_core,
        sub.verification_status,
        sub.review_date
      );
    }
  });

  insertManySubjects(CAPS_SUBJECTS);

  const salt = bcrypt.genSaltSync(10);
  const passwordMolefe = bcrypt.hashSync('MolefePass2026!', salt);
  const passwordVanDerMerwe = bcrypt.hashSync('MerwePass2026!', salt);

  const seedFamiliesTx = db.transaction(() => {
    // 2. Clear existing demo families for a clean repeatable state
    db.prepare(`DELETE FROM families WHERE id IN ('fam_molefe_01', 'fam_vandermerwe_02')`).run();

    // 3. Seed Family 1: Molefe Family
    console.log('[Seed] Seeding Family 1 (Molefe Family)...');
    db.prepare(`
      INSERT INTO families (id, name, status)
      VALUES ('fam_molefe_01', 'Molefe Family', 'active')
    `).run();

    db.prepare(`
      INSERT INTO users (id, family_id, email, password_hash, display_name, role)
      VALUES ('usr_thabo_01', 'fam_molefe_01', 'thabo@molefe.co.za', ?, 'Thabo Molefe (Parent)', 'parent')
    `).run(passwordMolefe);

    // Learner 1: Kamohelo (Grade 4)
    db.prepare(`
      INSERT INTO learners (id, family_id, first_name, preferred_name, grade, avatar_code, learning_notes)
      VALUES ('lrn_kamohelo_01', 'fam_molefe_01', 'Kamohelo', 'Kamo', 'Grade 4', 'explorer', 'Enjoys visual geometry and number patterns.')
    `).run();

    // Learner 2: Lesedi (Grade 7)
    db.prepare(`
      INSERT INTO learners (id, family_id, first_name, preferred_name, grade, avatar_code, learning_notes)
      VALUES ('lrn_lesedi_02', 'fam_molefe_01', 'Lesedi', 'Lesedi', 'Grade 7', 'inventor', 'Transitioning from Intermediate to Senior Phase mathematics.')
    `).run();

    // Enrolments for Kamohelo
    db.prepare(`
      INSERT INTO learner_subject_enrolments (id, learner_id, subject_code, status)
      VALUES 
        ('enr_kamo_01', 'lrn_kamohelo_01', 'CAPS-IP-MATH', 'active'),
        ('enr_kamo_02', 'lrn_kamohelo_01', 'CAPS-IP-NST', 'active')
    `).run();

    // Enrolment history for Kamohelo
    db.prepare(`
      INSERT INTO learner_enrolment_history (id, learner_id, subject_code, action, new_status, notes)
      VALUES 
        ('hist_kamo_01', 'lrn_kamohelo_01', 'CAPS-IP-MATH', 'enrolled', 'active', 'Initial Grade 4 enrolment'),
        ('hist_kamo_02', 'lrn_kamohelo_01', 'CAPS-IP-NST', 'enrolled', 'active', 'Initial Grade 4 enrolment')
    `).run();

    // Enrolments for Lesedi
    db.prepare(`
      INSERT INTO learner_subject_enrolments (id, learner_id, subject_code, status)
      VALUES 
        ('enr_lesedi_01', 'lrn_lesedi_02', 'CAPS-SP-MATH', 'active'),
        ('enr_lesedi_02', 'lrn_lesedi_02', 'CAPS-SP-TECH', 'active')
    `).run();

    db.prepare(`
      INSERT INTO learner_enrolment_history (id, learner_id, subject_code, action, new_status, notes)
      VALUES 
        ('hist_lesedi_01', 'lrn_lesedi_02', 'CAPS-SP-MATH', 'enrolled', 'active', 'Senior Phase enrolment')
    `).run();

    // Activity indicators (transparent educational engagement, not surveillance)
    db.prepare(`
      INSERT OR REPLACE INTO learner_activity_states (learner_id, family_id, state, current_subject_code, last_active_at)
      VALUES 
        ('lrn_kamohelo_01', 'fam_molefe_01', 'online', 'CAPS-IP-MATH', datetime('now')),
        ('lrn_lesedi_02', 'fam_molefe_01', 'recently_active', 'CAPS-SP-MATH', datetime('now', '-2 hours'))
    `).run();

    // 4. Seed Family 2: Van der Merwe Family (for testing cross-family data isolation!)
    console.log('[Seed] Seeding Family 2 (Van der Merwe Family for isolation testing)...');
    db.prepare(`
      INSERT INTO families (id, name, status)
      VALUES ('fam_vandermerwe_02', 'Van der Merwe Family', 'active')
    `).run();

    db.prepare(`
      INSERT INTO users (id, family_id, email, password_hash, display_name, role)
      VALUES ('usr_annelize_02', 'fam_vandermerwe_02', 'annelize@vandermerwe.co.za', ?, 'Annelize van der Merwe (Parent)', 'parent')
    `).run(passwordVanDerMerwe);

    // Learner 3: Liam (Grade 9)
    db.prepare(`
      INSERT INTO learners (id, family_id, first_name, preferred_name, grade, avatar_code, learning_notes)
      VALUES ('lrn_liam_03', 'fam_vandermerwe_02', 'Liam', 'Liam', 'Grade 9', 'scientist', 'Focusing on Senior Phase algebraic expressions.')
    `).run();

    db.prepare(`
      INSERT INTO learner_subject_enrolments (id, learner_id, subject_code, status)
      VALUES 
        ('enr_liam_01', 'lrn_liam_03', 'CAPS-SP-MATH', 'active'),
        ('enr_liam_02', 'lrn_liam_03', 'CAPS-SP-NS', 'active')
    `).run();

    db.prepare(`
      INSERT OR REPLACE INTO learner_activity_states (learner_id, family_id, state, current_subject_code, last_active_at)
      VALUES 
        ('lrn_liam_03', 'fam_vandermerwe_02', 'working_on_lesson', 'CAPS-SP-MATH', datetime('now', '-15 minutes'))
    `).run();
  });

  seedFamiliesTx();

  console.log('[Seed] Database successfully seeded with CAPS subjects and synthetic demonstration data.');
}

// Allow direct CLI execution: node server/db/seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeed();
}
