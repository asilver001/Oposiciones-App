# Referencias - Documentos de Apoyo

> Carpeta para documentos de referencia que Claude puede usar para crear y validar preguntas.

---

## Estructura

```
references/
├── examenes/          # Exámenes oficiales de oposiciones anteriores
│   └── [año]_[convocatoria].pdf
├── leyes/             # Textos legales vigentes
│   └── [nombre_ley].pdf
└── temario/           # Temarios oficiales o de referencia
    └── [tema]_[titulo].pdf
```

---

## Cómo Usar Esta Carpeta

### Para el Usuario

1. **Añadir exámenes antiguos**: Coloca PDFs de exámenes en `examenes/`
   - Nombrar como: `2023_AGE_auxiliar.pdf`, `2022_AGE_auxiliar.pdf`

2. **Añadir leyes**: Coloca textos legales en `leyes/`
   - Nombrar como: `constitucion_espanola.pdf`, `ley_39_2015.pdf`

3. **Añadir temarios**: Material de referencia en `temario/`

### Para Claude

Al inicio de cada sesión, revisar si hay nuevos documentos en esta carpeta:

```
"revisar referencias"  → Escanea la carpeta y reporta novedades
```

Cuando hay nuevos documentos:
1. **Exámenes**: Extraer preguntas para reformular
2. **Leyes**: Verificar actualizaciones legales
3. **Temarios**: Identificar temas con poca cobertura

---

## Documentos Pendientes de Añadir

### Alta Prioridad
- [ ] Constitución Española 1978 (texto consolidado)
- [ ] Ley 39/2015 de Procedimiento Administrativo
- [ ] Ley 40/2015 de Régimen Jurídico
- [ ] EBEP (Real Decreto Legislativo 5/2015)
- [ ] Exámenes AGE Auxiliar 2020-2024

### Media Prioridad
- [ ] LOPJ (Ley Orgánica del Poder Judicial)
- [ ] Ley de Gobierno (Ley 50/1997)
- [ ] Temario oficial de la convocatoria

---

## Historial de Revisiones

| Fecha | Documentos Añadidos | Acción Tomada |
|-------|---------------------|---------------|
| 2025-01-14 | Carpeta creada | Estructura inicial |

---

## Notas

- Los PDFs grandes pueden tardar en procesarse
- Preferir textos consolidados (con todas las modificaciones)
- Indicar fecha de última actualización del documento si es posible
