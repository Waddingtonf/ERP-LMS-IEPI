/**
 * CsvImportService — parse & validate CSV/TSV files for bulk import.
 *
 * Edge/Node compatible (uses built-in string operations only — no fs).
 *
 * Supported import types:
 *  - 'alunos'   → creates users + enrollments
 */

export type ImportType = 'alunos';

export interface ImportRow {
    nome: string;
    email: string;
    telefone?: string;
    cpf?: string;
    cursoId?: string;
    turmaId?: string;
}

export interface ImportResult {
    total: number;
    importados: number;
    erros: ImportError[];
}

export interface ImportError {
    row: number;
    campo?: string;
    mensagem: string;
    dados?: Partial<ImportRow>;
}

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCsv(text: string): string[][] {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    return lines
        .filter((l) => l.trim())
        .map((line) => {
            const cols: string[] = [];
            let cur = '';
            let inQuote = false;
            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (ch === '"') {
                    if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
                    else inQuote = !inQuote;
                } else if ((ch === ',' || ch === ';' || ch === '\t') && !inQuote) {
                    cols.push(cur.trim());
                    cur = '';
                } else {
                    cur += ch;
                }
            }
            cols.push(cur.trim());
            return cols;
        });
}

// ── Required columns ──────────────────────────────────────────────────────────

const REQUIRED_ALUNO: (keyof ImportRow)[] = ['nome', 'email'];

// ── Main service ─────────────────────────────────────────────────────────────

export class CsvImportService {
    /**
     * Parse CSV text and validate rows. Returns parsed rows and errors.
     * Does NOT write to the database — call importAlunos() for that.
     */
    parse(csvText: string, type: ImportType): { rows: ImportRow[]; errors: ImportError[] } {
        const [header, ...dataLines] = parseCsv(csvText);
        if (!header) return { rows: [], errors: [{ row: 0, mensagem: 'Arquivo vazio ou sem cabeçalho.' }] };

        const colIndex = (name: string) =>
            header.findIndex((h) => h.toLowerCase().replace(/\s/g, '') === name.toLowerCase());

        const idx = {
            nome: colIndex('nome'),
            email: colIndex('email'),
            telefone: colIndex('telefone'),
            cpf: colIndex('cpf'),
            cursoId: colIndex('cursoid'),
            turmaId: colIndex('turmaid'),
        };

        const rows: ImportRow[] = [];
        const errors: ImportError[] = [];

        dataLines.forEach((cols, i) => {
            const rowNum = i + 2; // 1-indexed, header = row 1
            const get = (k: keyof typeof idx) => {
                const ci = idx[k];
                return ci >= 0 ? (cols[ci] ?? '').trim() : '';
            };

            const row: ImportRow = {
                nome:     get('nome'),
                email:    get('email'),
                telefone: get('telefone') || undefined,
                cpf:      get('cpf') || undefined,
                cursoId:  get('cursoId') || undefined,
                turmaId:  get('turmaId') || undefined,
            };

            // Validate required fields
            let hasError = false;
            for (const campo of REQUIRED_ALUNO) {
                if (!row[campo]) {
                    errors.push({ row: rowNum, campo, mensagem: `Campo obrigatório "${campo}" ausente.`, dados: row });
                    hasError = true;
                }
            }

            // Validate email format
            if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
                errors.push({ row: rowNum, campo: 'email', mensagem: 'Email inválido.', dados: row });
                hasError = true;
            }

            if (!hasError) rows.push(row);
        });

        return { rows, errors };
    }

    /**
     * Parse + import alunos via UserRepository + EnrollmentRepository.
     * Must be called from a Server Action (has access to repositories).
     */
    async importAlunos(
        csvText: string,
    ): Promise<ImportResult> {
        const { getUserRepository, getEnrollmentRepository } = await import('@/lms/repositories');
        const userRepo       = await getUserRepository();
        const enrollmentRepo = getEnrollmentRepository();

        const { rows, errors } = this.parse(csvText, 'alunos');
        let importados = 0;

        await Promise.allSettled(
            rows.map(async (row, i) => {
                const rowNum = i + 2;
                try {
                    // Check if user already exists
                    const existing = await userRepo.findByEmail(row.email);
                    let userId: string;
                    if (existing) {
                        userId = existing.id;
                    } else {
                        const newUser = await userRepo.create({
                            name:  row.nome,
                            email: row.email,
                            role:  'STUDENT',
                        });
                        userId = newUser.id;
                    }

                    // Create enrollment if cursoId provided
                    if (row.cursoId) {
                        const alreadyEnrolled = await enrollmentRepo.isEnrolled(userId, row.cursoId);
                        if (!alreadyEnrolled) {
                            await enrollmentRepo.create({
                                alunoId:              userId,
                                alunoName:            row.nome,
                                alunoEmail:           row.email,
                                courseId:             row.cursoId,
                                courseName:           '',
                                moduleId:             null,
                                moduleName:           null,
                                turmaId:              row.turmaId ?? null,
                                paymentTransactionId: null,
                                status:               'Ativo',
                                amountPaid:           0,
                                dataMatricula:        new Date().toISOString().split('T')[0],
                            });
                        }
                    }

                    importados++;
                } catch (err) {
                    errors.push({
                        row: rowNum,
                        mensagem: err instanceof Error ? err.message : 'Erro desconhecido.',
                        dados: row,
                    });
                }
            }),
        );

        return { total: rows.length + errors.length, importados, erros: errors };
    }
}
