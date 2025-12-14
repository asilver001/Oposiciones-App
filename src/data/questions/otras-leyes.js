/**
 * Categoría: Otras Leyes Administrativas
 * LCSP (Contratos), LGP (Presupuestaria), FP (Función Pública), RD640 (Pagos)
 * Preguntas con metadatos para preparadores
 */

export const otrasLeyesQuestions = [
  {
    id: "ADM-2026",
    categoria: "LCSP",
    topic: 6,
    question: "Según el artículo 29 de la Ley 9/2017, de Contratos del Sector Público, los contratos de concesión de obras y de concesión de servicios que comprendan ejecución de obras y explotación del servicio tendrán una duración máxima, incluidas prórrogas, de:",
    options: [
      { id: 'a', text: "10 años" },
      { id: 'b', text: "20 años" },
      { id: 'c', text: "30 años" },
      { id: 'd', text: "40 años" }
    ],
    correct: "d",
    explanation: "Pregunta típica de número (40).",
    ley: "Ley 9/2017 (LCSP)",
    articulo: "29",
    patron_examen: "duracion_concesiones",
    trampa_tipica: "confundir límites 30/40",
    nivel: "alto",
    nota_preparador: "Pregunta típica de número (40).",
    pattern_source: "Promo-Interna-Admin (patrón art.29 LCSP)"
  },
  {
    id: "ADM-2027",
    categoria: "LCSP",
    topic: 6,
    question: "Conforme al artículo 44.7 de la Ley 9/2017, la interposición del recurso especial en materia de contratación:",
    options: [
      { id: 'a', text: "Tiene carácter potestativo y es gratuito en todo caso." },
      { id: 'b', text: "Tiene carácter potestativo y estará sujeto a las tasas que correspondan." },
      { id: 'c', text: "No tiene carácter potestativo ni será gratuito." },
      { id: 'd', text: "Es gratuito solo si se acredita insuficiencia de recursos para litigar." }
    ],
    correct: "a",
    explanation: "El examen suele buscar 'potestativo' + 'gratuito'.",
    ley: "Ley 9/2017 (LCSP)",
    articulo: "44.7",
    patron_examen: "recurso_especial_gratuidad",
    trampa_tipica: "meter tasas por analogía con otros recursos",
    nivel: "alto",
    nota_preparador: "El examen suele buscar 'potestativo' + 'gratuito'.",
    pattern_source: "Promo-Interna-Admin (patrón art.44.7 LCSP)"
  },
  {
    id: "ADM-2028",
    categoria: "LGP",
    topic: 6,
    question: "De conformidad con el artículo 75 de la Ley 47/2003, General Presupuestaria, ¿a quién corresponden las funciones de Ordenador General de pagos del Estado?",
    options: [
      { id: 'a', text: "Al Ministro de Hacienda" },
      { id: 'b', text: "Al Ministro de Economía" },
      { id: 'c', text: "Al Director General del Tesoro y Política Financiera" },
      { id: 'd', text: "Al Secretario General del Tesoro y Financiación Internacional" }
    ],
    correct: "c",
    explanation: "Pregunta típica de órgano concreto.",
    ley: "Ley 47/2003 (LGP)",
    articulo: "75",
    patron_examen: "competencias_tesoro_pagos",
    trampa_tipica: "elegir el ministro por intuición",
    nivel: "alto",
    nota_preparador: "Pregunta típica de órgano concreto.",
    pattern_source: "AGE-Admin (patrón LGP art.75)"
  },
  {
    id: "ADM-2029",
    categoria: "FP",
    topic: 4,
    question: "De acuerdo con la Ley 30/1984, indique la opción correcta sobre el complemento específico:",
    options: [
      { id: 'a', text: "Es el correspondiente al nivel del puesto." },
      { id: 'b', text: "Es una retribución básica." },
      { id: 'c', text: "Se percibe necesariamente en 12 pagas." },
      { id: 'd', text: "En ningún caso podrá asignarse más de un complemento específico a cada puesto de trabajo." }
    ],
    correct: "d",
    explanation: "Ojo con 'nivel del puesto' (destino), no específico.",
    ley: "Ley 30/1984",
    articulo: "(retribuciones)",
    patron_examen: "retribuciones_complemento_especifico",
    trampa_tipica: "confundir con complemento de destino y retribuciones básicas",
    nivel: "alto",
    nota_preparador: "Ojo con 'nivel del puesto' (destino), no específico.",
    pattern_source: "AGE-Admin (patrón complemento específico)"
  },
  {
    id: "ADM-2030",
    categoria: "RD640",
    topic: 6,
    question: "Conforme al artículo 10 del RD 640/1987 sobre pagos 'a justificar', los cajeros pagadores quedarán obligados a justificar la aplicación de las cantidades recibidas:",
    options: [
      { id: 'a', text: "Dentro del mes siguiente a la inversión y, en todo caso, en seis meses desde la percepción." },
      { id: 'b', text: "Dentro de dos meses desde la inversión y, en todo caso, en tres meses desde la percepción." },
      { id: 'c', text: "Dentro de dos meses desde la inversión y, en todo caso, en seis meses desde la percepción." },
      { id: 'd', text: "Dentro del mes siguiente a la inversión y, en todo caso, en tres meses desde la percepción." }
    ],
    correct: "c",
    explanation: "Clásica de cruce de plazos: 2 meses + 6 meses.",
    ley: "RD 640/1987",
    articulo: "10",
    patron_examen: "pagos_justificar_plazos",
    trampa_tipica: "cruzar 'mes/dos meses' con 'tres/seis meses'",
    nivel: "alto",
    nota_preparador: "Clásica de cruce de plazos: 2 meses + 6 meses.",
    pattern_source: "AGE-Admin (patrón RD 640/1987 art.10)"
  }
];

export default otrasLeyesQuestions;
