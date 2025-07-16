import Stripe from 'stripe';
import config from '../../../config';
const stripe = new Stripe(config.stripe_secret_key as string);

const openOnboardingLink = async (host: any) => {
  if (host.stripeAccountId) {
    const onboardingLink = await stripe.accountLinks.create({
      account: host.stripeAccountId,
      refresh_url: `http://10.0.60.53:5100?accountId=${host.stripeAccountId}`,
      return_url: `http://10.0.60.53:5100/return`,
      type: 'account_onboarding',
    });
    return onboardingLink.url;
  }

  const account = await stripe.accounts.create({
    type: 'express',
    email: host?.email,
    country: 'US',
    capabilities: {
      transfers: { requested: true },
    },
    business_type: 'individual',
    settings: {
      payouts: {
        schedule: {
          interval: 'manual',
        },
      },
    },
  });
  host.stripeAccountId = account.id;
  await host.save();

  const onboardingLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `http://10.0.60.53:5100?accountId=${account?.id}`,
    return_url: `http://10.0.60.53:5100/refresh`,
    type: 'account_onboarding',
  });
  return onboardingLink?.url;
};

export default {
  openOnboardingLink,
};
