#!/bin/bash

# Complete Database Setup Script
# This script performs a complete database setup with proper component consistency

set -e  # Exit on any error

echo "🚀 Starting complete database setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📁 Working directory: $(pwd)${NC}"

# Step 1: Check if database is running
echo -e "\n${BLUE}🔍 Checking database connection...${NC}"
if ! pg_isready -h localhost -p 5432 -U dev_user -d nextjs_template_dev &>/dev/null; then
    echo -e "${YELLOW}⚠️  Database not accessible. Starting Docker services...${NC}"
    docker-compose -f docker-compose.dev.yml up -d
    
    echo -e "${BLUE}⏳ Waiting for database to be ready...${NC}"
    for i in {1..30}; do
        if pg_isready -h localhost -p 5432 -U dev_user -d nextjs_template_dev &>/dev/null; then
            echo -e "${GREEN}✅ Database is ready!${NC}"
            break
        fi
        echo -n "."
        sleep 1
    done
fi

# Step 2: Reset and seed basic data (without components)
echo -e "\n${BLUE}🗃️  Setting up database schema and basic data...${NC}"
npm run db:push || { echo -e "${RED}❌ Database push failed${NC}"; exit 1; }

echo -e "\n${BLUE}🌱 Seeding database with basic data...${NC}"
npx tsx scripts/database/seed.ts || { echo -e "${RED}❌ Database seeding failed${NC}"; exit 1; }

# Step 3: Generate and sync components automatically
echo -e "\n${BLUE}🔧 Generating and syncing components from TypeScript interfaces...${NC}"
npm run components:configure || { echo -e "${RED}❌ Component configuration failed${NC}"; exit 1; }

# Step 4: Verify setup
echo -e "\n${BLUE}📊 Verifying database setup...${NC}"
npx tsx -e "
import { PrismaClient } from '@prisma/client';
require('dotenv').config({ path: '.env.local' });

async function verify() {
  const prisma = new PrismaClient();
  try {
    const counts = await prisma.\$transaction([
      prisma.locale.count(),
      prisma.namespace.count(),
      prisma.translation.count(),
      prisma.page.count(),
      prisma.pageContent.count(),
      prisma.component.count(),
      prisma.systemConfig.count(),
    ]);
    
    console.log('📊 Database Setup Summary:');
    console.log(\`  • Locales: \${counts[0]}\`);
    console.log(\`  • Namespaces: \${counts[1]}\`);
    console.log(\`  • Translations: \${counts[2]}\`);
    console.log(\`  • Pages: \${counts[3]}\`);
    console.log(\`  • Page Contents: \${counts[4]}\`);
    console.log(\`  • Components: \${counts[5]} (Generated from TypeScript interfaces)\`);
    console.log(\`  • System Config: \${counts[6]}\`);
    
    if (counts[5] === 0) {
      console.error('❌ No components found! Component configuration may have failed.');
      process.exit(1);
    }
    
  } finally {
    await prisma.\$disconnect();
  }
}

verify();"

echo -e "\n${GREEN}🎉 Complete database setup finished successfully!${NC}"
echo -e "\n${BLUE}📋 Next steps:${NC}"
echo -e "  1. Start development server: ${YELLOW}npm run dev${NC}"
echo -e "  2. Visit admin panel: ${YELLOW}http://localhost:3000/admin${NC}"
echo -e "  3. Components are now synchronized with TypeScript interfaces"
echo -e "  4. Any changes to component interfaces will be reflected by running: ${YELLOW}npm run components:configure${NC}"

echo -e "\n${GREEN}✨ Your development environment is ready!${NC}"