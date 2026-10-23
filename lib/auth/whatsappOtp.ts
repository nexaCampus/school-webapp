/**
 * Meta WhatsApp Business Cloud API Integration
 * Handles dispatching cryptographic verification codes directly to creator WhatsApp numbers.
 */

export interface WhatsAppOtpResult {
  success: boolean;
  delivered: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Normalizes phone numbers to standard WhatsApp E.164 digits-only format.
 * E.g., "+91 6289652321" -> "916289652321", "6289652321" -> "916289652321".
 */
export function normalizeWhatsAppNumber(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`; // Default to India (+91) for 10-digit mobile
  }
  return digits;
}

/**
 * Dispatches a 6-digit verification code to the creator's WhatsApp via Meta Cloud API.
 */
export async function sendWhatsAppOtpMessage(
  rawPhone: string,
  otpCode: string,
  creatorName: string = 'Administrator'
): Promise<WhatsAppOtpResult> {
  const recipient = normalizeWhatsAppNumber(rawPhone);
  const token = process.env.WHATSAPP_API_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME?.trim();

  // If WhatsApp credentials have not been configured yet, log guidance and return safely.
  if (!token || !phoneNumberId) {
    console.info(
      `[WhatsApp OTP] WhatsApp Cloud API credentials not configured yet (WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID missing). OTP ${otpCode} securely generated & stored for ${recipient}.`
    );
    return {
      success: true,
      delivered: false,
      error: 'WhatsApp API credentials pending configuration.',
    };
  }

  const endpoint = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  // Payload: Either approved Meta authentication template or direct text message
  const payload = templateName
    ? {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: otpCode }],
            },
            {
              type: 'button',
              sub_type: 'url',
              index: '0',
              parameters: [{ type: 'text', text: otpCode }],
            },
          ],
        },
      }
    : {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: {
          preview_url: false,
          body: `*NexaCampus SchoolMaker Verification*\n\nHello ${creatorName},\n\nYour 6-digit WhatsApp verification code is: *${otpCode}*\n\nThis code will expire in 10 minutes. Please do not share this code with anyone.`,
        },
      };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg =
        data?.error?.message || `WhatsApp API error HTTP ${res.status}`;
      console.error('[WhatsApp OTP] Meta Cloud API error:', errMsg, data);
      return {
        success: false,
        delivered: false,
        error: errMsg,
      };
    }

    const messageId = data?.messages?.[0]?.id;
    console.info(
      `[WhatsApp OTP] Successfully dispatched WhatsApp verification code to ${recipient} (Message ID: ${messageId})`
    );

    return {
      success: true,
      delivered: true,
      messageId,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[WhatsApp OTP] Network/Transport exception:', message);
    return {
      success: false,
      delivered: false,
      error: message,
    };
  }
}
