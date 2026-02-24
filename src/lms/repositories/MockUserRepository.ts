import { IUserRepository, User } from './UserRepository';

export class MockUserRepository implements IUserRepository {
    private users: User[] = [
        {
            id: 'admin-1',
            name: 'Admin User',
            email: 'admin@iepi.com.br',
            role: 'ADMIN',
            enrolledCourseIds: [],
        },
        {
            id: 'student-1',
            name: 'Test Student',
            email: 'student@test.com',
            role: 'STUDENT',
            enrolledCourseIds: [],
        }
    ];

    async findById(id: string): Promise<User | null> {
        return this.users.find(u => u.id === id) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(u => u.email === email) || null;
    }

    async create(user: Omit<User, 'id' | 'enrolledCourseIds'>): Promise<User> {
        const newUser: User = {
            ...user,
            id: `user-${Math.random().toString(36).substring(7)}`,
            enrolledCourseIds: [],
        };
        this.users.push(newUser);
        return newUser;
    }

    async enrollInCourse(userId: string, courseId: string): Promise<void> {
        const user = await this.findById(userId);
        if (!user) throw new Error('User not found');
        if (!user.enrolledCourseIds.includes(courseId)) {
            user.enrolledCourseIds.push(courseId);
        }
    }
}

// Singleton instance for the mock
export const userRepository = new MockUserRepository();
