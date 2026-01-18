# MARKETING & CONSUMER EXPERIENCE ASSESSMENT
## OpositaSmart - Evaluación desde perspectiva del usuario/consumidor

**Fecha:** 18 de enero de 2026
**Versión App:** Pre-beta (~34% completado)
**Target:** Opositores preparando Auxiliar Administrativo del Estado (AGE)
**Filosofía Core:** "Bienestar primero, sin gamificación tóxica, a tu ritmo"
**Slogan:** "La forma inteligente de opositar"

---

## 1. PROPUESTA DE VALOR

### 1.1 Diferenciación vs Competidores (OpositaTest, TestOposiciones, etc.)

**Estado Actual: PARCIALMENTE CLARA**

| Aspecto | OpositaSmart | Competidores típicos |
|---------|-------------|---------------------|
| Enfoque emocional | Bienestar, sin presión | Competitividad, rankings |
| Sistema de progreso | Racha suave, "Fortaleza" | Puntos, niveles, leaderboards |
| Tono comunicación | Calmado, acompañamiento | Gamificación agresiva |
| Ciencia del aprendizaje | FSRS (repetición espaciada) | Tests aleatorios |

**Fortalezas identificadas:**
- Mensaje "Unos minutos al día, sin agobios" es diferenciador potente
- Sistema de Fortaleza (visualización de progreso por tema) es original
- Enfoque FSRS (algoritmo de repetición espaciada) es superior técnicamente
- Tono visual sobrio (púrpura suave) transmite calma vs los tonos agresivos típicos

**Oportunidades de mejora:**
- El diferencial "bienestar primero" NO está explícito en el onboarding
- No hay comparativa directa con "la competencia tóxica"
- El valor del algoritmo FSRS no se comunica al usuario
- Falta storytelling sobre por qué esta app es diferente

**Recomendación:** Incluir en onboarding una pantalla que explique:
> "OpositaSmart es diferente: aquí no competirás con nadie, solo contigo mismo.
> Usamos ciencia real (repetición espaciada) para que estudies menos y recuerdes más."

---

### 1.2 El "Bienestar Primero" en el Diseño

**Estado Actual: PRESENTE PERO SUTIL**

**Elementos que SÍ transmiten bienestar:**
- Paleta de colores suaves (purple-50 a purple-700)
- Bordes redondeados grandes (rounded-2xl, rounded-3xl)
- Sombras suaves (shadow-lg shadow-purple-600/30)
- Mensaje de racha: "Llevas X días seguidos" en lugar de "¡No pierdas tu racha!"
- Sistema de insignias sin presión (Constancia, Compromiso, Dedicación)

**Elementos que CONTRADICEN el bienestar:**
- Modal Premium después de primer test - interrupción agresiva
- Banner "Protege tu racha" con iconos de fuego - genera ansiedad
- "TOP 45% de nuevos usuarios" en resultados - comparación competitiva
- Contador de tiempo visible durante tests - crea presión

**Recomendación:**
- Reemplazar "Protege tu racha" por "Tu progreso está guardado"
- Eliminar comparaciones con otros usuarios
- Hacer el timer opcional o invisible por defecto
- Mover upsell de Premium al footer, no como interrupción

---

### 1.3 Problema que Resuelve - Claridad

**Estado Actual: IMPLÍCITO, NO EXPLÍCITO**

El problema real de los opositores:
1. Soledad en el estudio (estudian solos meses/años)
2. No saber si están progresando
3. Desmotivación por la duración del proceso
4. Materiales aburridos y repetitivos
5. Ansiedad por la fecha del examen

**Cómo OpositaSmart lo aborda (pero no lo comunica):**
- Racha = compañía diaria
- Fortaleza = visualización de progreso
- "A tu ritmo" = reduce ansiedad
- FSRS = optimiza el estudio

**Recomendación:** El onboarding debería empezar con:
> "Sabemos lo difícil que es opositar solo. Por eso creamos una app que te acompaña
> cada día, te muestra tu progreso real y te ayuda a estudiar de forma inteligente."

---

## 2. PRIMERA IMPRESIÓN

### 2.1 Análisis del Onboarding

**Flujo actual:**
1. WelcomeScreen - Logo + "Empezar"
2. OnboardingOposicion - Seleccionar oposición
3. OnboardingTiempo - Meta diaria (minutos)
4. OnboardingFecha - Fecha examen
5. OnboardingIntro - Explicación + primer test
6. FirstTest - 5 preguntas
7. Results - Puntuación + upsell Premium
8. Signup (opcional)
9. Home

**Fortalezas:**
- Flujo lineal, fácil de seguir
- Animación flotante del icono es amigable
- Pregunta por meta diaria personaliza experiencia
- Primer test es corto (5 preguntas) - bajo compromiso

**Problemas críticos:**
1. **No hay propuesta de valor** - El usuario no sabe POR QUÉ debería usar la app
2. **WelcomeScreen demasiado minimalista** - Solo logo y botón
3. **No hay social proof** - Cuántos usuarios, testimonios
4. **Upsell Premium muy pronto** - Antes de que el usuario vea valor
5. **Signup se percibe como fricción** - No hay beneficio claro de registrarse

**Métricas estimadas de drop-off:**
- WelcomeScreen -> OnboardingOposicion: ~85% continúan
- OnboardingIntro -> FirstTest: ~60% (muchos no quieren test aún)
- Results -> Signup: ~20% (mayoría skipea)

**Recomendación de nuevo flujo:**
1. WelcomeScreen con propuesta de valor clara
2. "¿Qué oposición preparas?" (ya existe)
3. **NUEVO:** "¿Cuánto llevas preparando?" (context)
4. **NUEVO:** "¿Cuál es tu mayor reto?" (pain point)
5. Mostrar cómo OpositaSmart resuelve ESE reto
6. Meta diaria (ya existe)
7. Home (ver valor primero)
8. Primer test cuando usuario lo elija
9. Signup después de 3+ sesiones exitosas

---

### 2.2 Claridad de la Acción Inicial

**Estado Actual: CONFUSO**

Al llegar al Home por primera vez, el usuario ve:
- Banner de racha (0 días)
- Fortaleza con temas (mock data)
- "Tu Sesión de Hoy" con temas predefinidos
- "Reto del día"
- Tab bar inferior

**Problema:** Demasiadas opciones, ninguna destacada.

**Lo que el usuario se pregunta:**
- "¿Por dónde empiezo?"
- "¿Qué es la Fortaleza?"
- "¿Qué diferencia hay entre Sesión de Hoy y Reto del día?"

**Recomendación:**
- Primera visita: UN solo CTA grande "Comenzar tu primer tema"
- Esconder elementos secundarios hasta que el usuario complete 1 sesión
- Agregar onboarding contextual ("Esto es tu Fortaleza, aquí ves...")

---

### 2.3 Generación de Confianza

**Estado Actual: DÉBIL**

**Elementos de confianza presentes:**
- Política de privacidad detallada
- Explicación de almacenamiento local
- FAQ completo

**Elementos de confianza AUSENTES:**
- Número de usuarios
- Testimonios de opositores
- Casos de éxito ("María aprobó en 6 meses")
- Afiliaciones/credenciales
- Garantía de actualización del temario
- Validación por expertos
- Equipo detrás del proyecto

**Recomendación inmediata:**
- Agregar contador de usuarios (aunque sea aproximado)
- Incluir 2-3 testimonios reales en WelcomeScreen
- Mostrar fecha de última actualización del temario

---

## 3. ENGAGEMENT Y RETENCIÓN

### 3.1 Motivación para Volver Cada Día

**Mecanismos actuales:**
1. **Racha:** "Llevas X días" - motivación intrínseca
2. **Insignias:** 3, 7, 14, 30, 100 días - hitos
3. **Progreso visual:** Fortaleza con estados por tema
4. **Feedback Panel:** Insights de última sesión

**Fortalezas:**
- Sistema de racha SIN penalización por perder (no hay "streak freeze")
- Mensajes empáticos: "Hoy es un buen día para empezar"
- Progreso persistente (no se pierde aunque no estudies)

**Debilidades:**
- No hay notificaciones push (solo marcado "Próximamente")
- No hay recordatorios personalizados
- No hay variedad en recompensas
- Falta la "anticipación" del día siguiente

**Recomendación - Sistema "Mañana te espera":**
Al terminar sesión, mostrar:
> "Mañana repasaremos Art. 57 (tu punto débil) y avanzaremos en Tema 5.
> Tu sesión estará lista a las 8am."

Esto crea anticipación y compromiso previo.

---

### 3.2 Sistema de Racha - Equilibrio

**Estado Actual: BIEN BALANCEADO**

| Aspecto | Evaluación |
|---------|-----------|
| Visibilidad | Media - solo en Home y TopBar |
| Presión | Baja - mensaje suave |
| Recompensas | Moderadas - insignias sin presión |
| Penalización | Nula - no hay "perder racha" dramático |

**Elementos positivos:**
- Mensajes como "La constancia suma" en lugar de "¡No lo pierdas!"
- Insignias con nombres positivos (Constancia, Compromiso, Dedicación)
- No hay comparación con otros usuarios

**Posibles mejoras:**
- Agregar "días de descanso" legítimos sin perder racha
- Mostrar "mejor racha histórica" como celebración pasada
- Enviar felicitación por hitos sin que el usuario tenga que buscarla

---

### 3.3 Variedad de Actividades

**Estado Actual: LIMITADO**

**Actividades disponibles:**
1. Tests de preguntas (5-10 preguntas)
2. Repasos (vía FSRS)
3. Reto del día

**Actividades AUSENTES que un opositor esperaría:**
1. Simulacros completos cronometrados
2. Estudio de teoría (lectura)
3. Flashcards
4. Resumen de artículos clave
5. Mapas mentales/esquemas
6. Audio/podcast de temas
7. Videos explicativos
8. Modo "solo errores"
9. Práctica de supuestos prácticos
10. Calendario de estudio personalizado

**Recomendación prioritaria:**
- **Must have:** Simulacros cronometrados (diferenciador clave)
- **Must have:** Modo "solo errores" (alto valor percibido)
- **Should have:** Flashcards (complemento natural)
- **Nice to have:** Audio resumen (innovador)

---

## 4. GAPS DE FUNCIONALIDAD

### 4.1 Expectativas de un Opositor - Análisis

**Lo que un opositor ESPERA encontrar:**

| Funcionalidad | Estado | Prioridad |
|--------------|--------|-----------|
| Banco de preguntas por tema | Parcial | CRÍTICA |
| Explicaciones detalladas | Parcial | CRÍTICA |
| Simulacros cronometrados | Ausente | CRÍTICA |
| Temario actualizado | Parcial | CRÍTICA |
| Estadísticas de progreso | Presente | Alta |
| Modo offline | Presente (PWA) | Alta |
| Calendario de estudio | Ausente | Alta |
| Compartir progreso | Ausente | Media |
| Comunidad/foro | Ausente | Media |
| Notificaciones | Ausente | Media |
| Modo oscuro | Ausente | Baja |

---

### 4.2 Must Have vs Nice to Have

**MUST HAVE (bloqueadores de conversión):**

1. **Más preguntas** - Solo ~34% del temario cubierto
   - Usuario espera: 15,000+ preguntas
   - Estado actual: ~500-1000 preguntas estimadas

2. **Simulacros reales** - Examen completo con tiempo
   - Usuario espera: Simular examen real de 100 preguntas en 60 min
   - Estado actual: Solo tests cortos de 5-10 preguntas

3. **Explicaciones de calidad** - Por qué cada respuesta es correcta
   - Usuario espera: Referencia legal, contexto
   - Estado actual: Explicaciones básicas

4. **Garantía de actualización** - Temario vigente
   - Usuario espera: Actualizaciones cuando cambie la ley
   - Estado actual: No comunicado

**NICE TO HAVE (diferenciadores):**

1. Flashcards inteligentes
2. Audio resúmenes
3. Comunidad de opositores
4. Integración con calendarios
5. Modo competición amigable (opcional)
6. Tutores IA para dudas

---

### 4.3 Oportunidades de Monetización

**Estado Actual:** Modelo freemium "Próximamente"

**Análisis de pricing competitivo:**
- OpositaTest: ~15-25 EUR/mes
- TestOposiciones: ~10-20 EUR/mes
- Academias online: ~50-100 EUR/mes

**Propuesta de monetización para OpositaSmart:**

**Tier Gratuito:**
- 2 temas completos
- 10 preguntas/día
- Racha y progreso básico
- Anuncios discretos (opcional)

**Tier Premium (9.99 EUR/mes o 59.99 EUR/año):**
- Todos los temas
- Preguntas ilimitadas
- Simulacros completos
- Modo offline completo
- Sin anuncios
- Estadísticas avanzadas
- Soporte prioritario

**Tier Pro (14.99 EUR/mes o 99.99 EUR/año):**
- Todo Premium +
- Análisis IA personalizado
- Tutoría IA para dudas
- Calendario de estudio personalizado
- Garantía de actualización inmediata
- Acceso anticipado a nuevas funciones

**Recomendación de timing:**
- NO mostrar upsell hasta 3+ días de uso
- Ofrecer trial de 7 días después de racha de 3 días
- Upsell contextual cuando usuario intente acceder a tema bloqueado

---

## 5. AWARD-WINNING POTENTIAL

### 5.1 Lo que Falta para Destacar

**Categoría: Mejor App Educativa**

**Criterios típicos de premios:**
1. Innovación pedagógica
2. Diseño UX excepcional
3. Impacto en usuarios
4. Accesibilidad
5. Escalabilidad

**Estado actual vs criterios:**

| Criterio | Estado | Mejora necesaria |
|----------|--------|------------------|
| Innovación pedagógica | Media | Comunicar mejor FSRS |
| Diseño UX | Bueno | Reducir fricción inicial |
| Impacto en usuarios | Desconocido | Medir y mostrar éxitos |
| Accesibilidad | Básica | WCAG compliance |
| Escalabilidad | Buena (Supabase) | Ya está |

**Para ser "award-winning":**
1. Publicar tasa de éxito de usuarios que aprobaron
2. Implementar accesibilidad completa
3. Crear "Innovation story" sobre FSRS
4. Conseguir menciones en medios especializados
5. Participar en hackathons/competencias de EdTech

---

### 5.2 Viralidad entre Opositores

**Factores de viralidad actuales: BAJOS**

**Lo que hace una app viral en este nicho:**
1. **Compartir logros** - "¡Conseguí 100 preguntas seguidas!"
2. **Retos grupales** - "Mi grupo de estudio vs el tuyo"
3. **Contenido UGC** - Memes de opositor, tips
4. **Referidos con beneficio** - "Invita y gana Premium"
5. **Historias de éxito** - "María aprobó gracias a..."

**Estado actual:**
- No hay compartir en redes sociales
- No hay sistema de referidos
- No hay comunidad
- No hay historias de éxito visibles

**Recomendación - "Comparte tu progreso":**
Al completar un hito (7 días de racha, tema dominado, etc.):
> [Imagen generada automáticamente con progreso]
> "Llevo 30 días preparando mi oposición con @OpositaSmart
>  Ya domino 3 temas. ¡Tú también puedes!"
> [Botón compartir en Instagram/Twitter/WhatsApp]

**Recomendación - Referidos:**
> "Invita a un compañero opositor y ambos reciben 7 días de Premium gratis"

---

### 5.3 Innovaciones Diferenciadoras

**Ideas para destacar en el mercado:**

1. **"Modo Tranquilo"**
   - Sin timer, sin puntuaciones, solo aprendizaje
   - Único en el mercado
   - Refuerza el posicionamiento de bienestar

2. **"Compañero de Estudio IA"**
   - Chat que responde dudas sobre el temario
   - Explica respuestas incorrectas en profundidad
   - Sugiere qué estudiar según debilidades

3. **"Sesión Guiada por Voz"**
   - Estudiar mientras caminas/conduces
   - Preguntas leídas, respuestas por voz
   - Accesibilidad y conveniencia

4. **"Predictor de Éxito"**
   - Basado en progreso, estimar probabilidad de aprobar
   - Motivador si es alta, orientador si es baja
   - Comunicar con cuidado para no desmotivar

5. **"Diario del Opositor"**
   - Notas personales por tema
   - Reflexiones después de cada sesión
   - Exportable como resumen de estudio

6. **"Calendario Adaptativo"**
   - Genera plan de estudio según fecha examen
   - Se ajusta si el usuario se atrasa
   - Integra con Google Calendar

---

## 6. PRIORIZACIÓN DE MEJORAS

### Matriz Impacto vs Esfuerzo

```
IMPACTO ALTO
     |
     |  [1] Simulacros cronometrados
     |  [2] Más preguntas por tema
     |  [3] Mejorar onboarding (valor claro)
     |
     |  [4] Sistema de referidos
     |  [5] Compartir logros
     |  [6] Notificaciones push
     |
     |  [7] Modo Tranquilo
     |  [8] Calendario adaptativo
     |
     |  [9] Compañero IA
     |  [10] Sesión por voz
     |
IMPACTO BAJO
     |______________________________________
          ESFUERZO BAJO          ESFUERZO ALTO
```

### Roadmap Recomendado

**Fase 1 - Fundamentos (0-3 meses):**
- Más preguntas (completar temario al 80%+)
- Simulacros cronometrados
- Mejorar onboarding (comunicar valor)
- Modo "solo errores"

**Fase 2 - Engagement (3-6 meses):**
- Notificaciones push
- Compartir logros en redes
- Sistema de referidos
- Flashcards

**Fase 3 - Diferenciación (6-12 meses):**
- Modo Tranquilo
- Calendario adaptativo
- Compañero IA básico
- Historias de éxito publicadas

**Fase 4 - Escala (12+ meses):**
- Sesión por voz
- Comunidad de opositores
- Expansión a otras oposiciones
- App nativa (iOS/Android)

---

## 7. CONCLUSIONES EJECUTIVAS

### Fortalezas Actuales
1. Posicionamiento diferenciado (bienestar vs gamificación tóxica)
2. Base tecnológica sólida (FSRS, Supabase, PWA)
3. Diseño visual agradable y coherente
4. Sistema de progreso no tóxico (Fortaleza)
5. Potencial de escalabilidad

### Debilidades Críticas
1. Contenido insuficiente (solo ~34% del temario)
2. Onboarding no comunica propuesta de valor
3. Sin simulacros reales (expectativa básica del opositor)
4. Sin mecanismos de viralidad/referidos
5. Upsell premium mal ubicado (genera fricción)

### Oportunidades Inmediatas
1. Diferenciarse claramente de competidores tóxicos
2. Capturar nicho de opositores que buscan bienestar
3. Primer mover en "Modo Tranquilo"
4. Sistema de referidos entre compañeros de oposición

### Riesgos
1. Competidores con más contenido (OpositaTest tiene 50K+ preguntas)
2. Percepción de "app incompleta" si no hay suficientes temas
3. Dificultad de monetización si no hay suficiente valor percibido
4. Pérdida de usuarios por falta de notificaciones/recordatorios

---

## 8. PRÓXIMOS PASOS RECOMENDADOS

1. **Inmediato (esta semana):**
   - Rediseñar WelcomeScreen con propuesta de valor clara
   - Mover upsell Premium fuera del flujo de onboarding
   - Agregar contador de usuarios (aunque sea estimado)

2. **Corto plazo (este mes):**
   - Implementar simulacros cronometrados (MVP)
   - Agregar modo "solo errores"
   - Mejorar explicaciones de respuestas

3. **Medio plazo (próximo trimestre):**
   - Completar temario al 80%+
   - Implementar notificaciones push
   - Lanzar sistema de referidos

---

*Assessment realizado por Claude - Marketing & Consumer Experience Expert*
*Enero 2026*
