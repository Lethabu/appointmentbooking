import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { customer_id, mood_score, notes } = await request.json();

    // Crisis intervention for low mood scores
    if (mood_score <= 3) {
      // Trigger crisis support workflow
      console.log(
        `Crisis alert for customer ${customer_id}: mood score ${mood_score}`,
      );
    }

    // AI mood discount for scores 4-6
    let discount = 0;
    if (mood_score >= 4 && mood_score <= 6) {
      discount = 10; // 10% mood boost discount
    }

    return NextResponse.json({
      success: true,
      mood_recorded: true,
      discount_applied: discount,
      message:
        discount > 0
          ? `We've applied a ${discount}% mood boost discount to your next booking!`
          : 'Mood recorded successfully',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
