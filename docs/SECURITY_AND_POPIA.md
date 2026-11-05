# POPIA & Security Compliance Engineering Report — ThutoBridge

## 1. Compliance Engineering Principles (Protection of Personal Information Act)

In accordance with South African POPIA regulations and child privacy protection best practices:

### Data Minimisation
* **No Birthdates**: Learners are tracked exclusively by educational grade level (e.g., "Grade 4"), not by full date of birth.
* **No Exact Physical Location**: No GPS, physical addresses, or neighborhood tracking are collected or stored.
* **No Medical or Disability Diagnostics**: The system explicitly forbids diagnosing learning disorders, labeling learners with medical conditions, or inferring neurodivergence from screen behaviour.
* **No Public Directories**: Learner records cannot be browsed publicly or indexed by search engines.

---

## 2. Server-Enforced Multi-Family Data Isolation

Isolation is enforced at the database and API middleware levels:
1. Every query is filtered by `family_id`.
2. When accessing or modifying a learner (`/api/learners/:id`), `verifyLearnerFamilyOwnership(id, req.user.family_id)` ensures the learner strictly belongs to the authenticated family.
3. If an attacker or compromised client alters the learner ID in a URL or payload to target another family, the server responds with **`HTTP 403 Forbidden`**.

---

## 3. History Preservation & Zero Data Loss

In many educational apps, unchecking a subject or re-enrolling deletes previous records. In ThutoBridge:
* The `learner_enrolment_history` table records all transitions (`enrolled`, `unenrolled`, `status_changed`).
* Changing a learner's subject status updates `status = 'inactive'`, preserving all previous attempts, mastery milestones, and notes.
* Deleting a learner sets `is_active = 0` (soft delete) to ensure parents retain access to historical learning evidence.
