# Oportunidades de Mejora Consolidadas
## OpositaSmart - Síntesis de Assessments UX/UI y Marketing

**Fecha:** 2026-01-18
**Fuentes:** UX_UI_ASSESSMENT.md, MARKETING_CONSUMER_ASSESSMENT.md

---

## Resumen Ejecutivo

Ambos assessments coinciden en que OpositaSmart tiene una **base sólida** con un posicionamiento diferenciador ("bienestar primero") pero necesita:
1. **Más contenido** (solo ~34% del temario)
2. **Mejor comunicación** de la propuesta de valor
3. **Unificación visual** entre código legacy y nuevo
4. **Funcionalidades críticas** ausentes (simulacros, notificaciones)

---

## 🔴 Prioridad ALTA (Bloqueadores)

### 1. Contenido Insuficiente
| Aspecto | Estado Actual | Necesario |
|---------|---------------|-----------|
| Cobertura temario | ~34% | 80%+ |
| Preguntas estimadas | ~500-1000 | 15,000+ |
| Simulacros | Ausente | Crítico |

**Acción:** Crear pipeline de generación de preguntas masiva

### 2. Onboarding No Comunica Valor
- WelcomeScreen solo tiene logo + botón
- No hay propuesta de valor clara
- No hay social proof (testimonios, # usuarios)
- Upsell Premium aparece muy pronto (genera fricción)

**Acción:** Rediseñar onboarding con storytelling

### 3. Inconsistencia Visual
- Dos versiones de Fortaleza (dots vs progress bars)
- Paletas múltiples coexistiendo
- OpositaApp.jsx monolítico (~2000+ líneas)

**Acción:** Unificar design system, elegir una versión de Fortaleza

### 4. Accesibilidad Básica
- Focus states ausentes
- Textos grises con bajo contraste
- Iconos sin aria-labels

**Acción:** Implementar quick wins de accesibilidad

---

## 🟡 Prioridad MEDIA (Mejoras Importantes)

### 5. Sin Simulacros Cronometrados
- Expectativa básica de cualquier opositor
- Solo hay tests cortos de 5-10 preguntas
- Competidores lo tienen

**Acción:** Implementar simulacros de 100 preguntas en 60 min

### 6. Sin Notificaciones Push
- Marcado como "Próximamente"
- Crítico para retención diaria
- Sin recordatorios personalizados

**Acción:** Implementar sistema de notificaciones

### 7. Sin Modo "Solo Errores"
- Alto valor percibido por usuarios
- Fácil de implementar con datos existentes

**Acción:** Añadir filtro de preguntas falladas

### 8. Sin Mecanismos de Viralidad
- No hay compartir logros
- No hay sistema de referidos
- No hay historias de éxito visibles

**Acción:** Implementar "Comparte tu progreso" + referidos

### 9. Elementos DEV en Producción
- WelcomeScreen muestra [DEV] Saltar y Reset
- Debe ocultarse con `import.meta.env.DEV`

**Acción:** Limpiar código de desarrollo

---

## 🟢 Prioridad BAJA (Nice to Have)

### 10. Flashcards Inteligentes
- Complemento natural al sistema FSRS
- Propuesta ya creada en DraftFeatures

### 11. Audio Resúmenes
- Innovador, diferenciador
- Permite estudiar mientras caminas/conduces

### 12. Calendario Adaptativo
- Genera plan según fecha examen
- Integración con Google Calendar

### 13. Compañero IA
- Chat para dudas sobre temario
- Explica respuestas incorrectas

### 14. Modo Oscuro
- Solicitado por usuarios
- Baja prioridad vs funcionalidades core

---

## Quick Wins (Implementar Esta Semana)

| # | Acción | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 1 | Eliminar elementos DEV de producción | Alto | 30 min |
| 2 | Agregar `focus-visible` a botones | Alto | 1 hora |
| 3 | Subir contraste de grises (gray-400→500) | Alto | 1 hora |
| 4 | Agregar aria-labels a iconos | Medio | 2 horas |
| 5 | Aumentar tiempo auto-avance (300ms→1000ms) | Medio | 15 min |
| 6 | Mover upsell Premium fuera del onboarding | Alto | 2 horas |

---

## Roadmap Recomendado

### Fase 1 - Fundamentos (0-3 meses)
- [ ] Completar temario al 80%+ (más preguntas)
- [ ] Implementar simulacros cronometrados
- [ ] Rediseñar onboarding con propuesta de valor
- [ ] Modo "solo errores"
- [ ] Quick wins de accesibilidad

### Fase 2 - Engagement (3-6 meses)
- [ ] Notificaciones push
- [ ] Compartir logros en redes
- [ ] Sistema de referidos
- [ ] Flashcards (usando FlipCard de DraftFeatures)
- [ ] Contadores animados en dashboard

### Fase 3 - Diferenciación (6-12 meses)
- [ ] "Modo Tranquilo" (único en mercado)
- [ ] Calendario adaptativo
- [ ] Compañero IA básico
- [ ] Historias de éxito publicadas
- [ ] Unificar design system completo

### Fase 4 - Escala (12+ meses)
- [ ] Sesión por voz
- [ ] Comunidad de opositores
- [ ] Expansión a otras oposiciones
- [ ] App nativa (iOS/Android)

---

## Innovaciones Únicas Propuestas

### 1. "Modo Tranquilo" ⭐
- Sin timer, sin puntuaciones, solo aprendizaje
- **Único en el mercado**
- Refuerza posicionamiento de bienestar

### 2. "Mañana te espera"
- Al terminar sesión: "Mañana repasaremos Art. 57 (tu punto débil)"
- Crea anticipación y compromiso previo

### 3. Fortaleza Expandida (Propuesta C)
- Gamificación visual con "torres" por bloque temático
- Sistema de niveles (Iniciado → Maestro)
- Ya implementado en DraftFeatures

---

## Métricas de Éxito Sugeridas

| Métrica | Actual | Meta 3 meses | Meta 6 meses |
|---------|--------|--------------|--------------|
| Cobertura temario | 34% | 80% | 100% |
| Retención D7 | ? | 40% | 50% |
| Usuarios con racha 7+ días | ? | 20% | 35% |
| NPS | ? | 30 | 50 |
| Conversión Premium | 0% | 5% | 10% |

---

## Archivos Creados en Draft Features

| Tab | Descripción | Estado |
|-----|-------------|--------|
| 🏰 Soft+Fort | Home con Fortaleza integrada | ✅ Listo para revisar |
| 📈 Actividad | Página de actividades con stats | ✅ Listo para revisar |
| 📖 Recursos | 6 categorías expandibles | ✅ Listo para revisar |
| 💡 Propuestas | FlipCard + Contador demos | ✅ Listo para revisar |
| 📚 Temas A | Lista clásica mejorada | ✅ Listo para revisar |
| 📚 Temas B | Grid de bloques | ✅ Listo para revisar |
| 📚 Temas C | Fortaleza expandida | ✅ Listo para revisar |

---

*Consolidación realizada por Claude - Orquestador*
*Enero 2026*
