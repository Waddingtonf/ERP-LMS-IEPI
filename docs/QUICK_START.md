# 🚀 ERP-IEPI MVP - Guia Rápido de Início

> **Status:** ✅ Estrutura completa implementada. Pronto para testes e ajustes finais.

## 📋 O que foi implementado

**5 Fases completadas com 33 arquivos criados:**

1. ✅ **Design System + Schemas Zod** - Validação centralizada, tema unificado
2. ✅ **Autenticação Supabase** - Login, signup, reset password, role-based access
3. ✅ **Payment Gateway** - Cielo (cartão), PIX, Boleto
4. ✅ **Email + SMS** - SendGrid + Twilio com templates
5. ✅ **Dashboards** - Admin, Student, Financial

## 🚀 Começar

### 1. Configurar Ambiente
```bash
# Clonar repositório
git clone <repo-url>
cd erp-iepi

# Instalar dependências
npm install

# Criar .env.local
cp .env.example .env.local
```

### 2. Configurar .env.local
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=seu-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave

# Cielo (Pagamentos)
CIELO_MERCHANT_ID=seu-id
CIELO_MERCHANT_KEY=sua-chave

# SendGrid (Email)
SENDGRID_API_KEY=sua-chave

# Twilio (SMS)
TWILIO_ACCOUNT_SID=seu-sid
TWILIO_AUTH_TOKEN=seu-token
TWILIO_PHONE_NUMBER=seu-numero

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Rodar Projeto
```bash
# Dev
npm run dev
# → http://localhost:3000

# Build
npm run build

# Tests
npm run test
```

## 📁 Estrutura Organizada

```
src/
├── lib/design-system/         ← Cores, tipografia, espaçamento
├── lib/schemas/               ← Validações Zod (auth, payment, etc)
├── components/
│   ├── ui/                    ← Componentes base
│   ├── modules/               ← Por domínio (lms, crm, financial)
│   ├── layouts/               ← Page templates
│   └── shared/forms/          ← LoginForm, SignupForm, etc
├── shared/
│   ├── actions/auth.actions.ts  ← Server actions
│   └── services/              ← EmailService, SmsService
└── app/auth/                  ← Páginas de autenticação
```

## 🎯 Fluxos Críticos Implementados

### Signup → Login → Dashboard
1. `/auth/signup` - Registrar usuário
2. Verificação de email (Supabase)
3. `/auth/login` - Entrar
4. Middleware redireciona para dashboard conforme role
5. `/admin` ou `/aluno` ou `/docente`

### Checkout → Pagamento → Acesso
1. Selecionar curso
2. Ir para `/checkout`
3. Escolher método (Cartão, PIX, Boleto)
4. PaymentForm valida com Zod
5. Envia para PaymentGatewayService
6. Cielo processa ou PIX/Boleto gera
7. Email de confirmação enviado
8. Acesso desbloqueado no curso

## 🔑 Arquivos-Chave para Começar

| Arquivo | Propósito |
|---------|-----------|
| `lib/design-system/` | Cores, espaçamento, tipografia |
| `lib/schemas/index.ts` | Todas as validações Zod |
| `shared/actions/auth.actions.ts` | Signup, login, reset password |
| `lms/services/PaymentGatewayService.ts` | Orquestrador de pagamentos |
| `shared/services/EmailService.ts` | Envio de emails |
| `components/modules/` | Componentes por domínio |

## 🧪 Próximos Passos

### Para testes locais:
1. ✅ Configurar `.env.local`
2. ✅ `npm run dev` - Rodar localmente
3. ✅ Testar `/auth/login` → `/auth/signup`
4. ✅ Testar checkout com Cielo sandbox
5. ✅ Verificar emails em mock ou sandboxSendGrid

### Para produção:
1. [ ] Testes E2E com Playwright
2. [ ] Coverage de testes > 80%
3. [ ] Lighthouse audit > 80 em todas páginas
4. [ ] Security scan OWASP
5. [ ] Deploy em staging
6. [ ] UAT (User Acceptance Testing)
7. [ ] Deploy em produção ✅

## 📊 Dashboards Disponíveis

```
/admin          → Admin Dashboard (KPIs, métricas)
/aluno          → Student Dashboard (meus cursos, progresso)
/docente        → Docente (estrutura pronta)
/financeiro     → Financial Dashboard (receita, transações)
/pedagogico     → Pedagogical (estrutura pronta)
```

## 💡 Design System em Uso

**Cores principais:**
- Azul (Sky-500): `#0ea5e9` - Primária
- Verde (Green-600): `#16a34a` - Sucesso
- Vermelho (Red-600): `#dc2626` - Perigo
- Cinza (Slate-900): `#111827` - Texto

**Usagem Tailwind:**
```tsx
<button className="bg-sky-500 text-white px-4 py-2 rounded-md 
  hover:bg-sky-600 active:bg-sky-700">
  Clique aqui
</button>
```

## 🔐 Segurança Checklist

- ✅ Validação Zod (frontend + backend)
- ✅ CSP headers
- ✅ Supabase RLS policies
- ✅ PCI compliance (Cielo)
- ✅ Rate limiting middleware
- [ ] 2FA (opcional MVP 1.1)
- [ ] Webhook signature verification

## 📞 Dados de Integração

### Cielo (Pagamento)
- **Docs**: https://www.cielo.com.br/desenvolvedores
- **Sandbox**: Usar merchant_id + key de teste
- **Ambiente**: `process.env.CIELO_ENVIRONMENT`

### SendGrid (Email)
- **Docs**: https://sendgrid.com/docs
- **API Key**: `process.env.SENDGRID_API_KEY`
- **From**: `noreply@iepi.com.br`

### Twilio (SMS)
- **Docs**: https://www.twilio.com/docs
- **Account SID**: `process.env.TWILIO_ACCOUNT_SID`
- **Phone**: `process.env.TWILIO_PHONE_NUMBER`

### Supabase (Banco de Dados)
- **Docs**: https://supabase.com/docs
- **Auth**: JWT em cookies (SSR)
- **RLS**: Row-Level Security habilitado

## 🎓 Aproveitar o Design System

```tsx
// Temas centralizados
import { designSystem } from '@/lib/design-system'

// Breakpoints mobile-first
import { responsiveConfig } from '@/lib/design-system/responsive'

// Animações padrão
import { animationConfig } from '@/lib/design-system/animations'

// Schemas para validação
import { loginSchema, courseSchema } from '@/lib/schemas'
```

## 🐛 Debug

### Verificar logs
```bash
# Frontend
Abrir DevTools (F12) → Console

# Backend (Supabase)
Dashboard → Logs → Funções
```

### Testar Server Actions
```typescript
// Em app router
'use server'
import { loginAction } from '@/shared/actions/auth.actions'
const result = await loginAction({ email: '...', password: '...' })
```

### Validar schemas
```typescript
import { courseSchema } from '@/lib/schemas'
const parsed = courseSchema.parse(data) // Throws se inválido
```

## 📱 Testing em Mobile

```bash
# Local tunnel
npx ngrok http 3000

# Compartilhado link gerado
# Abrir em dispositivo mobile
```

## 🆘 Troubleshooting

| Erro | Solução |
|------|---------|
| "Supabase not configured" | Verificar NEXT_PUBLIC_SUPABASE_URL |
| "Cielo API error" | Verificar CIELO_MERCHANT_ID em .env |
| "Email not sent" | Verificar SENDGRID_API_KEY |
| "SMS not sent" | Verificar TWILIO_ACCOUNT_SID |
| Port 3000 em uso | `lsof -i :3000` → kill processo |

## 📚 Documentação

- [MVP Implementation Guide](./MVP_IMPLEMENTATION_GUIDE.md) - Completo
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Pre-prod
- [Componentes](./src/components/README.md) - Em progresso
- [API Services](./src/shared/services/README.md) - Em progresso

## 🚢 Deploy Rápido

### Vercel (Recomendado)
```bash
npm install vercel -g
vercel deploy
# → Configure env vars no dashboard
```

### Railway
```bash
npm install railway
railway login
railway deploy
```

### Docker
```bash
docker build -t iepi .
docker run -p 3000:3000 iepi
```

## 📈 Métricas Esperadas

| Métrica | Target | Atual |
|---------|--------|-------|
| Lighthouse | >80 | ⏳ |
| LCP | <2.5s | ⏳ |
| Core Web Vitals | Green | ⏳ |
| Test Coverage | >80% | ⏳ |
| Bundle Size | <300KB | ⏳ |

## 👥 Time

- **Frontend**: Next.js, React, Tailwind inicialmente levantado
- **Backend**: Supabase, Server Actions
- **Payments**: Cielo, Braspag
- **Notifications**: SendGrid, Twilio
- **DevOps**: Vercel, GitHub Actions

## ✨ Próximas Features (MVP 1.1)

- [ ] Live classes (Zoom integration)
- [ ] Advanced quizzes
- [ ] Peer review
- [ ] Discussion forums
- [ ] Mobile app (React Native)
- [ ] Analytics avançada

---

**Última atualização:** 2026-04-07  
**Versão:** MVP 1.0 - Ready to Test ✅  
**Documentação:** [MVP_IMPLEMENTATION_GUIDE.md](./MVP_IMPLEMENTATION_GUIDE.md)
