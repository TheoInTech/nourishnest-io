import { createClient } from '@/utils/supabase-api'
import crypto from 'crypto'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

function sha256(data: Buffer, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.LEMONS_SQUEEZY_SIGNATURE_SECRET ?? ''

    const supabase = createClient()
    const rawBody = await req.json()
    const headersList = headers()
    const signature = sha256(rawBody, secret)

    if (signature !== headersList.get('x-signature')) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    const payload = JSON.parse(rawBody.toString('utf-8'))
    const eventName = payload?.meta?.event_name
    const subscriptionData = payload?.data?.attributes

    // Invoices
    // EVENT: subscription_payment_success
    if (eventName === 'subscription_payment_success') {
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('user_email,variant_name')
        .eq('id', subscriptionData?.subscription_id)
        .order('id', { ascending: false })
        .maybeSingle()

      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('availed_weeks,email')
        .eq('email', subData?.user_email)
        .order('id', { ascending: false })
        .maybeSingle()

      if (
        subError ||
        profileError ||
        !subData ||
        !profileData ||
        !subData?.variant_name
      ) {
        subError && console.error('Error getting subscription: ', subError)
        profileError && console.error('Error getting profile: ', profileError)
        return NextResponse.json(
          {
            error:
              'Failed to get subscription or profile on subscription_payment_success',
            data: subError || profileError,
          },
          { status: 500 },
        )
      }

      const { data, error } = await supabase.from('invoices').insert([
        {
          id: payload?.data?.id,
          store_id: subscriptionData?.stored_id,
          subscription_id: subscriptionData?.subscription_id,
          billing_reason: subscriptionData?.billing_reason,
          card_brand: subscriptionData?.card_brand,
          card_last_four: subscriptionData?.card_last_four,
          currency: subscriptionData?.currency,
          currency_rate: subscriptionData?.currency_rate,
          subtotal: subscriptionData?.subtotal,
          discount_total: subscriptionData?.discount_total,
          tax: subscriptionData?.tax,
          total: subscriptionData?.total,
          subtotal_usd: subscriptionData?.subtotal_usd,
          discount_total_usd: subscriptionData?.discount_total_usd,
          tax_usd: subscriptionData?.tax_usd,
          total_usd: subscriptionData?.total_usd,
          status: subscriptionData?.status,
          status_formatted: subscriptionData?.status_formatted,
          refunded: subscriptionData?.refunded,
          refunded_at: subscriptionData?.refunded_at,
          subtotal_formatted: subscriptionData?.subtotal_formatted,
          discount_total_formatted: subscriptionData?.discount_total_formatted,
          tax_formatted: subscriptionData?.tax_formatted,
          total_formatted: subscriptionData?.total_formatted,
          urls: subscriptionData?.urls,
          test_mode: subscriptionData?.test_mode,
        },
      ])

      // Add 52 weeks for annual; and 4 weeks for monthly
      const weeksToAdd = subData?.variant_name
        .toLocaleLowerCase()
        .includes('monthly')
        ? 4
        : 52
      const { error: userError } = await supabase
        .from('profile')
        .update({
          availed_weeks: profileData?.availed_weeks + weeksToAdd,
        })
        .match({ email: subData?.user_email })

      if (error || userError) {
        error && console.error('Error inserting invoice: ', error)
        userError && console.error('Error update subscription: ', userError)

        return NextResponse.json(
          {
            error: 'Failed to handle subscription_payment_success',
            data: subError || userError,
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          received: true,
          data,
        },
        { status: 200 },
      )
    }

    // Subscriptions
    const profile = await supabase
      .from('profile')
      .select('*')
      .eq('email', subscriptionData?.user_email)
      .maybeSingle()

    if (!profile || !profile?.data?.user_id) {
      console.log('No profile found')
      throw new Error('No profile found')
    } else if (!subscriptionData || !payload) {
      console.log('No subscription data found')
      throw new Error('No subscription data found')
    }

    // EVENT: subscription_created
    if (eventName === 'subscription_created') {
      const { data, error } = await supabase.from('subscriptions').insert([
        {
          billing_anchor: subscriptionData?.billing_anchor,
          cancelled: subscriptionData?.cancelled,
          card_brand: subscriptionData?.card_brand,
          card_last_four: subscriptionData?.card_last_four,
          customer_id: subscriptionData?.customer_id,
          ends_at: subscriptionData?.ends_at,
          order_id: subscriptionData?.order_id,
          pause: subscriptionData?.pause,
          product_id: subscriptionData?.product_id,
          product_name: subscriptionData?.product_name,
          renews_at: subscriptionData?.renews_at,
          status: subscriptionData?.status,
          status_formatted: subscriptionData?.status_formatted,
          store_id: subscriptionData?.stored_id,
          test_mode: subscriptionData?.test_mode,
          trial_ends_at: subscriptionData?.trial_ends_at,
          urls: subscriptionData?.urls,
          user_email: subscriptionData?.user_email,
          user_name: subscriptionData?.user_name,
          variant_id: subscriptionData?.variant_id,
          variant_name: subscriptionData?.variant_name,
          id: payload?.data?.id,
          profile_id: profile?.data?.id,
          user_id: profile?.data?.user_id,
        },
      ])

      if (error) {
        console.log('Error inserting data: ', error)
        throw new Error('Failed to insert data')
      }

      return NextResponse.json(
        {
          received: true,
          data,
        },
        { status: 200 },
      )
    }

    // EVENT: subscription_updated
    if (eventName === 'subscription_updated') {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          urls: subscriptionData?.urls,
          pause: subscriptionData?.pause,
          ends_at: subscriptionData?.ends_at,
          order_id: subscriptionData?.order_id,
          store_id: subscriptionData?.stored_id,
          cancelled: subscriptionData?.cancelled,
          renews_at: subscriptionData?.renews_at,
          test_mode: subscriptionData?.test_mode,
          user_name: subscriptionData?.user_name,
          card_brand: subscriptionData?.card_brand,
          product_id: subscriptionData?.product_id,
          user_email: subscriptionData?.user_email,
          variant_id: subscriptionData?.variant_id,
          customer_id: subscriptionData?.customer_id,
          product_name: subscriptionData?.product_name,
          variant_name: subscriptionData?.variant_name,
          order_item_id: subscriptionData?.order_item_id,
          trial_ends_at: subscriptionData?.trial_ends_at,
          billing_anchor: subscriptionData?.billing_anchor,
          card_last_four: subscriptionData?.card_last_four,
          status: subscriptionData?.status,
          status_formatted: subscriptionData?.status_formatted,
        })
        .match({ id: payload?.data?.id })

      if (error) {
        console.log('Error updating data: ', error)
        throw new Error('Failed to update data')
      }

      return NextResponse.json(
        {
          received: true,
          data,
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        error,
      },
      { status: 500 },
    )
  }
}
