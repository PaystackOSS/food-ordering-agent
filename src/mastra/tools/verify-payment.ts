import { createTool } from "@mastra/core/tools";
import { Paystack } from "@paystack/paystack-sdk";
import { z } from "zod";
import 'dotenv/config';

const secretKey = process.env.PAYSTACK_TEST_KEY
const paystack = new Paystack(secretKey!);

export const verifyPaymentTool = createTool({
  id: "verify_payment",
  description: "Verify a transaction given the transaction reference",
  inputSchema: z.object({
    reference: z.string(),
  }),
  outputSchema: z.object({
    status: z.string()
  }),
  execute: async ({reference}) => {
    return await verify(reference)
  },
});

const verify = async (reference: string) => {
  const response = await paystack.transaction.verify({reference})
  const status = (response.data as any)?.status ?? "unknown"

  return { status }
}