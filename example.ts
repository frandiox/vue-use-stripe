import '@stripe/stripe-js'
import { createApp, h, ref } from 'vue'
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

    return () =>
      h('div', {}, [
        h(StripeElement, {
          element: cardElement.value,
          onChange: (changeEvent: ElementChangeEvent) => {
            event.value = changeEvent
          },
        }),
        h('button', { onClick: registerCard }, 'Add'),
        event?.value?.error ? h('div', {}, event.value.error.message) : null,
      ])
  },
}).mount('#app')
