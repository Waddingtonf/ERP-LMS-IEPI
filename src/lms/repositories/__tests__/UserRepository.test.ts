import { userRepository, MockUserRepository } from './MockUserRepository';

describe('MockUserRepository', () => {
    beforeEach(() => {
        // Reset private state se possível, ou recriar
    });

    it('should find the default admin user', async () => {
        const user = await userRepository.findById('admin-1');
        expect(user).toBeDefined();
        expect(user?.role).toBe('ADMIN');
    });

    it('should create a new user and assign a random id', async () => {
        const newUser = await userRepository.create({
            name: 'John Doe Test',
            email: 'johndoe@test.com',
            role: 'STUDENT'
        });

        expect(newUser.id).toContain('user-');
        expect(newUser.name).toBe('John Doe Test');
        expect(newUser.enrolledCourseIds).toEqual([]);

        const foundUser = await userRepository.findById(newUser.id);
        expect(foundUser).toEqual(newUser);
    });

    it('should enroll a user in a course', async () => {
        await userRepository.enrollInCourse('student-1', 'course-123');
        const user = await userRepository.findById('student-1');
        expect(user?.enrolledCourseIds).toContain('course-123');
    });

    it('should not duplicate enrollments', async () => {
        await userRepository.enrollInCourse('student-1', 'course-999');
        await userRepository.enrollInCourse('student-1', 'course-999');

        const user = await userRepository.findById('student-1');
        const enrollments = user?.enrolledCourseIds.filter(id => id === 'course-999');
        expect(enrollments).toHaveLength(1);
    });
});
