import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/security/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(request);

    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
        phone: session.phone
      }
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 }
    );
  }
}
