# MAINTENANCE - Tareas de Mantenimiento Periódico

> Recordatorios de revisiones que deben hacerse regularmente.

---

## Revisiones Semanales

### 1. Revisar Carpeta de Referencias
```
Comando: "revisar referencias"
```

**Qué buscar:**
- [ ] ¿Hay nuevos PDFs de exámenes en `references/examenes/`?
- [ ] ¿Hay nuevas leyes o actualizaciones en `references/leyes/`?
- [ ] ¿Hay nuevo material de temario?

**Acciones si hay novedades:**
- Exámenes → Extraer preguntas para reformular
- Leyes → Verificar si afectan preguntas existentes
- Temarios → Identificar gaps de contenido

---

## Revisiones Mensuales

### 2. Auditoría de Preguntas en Supabase
```
Comando: "auditar preguntas"
```

**Qué revisar:**
- [ ] Preguntas con muchos reportes de usuarios
- [ ] Preguntas con bajo rendimiento (times_correct/times_shown < 20%)
- [ ] Preguntas sin explicación o con explicación pobre
- [ ] Distribución de preguntas por tema (gaps)

**Query de auditoría:**
```sql
-- Preguntas problemáticas
SELECT id, question_text,
       times_shown, times_correct,
       ROUND(times_correct::numeric / NULLIF(times_shown, 0) * 100, 1) as success_rate
FROM questions
WHERE times_shown > 10
  AND (times_correct::numeric / NULLIF(times_shown, 0)) < 0.2
ORDER BY times_shown DESC;

-- Distribución por tema
SELECT tema, materia, COUNT(*) as total,
       COUNT(*) FILTER (WHERE is_active) as activas
FROM questions
GROUP BY tema, materia
ORDER BY tema;
```

### 3. Verificación de Actualización Legal
```
Comando: "verificar leyes"
```

**Leyes que cambian frecuentemente:**
- EBEP (modificaciones laborales)
- Ley de Presupuestos (anual)
- Normativa de protección de datos
- Estructura ministerial (cada cambio de gobierno)

**Qué hacer:**
1. Buscar BOE de últimos 30 días
2. Filtrar por leyes relevantes al temario
3. Si hay cambios → Marcar preguntas afectadas para revisión

---

## Revisiones Trimestrales

### 4. Revisión de Arquitectura
```
Comando: "revisar arquitectura"
```

**Checklist:**
- [ ] ¿Hay archivos > 500 líneas nuevos?
- [ ] ¿Se ha añadido deuda técnica?
- [ ] ¿Los patrones siguen siendo consistentes?

### 5. Análisis de Métricas de Usuarios
```
Comando: "analizar métricas"
```

**Qué revisar:**
- Temas más estudiados vs menos estudiados
- Preguntas más falladas (¿son difíciles o confusas?)
- Patrones de abandono

---

## Calendario de Mantenimiento

| Frecuencia | Tarea | Última Revisión | Próxima |
|------------|-------|-----------------|---------|
| Semanal | Revisar referencias | - | 2025-01-21 |
| Mensual | Auditar preguntas | - | 2025-02-14 |
| Mensual | Verificar leyes | - | 2025-02-14 |
| Trimestral | Revisar arquitectura | - | 2025-04-14 |
| Trimestral | Analizar métricas | - | 2025-04-14 |

---

## Recursos Necesarios para Mantenimiento

### Lo que Claude ya tiene:
- ✅ Acceso a Supabase (queries, inserts, updates)
- ✅ Acceso al código fuente
- ✅ Capacidad de leer PDFs

### Lo que podría necesitar:
- ⚠️ **Acceso a BOE** (para verificar cambios legales)
  - Solución: Usuario puede copiar texto relevante o usar WebFetch
- ⚠️ **Notificaciones de cambios legales**
  - Solución: Revisión manual mensual o suscripción a alertas BOE

---

## Comandos Rápidos de Mantenimiento

| Comando | Descripción |
|---------|-------------|
| `"revisar referencias"` | Escanea carpeta de referencias |
| `"auditar preguntas"` | Revisa calidad de preguntas en Supabase |
| `"verificar leyes"` | Busca actualizaciones legales recientes |
| `"revisar arquitectura"` | Analiza estado del código |
| `"analizar métricas"` | Revisa estadísticas de uso |
| `"status mantenimiento"` | Muestra calendario de próximas revisiones |
