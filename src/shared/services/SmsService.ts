/**
 * SMS Service
 * Usa Twilio para envio de SMS
 */

'use server'

interface SmsOptions {
  to: string
  body: string
  from?: string
}

interface SmsResponse {
  success: boolean
  messageId?: string
  error?: string
}

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

/**
 * Enviar SMS via Twilio
 */
async function sendSms(options: SmsOptions): Promise<SmsResponse> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.warn('Twilio credentials not configured - SMS will not be sent')
    return { success: true, messageId: 'mock-id' } // Mock mode
  }

  try {
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: options.from || TWILIO_PHONE_NUMBER,
          To: options.to,
          Body: options.body,
        }).toString(),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Twilio API error: ${response.status} - ${error}`)
    }

    const data = (await response.json()) as { sid: string }

    return {
      success: true,
      messageId: data.sid,
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao enviar SMS',
    }
  }
}

/**
 * Enviar SMS de confirmação de matrícula
 */
export async function sendEnrollmentConfirmationSms(
  phoneNumber: string,
  studentName: string,
  courseName: string
): Promise<SmsResponse> {
  const message = `Olá ${studentName}! Sua matrícula em "${courseName}" foi confirmada! Acesse ${process.env.NEXT_PUBLIC_APP_URL}/aluno para começar.`

  return sendSms({
    to: phoneNumber,
    body: message,
  })
}

/**
 * Enviar SMS de lembrete de aula
 */
export async function sendClassReminderSms(
  phoneNumber: string,
  courseName: string,
  classTime: string
): Promise<SmsResponse> {
  const message = `Lembrete: Você tem aula de "${courseName}" em ${classTime}. Não perca!`

  return sendSms({
    to: phoneNumber,
    body: message,
  })
}

/**
 * Enviar SMS de pagamento pendente
 */
export async function sendPendingPaymentSms(
  phoneNumber: string,
  courseName: string,
  dueDate: string,
  amount: number
): Promise<SmsResponse> {
  const message = `Atenção! Você tem um pagamento pendente de R$${amount.toFixed(2)} para o curso "${courseName}". Vence em ${dueDate}. Acesse sua conta para pagar.`

  return sendSms({
    to: phoneNumber,
    body: message,
  })
}

/**
 * Enviar SMS de notificação genérica
 */
export async function sendNotificationSms(
  phoneNumber: string,
  message: string
): Promise<SmsResponse> {
  // Limitar a 160 caracteres
  const trimmedMessage = message.substring(0, 160)

  return sendSms({
    to: phoneNumber,
    body: trimmedMessage,
  })
}

/**
 * Enviar SMS de código de verificação
 */
export async function sendVerificationCodeSms(
  phoneNumber: string,
  code: string
): Promise<SmsResponse> {
  const message = `Seu código de verificação IEPI é: ${code}. Válido por 10 minutos.`

  return sendSms({
    to: phoneNumber,
    body: message,
  })
}

/**
 * Enviar SMS de recuperação de senha
 */
export async function sendPasswordResetSms(
  phoneNumber: string,
  resetLink: string
): Promise<SmsResponse> {
  const message = `Clique aqui para redefenir sua senha IEPI: ${resetLink}`

  return sendSms({
    to: phoneNumber,
    body: message,
  })
}

/**
 * Enviar SMS de certificado pronto
 */
export async function sendCertificateReadySms(
  phoneNumber: string,
  courseName: string
): Promise<SmsResponse> {
  const message = `Parabéns! Seu certificado de "${courseName}" está pronto! Acesse sua conta para fazer download.`

  return sendSms({
    to: phoneNumber,
    body: message,
  })
}
