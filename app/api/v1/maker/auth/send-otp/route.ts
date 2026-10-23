import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { turso } from '@/lib/db/turso';
import { sendWhatsAppOtpMessage } from '@/lib/auth/whatsappOtp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPhone = String(body.phone || '').trim();
    const digitsOnly = rawPhone.replace(/\D/g, '');

    if (digitsOnly.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number for WhatsApp verification.' },
        { status: 400 }
      );
    }

    const cleanPhone = rawPhone.startsWith('+')
      ? rawPhone
      : `+91 ${digitsOnly.slice(-10)}`;
    const creatorName = String(body.creator_name || body.creatorName || 'School Administrator').trim();

    // Generate a secure cryptographically random 6-digit OTP (100000 - 999999)
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const initialToken = `tok_maker_${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Persist OTP in Turso SQLite
    await turso.execute({
      sql: `INSERT INTO creator_sessions (phone, creator_name, otp_code, token, verified, created_at, expires_at, attempts, channel)
            VALUES (?, ?, ?, ?, 0, ?, ?, 0, 'whatsapp')
            ON CONFLICT(phone) DO UPDATE SET
              creator_name = excluded.creator_name,
              otp_code = excluded.otp_code,
              token = excluded.token,
              verified = 0,
              attempts = 0,
              channel = 'whatsapp',
              expires_at = excluded.expires_at`,
      args: [cleanPhone, creatorName, otpCode, initialToken, now, expiresAt],
    });

    // Record audit event
    await turso.execute({
      sql: `INSERT INTO maker_audit_logs (id, school_id, creator_phone, action, details, created_at)
            VALUES (?, NULL, ?, 'otp_dispatched', ?, ?)`,
      args: [
        `audit-${crypto.randomUUID()}`,
        cleanPhone,
        JSON.stringify({ channel: 'whatsapp', creator_name: creatorName }),
        now,
      ],
    });

    // Dispatch via Meta WhatsApp Business Cloud API
    const waResult = await sendWhatsAppOtpMessage(cleanPhone, otpCode, creatorName);

    // Return production-grade response WITHOUT leaking otp code to client DOM
    return NextResponse.json({
      success: true,
      message: `6-digit WhatsApp verification code dispatched to ${cleanPhone}`,
      channel: 'whatsapp',
      delivered: waResult.delivered,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send OTP';
    console.error('[API Send-OTP] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
