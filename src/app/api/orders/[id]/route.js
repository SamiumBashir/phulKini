import { NextResponse } from 'next/server';
import { getOrderById } from '@/server/orders/getOrderById';
import { getServerSession } from '@/lib/security/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(request);

    const order = await getOrderById(id, session);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'অর্ডারটি খুঁজে পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'অর্ডার লোড করতে সমস্যা হয়েছে' },
      { status: 403 }
    );
  }
}
