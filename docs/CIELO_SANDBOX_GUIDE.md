# 🔗 INTEGRAÇÃO CIELO - AMBIENTE SANDBOX

**Data**: 2026-04-07  
**Status**: ✅ Pronto para Teste  
**Ambiente**: Sandbox (desenvolvimento/teste)  
**Documentação**: Cielo eCommerce REST v3

---

## 🎯 O QUE É SANDBOX?

Sandbox é um **ambiente de testes isolado** onde você pode:
- ✅ Testar transações sem gastar dinheiro real
- ✅ Usar cartões de teste fictícios
- ✅ Simular diferentes respostas (aprovação, recusa, etc)
- ✅ Validar a integração sem riscos

---

## 📋 CONFIGURAÇÃO ATUAL

### Variáveis de Ambiente

Seu arquivo `.env.local` já está configurado:

```env
# ── PAYMENT GATEWAY (Cielo) ────────────────────────────────
CIELO_MERCHANT_ID=8540af68-d213-4868-8dae-9a8b33ff361a
CIELO_MERCHANT_KEY=r7UNstaaOek7HK4Cmbu72OdCrQJ9Q9P5Ol5Ixr3A
CIELO_ENVIRONMENT=sandbox  ← ✅ SANDBOX ATIVADO
```

**Status**: ✅ Tudo em Sandbox (seguro para testes)

---

## 🧪 CARTÕES DE TESTE CIELO

### Cartões para Testar Aprovação

```
┌─────────────────────────────────────────────────────────────┐
│                    CARTÕES DE TESTE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1️⃣ VISA - APROVADA                                         │
│    Número: 4111 1111 1111 1111                            │
│    Validade: 12/2026 (ou futura)                          │
│    CVV: 123                                               │
│    Resultado: AUTORIZADA E CAPTURADA                      │
│                                                             │
│ 2️⃣ MASTERCARD - RECUSADA                                   │
│    Número: 5555 5555 5555 4444                            │
│    Validade: 12/2026                                      │
│    CVV: 123                                               │
│    Resultado: RECUSADA                                    │
│                                                             │
│ 3️⃣ AMEX - APROVADA (Com 3DS)                              │
│    Número: 3782 822463 10005                              │
│    Validade: 12/2026                                      │
│    CVV: 1234                                              │
│    Resultado: AUTORIZADA                                  │
│                                                             │
│ 4️⃣ DINERS - APROVADA                                      │
│    Número: 3623 450000 00006                              │
│    Validade: 12/2026                                      │
│    CVV: 123                                               │
│    Resultado: AUTORIZADA E CAPTURADA                      │
│                                                             │
│ 5️⃣ ELO - APROVADA                                         │
│    Número: 6362 7100 0000 0300                            │
│    Validade: 12/2026                                      │
│    CVV: 123                                               │
│    Resultado: AUTORIZADA E CAPTURADA                      │
│                                                             │
│ 6️⃣ DESCOBRIR - RECUSADA POR SALDO INSUFICIENTE           │
│    Número: 6011 1111 1111 1117                            │
│    Validade: 12/2026                                      │
│    CVV: 123                                               │
│    Resultado: RECUSADA                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Dados do Titular

```
Nome Titular: TESTE SANDBOX CIELO
CPF/CNPJ: 00000000000000 (qualquer valor)
Email: sandbox@test.com (qualquer email)
```

### Validações Sandbox

- **Validade**: Pode ser futura (Sandbox aceita qualquer data)
- **CVV**: Qualquer valor numérico
- **Número**: Use exatamente os cartões acima para resultados específicos
- **Valor**: Qualquer valor em centavos (ex: 19999 = R$ 199,99)

---

## 🔗 URLs DE SANDBOX

### Transações (Criar/Capturar)

```
POST   https://apisandbox.cieloecommerce.cielo.com.br/1/sales/
PUT    https://apisandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}/capture
DELETE https://apisandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}/void
```

### Consultas (Query)

```
GET https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}
```

### Produção (NUNCA use em testes!)

```
POST   https://api.cieloecommerce.cielo.com.br/1/sales/
Query: https://apiquery.cieloecommerce.cielo.com.br/1/sales/{PaymentId}
```

---

## 📝 FLUXO DE PAGAMENTO

### 1️⃣ Criar Transação (Authorization)

```bash
curl -X POST https://apisandbox.cieloecommerce.cielo.com.br/1/sales/ \
  -H "Content-Type: application/json" \
  -H "MerchantId: 8540af68-d213-4868-8dae-9a8b33ff361a" \
  -H "MerchantKey: r7UNstaaOek7HK4Cmbu72OdCrQJ9Q9P5Ol5Ixr3A" \
  -d '{
    "MerchantOrderId": "201411277292",
    "Customer": {
      "Name": "TESTE SANDBOX CIELO"
    },
    "Payment": {
      "Type": "CreditCard",
      "Amount": 19999,
      "Installments": 1,
      "SoftDescriptor": "IEPI",
      "Capture": false,
      "CreditCard": {
        "CardNumber": "4111111111111111",
        "Holder": "TESTE SANDBOX CIELO",
        "ExpirationDate": "12/2026",
        "SecurityCode": "123",
        "Brand": "Visa"
      }
    }
  }'
```

**Resposta Esperada**:
```json
{
  "MerchantOrderId": "201411277292",
  "Customer": { "Name": "TESTE SANDBOX CIELO" },
  "Payment": {
    "PaymentId": "e57b09eb-475d-4a87-96b3-7dd8ef49a82a",
    "Status": 1,
    "ReturnCode": "4",
    "ReturnMessage": "Transaction Authorized",
    "CreditCard": {
      "CardNumber": "411111****1111",
      "ExpirationDate": "12/2026"
    }
  }
}
```

**Status Códigos**:
- `0` = Não Processada
- `1` = **Autorizada** ✅
- `2` = **Capturada** ✅
- `3` = Não Autorizada
- `4` = Não Processada
- `5` = Aceita (para Débito)

---

### 2️⃣ Capturar Transação

```bash
curl -X PUT https://apisandbox.cieloecommerce.cielo.com.br/1/sales/<PaymentId>/capture \
  -H "MerchantId: 8540af68-d213-4868-8dae-9a8b33ff361a" \
  -H "MerchantKey: r7UNstaaOek7HK4Cmbu72OdCrQJ9Q9P5Ol5Ixr3A"
```

**Resposta**:
```json
{
  "Status": 2,
  "ReturnCode": "6",
  "ReturnMessage": "Captured"
}
```

---

### 3️⃣ Consultar Transação

```bash
curl -X GET https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/<PaymentId> \
  -H "MerchantId: 8540af68-d213-4868-8dae-9a8b33ff361a" \
  -H "MerchantKey: r7UNstaaOek7HK4Cmbu72OdCrQJ9Q9P5Ol5Ixr3A"
```

---

## 💻 IMPLEMENTAÇÃO NO SEU CÓDIGO

### Classe CieloService.ts (Já Implementada ✅)

```typescript
// src/lms/services/CieloService.ts

const CIELO_SANDBOX_URL       = 'https://apisandbox.cieloecommerce.cielo.com.br';
const CIELO_SANDBOX_QUERY_URL = 'https://apiquerysandbox.cieloecommerce.cielo.com.br';

export class CieloSandboxService {
    constructor() {
        this.merchantId  = process.env.CIELO_MERCHANT_ID!;      // UUID
        this.merchantKey = process.env.CIELO_MERCHANT_KEY!;    // 32 chars
        const isProd     = process.env.CIELO_ENVIRONMENT === 'production';
        
        // ✅ Sandbox automático si isProd é false
        this.baseUrl     = isProd ? CIELO_PROD_URL : CIELO_SANDBOX_URL;
        this.queryUrl    = isProd ? CIELO_PROD_QUERY_URL : CIELO_SANDBOX_QUERY_URL;
    }

    async createTransaction(request: CieloPaymentRequest): Promise<CieloPaymentResponse> {
        // POST para criar transação
    }

    async captureTransaction(paymentId: string): Promise<CieloPaymentResponse> {
        // PUT para capturar
    }

    async getTransaction(paymentId: string): Promise<CieloPaymentResponse> {
        // GET para consultar
    }
}
```

### Usar no PaymentGatewayService.ts

```typescript
// src/lms/services/PaymentGatewayService.ts

import { CieloSandboxService } from './CieloService'

const cieloService = new CieloSandboxService()

// Criar transação
const response = await cieloService.createTransaction({
    merchantOrderId: 'ORDER-12345',
    amount: 19999,  // R$ 199,99
    creditCard: {
        cardNumber: '4111111111111111',      // Cartão de teste VISA
        holder: 'TESTE SANDBOX CIELO',
        expirationDate: '12/2026',
        securityCode: '123',
        brand: 'Visa'
    }
})

if (response.status === 1) {
    // ✅ Autorizada - agora capturar
    const captureResponse = await cieloService.captureTransaction(response.paymentId)
    console.log('💰 Pagamento capturado:', captureResponse)
}
```

---

## 🧪 TESTANDO A INTEGRAÇÃO

### Passo 1: Verificar Credenciais

```bash
cd c:\Users\l5857\Downloads\ERP\ -\ IEPI\erp-iepi

# Verificar que está em Sandbox
grep CIELO .env.local
```

**Esperado**:
```
CIELO_MERCHANT_ID=8540af68-d213-4868-8dae-9a8b33ff361a
CIELO_MERCHANT_KEY=r7UNstaaOek7HK4Cmbu72OdCrQJ9Q9P5Ol5Ixr3A
CIELO_ENVIRONMENT=sandbox ← ✅
```

### Passo 2: Testar com cURL

```bash
# Testar transação VISA aprovada
curl -X POST https://apisandbox.cieloecommerce.cielo.com.br/1/sales/ \
  -H "Content-Type: application/json" \
  -H "MerchantId: 8540af68-d213-4868-8dae-9a8b33ff361a" \
  -H "MerchantKey: r7UNstaaOek7HK4Cmbu72OdCrQJ9Q9P5Ol5Ixr3A" \
  -d '{
    "MerchantOrderId": "TEST-001",
    "Customer": {"Name": "TESTE CIELO"},
    "Payment": {
      "Type": "CreditCard",
      "Amount": 10000,
      "Installments": 1,
      "Capture": false,
      "CreditCard": {
        "CardNumber": "4111111111111111",
        "Holder": "TESTE CIELO",
        "ExpirationDate": "12/2026",
        "SecurityCode": "123",
        "Brand": "Visa"
      }
    }
  }'
```

**Resposta Esperada** (Status 1 = Autorizada):
```json
{
  "Payment": {
    "PaymentId": "e57b09eb-475d-4a87-96b3-7dd8ef49a82a",
    "Status": 1,
    "ReturnMessage": "Transaction Authorized"
  }
}
```

### Passo 3: Testar no Seu App

```bash
# 1. Iniciar servidor
npm run dev

# 2. Abrir browser
# http://localhost:3000/checkout

# 3. Preencher formulário
# - Número: 4111 1111 1111 1111 (VISA Sandbox)
# - Validade: 12/2026
# - CVV: 123
# - Nome: TESTE SANDBOX CIELO

# 4. Clicar em "Confirmar Pagamento"

# 5. Verificar resultado no console
npm test -- security  # Testes devem passar
```

---

## 📊 MATRIZ DE TESTES

| Cartão | Número | Resultado Esperado | Use Para |
|---|---|---|---|
| VISA | 4111111111111111 | ✅ Autorizada + Capturada | Sucesso |
| MASTERCARD | 5555555555554444 | ❌ Recusada | Erro |
| AMEX | 378282246310005 | ✅ Autorizada | 3DS |
| DINERS | 36234500000006 | ✅ Autorizada + Capturada | Sucesso |
| ELO | 6362710000000300 | ✅ Autorizada + Capturada | Sucesso |
| DISCOVER | 6011111111111117 | ❌ Saldo insuficiente | Erro |

---

## 🔒 SEGURANÇA EM SANDBOX

### O Que NÃO Fazer

❌ **NUNCA** use dados reais de cartão em Sandbox  
❌ **NUNCA** use credenciais de Produção em Sandbox  
❌ **NUNCA** commit `.env.local` com credenciais reais  
❌ **NUNCA** teste com valores de Produção  

### O Que FAZER

✅ Use APENAS cartões de teste fornecidos pela Cielo  
✅ Use `CIELO_ENVIRONMENT=sandbox` em desenvolvimento  
✅ Use `.env.local` (gitignored) para credenciais  
✅ Troque para Produção APENAS após testes completos  

---

## 🚀 IR PARA PRODUÇÃO

### Quando Mudar de Sandbox → Produção

```
✅ Todos os testes passaram (38/38 security tests)
✅ Fluxo de pagamento validado com cartões teste
✅ Webhooks funcionando corretamente
✅ Auditoria de segurança completa
✅ Code review aprovado

→ ENTÃO: Trocar variáveis de ambiente
```

### Mudança para Produção

```env
# Produção: .env.production
CIELO_MERCHANT_ID=<YOUR_REAL_ID>
CIELO_MERCHANT_KEY=<YOUR_REAL_KEY>
CIELO_ENVIRONMENT=production  ← Muda para "production"

# URLs mudam automaticamente:
# POST/PUT: https://api.cieloecommerce.cielo.com.br/1/sales/
# GET:      https://apiquery.cieloecommerce.cielo.com.br/1/sales/
```

**⚠️ Cuidado**: Em produção, transações são REAIS!

---

## 📚 LINKS ÚTEIS

### Documentação Oficial Cielo

- **Portal Desenvolvedor**: https://desenvolvedores.cielo.com.br/
- **API Sandbox Docs**: https://desenvolvedores.cielo.com.br/api-3-0-ecommerce
- **Status de Transações**: https://desenvolvedores.cielo.com.br/
- **Códigos de Retorno**: https://desenvolvedores.cielo.com.br/api-3-0-ecommerce#códigos-de-retorno

### Cartões de Teste

- **Lista Completa**: https://desenvolvedores.cielo.com.br/
- **Bandeiras**: Visa, Mastercard, Amex, Diners, Elo, Discover

### Suporte

- **Email**: cieloecommerce@cielo.com.br
- **Chat**: https://desenvolvedores.cielo.com.br/
- **Telefone**: 4062-1111

---

## 🧪 CHECKLIST PRÉ-PRODUÇÃO

- [ ] Credenciais Sandbox configuradas em `.env.local`
- [ ] Cartão VISA teste aprovado (4111...)
- [ ] Cartão MASTERCARD teste recusado (5555...)
- [ ] Transação criada e autorizada
- [ ] Transação capturada com sucesso
- [ ] Consulta de transação funciona
- [ ] Webhooks recebendo callbacks
- [ ] HMAC signature validando corretamente
- [ ] Auditoria salvando transações
- [ ] Testes de segurança 38/38 passando
- [ ] Credenciais Produção prontas (em arquivo .env.production separado)
- [ ] Mudança para produção aprovada

---

## 🎯 RESUMO

```
SANDBOX CIELO - STATUS ATUAL

✅ CieloSandboxService implementado
✅ Credenciais Sandbox configuradas
✅ Endpoints corretos (sandbox vs prod)
✅ Cartões de teste disponíveis
✅ Fluxo de pagamento implementado

PRÓXIMOS PASSOS:
1. Testar com cartões sandbox
2. Validar webhooks
3. Ir para produção (quando pronto)

DOCUMENTAÇÃO: Este arquivo
CÓDIGO: src/lms/services/CieloService.ts
CONFIG: .env.local (CIELO_ENVIRONMENT=sandbox)
```

---

**Última atualização**: 2026-04-07  
**Status**: ✅ Ready for Testing  
**Ambiente**: Sandbox (Seguro)
