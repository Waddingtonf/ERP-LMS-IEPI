-- =============================================================================
-- ERP-IEPI — Schema Supabase (PostgreSQL)
-- Versão 1.0.0
-- Execute no SQL Editor do painel do Supabase
-- =============================================================================

-- ----------------------------------------------------------------------------
-- EXTENSÕES
-- ----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- TABELA: profiles
-- Complementa a tabela auth.users do Supabase Auth com dados do sistema.
-- Row Level Security (RLS) é necessário em produção.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
    id              uuid        primary key references auth.users(id) on delete cascade,
    name            text        not null,
    email           text        not null unique,
    role            text        not null default 'STUDENT'
                                check (role in ('STUDENT', 'ADMIN', 'DOCENTE', 'FINANCEIRO', 'PEDAGOGICO')),
    enrolled_course_ids text[]  not null default '{}',
    avatar_url      text,
    phone           text,
    cpf             text unique,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- Índice por e-mail para busca rápida
create index if not exists profiles_email_idx on public.profiles(email);

-- Trigger: atualiza updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
    before update on public.profiles
    for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------------------
-- TABELA: courses
-- ----------------------------------------------------------------------------
create table if not exists public.courses (
    id              uuid        primary key default uuid_generate_v4(),
    title           text        not null,
    description     text        not null default '',
    price           integer     not null default 0, -- em centavos
    thumbnail_url   text,
    is_published    boolean     not null default false,
    type            text        not null default 'Curso Livre'
                                check (type in ('Graduação', 'Pós-Graduação', 'Curso Livre', 'MBA')),
    duration        text,       -- ex: "360 horas", "4 anos"
    max_installments integer    not null default 1,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

drop trigger if exists courses_updated_at on public.courses;
create trigger courses_updated_at
    before update on public.courses
    for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------------------
-- TABELA: modules
-- ----------------------------------------------------------------------------
create table if not exists public.modules (
    id              uuid        primary key default uuid_generate_v4(),
    course_id       uuid        not null references public.courses(id) on delete cascade,
    title           text        not null,
    sort_order      integer     not null default 0,
    created_at      timestamptz not null default now()
);

create index if not exists modules_course_idx on public.modules(course_id);

-- ----------------------------------------------------------------------------
-- TABELA: materials
-- ----------------------------------------------------------------------------
create table if not exists public.materials (
    id              uuid        primary key default uuid_generate_v4(),
    module_id       uuid        not null references public.modules(id) on delete cascade,
    title           text        not null,
    type            text        not null check (type in ('PDF', 'VIDEO', 'LINK', 'SLIDE')),
    url             text        not null,
    sort_order      integer     not null default 0,
    created_at      timestamptz not null default now()
);

create index if not exists materials_module_idx on public.materials(module_id);

-- ----------------------------------------------------------------------------
-- TABELA: payment_transactions
-- ----------------------------------------------------------------------------
create table if not exists public.payment_transactions (
    id                  uuid        primary key default uuid_generate_v4(),
    user_id             uuid        not null references public.profiles(id) on delete restrict,
    course_id           uuid        not null references public.courses(id) on delete restrict,
    amount              integer     not null,    -- em centavos
    status              text        not null default 'PENDING'
                                    check (status in ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELED')),
    cielo_payment_id    text,
    installments        integer     not null default 1,
    error_message       text,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now()
);

create index if not exists payment_user_idx on public.payment_transactions(user_id);
create index if not exists payment_status_idx on public.payment_transactions(status);

drop trigger if exists payment_transactions_updated_at on public.payment_transactions;
create trigger payment_transactions_updated_at
    before update on public.payment_transactions
    for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------------------
-- TABELA: turmas
-- ----------------------------------------------------------------------------
create table if not exists public.turmas (
    id              uuid        primary key default uuid_generate_v4(),
    course_id       uuid        not null references public.courses(id) on delete restrict,
    nome            text        not null,
    semestre        text        not null,        -- ex: "2024.1"
    horario         text,
    dias_semana     text,
    sala            text,
    max_alunos      integer     not null default 40,
    inicio          date,
    fim             date,
    created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- TABELA: turma_alunos (matrícula por turma)
-- ----------------------------------------------------------------------------
create table if not exists public.turma_alunos (
    id              uuid        primary key default uuid_generate_v4(),
    turma_id        uuid        not null references public.turmas(id) on delete cascade,
    aluno_id        uuid        not null references public.profiles(id) on delete cascade,
    data_matricula  date        not null default current_date,
    status          text        not null default 'Ativo'
                                check (status in ('Ativo', 'Evadido', 'Concluído', 'Trancado')),
    unique (turma_id, aluno_id)
);

-- ----------------------------------------------------------------------------
-- TABELA: notas
-- ----------------------------------------------------------------------------
create table if not exists public.notas (
    id              uuid        primary key default uuid_generate_v4(),
    turma_id        uuid        not null references public.turmas(id) on delete cascade,
    aluno_id        uuid        not null references public.profiles(id) on delete cascade,
    av1             numeric(4,2),
    av2             numeric(4,2),
    trabalho        numeric(4,2),
    frequencia      numeric(5,2) not null default 0, -- percentual
    updated_at      timestamptz not null default now(),
    unique (turma_id, aluno_id)
);

-- ----------------------------------------------------------------------------
-- TABELA: ocorrencias
-- ----------------------------------------------------------------------------
create table if not exists public.ocorrencias (
    id                      uuid        primary key default uuid_generate_v4(),
    aluno_id                uuid        not null references public.profiles(id) on delete cascade,
    tipo                    text        not null
                                        check (tipo in ('Reclamação', 'Sugestão', 'Dúvida Acadêmica', 'Solicitação de Documento', 'Outros')),
    descricao               text        not null,
    status                  text        not null default 'Aberta'
                                        check (status in ('Aberta', 'Em andamento', 'Resolvida', 'Escalada')),
    prioridade              text        not null default 'Média'
                                        check (prioridade in ('Baixa', 'Média', 'Alta')),
    responsavel_id          uuid        references public.profiles(id) on delete set null,
    prazo_sla               date        not null,
    data_resolucao          date,
    created_at              timestamptz not null default now(),
    updated_at              timestamptz not null default now()
);

drop trigger if exists ocorrencias_updated_at on public.ocorrencias;
create trigger ocorrencias_updated_at
    before update on public.ocorrencias
    for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) — habilitar em produção
-- ----------------------------------------------------------------------------
alter table public.profiles               enable row level security;
alter table public.courses                enable row level security;
alter table public.modules                enable row level security;
alter table public.materials              enable row level security;
alter table public.payment_transactions   enable row level security;
alter table public.turmas                 enable row level security;
alter table public.turma_alunos           enable row level security;
alter table public.notas                  enable row level security;
alter table public.ocorrencias            enable row level security;

-- Política básica: usuário vê seu próprio perfil
create policy "Usuário vê seu perfil"
    on public.profiles for select
    using (auth.uid() = id);

-- Política básica: admin vê tudo
create policy "Admin vê todos os perfis"
    on public.profiles for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'ADMIN'
        )
    );

-- Cursos públicos visíveis para todos
create policy "Cursos publicados visíveis"
    on public.courses for select
    using (is_published = true);

create policy "Admin gerencia cursos"
    on public.courses for all
    using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
    );

-- Transações: usuário vê as próprias
create policy "Aluno vê próprias transações"
    on public.payment_transactions for select
    using (auth.uid() = user_id);

create policy "Admin vê todas transações"
    on public.payment_transactions for all
    using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
    );

-- =============================================================================
-- SEED DATA — Usuários de Teste
-- =============================================================================
-- INSTRUÇÕES:
--   1. Execute este bloco no SQL Editor do Supabase (com service_role key)
--   2. Os UUIDs abaixo são fixos para facilitar testes — não altere em dev
--   3. Em produção, remova ou substitua por usuários reais
--
-- Senha padrão de todos os usuários de teste: Iepi@2026#
-- =============================================================================

do $$
declare
    v_aluno_id    uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
    v_admin_id    uuid := 'aaaaaaaa-0000-0000-0000-000000000002';
    v_docente_id  uuid := 'aaaaaaaa-0000-0000-0000-000000000003';
begin

    -- ── 1. Aluno ──────────────────────────────────────────────────────────────
    insert into auth.users (
        id, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, role, aud
    ) values (
        v_aluno_id,
        'joao.silva@aluno.iepi.edu.br',
        crypt('Iepi@2026#', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"],"role":"STUDENT"}'::jsonb,
        '{"name":"João Silva"}'::jsonb,
        now(), now(), 'authenticated', 'authenticated'
    ) on conflict (id) do nothing;

    insert into public.profiles (id, name, email, role, enrolled_course_ids)
    values (v_aluno_id, 'João Silva', 'joao.silva@aluno.iepi.edu.br', 'STUDENT', '{}')
    on conflict (id) do nothing;

    -- ── 2. Administrador ──────────────────────────────────────────────────────
    insert into auth.users (
        id, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, role, aud
    ) values (
        v_admin_id,
        'ana.rodrigues@iepi.edu.br',
        crypt('Iepi@2026#', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"],"role":"ADMIN"}'::jsonb,
        '{"name":"Ana Rodrigues"}'::jsonb,
        now(), now(), 'authenticated', 'authenticated'
    ) on conflict (id) do nothing;

    insert into public.profiles (id, name, email, role, enrolled_course_ids)
    values (v_admin_id, 'Ana Rodrigues', 'ana.rodrigues@iepi.edu.br', 'ADMIN', '{}')
    on conflict (id) do nothing;

    -- ── 3. Docente ────────────────────────────────────────────────────────────
    insert into auth.users (
        id, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, role, aud
    ) values (
        v_docente_id,
        'marcos.oliveira@iepi.edu.br',
        crypt('Iepi@2026#', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"],"role":"DOCENTE"}'::jsonb,
        '{"name":"Prof. Marcos Oliveira"}'::jsonb,
        now(), now(), 'authenticated', 'authenticated'
    ) on conflict (id) do nothing;

    insert into public.profiles (id, name, email, role, enrolled_course_ids)
    values (v_docente_id, 'Prof. Marcos Oliveira', 'marcos.oliveira@iepi.edu.br', 'DOCENTE', '{}')
    on conflict (id) do nothing;

end $$;
