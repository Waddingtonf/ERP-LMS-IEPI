-- ============================================================
-- IEPI LMS — Supabase Schema Migration
-- Run this on your Supabase SQL editor (Dashboard > SQL Editor)
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. PROFILES  (one row per auth.users entry)
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  email       text,
  role        text not null default 'aluno',   -- 'aluno' | 'docente' | 'admin' | 'financeiro' | 'pedagogico'
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Automatically create a profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'aluno')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- 2. COURSES
-- ─────────────────────────────────────────────
create table if not exists public.courses (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  description          text,
  category             text,
  workload_hours       integer default 0,
  price                numeric(10,2) default 0,
  bundle_price         numeric(10,2),                  -- discounted full-bundle price
  course_mode          text not null default 'CursoLivre',
                         -- 'CursoLivre' | 'GraduacaoModular' | 'PosGraduacao' | 'MBA'
  is_published         boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "Anyone can view published courses"
  on public.courses for select using (is_published = true);

create policy "Admins can manage courses"
  on public.courses for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─────────────────────────────────────────────
-- 3. MODULES (belong to a course)
-- ─────────────────────────────────────────────
create table if not exists public.modules (
  id                    uuid primary key default gen_random_uuid(),
  course_id             uuid not null references public.courses on delete cascade,
  title                 text not null,
  description           text,
  workload_hours        integer default 0,
  price                 numeric(10,2) default 0,        -- price when sold standalone
  is_sellable_standalone boolean not null default false,
  sort_order            integer default 0,
  created_at            timestamptz not null default now()
);

alter table public.modules enable row level security;

create policy "Anyone can view modules of published courses"
  on public.modules for select
  using (
    exists (select 1 from public.courses c where c.id = course_id and c.is_published = true)
  );

create policy "Admins can manage modules"
  on public.modules for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─────────────────────────────────────────────
-- 4. MATERIALS (belong to a module)
-- ─────────────────────────────────────────────
create table if not exists public.materials (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references public.modules on delete cascade,
  title       text not null,
  type        text not null default 'PDF',   -- 'PDF' | 'Video' | 'Link' | 'Outro'
  url         text,
  created_at  timestamptz not null default now()
);

alter table public.materials enable row level security;


create policy "Admins and docentes can manage materials"
  on public.materials for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','docente'))
  );

-- ─────────────────────────────────────────────
-- 5. TURMAS  (class sections)
-- ─────────────────────────────────────────────
create table if not exists public.turmas (
  id               uuid primary key default gen_random_uuid(),
  course_id        uuid not null references public.courses on delete cascade,
  code             text not null unique,
  instructor_id    uuid references public.profiles,
  start_date       date,
  end_date         date,
  schedule         text,
  location         text,
  max_students     integer default 40,
  enrolled_count   integer default 0,
  status           text not null default 'Planejada',
                     -- 'Planejada' | 'Em Andamento' | 'Concluida' | 'Cancelada'
  created_at       timestamptz not null default now()
);

alter table public.turmas enable row level security;

create policy "Admins manage turmas"
  on public.turmas for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Docentes can view their turmas"
  on public.turmas for select
  using (instructor_id = auth.uid());

-- ─────────────────────────────────────────────
-- 6. AULAS  (individual class sessions)
-- ─────────────────────────────────────────────
create table if not exists public.aulas (
  id               uuid primary key default gen_random_uuid(),
  turma_id         uuid not null references public.turmas on delete cascade,
  module_id        uuid references public.modules,
  title            text not null,
  date             date not null,
  start_time       text,                  -- e.g. '08:00'
  duration_minutes integer default 60,
  status           text not null default 'Agendada',
                     -- 'Agendada' | 'Realizada' | 'Cancelada'
  created_at       timestamptz not null default now()
);

alter table public.aulas enable row level security;

create policy "Docentes can view and update aulas for their turmas"
  on public.aulas for all
  using (
    exists (
      select 1 from public.turmas t
      where t.id = turma_id and t.instructor_id = auth.uid()
    )
  );

create policy "Admins manage all aulas"
  on public.aulas for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─────────────────────────────────────────────
-- 7. FREQUENCIAS  (attendance per student per aula)
-- ─────────────────────────────────────────────
create table if not exists public.frequencias (
  id              uuid primary key default gen_random_uuid(),
  aula_id         uuid not null references public.aulas on delete cascade,
  aluno_id        uuid not null references public.profiles on delete cascade,
  presente        boolean not null default false,
  observacao      text,
  registrado_em   timestamptz not null default now(),
  unique(aula_id, aluno_id)
);

alter table public.frequencias enable row level security;

create policy "Students can view their own attendance"
  on public.frequencias for select using (aluno_id = auth.uid());

create policy "Docentes can manage attendance for their turmas"
  on public.frequencias for all
  using (
    exists (
      select 1 from public.aulas a
      join public.turmas t on t.id = a.turma_id
      where a.id = aula_id and t.instructor_id = auth.uid()
    )
  );

create policy "Admins can view all attendance"
  on public.frequencias for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─────────────────────────────────────────────
-- 8. PAYMENTS  (Cielo transaction records)
-- ─────────────────────────────────────────────
create table if not exists public.payments (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references public.profiles,
  course_id           uuid references public.courses,
  module_id           uuid references public.modules,
  amount              numeric(10,2) not null,
  payment_method      text,
  status              text not null default 'Pendente',
                        -- 'Pendente' | 'Aprovado' | 'Recusado' | 'Estornado'
  cielo_payment_id    text,
  tid                 text,
  created_at          timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "Users can view their own payments"
  on public.payments for select using (user_id = auth.uid());

create policy "Admins and financeiro can view all payments"
  on public.payments for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','financeiro'))
  );

-- ─────────────────────────────────────────────
-- 9. ENROLLMENTS  (matriculas)
-- ─────────────────────────────────────────────
create table if not exists public.enrollments (
  id                       uuid primary key default gen_random_uuid(),
  aluno_id                 uuid not null references public.profiles on delete cascade,
  course_id                uuid not null references public.courses on delete cascade,
  module_id                uuid references public.modules,      -- null = full course
  turma_id                 uuid references public.turmas,
  payment_transaction_id   uuid references public.payments,
  status                   text not null default 'Ativo',
                             -- 'Ativo' | 'Evadido' | 'Concluido' | 'Trancado'
  amount_paid              numeric(10,2) default 0,
  data_matricula           timestamptz not null default now(),
  unique(aluno_id, course_id, module_id)   -- prevents duplicate enrollments
);

alter table public.enrollments enable row level security;

create policy "Students can view their own enrollments"
  on public.enrollments for select using (aluno_id = auth.uid());

create policy "Students can create their own enrollments"
  on public.enrollments for insert with check (aluno_id = auth.uid());

create policy "Admins and pedagogico can manage all enrollments"
  on public.enrollments for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','pedagogico'))
  );

-- ─────────────────────────────────────────────
-- RLS Deferred Policies (materials -> enrollments)
-- ─────────────────────────────────────────────
create policy "Enrolled students can view materials"
  on public.materials for select
  using (
    exists (
      select 1 from public.enrollments e
      join public.modules m on m.id = module_id
      where e.aluno_id = auth.uid()
        and (e.course_id = m.course_id or e.module_id = module_id)
        and e.status = 'Ativo'
    )
  );

-- ─────────────────────────────────────────────
-- 10. HELPFUL VIEWS
-- ─────────────────────────────────────────────

-- Enrollment summary per student (useful for admin/alunos page)
create or replace view public.v_enrollment_summary as
select
  e.aluno_id,
  p.full_name       as aluno_name,
  p.email           as aluno_email,
  count(*)          as total_enrollments,
  max(e.data_matricula) as last_enrollment,
  bool_or(e.status = 'Ativo')     as has_active,
  bool_or(e.status = 'Evadido')   as has_evadido,
  bool_or(e.status = 'Trancado')  as has_trancado
from public.enrollments e
join public.profiles p on p.id = e.aluno_id
group by e.aluno_id, p.full_name, p.email;

-- Attendance percentage per student per turma
create or replace view public.v_frequencia_resumo as
select
  f.aluno_id,
  p.full_name                              as aluno_name,
  a.turma_id,
  count(*)                                 as total_aulas,
  count(*) filter (where f.presente = true) as presentes,
  round(
    count(*) filter (where f.presente = true)::numeric / nullif(count(*), 0) * 100,
    1
  )                                        as percentual
from public.frequencias f
join public.aulas a on a.id = f.aula_id
join public.profiles p on p.id = f.aluno_id
group by f.aluno_id, p.full_name, a.turma_id;

-- ─────────────────────────────────────────────
-- 11. INDEXES for performance
-- ─────────────────────────────────────────────
create index if not exists idx_modules_course_id       on public.modules(course_id);
create index if not exists idx_aulas_turma_id          on public.aulas(turma_id);
create index if not exists idx_frequencias_aula_id     on public.frequencias(aula_id);
create index if not exists idx_frequencias_aluno_id    on public.frequencias(aluno_id);
create index if not exists idx_enrollments_aluno_id    on public.enrollments(aluno_id);
create index if not exists idx_enrollments_course_id   on public.enrollments(course_id);
create index if not exists idx_enrollments_turma_id    on public.enrollments(turma_id);
create index if not exists idx_payments_user_id        on public.payments(user_id);
create index if not exists idx_turmas_course_id        on public.turmas(course_id);
create index if not exists idx_turmas_instructor_id    on public.turmas(instructor_id);
