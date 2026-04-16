-- =============================================================================
-- ERP-IEPI — Migration Complementar LMS (2026-04-15)
-- Executa APÓS 20260101_lms_schema.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. COLUNAS ADICIONAIS em turmas
--    Alinhar com ITurmaRepository (nome, semestre, horario, dias_semana, sala)
-- ---------------------------------------------------------------------------
alter table public.turmas
    add column if not exists nome        text,
    add column if not exists semestre    text,
    add column if not exists horario     text,
    add column if not exists dias_semana text,
    add column if not exists sala        text;

-- Backfill: nomear turmas existentes com o code como fallback
update public.turmas
   set nome     = coalesce(nome, code),
       semestre = coalesce(semestre, '2026.1');

-- Tornar nome NOT NULL após backfill
alter table public.turmas
    alter column nome     set not null,
    alter column semestre set not null;

-- ---------------------------------------------------------------------------
-- 2. TABELA: notas
--    (se não existir ainda — schema.sql da v1 só tem a versão antiga)
-- ---------------------------------------------------------------------------
create table if not exists public.notas (
    id          uuid         primary key default gen_random_uuid(),
    turma_id    uuid         not null references public.turmas(id) on delete cascade,
    aluno_id    uuid         not null references public.profiles(id) on delete cascade,
    disciplina  text         not null default 'Geral',
    av1         numeric(4,2),
    av2         numeric(4,2),
    trabalho    numeric(4,2),
    media       numeric(4,2) generated always as (
        case
            when av1 is not null and av2 is not null and trabalho is not null
                then round((av1 + av2 + trabalho) / 3.0, 1)
            when av1 is not null and av2 is not null
                then round((av1 + av2) / 2.0, 1)
            when av1 is not null
                then av1
            else null
        end
    ) stored,
    situacao    text         generated always as (
        case
            when av1 is null and av2 is null and trabalho is null
                then 'Em Andamento'
            when round(
                    case
                        when av1 is not null and av2 is not null and trabalho is not null
                            then (av1 + av2 + trabalho) / 3.0
                        when av1 is not null and av2 is not null
                            then (av1 + av2) / 2.0
                        when av1 is not null
                            then av1
                        else 0
                    end, 1) >= 7
                then 'Aprovado'
            when round(
                    case
                        when av1 is not null and av2 is not null and trabalho is not null
                            then (av1 + av2 + trabalho) / 3.0
                        when av1 is not null and av2 is not null
                            then (av1 + av2) / 2.0
                        when av1 is not null
                            then av1
                        else 0
                    end, 1) >= 5
                then 'Recuperacao'
            else 'Reprovado'
        end
    ) stored,
    updated_at  timestamptz  not null default now(),
    unique (turma_id, aluno_id, disciplina)
);

create index if not exists idx_notas_turma_id on public.notas(turma_id);
create index if not exists idx_notas_aluno_id on public.notas(aluno_id);

-- Trigger updated_at em notas
drop trigger if exists notas_updated_at on public.notas;
create trigger notas_updated_at
    before update on public.notas
    for each row execute procedure public.set_updated_at();

-- RLS em notas
alter table public.notas enable row level security;

create policy "Aluno vê próprias notas"
    on public.notas for select
    using (aluno_id = auth.uid());

create policy "Docente gerencia notas de suas turmas"
    on public.notas for all
    using (
        exists (
            select 1 from public.turmas t
            where t.id = turma_id and t.instructor_id = auth.uid()
        )
    );

create policy "Admin e Pedagógico veem todas as notas"
    on public.notas for all
    using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN', 'PEDAGOGICO'))
    );

-- ---------------------------------------------------------------------------
-- 3. TABELA: ocorrencias (reformulada para alinhar com IOcorrenciaRepository)
-- ---------------------------------------------------------------------------
drop table if exists public.ocorrencias cascade;

create table public.ocorrencias (
    id                   uuid        primary key default gen_random_uuid(),
    tipo                 text        not null,
    prioridade           text        not null default 'Media'
                                     check (prioridade in ('Baixa', 'Media', 'Alta', 'Critica')),
    status               text        not null default 'Aberta'
                                     check (status in ('Aberta', 'Em Andamento', 'Resolvida', 'Fechada')),
    titulo               text        not null,
    descricao            text        not null,
    aluno_id             uuid        references public.profiles(id) on delete set null,
    turma_id             uuid        references public.turmas(id) on delete set null,
    curso_id             uuid        references public.courses(id) on delete set null,
    criado_por_id        uuid        references public.profiles(id) on delete set null,
    atribuido_para_id    uuid        references public.profiles(id) on delete set null,
    resolucao            text,
    criado_em            timestamptz not null default now(),
    atualizado_em        timestamptz not null default now(),
    resolvido_em         timestamptz
);

create index if not exists idx_ocorrencias_status    on public.ocorrencias(status);
create index if not exists idx_ocorrencias_aluno_id  on public.ocorrencias(aluno_id);
create index if not exists idx_ocorrencias_tipo      on public.ocorrencias(tipo);

drop trigger if exists ocorrencias_updated_at on public.ocorrencias;
create trigger ocorrencias_updated_at
    before update on public.ocorrencias
    for each row execute procedure public.set_updated_at();

-- RLS em ocorrencias
alter table public.ocorrencias enable row level security;

create policy "Aluno vê próprias ocorrências"
    on public.ocorrencias for select
    using (aluno_id = auth.uid());

create policy "Admin e Pedagógico gerenciam ocorrências"
    on public.ocorrencias for all
    using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN', 'PEDAGOGICO'))
    );

create policy "Atribuído pode atualizar a ocorrência"
    on public.ocorrencias for update
    using (atribuido_para_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 4. VIEW: frequência por aluno/turma (garante que existe)
-- ---------------------------------------------------------------------------
create or replace view public.v_frequencia_resumo as
select
    f.aluno_id,
    p.name                                       as aluno_name,
    a.turma_id,
    count(*)                                     as total_aulas,
    count(*) filter (where f.presente = true)    as presentes,
    round(
        count(*) filter (where f.presente = true)::numeric
        / nullif(count(*), 0) * 100,
        1
    )                                            as percentual
from public.frequencias f
join public.aulas        a on a.id = f.aula_id
join public.profiles     p on p.id = f.aluno_id
group by f.aluno_id, p.name, a.turma_id;

-- ---------------------------------------------------------------------------
-- 5. VIEW: alunos de uma turma com notas e frequência (helper para docente)
-- ---------------------------------------------------------------------------
create or replace view public.v_turma_alunos_resumo as
select
    e.turma_id,
    e.aluno_id,
    p.name                                                  as aluno_name,
    p.email                                                 as aluno_email,
    e.status                                                as matricula_status,
    n.av1, n.av2, n.trabalho, n.media, n.situacao,
    coalesce(fr.percentual, 0)                              as frequencia_percentual
from public.enrollments e
join public.profiles p    on p.id = e.aluno_id
left join public.notas n  on n.turma_id = e.turma_id and n.aluno_id = e.aluno_id
left join public.v_frequencia_resumo fr
                          on fr.turma_id = e.turma_id and fr.aluno_id = e.aluno_id
where e.turma_id is not null;
