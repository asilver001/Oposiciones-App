# ROADMAP - OpositaSmart

## Estado Actual: ~34% completado (Pre-Beta)

---

## Fase 1: Estabilización y Refactor (Prioridad Alta)

### 1.1 Refactor de OpositaApp.jsx
- [ ] Extraer flujo de Onboarding a `components/onboarding/`
- [ ] Separar lógica de navegación (crear router o state machine)
- [ ] Mover componentes inline a archivos separados
- [ ] Crear componentes de UI reutilizables (`Button`, `Card`, `Modal`)

### 1.2 Refactor de HybridSession.jsx
- [ ] Dividir en componentes más pequeños
- [ ] Extraer lógica de sesión a hook personalizado

### 1.3 Calidad de Código
- [ ] Configurar ESLint más estricto
- [ ] Añadir Prettier para formateo consistente
- [ ] Considerar migración a TypeScript (gradual)

---

## Fase 2: Funcionalidad Core

### 2.1 Sistema de Estudio
- [ ] Mejorar algoritmo FSRS con ajustes personalizados
- [ ] Implementar sesiones por tema/bloque
- [ ] Estadísticas detalladas de rendimiento
- [ ] Sistema de "racha" no-punitivo (bienestar primero)

### 2.2 Banco de Preguntas
- [ ] Completar preguntas de Constitución Española
- [ ] Añadir preguntas de Ley 39/2015 (Procedimiento Administrativo)
- [ ] Añadir preguntas de Ley 40/2015 (Régimen Jurídico)
- [ ] Sistema de etiquetas y categorización
- [ ] Explicaciones detalladas por pregunta

### 2.3 Panel de Admin
- [ ] CRUD completo de preguntas
- [ ] Import/Export masivo (CSV/JSON)
- [ ] Dashboard de métricas de uso
- [ ] Sistema de revisión de preguntas

---

## Fase 3: Experiencia de Usuario

### 3.1 PWA Completa
- [ ] Service Worker robusto (offline-first)
- [ ] Sincronización en background
- [ ] Push notifications (recordatorios amables)
- [ ] Instalación nativa mejorada

### 3.2 UI/UX
- [ ] Modo oscuro
- [ ] Animaciones con Framer Motion
- [ ] Onboarding interactivo mejorado
- [ ] Accesibilidad (WCAG 2.1 AA)

### 3.3 Gamificación Saludable
- [ ] Sistema "Fortaleza" (progreso visual sin presión)
- [ ] Logros por consistencia, no por cantidad
- [ ] Mensajes de bienestar y descanso

---

## Fase 4: Social y Comunidad

### 4.1 Funcionalidades Sociales
- [ ] Grupos de estudio
- [ ] Ranking opcional (opt-in)
- [ ] Compartir logros
- [ ] Foro/Chat de dudas

### 4.2 Contenido Generado
- [ ] Sistema para que usuarios propongan preguntas
- [ ] Votación de calidad de preguntas
- [ ] Comentarios en preguntas

---

## Fase 5: Monetización y Escalado

### 5.1 Modelo Freemium
- [ ] Definir features gratuitos vs premium
- [ ] Integración de pagos (Stripe)
- [ ] Sistema de suscripciones
- [ ] Periodo de prueba

### 5.2 Expansión
- [ ] Otras oposiciones AGE (Administrativo, Gestión)
- [ ] Oposiciones autonómicas
- [ ] Oposiciones de Justicia

### 5.3 Infraestructura
- [ ] Migrar a hosting propio si necesario
- [ ] CDN para assets
- [ ] Monitorización y alertas
- [ ] Tests automatizados (unit + e2e)

---

## Métricas de Éxito

- **Usuarios activos diarios (DAU)**
- **Retención a 7 días**
- **Sesiones completadas por usuario**
- **NPS (Net Promoter Score)**
- **Tasa de conversión free → premium**

---

## Principios Guía

1. **Bienestar sobre engagement**: No optimizar para adicción
2. **Simplicidad**: Menos es más, evitar feature creep
3. **Ciencia**: Decisiones basadas en evidencia (FSRS, etc.)
4. **Accesibilidad**: La app debe ser usable por todos
5. **Respeto**: Los datos del usuario son sagrados
