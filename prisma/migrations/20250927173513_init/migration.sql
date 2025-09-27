-- CreateTable
CREATE TABLE "public"."locales" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."namespaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "namespaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."translations" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "localeId" TEXT NOT NULL,
    "namespaceId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT,
    "fullPath" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "routeType" TEXT NOT NULL DEFAULT 'dynamic',
    "staticRoute" TEXT,
    "isStaticPrefix" BOOLEAN NOT NULL DEFAULT false,
    "template" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."page_contents" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "localeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" TEXT[],
    "content" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."components" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "configSchema" JSONB,
    "defaultConfig" JSONB,
    "propsSchema" JSONB,
    "defaultProps" JSONB,
    "customProps" JSONB,
    "editorConfig" JSONB,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "displayName" TEXT,
    "icon" TEXT,
    "tags" TEXT[],
    "deprecated" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."component_defaults" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "originalProps" JSONB NOT NULL,
    "currentProps" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "createdBy" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "component_defaults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."page_components" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locales_code_key" ON "public"."locales"("code");

-- CreateIndex
CREATE UNIQUE INDEX "namespaces_name_key" ON "public"."namespaces"("name");

-- CreateIndex
CREATE INDEX "translations_localeId_namespaceId_idx" ON "public"."translations"("localeId", "namespaceId");

-- CreateIndex
CREATE INDEX "translations_key_idx" ON "public"."translations"("key");

-- CreateIndex
CREATE UNIQUE INDEX "translations_key_localeId_namespaceId_key" ON "public"."translations"("key", "localeId", "namespaceId");

-- CreateIndex
CREATE UNIQUE INDEX "pages_fullPath_key" ON "public"."pages"("fullPath");

-- CreateIndex
CREATE INDEX "pages_parentId_order_idx" ON "public"."pages"("parentId", "order");

-- CreateIndex
CREATE INDEX "pages_routeType_idx" ON "public"."pages"("routeType");

-- CreateIndex
CREATE INDEX "pages_fullPath_idx" ON "public"."pages"("fullPath");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_parentId_key" ON "public"."pages"("slug", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "page_contents_pageId_localeId_key" ON "public"."page_contents"("pageId", "localeId");

-- CreateIndex
CREATE UNIQUE INDEX "components_name_key" ON "public"."components"("name");

-- CreateIndex
CREATE INDEX "component_defaults_componentId_version_idx" ON "public"."component_defaults"("componentId", "version");

-- CreateIndex
CREATE INDEX "page_components_pageId_order_idx" ON "public"."page_components"("pageId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "public"."system_config"("key");

-- AddForeignKey
ALTER TABLE "public"."translations" ADD CONSTRAINT "translations_localeId_fkey" FOREIGN KEY ("localeId") REFERENCES "public"."locales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."translations" ADD CONSTRAINT "translations_namespaceId_fkey" FOREIGN KEY ("namespaceId") REFERENCES "public"."namespaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pages" ADD CONSTRAINT "pages_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."page_contents" ADD CONSTRAINT "page_contents_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "public"."pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."page_contents" ADD CONSTRAINT "page_contents_localeId_fkey" FOREIGN KEY ("localeId") REFERENCES "public"."locales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."component_defaults" ADD CONSTRAINT "component_defaults_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "public"."components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."page_components" ADD CONSTRAINT "page_components_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "public"."pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."page_components" ADD CONSTRAINT "page_components_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "public"."components"("id") ON DELETE CASCADE ON UPDATE CASCADE;
