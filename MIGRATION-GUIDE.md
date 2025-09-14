# 🚀 Guía de Migración: Index-Based → PostgreSQL

## 📋 Checklist de Migración (Cuando tengas Prisma listo)

### Paso 1: Configurar Base de Datos

```bash
# 1. Configurar variable de entorno
echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/db"' >> .env.local

# 2. Verificar detección automática
curl http://localhost:3000/api/translations/metrics
# Debería mostrar: "databaseEnabled": true
```

### Paso 2: Ejecutar Migración Automática

```bash
# Vista previa (recomendado primero)
node scripts/migrate-translations.ts

# Migración real
node scripts/migrate-translations.ts --execute

# Verificar resultado
curl http://localhost:3000/api/translations/metrics | jq '.health.providers'
# Debería mostrar: {"file": "ok", "database": "ok"}
```

### Paso 3: Verificar Funcionamiento Híbrido

```bash
# Testear en navegador
open http://localhost:3000/en
open http://localhost:3000/es

# Verificar console logs
# Debería mostrar: "✅ Loaded from database: Admin, Home"
# Debería mostrar: "✅ Loaded from files: common"
```

## 🎯 Estrategias Automáticas Post-Migración

| Namespace | Estrategia | Origen | Cache | Fallback |
|-----------|------------|---------|-------|----------|
| common (null) | static | 📁 Archivos JSON | 1h | N/A |
| Home | hybrid | 🗄️ PostgreSQL | 5min | 📁 Archivos |
| Admin | dynamic | 🗄️ PostgreSQL | 1min | 📁 Archivos |

## ✅ Verificaciones de Seguridad

### Antes de Migrar
- [ ] Backup de archivos JSON existentes
- [ ] PostgreSQL conectando correctamente
- [ ] Tests Playwright pasando
- [ ] `npm run build` sin errores

### Después de Migrar
- [ ] Todas las traducciones visibles en navegador
- [ ] API métricas showing "healthy"
- [ ] Console sin errores de carga
- [ ] Fallback funcionando (desconectar DB temporalmente)

## 🔧 Troubleshooting

### Problema: "Database not detected"
**Solución**:
```bash
# Verificar variable
echo $DATABASE_URL

# Reiniciar servidor
npm run dev
```

### Problema: "Some translations missing"
**Solución**:
```bash
# Ejecutar migración incremental
node scripts/migrate-translations.ts --locales en,es --verbose
```

### Problema: "Performance degradation"
**Solución**:
```bash
# Verificar métricas
curl http://localhost:3000/api/translations/metrics

# Limpiar cache si necesario
curl -X POST http://localhost:3000/api/translations/metrics -d '{"action":"reset"}'
```

## 🎉 Post-Migración: Nuevas Capacidades

### Traducciones Dinámicas
```bash
# Ahora puedes actualizar traducciones via API (futuro)
POST /api/translations
{
  "namespace": "Admin",
  "key": "dashboard.title",
  "locale": "es",
  "value": "Panel de Control Actualizado"
}
```

### A/B Testing
```bash
# Overrides temporales (futuro)
POST /api/translations/override
{
  "namespace": "Home",
  "key": "hero.title",
  "locale": "en",
  "value": "A/B Test Version",
  "expires": "2025-12-31"
}
```

---

**💡 Recuerda**: La migración es opcional y gradual. Tu sistema funciona perfecto con archivos JSON indefinidamente.
EOF'