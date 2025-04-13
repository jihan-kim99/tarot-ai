import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";

// Reading product configuration
const READING_PRODUCTS = {
  single: {
    price: "price_1RCWmoQQsGCeoHVdTz7Lzsvq", // Price ID for single card reading
    name: "Single Card Tarot Reading",
  },
  universal6: {
    price: "price_1RCWmoQQsGCeoHVdTz7Lzsvq", // Using same price for now, should be updated with actual price ID
    name: "Universal 6 Card Tarot Reading",
  },
};

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // Parse the request body
    const body = await request.json();
    const { readingType = "single" } = body;

    // Get the appropriate product based on reading type
    const product =
      READING_PRODUCTS[readingType as keyof typeof READING_PRODUCTS] ||
      READING_PRODUCTS.single;

    // Create Checkout Sessions from body params
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: product.price,
          quantity: 1,
          adjustable_quantity: {
            enabled: false,
          },
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/canceled`,
      metadata: {
        readingType,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
    }
    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode || 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
