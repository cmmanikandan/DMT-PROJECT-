export const CATEGORY_PALETTE: Record<string, string> = {
  'Electronics': '#1769E0', // Professional Blue
  'Footwear': '#10B981',    // Emerald Green
  'Apparel': '#F59E0B',     // Warm Amber
  'Accessories': '#8B5CF6', // Royal Purple
};

export const FALLBACK_PALETTE = [
  '#1769E0', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6'  // Teal
];

export function getCategoryColor(name?: string, index: number = 0, existingColor?: string): string {
  if (name && CATEGORY_PALETTE[name]) {
    return CATEGORY_PALETTE[name];
  }
  if (existingColor && existingColor.startsWith('#') && existingColor !== '#1769E0') {
    return existingColor;
  }
  return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
}
