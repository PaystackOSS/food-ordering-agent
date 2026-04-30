import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { initiatePayment } from '../tools/initiate-payment';
import { verifyPaymentTool } from '../tools/verify-payment';
import { foodOrderingInstruction } from '../prompts/ordering-instructions';
import { searchMenu } from '../tools/search-menu';
import { viewMenu } from '../tools/view-menu';

export const orderAgent = new Agent({
  id: 'order-agent',
  name: 'Food Ordering Agent',
  instructions: foodOrderingInstruction,
  model: 'google/gemma-4-31b-it',
  tools: {
    search_menu: searchMenu,
    view_menu: viewMenu,
    initiate_payment: initiatePayment,
    verify_payment: verifyPaymentTool,
  },
  scorers: {},
  memory: new Memory(),
});
