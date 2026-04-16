/**
 * Typed application error classes.
 * Use these instead of throwing plain strings or generic Error.
 */

export class AppError extends Error {
    constructor(
        message: string,
        public readonly code: string = 'APP_ERROR',
        public readonly statusCode: number = 500
    ) {
        super(message);
        this.name = 'AppError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, id?: string) {
        super(
            id ? `${resource} com id "${id}" não encontrado.` : `${resource} não encontrado.`,
            'NOT_FOUND',
            404
        );
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Acesso não autorizado.') {
        super(message, 'UNAUTHORIZED', 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Você não tem permissão para realizar esta ação.') {
        super(message, 'FORBIDDEN', 403);
        this.name = 'ForbiddenError';
    }
}

export class ValidationError extends AppError {
    constructor(
        message: string,
        public readonly fields?: Record<string, string>
    ) {
        super(message, 'VALIDATION_ERROR', 422);
        this.name = 'ValidationError';
    }
}

/** Narrow an unknown catch value to an AppError-compatible message. */
export function toErrorMessage(err: unknown): string {
    if (err instanceof AppError) return err.message;
    if (err instanceof Error) return err.message;
    return 'Ocorreu um erro inesperado.';
}

/** Type guard — use in catch blocks. */
export function isAppError(err: unknown): err is AppError {
    return err instanceof AppError;
}
