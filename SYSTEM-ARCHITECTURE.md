# System Architecture Documentation

## Overview

The Next.js Template CMS is built with a modern, scalable architecture that emphasizes type safety, performance, and developer experience. This document outlines the system's architecture, design patterns, and implementation details.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 15 App Router                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Client Side   │  │   Server Side   │  │   Build Time    │ │
│  │                 │  │                 │  │                 │ │
│  │ • React 18      │  │ • SSR/SSG       │  │ • TypeScript    │ │
│  │ • Zustand       │  │ • API Routes    │  │ • Schema Gen    │ │
│  │ • Playwright    │  │ • Prisma ORM    │  │ • Auto-config   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data & Services Layer                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   PostgreSQL    │  │     Redis       │  │   File System   │ │
│  │                 │  │                 │  │                 │ │
│  │ • Pages         │  │ • Translations  │  │ • Components    │ │
│  │ • Components    │  │ • Cache         │  │ • Assets        │ │
│  │ • Translations  │  │ • Sessions      │  │ • Configs       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Core Systems

### 1. Component System Architecture

#### Dynamic Component Factory
```typescript
// Component resolution and rendering pipeline
interface ComponentPipeline {
  detection: ComponentDetection;     // Auto-detect from TypeScript
  generation: SchemaGeneration;      // Generate Zod schemas
  mapping: ComponentMapping;         // Map types to React components
  rendering: DynamicRendering;       // SSR/CSR rendering
  persistence: DatabasePersistence;  // PostgreSQL storage
}
```

#### Component Flow
```
TypeScript Interface → Schema Generation → Database Storage → UI Forms → Preview Rendering
        ↓                      ↓                ↓              ↓            ↓
   Auto-detected        Zod validation    PostgreSQL      Form fields   Real-time
   properties           & type safety      storage         generated     preview
```

### 2. State Management Architecture

#### Zustand Store Structure
```typescript
// Store separation by domain
interface StoreArchitecture {
  pageStore: PageManagement;           // Page CRUD operations
  editModeStore: VisualEditor;         // Editor state & history  
  userPreferencesStore: UserSettings;  // Theme, language, etc.
  translationCacheStore: I18nCache;   // Translation performance
}
```

#### State Flow Pattern
```
User Action → Store Action → Database Update → State Update → UI Re-render
     ↓              ↓             ↓              ↓              ↓
  Click move    moveComponent   API call    Update state   Re-render
   button        function       to /api      with new       components
                                           order values      list
```

### 3. Database Architecture

#### Entity Relationship Diagram
```sql
-- Core entities and relationships
Pages (1) ──── (N) PageComponents
  │                    │
  │                    │ 
  │              (N) Components (1)
  │                    │
  │              (N) ComponentConfigs
  │
(N) Translations
  │
(N) Locales
```

#### Schema Design
```typescript
// Database schema with TypeScript types
interface DatabaseSchema {
  pages: {
    id: string;
    title: string;
    slug: string;
    locale: string;
    isPublished: boolean;
    metadata: PageMetadata;
    components: PageComponent[];
  };
  
  components: {
    id: string;
    pageId: string;
    type: string;
    props: Record<string, unknown>;
    order: number;
    isVisible: boolean;
  };
  
  translations: {
    id: string;
    key: string;
    value: string;
    locale: string;
    namespace: string;
  };
}
```

## Design Patterns

### 1. Component Factory Pattern

#### Implementation
```typescript
// Centralized component resolution
class ComponentFactory {
  private static components = new Map<string, ComponentType>();
  
  static register(name: string, component: ComponentType) {
    this.components.set(name.toLowerCase(), component);
    // Support both formats: "hero-section" and "herosection"
    this.components.set(name.replace(/-/g, ''), component);
  }
  
  static getComponent(type: string): ComponentType | null {
    return this.components.get(type.toLowerCase()) || null;
  }
}
```

#### Benefits
- ✅ Type-safe component resolution
- ✅ Flexible naming conventions
- ✅ Easy component registration
- ✅ Centralized component management

### 2. Auto-Configuration Pattern

#### Schema Generation Pipeline
```typescript
// Automatic configuration from TypeScript interfaces
interface AutoConfigPipeline {
  scan: () => ComponentInterface[];          // Scan for TS interfaces
  analyze: (interfaces) => PropertySchema[]; // Analyze property types
  generate: (schemas) => ZodSchema[];        // Generate Zod validation
  persist: (schemas) => DatabaseEntry[];    // Store in database
}
```

#### Example Transformation
```typescript
// TypeScript interface → Generated schema
interface ComponentProps {
  title: string;
  isVisible?: boolean;
  backgroundColor?: string;
}

// Becomes:
const generatedSchema = {
  title: {
    type: 'string',
    required: true,
    label: 'Title',
    placeholder: 'Enter title...'
  },
  isVisible: {
    type: 'boolean', 
    required: false,
    default: true,
    label: 'Is Visible'
  },
  backgroundColor: {
    type: 'color',
    required: false,
    default: '#ffffff',
    label: 'Background Color'
  }
};
```

### 3. Hybrid Database Pattern

#### Database Strategy
```typescript
// Flexible database detection
interface DatabaseStrategy {
  detect: () => 'postgresql' | 'mock';
  getClient: () => DatabaseClient;
  fallback: () => MockDatabase;
}

// Usage
const db = getDbClient(); // Auto-detects available database
```

#### Benefits
- ✅ Development without external dependencies
- ✅ Production-ready PostgreSQL integration
- ✅ Seamless switching between modes
- ✅ Consistent API across environments

### 4. Real-time Preview Pattern

#### Implementation
```typescript
// Immediate UI updates with debounced persistence
interface PreviewSystem {
  onChange: (props: ComponentProps) => void;
  updatePreview: () => void;              // Immediate
  saveToDatabase: debounce(() => void);   // Debounced
}
```

#### Flow
```
Property Change → Immediate Preview Update → Debounced Database Save
      ↓                      ↓                        ↓
   User types          Preview shows           Database stores
   in form field       change instantly        after 500ms delay
```

## Performance Optimizations

### 1. Component Loading Strategy

```typescript
// Lazy loading for large components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Component splitting by category
const componentImports = {
  marketing: () => import('./marketing'),
  forms: () => import('./forms'),
  media: () => import('./media')
};
```

### 2. State Management Optimization

```typescript
// Selective subscriptions to prevent unnecessary re-renders
const usePageStore = () => {
  const pages = useStore(state => state.pages);           // Only pages
  const currentPage = useStore(state => state.currentPage); // Only current
  // Avoid: const store = useStore(); // Would cause unnecessary renders
};
```

### 3. Database Query Optimization

```sql
-- Optimized queries with proper indexing
CREATE INDEX idx_pages_locale_published ON pages(locale, is_published);
CREATE INDEX idx_components_page_order ON components(page_id, order_position);
CREATE INDEX idx_translations_key_locale ON translations(key, locale);
```

### 4. Caching Strategy

```typescript
// Multi-level caching
interface CacheStrategy {
  browser: BrowserCache;      // Component schemas, user preferences
  server: ServerCache;        // Rendered pages, translations
  database: DatabaseCache;    // Query result caching
  cdn: CDNCache;             // Static assets, images
}
```

## Security Architecture

### 1. Input Validation

```typescript
// Multi-layer validation
interface ValidationLayers {
  client: ZodValidation;      // Form validation
  api: SchemaValidation;      // API endpoint validation  
  database: ConstraintCheck;  // Database constraints
  runtime: TypeGuards;        // Runtime type checking
}
```

### 2. Data Sanitization

```typescript
// Automatic XSS prevention
interface SecurityMeasures {
  htmlSanitization: DOMPurify;     // Clean HTML content
  sqlInjectionPrevention: Prisma;  // Parameterized queries
  csrfProtection: NextAuth;        // CSRF tokens
  inputValidation: Zod;            // Schema validation
}
```

## Scalability Considerations

### 1. Horizontal Scaling

```typescript
// Stateless architecture for easy scaling
interface ScalabilityFeatures {
  statelessComponents: true;      // No server-side state
  databasePooling: ConnectionPool; // Handle multiple instances
  cacheDistribution: Redis;        // Shared cache across instances
  assetCDN: CloudflareR2;         // Distributed asset delivery
}
```

### 2. Performance Monitoring

```typescript
// Built-in performance tracking
interface PerformanceMetrics {
  componentRenderTime: number;
  databaseQueryTime: number;
  cacheHitRate: number;
  pageLoadSpeed: number;
}
```

## Development Workflow

### 1. Component Development Cycle

```
1. Create TypeScript Interface
   ↓
2. Implement React Component  
   ↓
3. Add to Component Index
   ↓
4. Configure Defaults/Icons
   ↓
5. Run npm run components:configure
   ↓
6. Test in Visual Editor
   ↓
7. Deploy to Production
```

### 2. Testing Strategy

```typescript
// Comprehensive testing approach
interface TestingStrategy {
  unit: ComponentTesting;        // Jest + React Testing Library
  integration: APITesting;       // Supertest for API routes
  e2e: PlaywrightTesting;       // Full user workflows
  visual: ScreenshotTesting;    // UI regression testing
  performance: LighthouseTesting; // Core Web Vitals
}
```

### 3. Deployment Pipeline

```typescript
// Automated deployment with validation
interface DeploymentPipeline {
  validation: TypeScriptCheck;   // Type checking
  testing: TestSuite;           // Full test suite
  building: NextJSBuild;        // Production build
  migration: DatabaseMigration; // Schema updates
  deployment: VercelDeploy;     // Platform deployment
}
```

## API Architecture

### 1. RESTful API Design

```typescript
// Consistent API patterns
interface APIEndpoints {
  'GET /api/pages': ListPages;
  'POST /api/pages': CreatePage;
  'GET /api/pages/[id]': GetPage;
  'PUT /api/pages/[id]': UpdatePage;
  'DELETE /api/pages/[id]': DeletePage;
  'PUT /api/pages/[id]/components': UpdateComponents;
}
```

### 2. Error Handling

```typescript
// Standardized error responses
interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
  path: string;
}
```

## Monitoring & Observability

### 1. Logging Strategy

```typescript
// Structured logging for debugging
interface LoggingLevels {
  debug: ComponentOperations;    // Component creation, updates
  info: UserActions;            // Page saves, component moves
  warn: PerformanceIssues;      // Slow queries, large payloads
  error: SystemFailures;        // Database errors, API failures
}
```

### 2. Analytics Integration

```typescript
// User behavior tracking
interface AnalyticsEvents {
  componentAdded: ComponentType;
  componentMoved: OrderChange;
  pagePublished: PageInfo;
  errorOccurred: ErrorDetails;
}
```

## Future Architecture Considerations

### 1. Microservices Migration

```typescript
// Potential service separation
interface FutureServices {
  componentService: ComponentManagement;
  pageService: PageManagement;
  translationService: I18nManagement;
  assetService: MediaManagement;
}
```

### 2. Real-time Collaboration

```typescript
// Multi-user editing capabilities
interface CollaborationFeatures {
  websockets: RealTimeUpdates;
  conflictResolution: MergeStrategies;
  userPresence: ActiveUsers;
  versionControl: ChangeHistory;
}
```

### 3. Advanced Caching

```typescript
// Intelligent cache invalidation
interface SmartCaching {
  dependencyTracking: ComponentDependencies;
  granularInvalidation: SelectiveRefresh;
  predictivePrefetch: UserBehaviorPrediction;
}
```

## Related Documentation

- [Component Creation Guide](./COMPONENT-CREATION-GUIDE.md)
- [Component Ordering Guide](./COMPONENT-ORDERING-GUIDE.md)
- [Development Setup](./README.md)
- [API Reference](./API-REFERENCE.md)