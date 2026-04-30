import { createTool } from "@mastra/core/tools";
import { Paystack } from "@paystack/paystack-sdk";
import { z } from "zod";
import 'dotenv/config';

const secretKey = process.env.PAYSTACK_TEST_KEY
const paystack = new Paystack(secretKey!);

export const initiatePayment = createTool({
  id: "initiate_payment",
  description: "Initiate a Paystack transaction with the customer email and amount",
  inputSchema: z.object({
    email: z.string(),
    amount: z.number()
  }),
  outputSchema: z.object({
    status: z.boolean(),
    message: z.string(),
    data: z.object({
      authorization_url: z.string(),
      access_code: z.string(),
      reference: z.string()
    })
  }),
  // @ts-ignore
  execute: async ({email, amount}) => {
    return await initialize(email, amount)
  },
});

const initialize = async (email: string, amount: number) => {
  const amountLowerDenomination = amount * 100;
  const response = await paystack.transaction.initialize({
    email,
    amount: amountLowerDenomination
  });

  return response
}