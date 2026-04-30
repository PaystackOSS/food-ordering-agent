import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import menuData from '../../data/menu.json';

export const searchMenu = createTool({
  id: 'search_menu',
  description: 'Search the restaurant menu for dishes, sizes, and prices in GHS.',
  inputSchema: z.object({
    query: z.string().describe('The food item or menu term the customer is looking for.'),
  }),
  outputSchema: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      description: z.string(),
      sizes: z.array(
        z.object({
          label: z.string(),
          price_ghs: z.number(),
        }),
      ),
    }),
  ),
  execute: async ({ query }) => {
    return filterMenu(query)
  },
});

const filterMenu = (query: string) => {
  const normalizedQuery = query.toLowerCase();

  return menuData.menu
    .filter(item => 
      item.name.toLowerCase().includes(normalizedQuery) || 
      item.category.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery)
    )
    .map(item => ({
      name: item.name,
      category: item.category,
      description: item.description,
      sizes: item.sizes
    }))
}