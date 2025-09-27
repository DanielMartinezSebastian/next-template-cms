/**
 * Editable Components Registry
 * 
 * This index exports all components that use the withEditable HOC
 * and are available for content creators in the visual editor.
 */

// Export all editable components
export { default as ButtonMigrated } from './ButtonMigrated';
export { default as EditableButton } from './EditableButton';
export { default as CardMigrated } from './CardMigrated';
export { default as CallToActionMigrated } from './CallToActionMigrated';
export { default as HeroSectionMigrated } from './HeroSectionMigrated';
export { default as TextBlockMigrated } from './TextBlockMigrated';

// Note: All components exported from this index should:
// 1. Use the withEditable HOC
// 2. Have Zod schema validation
// 3. Include proper metadata (category, icon, description)
// 4. Define defaultProps
// 5. Be ready for content creator usage
