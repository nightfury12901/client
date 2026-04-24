import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLANS: Record<string, { amount: number; name: string }> = {
  pro:    { amount: 99900, name: 'Pro Plan' },    // ₹999 in paise
  agency: { amount: 249900, name: 'Agency Plan' }, // ₹2499 in paise
};

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { plan } = await request.json();
  const planInfo = PLANS[plan];
  if (!planInfo) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

  const order = await razorpay.orders.create({
    amount:   planInfo.amount,
    currency: 'INR',
    receipt:  `order_${user.id.slice(0, 8)}_${Date.now()}`,
    notes:    { userId: user.id, plan },
  });

  return NextResponse.json({
    orderId: order.id,
    amount:  order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    planName: planInfo.name,
    userEmail: user.email,
  });
}
