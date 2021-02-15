import { onMounted, Ref, ref, onBeforeUnmount } from 'vue-demi'
import {
  StripeConstructorOptions,
  Stripe,
  StripeElementsOptions,
  StripeElements,
  StripeCardElementOptions,
  StripeCardCvcElementOptions,
  StripeCardNumberElementOptions,
  StripeCardExpiryElementOptions,
  StripeAuBankAccountElementOptions,
  StripeFpxBankElementOptions,
  StripeIbanElementOptions,
  StripeIdealBankElementOptions,
  StripePaymentRequestButtonElementOptions,
  StripeEpsBankElementOptions,
  StripeP24BankElementOptions,
  StripeElementType,
  StripeElement,
} from '@stripe/stripe-js'

export type ElementType = {
  type: StripeElementType
  options?:
    | StripeCardElementOptions
    | StripeCardCvcElementOptions
    | StripeCardExpiryElementOptions
    | StripeCardNumberElementOptions
    | StripeAuBankAccountElementOptions
    | StripeFpxBankElementOptions
    | StripeIbanElementOptions
    | StripeIdealBankElementOptions
    | StripePaymentRequestButtonElementOptions
    | StripeEpsBankElementOptions
    | StripeP24BankElementOptions
}

export type StripeOptions = {
  key: string
  elements?: ElementType[]
  constructorOptions?: StripeConstructorOptions
  elementsOptions?: StripeElementsOptions
}

export const baseStyle = {
  base: {
    color: '#32325d',
    fontFamily: 'Helvetica Neue, Roboto',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
}

export function useStripe({
  key,
  elements: types = [],
  constructorOptions,
  elementsOptions,
}: StripeOptions) {
  const stripe = ref(null) as Ref<Stripe | null>
  const stripeElements = ref(null) as Ref<StripeElements | null>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elements = types.map(() => ref(null)) as Ref<any>[]

  const setupStripe = () => {
    if (typeof window === 'undefined' || !window.Stripe) {
      return false
    }

    stripe.value = window.Stripe(key, constructorOptions)
    stripeElements.value = stripe.value.elements(elementsOptions)

    types.forEach(({ type, options }, index) => {
      // @ts-ignore
      elements[index].value = stripeElements.value.create(type, {
        style: baseStyle,
        ...options,
      })
    })

    return true
  }

  const destroyElement = (element: StripeElement) => {
    if (element) {
      try {
        element.unmount()
        element.destroy()
      } catch {
        // Do nothing
      }
    }
  }

  onMounted(() => {
    if (!setupStripe()) {
      let times = 0
      const iid = setInterval(() => {
        times++
        const ready = setupStripe()
        if (ready || times > 10) {
          clearInterval(iid)
          if (!ready) {
            console.error('Stripe library is not loaded')
          }
        }
      }, 500)
    }
  })

  onBeforeUnmount(() => {
    elements.forEach((element) => destroyElement(element.value))
  })

  return {
    stripe,
    stripeElements,
    elements,
  }
}
