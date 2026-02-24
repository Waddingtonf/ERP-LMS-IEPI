export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  enrolledCourseIds: string[];
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'enrolledCourseIds'>): Promise<User>;
  enrollInCourse(userId: string, courseId: string): Promise<void>;
}
