<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Next.js Edit Mode Template - Copilot Instructions

This project is a comprehensive Next.js 15 template with visual editing capabilities, internationalization, and a content management system designed to be a production-ready foundation for modern web applications.

## Project Architecture

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 with PostCSS
- **Database**: PostgreSQL with Prisma ORM
- **Internationalization**: next-intl with middleware
- **State Management**: Zustand with TypeScript
- **UI Components**: Radix UI with CVA variants system
- **Editor**: Lexical for visual content editing
- **Forms**: React Hook Form with Zod validation
- **Testing**: Playwright for E2E testing and visual verification

## Key Features

- **Server-side rendering (SSR)** by default with selective client components
- **Dynamic page configuration** via JSON with TypeScript schemas
- **Visual page editor** with drag & drop capabilities using Lexical
- **Multi-language support** with next-intl and route-based localization
- **Content management** via protected admin panel
- **SEO optimization** with dynamic metadata generation
- **Component-based architecture** following atomic design principles
- **Real-time preview** with edit mode toggle functionality

## Development Guidelines

### Core Principles
- **Server Components First**: Prioritize server components, use client components only when necessary (interactivity, hooks, browser APIs)
- **TypeScript Strict**: Use strict mode with comprehensive type definitions
- **Atomic Design**: Organize components as Atoms → Molecules → Organisms → Templates → Pages
- **Progressive Enhancement**: Ensure functionality works without JavaScript, enhance with interactivity
- **Performance First**: Optimize for Core Web Vitals and SSR performance

### Code Quality Standards
- **Error Boundaries**: Implement at page and component levels
- **Validation**: Use Zod schemas for runtime validation
- **Accessibility**: Follow WCAG 2.1 AA standards
- **SEO**: Generate semantic HTML with proper metadata
- **Security**: Validate all inputs, sanitize outputs, protect API routes

### Testing and Verification Strategy
- **MCP Playwright Integration**: Use browser automation for visual and functional verification
- **Component Testing**: Test UI components in isolation
- **E2E Testing**: Test complete user workflows
- **Visual Regression**: Compare screenshots across changes
- **Performance Testing**: Validate Core Web Vitals thresholds

## MCP Playwright Integration

### When to Use Playwright
- **After each significant feature implementation**
- **Before committing major changes**
- **When testing responsive design**
- **Validating form submissions and interactions**
- **Checking internationalization display**
- **Verifying admin panel functionality**

### Playwright Testing Workflow
1. **Start development server** (`npm run dev`)
2. **Navigate to pages** using `mcp_playwright_browser_navigate`
3. **Take screenshots** for visual verification with `mcp_playwright_browser_take_screenshot`
4. **Test interactions** (clicks, form fills, navigation)
5. **Verify responsive behavior** at different viewport sizes
6. **Check accessibility** with snapshots and screen readers
7. **Document issues** and iterate on fixes

### Standard Playwright Checks
```typescript
// Navigation and basic rendering
- Navigate to http://localhost:3000
- Take screenshot of homepage
- Check for console errors
- Verify responsive design (mobile, tablet, desktop)

// Internationalization
- Test /es and /en routes
- Verify language switching
- Check translated content display

// Admin panel (when implemented)
- Navigate to /admin
- Test authentication flow
- Verify CRUD operations
- Test visual editor functionality

// Performance
- Check page load times
- Verify image optimization
- Test Core Web Vitals
```

## Project Status: DEVELOPMENT PHASE
Setting up the foundational architecture with iterative development and testing.

### Completed ✅
- [x] Verify that the copilot-instructions.md file in the .github directory is created
- [x] Clarify Project Requirements - Next.js 15 template with TypeScript, Tailwind 4, next-intl, Prisma, visual editor
- [x] Scaffold the Project - Next.js project created with TypeScript, Tailwind CSS, ESLint, App Router
- [x] Customize the Project - Updated package.json with all dependencies and created detailed development plan
- [x] Compile the Project - All dependencies installed successfully (471 packages, 0 vulnerabilities)
- [x] Launch Project and Verify with Playwright - Initial setup tested and verified
- [x] Configure Internationalization - next-intl middleware, [locale] routing, translations (es/en) working

### Current Phase: Foundation Enhancement 🔄
- [ ] Install Required Extensions
- [ ] Configure Prettier and ESLint rules
- [ ] Setup Git with Husky hooks
- [ ] Configure environment variables (.env.local)
- [ ] Create development task automation

### Next Phase: Database and Components 📝
- [ ] Configure Prisma schema for pages, components, translations
- [ ] Setup PostgreSQL connection and migrations
- [ ] Create base UI components with Radix UI and CVA
- [ ] Implement Zustand stores for state management
- [ ] Develop component library foundations

## File Structure Standards

### Components Organization
```
src/components/
├── ui/                    # Atomic UI components (Button, Input, etc.)
│   ├── button.tsx        # Individual component files
│   ├── input.tsx
│   └── index.ts          # Barrel exports
├── layout/               # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
├── features/             # Feature-specific components
│   ├── auth/
│   ├── pages/
│   └── editor/
└── providers/            # Context providers
    ├── theme-provider.tsx
    └── i18n-provider.tsx
```

### API Routes Structure
```
src/app/api/
├── pages/                # Page CRUD operations
│   ├── route.ts         # GET, POST
│   └── [id]/
│       └── route.ts     # GET, PUT, DELETE
├── translations/         # Translation management
├── components/          # Component configurations
└── auth/               # Authentication routes
```

## Development Workflow

### Feature Development Process
1. **Plan**: Define feature requirements and acceptance criteria
2. **Design**: Create component interfaces and API contracts
3. **Implement**: Write code following project standards
4. **Test**: Use Playwright for functional and visual testing
5. **Review**: Check code quality and performance
6. **Document**: Update README and component documentation

### Quality Gates
- **TypeScript**: No compilation errors
- **ESLint**: No linting errors or warnings
- **Prettier**: Consistent code formatting
- **Playwright**: All E2E tests passing
- **Performance**: Core Web Vitals within thresholds
- **Accessibility**: WCAG 2.1 AA compliance

## Integration Guidelines

### Database Integration (Prisma)
- Use server actions for database operations
- Implement proper error handling and validation
- Use transactions for complex operations
- Cache frequently accessed data
- Follow Prisma best practices for performance

### State Management (Zustand)
- Keep stores minimal and focused
- Use TypeScript interfaces for store types
- Implement persistence only when necessary
- Separate client and server state clearly
- Use React Server Components for server state

### Styling Guidelines (Tailwind CSS 4)
- Use design tokens for consistency
- Implement responsive design mobile-first
- Create reusable component variants with CVA
- Optimize for dark/light theme support
- Follow semantic class naming conventions

### Internationalization (next-intl)
- Use translation keys that describe content purpose
- Implement ICU message format for complex translations
- Handle pluralization and date/time formatting
- Test all locales with Playwright
- Provide fallbacks for missing translations