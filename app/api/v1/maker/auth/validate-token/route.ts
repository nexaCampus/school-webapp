import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/db/turso';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = String(body.phone || '').trim();
    const token = String(body.token || '').trim();

    if (!phone || !token) {
      return NextResponse.json(
        { valid: false, error: 'Phone and token are required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.startsWith('+') ? phone : `+91 ${phone.replace(/\D/g, '').slice(-10)}`;

    const result = await turso.execute({
      sql: 'SELECT token, verified, creator_name, verified_at FROM creator_sessions WHERE phone = ? AND token = ?',
      args: [cleanPhone, token],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ valid: false, message: 'Invalid or expired session token.' });
    }

    const row = result.rows[0];
    const isVerified = Number(row.verified) === 1;

    return NextResponse.json({
      valid: isVerified,
      phone: cleanPhone,
      creator_name: String(row.creator_name || ''),
      verified_at: row.verified_at,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Validation error';
    return NextResponse.json({ valid: false, error: message }, { status: 500 });
  }
}
