/**
 * NexaCampus Student Profile & Roster Business Service
 */

import { getStudent, getStudentByEmail, saveStudent } from '../firebase';
import { getSession, setSession, type Session } from '../session';
import type { Student } from '../data';
import { NotFoundError, ValidationError } from '../errors/AppError';

export const studentService = {
  /**
   * Fetches full student profile by admission number
   */
  async getByAdmission(admissionNumber: string): Promise<Student & { id: string }> {
    const student = await getStudent(admissionNumber);
    if (!student) {
      throw new NotFoundError(`Student #${admissionNumber}`);
    }
    return student;
  },

  /**
   * Fetches full student profile by guardian/student email
   */
  async getByEmail(email: string): Promise<(Student & { id: string }) | null> {
    return await getStudentByEmail(email);
  },

  /**
   * Saves onboarding profile and updates active session
   */
  async saveOnboardingProfile(profile: Student & { id: string }): Promise<Student & { id: string }> {
    if (!profile.id) throw new ValidationError('Admission ID is required');
    if (!profile.name && !profile.displayName) throw new ValidationError('Student name is required');

    const saved = await saveStudent(profile);
    const existing = getSession();

    if (existing) {
      const updated: Session = {
        ...existing,
        name: saved.displayName || saved.name,
        isNewAccount: false,
        student: saved,
      };
      setSession(updated);
    }
    return saved;
  },
};

export default studentService;
