import '@stripe/stripe-js'
import { createApp, h, ref, isVue2 } from 'vue-demi'
import { useStripe, StripeElement, ElementChangeEvent } from './src'

createApp({
  setup() {
    const event = ref(null as null | ElementChangeEvent)

    const {
      stripe,
      elements: [cardElement],
    } = useStripe({
      key: import.meta.env.VITE_STRIPE_PUBLIC_KEY as string,
      elements: [{ type: 'card', options: {} }],
    })

    const registerCard = () => {
      if (event.value?.complete) {
        // Refer to the official docs to see all the Stripe instance properties.
        // E.g. https://stripe.com/docs/js/setup_intents/confirm_card_setup
        return stripe.value?.confirmCardSetup('<client-secret>', {
          // eslint-disable-next-line @typescript-eslint/camelcase
          payment_method: {
            card: cardElement.value,
          },
        })
      }
    }

    const onChange = (changeEvent: ElementChangeEvent) => {
      event.value = changeEvent
    }

    return () =>
      h('div', { style: { maxWidth: '400px', margin: '20px auto' } }, [
        h('div', {}, [`Using ESM + TS and Vue ${isVue2 ? 2 : 3}`]),
        // @ts-ignore
        h(StripeElement, {
          style: { margin: '20px 0', height: '20px' },
          ...(isVue2
            ? {
                props: { element: cardElement.value },
                on: { change: onChange },
              }
            : { element: cardElement.value, onChange }),
        }),
        h(
          'button',
          // @ts-ignore
          isVue2 ? { on: { click: registerCard } } : { onClick: registerCard },
          'Add'
        ),
        event?.value?.error
          ? h(
              'div',
              { style: { marginTop: '20px', color: 'red' } },
              event.value.error.message
            )
          : null,
      ])
  },
}).mount('#app')
