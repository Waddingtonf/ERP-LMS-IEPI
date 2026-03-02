import { IUserRepository, User } from './UserRepository';

export class MockUserRepository implements IUserRepository {
    private users: User[] = [
        // ─── Aluno ─────────────────────────────────────────────────────────
        {
            id: 'student-1',
            name: 'João Silva',
            email: 'joao.silva@aluno.iepi.edu.br',
            role: 'STUDENT',
            enrolledCourseIds: [],
        },
        // ─── Administrador ─────────────────────────────────────────────────
        {
            id: 'admin-1',
            name: 'Ana Rodrigues',
            email: 'ana.rodrigues@iepi.edu.br',
            role: 'ADMIN',
            enrolledCourseIds: [],
        },
        // ─── Docente ───────────────────────────────────────────────────────
        {
            id: 'docente-1',
            name: 'Prof. Marcos Oliveira',
            email: 'marcos.oliveira@iepi.edu.br',
            role: 'DOCENTE',
            enrolledCourseIds: [],
        },
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

    /** Restore the repo to its initial seeded state — useful in beforeEach */
    reset(): void {
        this.users = [
            { id: 'student-1', name: 'João Silva',           email: 'joao.silva@aluno.iepi.edu.br', role: 'STUDENT',  enrolledCourseIds: [] },
            { id: 'admin-1',   name: 'Ana Rodrigues',        email: 'ana.rodrigues@iepi.edu.br',    role: 'ADMIN',    enrolledCourseIds: [] },
            { id: 'docente-1', name: 'Prof. Marcos Oliveira', email: 'marcos.oliveira@iepi.edu.br', role: 'DOCENTE',  enrolledCourseIds: [] },
        ];
    }
}

// Singleton instance for the mock
export const userRepository = new MockUserRepository();
