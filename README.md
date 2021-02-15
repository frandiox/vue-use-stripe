# Vue Use Stripe

This is a thin Vue 3 wrapper (0.7 KB gzipped) for Stripe.js written in TypeScript. It simply provides a function (Vue hook) to create Stripe elements and a component that conveniently emits events.

Support for Vue 2 was added in `0.1.0` via `vue-demi`.

## Installation

Add Stripe.js to `index.html` as recommended by Stripe:

```html
<script async src="https://js.stripe.com/v3/"></script>
```

Alternatively, [install `@stripe/stripe-js`](https://github.com/stripe/stripe-js) and import it in your project to automatically add the previous script tag as a side effect:

```js
// main.js
import '@stripe/stripe-js'
```

Install this wrapper:

```bash
yarn add vue-use-stripe
```

If you are using TypeScript, make sure you also install the mentioned `@stripe/stripe-js` library as well to get proper types for Stripe. Note that, if you are adding the script tag direclty to `index.html`, then `@stripe/stripe-js` can be installed as a **dev dependency** (it will only be used for types, not bundled in your app).

## Usage

### Vue 3 in ESM environment

```ts
import { defineComponent, ref } from 'vue'
import { useStripe, StripeElement } from 'vue-use-stripe'

export default defineComponent({
  components: { StripeElement },
  setup() {
    const event = ref(null)

    const {
      stripe,
      elements: [cardElement],
    } = useStripe({
      key: process.env.VUE_APP_STRIPE_PUBLIC_KEY || '',
      elements: [{ type: 'card', options: {} }],
    })

    const registerCard = () => {
      if (event.value?.complete) {
        // Refer to the official docs to see all the Stripe instance properties.
        // E.g. https://stripe.com/docs/js/setup_intents/confirm_card_setup
        return stripe.value?.confirmCardSetup('<client-secret>', {
          payment_method: {
            card: cardElement.value,
          },
        })
      }
    }

    return {
      event,
      cardElement,
      registerCard,
    }
  },
})
```

```html
<template>
  <StripeElement :element="cardElement" @change="event = $event" />
  <button @click="registerCard">Add</button>
  <div v-if="event && event.error">{{ event.error.message }}</div>
</template>
```

### Vue 2

Install `@vue/composition-api` as a dependency. Everything else should be similar to the example above for Vue 3.

### Downloading directly from CDN

Make sure `vue-demi` is included before `vue-use-stripe`:

```html
<script src="https://unpkg.com/vue@3"></script>
<!-- if using Vue 2 -->
<!-- <script src="https://unpkg.com/@vue/composition-api@1.0.0-rc.1"></script> -->
<script src="https://unpkg.com/vue-demi"></script>
<script src="https://unpkg.com/vue-use-stripe"></script>

<script>
  const { useStripe, StripeElement } = window.VueUseStripe
  // Same as Vue 3 example above
</script>
```

### API

```ts
useStripe(options: StripeOptions): {
  // Reactive reference to the Stripe instance (created using `window.Stripe`) with proper typings
  stripe: Ref<Stripe | null>;

  // Reactive reference to the internal elements instance (Stripe.elements(...)).
  // This allows creating Stripe elements manually (optional):
  // stripeElements.create('card', { <options> })
  stripeElements: Ref<StripeElements | null>;

  // Array of elements created out of `StripeOptions.elements` array
  elements: Ref<any>[];
}

type StripeOptions = {
  // Stripe API key
  key: string;

  // Array of elements to be created
  // See the following link for possible types and options:
  // https://stripe.com/docs/js/elements_object/create_element?type=card
  // E.g. `[{ type: 'card', options: { hidePostalCode: true } }, { type: 'fpxBank' }, ...]
  elements?: { type: string; options: object }[];

  // Stripe constructor options: https://stripe.com/docs/js/initializing
  constructorOptions?: object;

  // Elements constructor options: https://stripe.com/docs/js/elements_object/create
  elementsOptions?: object;
}
```

Note: `StripeOptions.elements` array is optional. Alternatively, create elements manually using the returned `stripeElements`.

The `<StripeElement />` component will emit any event created by the internal element: `change`, `ready`, `click`, `focus`, `blur`.
