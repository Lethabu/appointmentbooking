import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

export async function POST(req) {
    const { order_id, amount, email, currency = 'ZAR', callback_url } = await req.json();

    if (!process.env.PAYSTACK_SECRET_KEY) {
        console.error("PAYSTACK_SECRET_KEY is not set.");
        return NextResponse.json({ error: "Payment gateway configuration error" }, { status: 500 });
    }
    if (!amount || !email || !order_id) {
        return NextResponse.json({ error: "Missing required fields: amount, email, order_id" }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const paymentReference = `ps_${nanoid(12)}`;

    try {
        // 1. Record the payment attempt in your 'payments' table
        const { data: paymentRecord, error: paymentInsertError } = await supabase
            .from('payments')
            .insert({
                order_id: order_id,
                amount: amount,
                currency: currency,
                status: 'pending',
                method: 'paystack',
                gateway_reference: paymentReference,
            })
            .select()
            .single();

        if (paymentInsertError || !paymentRecord) {
            console.error("Failed to record payment attempt:", paymentInsertError);
            return NextResponse.json({ error: "Failed to initiate payment record" }, { status: 500 });
        }

        // 2. Initialize Paystack Transaction
        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                amount: amount,
                currency: currency,
                reference: paymentReference,
                callback_url: callback_url || `${process.env.NEXT_PUBLIC_SITE_URL}/order/complete?payment_ref=${paymentReference}&payment_id=${paymentRecord.id}`,
                metadata: {
                    order_id: order_id,
                    payment_db_id: paymentRecord.id,
                },
            }),
        });

        const paystackData = await paystackResponse.json();

        if (!paystackData.status || !paystackData.data.authorization_url) {
            console.error('Paystack initialization failed:', paystackData);
            await supabase
                .from('payments')
                .update({ status: 'failed_initiation' })
                .eq('id', paymentRecord.id);
            return NextResponse.json({ error: 'Payment gateway initialization failed' }, { status: 500 });
        }

        await supabase
            .from('payments')
            .update({ status: 'redirected' })
            .eq('id', paymentRecord.id);

        return NextResponse.json({ authorization_url: paystackData.data.authorization_url, access_code: paystackData.data.access_code, reference: paystackData.data.reference });

    } catch (error) {
        console.error('Paystack payment initiation failed:', error);
        return NextResponse.json({ error: 'Payment processing error' }, { status: 500 });
    }
}
