'use client';

import { Button } from '@/app/components/ui/button';
import { createStripeCheckout } from '../_actions/create-checkout';
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

const AcquirePlanButton = () => {
  const { user } = useUser();
  const handleAcquirePlanClick = async () => {
    const { sessionId } = await createStripeCheckout();
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error('Stripe publishable key not found');
    }
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    if (!stripe) {
      throw new Error('Stripe not found');
    }
    await stripe.redirectToCheckout({ sessionId });
  };
  const hasPremiumPlan = user?.publicMetadata.subscriptionPlan === 'premium';
  if (hasPremiumPlan) {
    return (
      <Button
        className="flex items-center justify-center w-[370px] h-[45px] mb-4 border-[.1px] rounded-full text-[14px] text-white bg-[#55B02E] hover:bg-[#55B02E]"
        variant="link"
      >
        <Link
          href={`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL as string}?prefilled_email=${user.emailAddresses[0].emailAddress}`}
        >
          Gerenciar plano
        </Link>
      </Button>
    );
  }
  return (
    <Button
      className="flex items-center justify-center w-[370px] h-[45px] mb-4 border-[.1px] rounded-full text-[14px] text-white bg-[#55B02E] hover:bg-[#55B02E]"
      onClick={handleAcquirePlanClick}
    >
      Adquirir plano
    </Button>
  );
};

export default AcquirePlanButton;
