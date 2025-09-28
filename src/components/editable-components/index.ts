/**
 * Editable Components Registry
 *
 * This index exports all components that use the withEditableSSR HOC
 * and are available for content creators in the visual editor.
 */

// Export all editable components
export { default as Button } from './Button';
export { default as CallToAction } from './CallToAction';
export { default as Card } from './Card';
export { default as HeroSection } from './HeroSection';
export { default as ImageBlock } from './ImageBlock';
export { default as TextBlock } from './TextBlock';

// Export types for TypeScript support
export type { ButtonProps } from './Button';
export type { CallToActionProps } from './CallToAction';
export type { CardProps } from './Card';
export type { HeroSectionProps } from './HeroSection';
export type { ImageBlockProps } from './ImageBlock';
export type { TextBlockProps } from './TextBlock';

// Export schemas for validation
export { ButtonSchema } from './Button';
export { CallToActionSchema } from './CallToAction';
export { CardSchema } from './Card';
export { HeroSectionSchema } from './HeroSection';
export { ImageBlockSchema } from './ImageBlock';
export { TextBlockSchema } from './TextBlock';

// Note: All components exported from this index should:
// 1. Use the withEditableSSR HOC
// 2. Have Zod schema validation with proper TypeScript interfaces
// 3. Include proper metadata (category, icon, description)
// 4. Define complete defaultProps
// 5. Be ready for content creator usage
// 6. Handle editMode prop for visual feedback
