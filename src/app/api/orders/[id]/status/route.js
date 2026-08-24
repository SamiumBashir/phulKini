import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/server/orders/updateOrderStatus';
import { getServerSession, hasPermission } from '@/lib/security/auth';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(request);

    if (!hasPermission(session, ['SUPER_ADMIN', 'ADMIN', 'MANAGER'])) {
      return NextResponse.json(
        { success: false, message: 'অননুমোদিত অ্যাক্সেস!' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, note } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'স্ট্যাটাস আবশ্যক' },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus({
      orderId: id,
      newStatus: status,
      note,
      actor: session
    });

    return NextResponse.json({
      success: true,
      order: updated,
      message: 'অর্ডার স্ট্যাটাস আপডেট সম্পন্ন হয়েছে'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'স্ট্যাটাস আপডেটে সমস্যা' },
      { status: 500 }
    );
  }
}
