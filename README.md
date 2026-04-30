# Food Ordering Agent

An AI-powered food ordering assistant for **Mama Asante's Chop Bar**, a Ghanaian restaurant in East Legon, Accra. Built with [Mastra](https://mastra.ai/) and [Paystack](https://paystack.com/) for end-to-end ordering and payment.

Customers can browse the menu, place orders in natural language, and pay by card or Mobile Money (MTN MoMo, Vodafone Cash).

## How it works

1. **Browse**: Customer asks to see the menu or search for a specific dish
2. **Order**: Agent confirms items, sizes, and total in GHS
3. **Pay**: Agent generates a Paystack payment link (card or Mobile Money)
4. **Confirm**: Agent verifies the payment and confirms the order

## Prerequisites

- [Node.js](https://nodejs.org/) `>=22.13.0`
- [pnpm](https://pnpm.io/) `>=10`. Install with `npm install -g pnpm`
- A **Google AI API key**. The agent uses `google/gemma-4-31b-it`. Get one at [aistudio.google.com](https://aistudio.google.com/app/apikey)
- A **Paystack secret key** (test mode works). Get one from your [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer)

## Setup

**1. Clone the repository**

```bash
git clone https://github.com/PaystackOSS/food-ordering-agent.git
cd food-ordering-agent
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
PAYSTACK_TEST_KEY=your_paystack_secret_key
```

**4. Start the development server**

```bash
pnpm run dev
```

Open [http://localhost:4111](http://localhost:4111) in your browser to access **Mastra Studio**, an interactive UI for chatting with the agent, inspecting traces, and testing tools.

## Project structure

```
src/
├── data/
│   └── menu.json                     # Restaurant menu (items, sizes, GHS prices)
└── mastra/
    ├── index.ts                      # Mastra configuration and entry point
    ├── agents/
    │   └── order-agent.ts            # The food ordering agent definition
    ├── tools/
    │   ├── view-menu.ts              # Returns the full menu organised by category
    │   ├── search-menu.ts            # Searches menu by name, category, or description
    │   ├── initiate-payment.ts       # Creates a Paystack transaction and returns a payment link
    │   └── verify-payment.ts         # Verifies a Paystack transaction by reference
    └── prompts/
        └── ordering-instructions.ts  # System prompt for the ordering agent
```

## Available tools

| Tool | Description |
|---|---|
| `view_menu` | Returns the complete menu grouped by category with price ranges |
| `search_menu` | Searches for dishes by name, category, or description |
| `initiate_payment` | Takes a customer email and total (GHS) and returns a Paystack payment link |
| `verify_payment` | Verifies a payment using the Paystack transaction reference |

## Customising the menu

Edit `src/data/menu.json` to update dishes, sizes, and prices. Each item follows this shape:

```json
{
  "id": "rice-jollof",
  "name": "Jollof Rice",
  "category": "Rice Dishes",
  "description": "Smoky party-style jollof rice cooked with tomatoes, peppers, and spices.",
  "sizes": [
    { "label": "Small", "price_ghs": 25 },
    { "label": "Regular", "price_ghs": 35 },
    { "label": "Large", "price_ghs": 50 }
  ],
  "available": true
}
```

## Other commands

```bash
pnpm run build   # Build a production-ready server
pnpm run start   # Start the production server (after build)
```

## Learn more

- [Mastra documentation](https://mastra.ai/docs/)
- [Paystack documentation](https://paystack.com/docs/)
