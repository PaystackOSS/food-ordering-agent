import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import menuData from '../../data/menu.json';

export const viewMenu = createTool({
  id: 'view_menu',
  description: 'View the complete restaurant menu organized by category.',
  inputSchema: z.object({}),
  outputSchema: z.object({
    restaurant: z.string(),
    categories: z.array(
      z.object({
        category: z.string(),
        items: z.array(
          z.object({
            name: z.string(),
            description: z.string(),
            priceRange: z.string(),
          }),
        ),
      }),
    ),
  }),
  execute: async () => {
    return parseMenu()
  },
});

const parseMenu = () => {
  const categories = new Map<string, typeof menuData.menu>();

  for (const item of menuData.menu) {
    if (!categories.has(item.category)) {
      categories.set(item.category, []);
    }
    categories.get(item.category)!.push(item);
  }

  return {
    restaurant: menuData.restaurant.name,
    categories: Array.from(categories.entries()).map(([category, items]) => ({
      category,
      items: items.map(item => ({
        name: item.name,
        description: item.description,
        priceRange: `GHS ${Math.min(...item.sizes.map(s => s.price_ghs))} - GHS ${Math.max(...item.sizes.map(s => s.price_ghs))}`,
      })),
    })),
  };
}
