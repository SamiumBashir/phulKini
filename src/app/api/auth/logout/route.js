import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, getServerSession } from '@/lib/security/auth';
import { logAudit } from '@/server/audit/logAudit';

export async function POST(request) {
  try {
    const session = await getServerSession(request);

    if (session) {
      await logAudit({
        actorId: session.id,
        actorName: session.name,
        actorRole: session.role,
        action: 'LOGOUT',
        resource: 'AUTH'
      });
    }

    const response = NextResponse.json({
      success: true,
      message: 'লগআউট সফল হয়েছে'
    });

    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  } catch (error) {
    return NextResponse.json({ success: true });
  }
}
