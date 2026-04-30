import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import menuData from '../../data/menu.json';

const menuItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	category: z.string(),
	description: z.string(),
	available: z.boolean(),
	matchScore: z.number(),
	sizes: z.array(
		z.object({
			label: z.string(),
			price_ghs: z.number(),
		}),
	),
});

type MenuData = typeof menuData;
type MenuItem = MenuData['menu'][number];

export const searchMenuAdvance = createTool({
	id: 'search_menu',
	description: 'Search the restaurant menu for matching dishes, sizes, availability, and prices in GHS.',
	inputSchema: z.object({
		query: z.string().min(1).describe('The food item, drink, or menu term the customer mentioned.'),
		limit: z.number().int().min(1).max(10).default(5).describe('Maximum number of results to return.'),
	}),
	outputSchema: z.object({
		restaurant: z.string(),
		currency: z.literal('GHS'),
		query: z.string(),
		totalMatches: z.number(),
		matches: z.array(menuItemSchema),
		suggestions: z.array(menuItemSchema),
	}),
	execute: async ({ query, limit }) => {
		return searchMenu(query, limit ?? 5);
	},
});

function searchMenu(query: string, limit: number) {
	const normalizedQuery = normalizeText(query);

	const rankedItems = menuData.menu
		.map(item => ({
			...item,
			matchScore: scoreMenuItem(item, normalizedQuery),
		}))
		.sort((left, right) => right.matchScore - left.matchScore || left.name.localeCompare(right.name));

	const matches = rankedItems.filter(item => item.matchScore > 0).slice(0, limit);
	const suggestions = (matches.length > 0 ? rankedItems : rankedItems.filter(item => item.available))
		.filter(item => !matches.some(match => match.id === item.id))
		.slice(0, limit);

	return {
		restaurant: menuData.restaurant.name,
		currency: 'GHS' as const,
		query,
		totalMatches: matches.length,
		matches: matches.map(formatMenuItem),
		suggestions: suggestions.map(formatMenuItem),
	};
}

function formatMenuItem(item: MenuItem & { matchScore: number }) {
	return {
		id: item.id,
		name: item.name,
		category: item.category,
		description: item.description,
		available: item.available,
		matchScore: Number(item.matchScore.toFixed(2)),
		sizes: item.sizes,
	};
}

function scoreMenuItem(item: MenuItem, normalizedQuery: string) {
	if (!normalizedQuery) {
		return 0;
	}

	const itemName = normalizeText(item.name);
	const category = normalizeText(item.category);
	const description = normalizeText(item.description);
	const sizeLabels = item.sizes.map(size => normalizeText(size.label));
	const queryTokens = normalizedQuery.split(' ').filter(Boolean);

	let score = 0;

	if (itemName === normalizedQuery) {
		score += 100;
	}

	if (item.id === normalizedQuery) {
		score += 100;
	}

	if (itemName.includes(normalizedQuery)) {
		score += 70;
	}

	if (category.includes(normalizedQuery)) {
		score += 30;
	}

	if (description.includes(normalizedQuery)) {
		score += 20;
	}

	for (const label of sizeLabels) {
		if (label.includes(normalizedQuery)) {
			score += 10;
		}
	}

	for (const token of queryTokens) {
		if (itemName.includes(token)) {
			score += 15;
		}
		if (category.includes(token)) {
			score += 5;
		}
		if (description.includes(token)) {
			score += 3;
		}
		if (sizeLabels.some(label => label.includes(token))) {
			score += 2;
		}
	}

	return score;
}

function normalizeText(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}
