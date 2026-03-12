/**
 * Repository Factory
 *
 * - Mock mode:     when NEXT_PUBLIC_SUPABASE_URL is absent or contains "dummy"
 * - Supabase mode: when a real Supabase URL is configured
 */

import { IUserRepository }                       from './UserRepository';
import { ICourseRepository }                    from './CourseRepository';
import { IPaymentRepository }                   from './PaymentRepository';
import { ITurmaRepository }                     from './TurmaRepository';
import { IFrequenciaRepository }               from './FrequenciaRepository';
import { IEnrollmentRepository }               from './EnrollmentRepository';
import { INotaRepository }                      from './NotaRepository';
import { IAvaliacaoRepository }                from './AvaliacaoRepository';
import { IMaterialRepository }                  from './MaterialRepository';
import { ICertificadoRepository }              from './CertificadoRepository';
import { ICalendarioRepository }               from './CalendarioRepository';
import { ICatalogoRepository }                  from './CatalogoRepository';
import { IRequerimentoRepository }             from './RequerimentoRepository';
import { IPlanoEnsinoRepository }              from './PlanoEnsinoRepository';
import { IDiarioClasseRepository }             from './DiarioClasseRepository';
import { IAvaliacaoInstitucionalRepository }   from './AvaliacaoInstitucionalRepository';
import { IProgressoRepository }                from './ProgressoRepository';

import { MockUserRepository }                       from './MockUserRepository';
import { MockCourseRepository }                    from './MockCourseRepository';
import { MockPaymentRepository }                   from './MockPaymentRepository';
import { MockTurmaRepository }                     from './MockTurmaRepository';
import { MockFrequenciaRepository }               from './MockFrequenciaRepository';
import { MockEnrollmentRepository }               from './MockEnrollmentRepository';
import { MockNotaRepository }                      from './MockNotaRepository';
import { MockAvaliacaoRepository }                from './MockAvaliacaoRepository';
import { MockMaterialRepository }                  from './MockMaterialRepository';
import { MockCertificadoRepository }              from './MockCertificadoRepository';
import { MockCalendarioRepository }               from './MockCalendarioRepository';
import { MockCatalogoRepository }                  from './MockCatalogoRepository';
import { MockRequerimentoRepository }             from './MockRequerimentoRepository';
import { MockPlanoEnsinoRepository }              from './MockPlanoEnsinoRepository';
import { MockDiarioClasseRepository }             from './MockDiarioClasseRepository';
import { MockAvaliacaoInstitucionalRepository }   from './MockAvaliacaoInstitucionalRepository';
import { MockProgressoRepository }                from './MockProgressoRepository';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const isMockMode = !supabaseUrl || supabaseUrl.includes('dummy') || supabaseUrl.includes('placeholder');

let _user:         IUserRepository         | null = null;
let _course:       ICourseRepository       | null = null;
let _payment:      IPaymentRepository      | null = null;
let _turma:        ITurmaRepository        | null = null;
let _frequencia:   IFrequenciaRepository   | null = null;
let _enrollment:   IEnrollmentRepository   | null = null;
let _nota:         INotaRepository         | null = null;
let _avaliacao:    IAvaliacaoRepository    | null = null;
let _material:     IMaterialRepository     | null = null;
let _certificado:  ICertificadoRepository  | null = null;
let _calendario:   ICalendarioRepository   | null = null;
let _catalogo:               ICatalogoRepository                | null = null;
let _requerimento:           IRequerimentoRepository            | null = null;
let _planoEnsino:            IPlanoEnsinoRepository             | null = null;
let _diarioClasse:           IDiarioClasseRepository            | null = null;
let _avaliacaoInstitucional: IAvaliacaoInstitucionalRepository  | null = null;
let _progresso:              IProgressoRepository               | null = null;

// Async factories (Supabase-capable)
export async function getUserRepository(): Promise<IUserRepository> {
    if (_user) return _user;
    if (isMockMode) { return (_user = new MockUserRepository()); }
    const { SupabaseUserRepository } = await import('./SupabaseUserRepository');
    return (_user = new SupabaseUserRepository());
}

export async function getCourseRepository(): Promise<ICourseRepository> {
    if (_course) return _course;
    if (isMockMode) { return (_course = new MockCourseRepository()); }
    const { SupabaseCourseRepository } = await import('./SupabaseCourseRepository');
    return (_course = new SupabaseCourseRepository());
}

export async function getPaymentRepository(): Promise<IPaymentRepository> {
    if (_payment) return _payment;
    if (isMockMode) { return (_payment = new MockPaymentRepository()); }
    const { SupabasePaymentRepository } = await import('./SupabasePaymentRepository');
    return (_payment = new SupabasePaymentRepository());
}

// Sync factories (mock-only for now — swap to Supabase when ready)
export function getTurmaRepository():       ITurmaRepository       { return (_turma       ??= new MockTurmaRepository()); }
export function getFrequenciaRepository():  IFrequenciaRepository  { return (_frequencia  ??= new MockFrequenciaRepository()); }
export function getEnrollmentRepository():  IEnrollmentRepository  { return (_enrollment  ??= new MockEnrollmentRepository()); }
export function getNotaRepository():        INotaRepository        { return (_nota        ??= new MockNotaRepository()); }
export function getAvaliacaoRepository():   IAvaliacaoRepository   { return (_avaliacao   ??= new MockAvaliacaoRepository()); }
export function getMaterialRepository():    IMaterialRepository    { return (_material    ??= new MockMaterialRepository()); }
export function getCertificadoRepository(): ICertificadoRepository { return (_certificado ??= new MockCertificadoRepository()); }
export function getCalendarioRepository():  ICalendarioRepository  { return (_calendario  ??= new MockCalendarioRepository()); }
export function getCatalogoRepository():              ICatalogoRepository               { return (_catalogo              ??= new MockCatalogoRepository()); }
export function getRequerimentoRepository():          IRequerimentoRepository           { return (_requerimento          ??= new MockRequerimentoRepository()); }
export function getPlanoEnsinoRepository():           IPlanoEnsinoRepository            { return (_planoEnsino           ??= new MockPlanoEnsinoRepository()); }
export function getDiarioClasseRepository():          IDiarioClasseRepository           { return (_diarioClasse          ??= new MockDiarioClasseRepository()); }
export function getAvaliacaoInstitucionalRepository(): IAvaliacaoInstitucionalRepository  { return (_avaliacaoInstitucional ??= new MockAvaliacaoInstitucionalRepository()); }
export function getProgressoRepository(): IProgressoRepository { return (_progresso ??= new MockProgressoRepository()); }

// Sync convenience aliases for server components (always mock in dev)
export function getUserRepositorySync():    IUserRepository    { return (_user    ??= new MockUserRepository()); }
export function getCourseRepositorySync():  ICourseRepository  { return (_course  ??= new MockCourseRepository()); }
export function getPaymentRepositorySync(): IPaymentRepository { return (_payment ??= new MockPaymentRepository()); }

