import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { turso } from '@/lib/db/turso';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPhone = String(body.phone || '').trim();
    const inputOtp = String(body.otp || body.code || '').trim();
    const digitsOnly = rawPhone.replace(/\D/g, '');

    if (!rawPhone || !inputOtp) {
      return NextResponse.json(
        { error: 'Phone number and 6-digit WhatsApp verification code are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = rawPhone.startsWith('+')
      ? rawPhone
      : `+91 ${digitsOnly.slice(-10)}`;

    // Query creator session from Turso
    const result = await turso.execute({
      sql: 'SELECT otp_code, creator_name, expires_at, verified, attempts FROM creator_sessions WHERE phone = ?',
      args: [cleanPhone],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'No verification request found for this phone number. Please request a new code.' },
        { status: 400 }
      );
    }

    const row = result.rows[0];
    const storedOtp = String(row.otp_code || '');
    const creatorName = String(row.creator_name || body.creator_name || 'School Administrator');
    const expiresAt = new Date(String(row.expires_at || 0));
    const attempts = Number(row.attempts || 0);

    // Rate-limiting brute force check
    if (attempts >= 5) {
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please request a new WhatsApp verification code.' },
        { status: 429 }
      );
    }

    // Check expiration
    if (Date.now() > expiresAt.getTime()) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Verify OTP match
    if (inputOtp !== storedOtp) {
      await turso.execute({
        sql: 'UPDATE creator_sessions SET attempts = attempts + 1 WHERE phone = ?',
        args: [cleanPhone],
      });

      return NextResponse.json(
        { error: 'Invalid verification code. Please enter the correct 6-digit code received on WhatsApp.' },
        { status: 400 }
      );
    }

    // Success: Issue 256-bit cryptographic creator session token
    const now = new Date().toISOString();
    const verifiedToken = `tok_creator_live_${crypto.randomBytes(24).toString('hex')}`;

    await turso.execute({
      sql: `UPDATE creator_sessions
            SET verified = 1, verified_at = ?, token = ?, attempts = 0
            WHERE phone = ?`,
      args: [now, verifiedToken, cleanPhone],
    });

    // Record audit event
    await turso.execute({
      sql: `INSERT INTO maker_audit_logs (id, school_id, creator_phone, action, details, created_at)
            VALUES (?, NULL, ?, 'creator_verified', ?, ?)`,
      args: [
        `audit-${crypto.randomUUID()}`,
        cleanPhone,
        JSON.stringify({ creator_name: creatorName, channel: 'whatsapp' }),
        now,
      ],
    });

    return NextResponse.json({
      success: true,
      token: verifiedToken,
      session: {
        phone: cleanPhone,
        creatorName,
        verifiedAt: now,
        token: verifiedToken,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Verification failed';
    console.error('[API Verify-OTP] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
