/**
 * Categoría: CE - Constitución Española
 * Preguntas con metadatos para preparadores
 */

export const ceQuestions = [
  {
    id: "ADM-2001",
    categoria: "CE",
    topic: 1,
    question: "Conforme a los artículos 90 y 91 de la Constitución Española, aprobado un proyecto de ley por el Congreso, ¿cuál de las siguientes afirmaciones es correcta respecto al plazo del Senado cuando el proyecto ha sido declarado urgente?",
    options: [
      { id: 'a', text: "El Senado dispone de tres meses para vetar o enmendar el texto." },
      { id: 'b', text: "El Senado dispone de dos meses, sin posibilidad de reducción." },
      { id: 'c', text: "El plazo del Senado se reduce a veinte días naturales si el proyecto se declara urgente por el Gobierno o por el Congreso." },
      { id: 'd', text: "El plazo del Senado se reduce a quince días hábiles en todo caso." }
    ],
    correct: "c",
    explanation: "Ojo: en urgencia el plazo baja a 20 días naturales.",
    ley: "Constitución Española",
    articulo: "90-91",
    patron_examen: "tramitacion_ley_urgente_plazos",
    trampa_tipica: "confundir meses/días y naturaleza hábil/natural",
    nivel: "alto",
    nota_preparador: "Ojo: en urgencia el plazo baja a 20 días naturales.",
    pattern_source: "AGE-Admin-2024 (patrón CE 90/91)"
  },
  {
    id: "ADM-2002",
    categoria: "CE",
    topic: 1,
    question: "Según el artículo 91 de la Constitución, una vez aprobadas las leyes por las Cortes Generales, el Rey deberá sancionarlas y promulgarlas en el plazo de:",
    options: [
      { id: 'a', text: "10 días naturales" },
      { id: 'b', text: "15 días" },
      { id: 'c', text: "20 días naturales" },
      { id: 'd', text: "1 mes" }
    ],
    correct: "b",
    explanation: "Es 15 días (sin matiz hábil/natural).",
    ley: "Constitución Española",
    articulo: "91",
    patron_examen: "funciones_rey_plazo_sancion",
    trampa_tipica: "responder 20 por contaminación de otras opciones del examen",
    nivel: "medio",
    nota_preparador: "Es 15 días (sin matiz hábil/natural).",
    pattern_source: "AGE-Admin-2024 (patrón art.91)"
  },
  {
    id: "ADM-2003",
    categoria: "CE",
    topic: 1,
    question: "¿Cuál de las siguientes proposiciones se ajusta a la definición constitucional del Senado?",
    options: [
      { id: 'a', text: "Es la Cámara de representación popular." },
      { id: 'b', text: "Es la Cámara de representación territorial." },
      { id: 'c', text: "Es un órgano consultivo del Gobierno." },
      { id: 'd', text: "Es un órgano jurisdiccional de control constitucional." }
    ],
    correct: "b",
    explanation: "Pregunta típica de definición literal.",
    ley: "Constitución Española",
    articulo: "69.1",
    patron_examen: "definicion_senado",
    trampa_tipica: "confundir con Congreso o TC",
    nivel: "medio",
    nota_preparador: "Pregunta típica de definición literal.",
    pattern_source: "AGE-Admin (patrón recurrente CE)"
  },
  {
    id: "ADM-2004",
    categoria: "CE",
    topic: 1,
    question: "De acuerdo con el artículo 66 de la Constitución, las Cortes Generales:",
    options: [
      { id: 'a', text: "Representan a la Nación y al Rey conjuntamente." },
      { id: 'b', text: "Representan al pueblo español y están formadas por el Congreso y el Senado." },
      { id: 'c', text: "Representan al Gobierno y controlan al poder judicial." },
      { id: 'd', text: "Representan exclusivamente a las Comunidades Autónomas." }
    ],
    correct: "b",
    explanation: "Art. 66.1: pueblo español + Congreso/Senado.",
    ley: "Constitución Española",
    articulo: "66.1",
    patron_examen: "cortes_representacion_composicion",
    trampa_tipica: "nación vs pueblo; confundir composición",
    nivel: "medio",
    nota_preparador: "Art. 66.1: pueblo español + Congreso/Senado.",
    pattern_source: "AGE-Admin (patrón art.66)"
  },
  {
    id: "ADM-2005",
    categoria: "CE",
    topic: 1,
    question: "En relación con el artículo 63 de la Constitución, la declaración de guerra y la paz corresponde:",
    options: [
      { id: 'a', text: "Al Congreso por mayoría simple." },
      { id: 'b', text: "Al Gobierno mediante Real Decreto." },
      { id: 'c', text: "Al Rey, previa autorización de las Cortes Generales." },
      { id: 'd', text: "Al Senado mediante mensaje motivado." }
    ],
    correct: "c",
    explanation: "Rey + autorización previa de Cortes Generales.",
    ley: "Constitución Española",
    articulo: "63.3",
    patron_examen: "competencias_rey_autorizacion_cortes",
    trampa_tipica: "atribuirlo al Gobierno o a una sola Cámara",
    nivel: "alto",
    nota_preparador: "Rey + autorización previa de Cortes Generales.",
    pattern_source: "AGE-Admin (patrón competencias del Rey)"
  },
  {
    id: "ADM-2006",
    categoria: "CE",
    topic: 1,
    question: "¿Cuál de las siguientes afirmaciones describe correctamente el principio recogido en el artículo 9.3 de la Constitución?",
    options: [
      { id: 'a', text: "Consagra los valores superiores del ordenamiento jurídico (libertad, justicia, igualdad y pluralismo político)." },
      { id: 'b', text: "Garantiza, entre otros, la jerarquía normativa, la publicidad de las normas y la seguridad jurídica." },
      { id: 'c', text: "Reconoce el derecho a la educación y a la libertad de enseñanza." },
      { id: 'd', text: "Define la estructura territorial del Estado en municipios, provincias y CCAA." }
    ],
    correct: "b",
    explanation: "Art. 9.3 es un cajón de principios; cae mucho.",
    ley: "Constitución Española",
    articulo: "9.3",
    patron_examen: "principios_constitucionales_9_3",
    trampa_tipica: "confundir valores del 1.1 con principios del 9.3",
    nivel: "alto",
    nota_preparador: "Art. 9.3 es un cajón de principios; cae mucho.",
    pattern_source: "AGE-Admin (patrón 9.3)"
  },
  {
    id: "ADM-2007",
    categoria: "CE",
    topic: 1,
    question: "Señale la opción correcta respecto al Tribunal Constitucional:",
    options: [
      { id: 'a', text: "Se compone de 10 magistrados nombrados por el Gobierno." },
      { id: 'b', text: "Se compone de 12 magistrados nombrados por distintos órganos constitucionales." },
      { id: 'c', text: "Se compone de 15 magistrados elegidos por sufragio." },
      { id: 'd', text: "Forma parte del Poder Judicial." }
    ],
    correct: "b",
    explanation: "No pertenece al Poder Judicial; son 12.",
    ley: "Constitución Española",
    articulo: "159.1",
    patron_examen: "tc_composicion_nombramiento",
    trampa_tipica: "confundir con CGPJ o TS; número 15",
    nivel: "medio",
    nota_preparador: "No pertenece al Poder Judicial; son 12.",
    pattern_source: "AGE-Admin (patrón TC)"
  },
  {
    id: "ADM-2008",
    categoria: "CE",
    topic: 1,
    question: "En el Título I de la Constitución, ¿qué bloque se corresponde con los principios rectores de la política social y económica?",
    options: [
      { id: 'a', text: "Artículos 15 a 29" },
      { id: 'b', text: "Artículos 30 a 38" },
      { id: 'c', text: "Artículos 39 a 52" },
      { id: 'd', text: "Artículos 53 a 54" }
    ],
    correct: "c",
    explanation: "Bloque muy preguntable por trampas numéricas.",
    ley: "Constitución Española",
    articulo: "39-52",
    patron_examen: "estructura_titulo_I_bloques",
    trampa_tipica: "confundir deberes (30-38) con principios (39-52)",
    nivel: "alto",
    nota_preparador: "Bloque muy preguntable por trampas numéricas.",
    pattern_source: "AGE-Admin (patrón estructura CE)"
  },
  {
    id: "ADM-2009",
    categoria: "CE",
    topic: 1,
    question: "¿Cuál de las siguientes materias se configura como derecho fundamental (y no como principio rector) en la Constitución?",
    options: [
      { id: 'a', text: "Protección de la salud" },
      { id: 'b', text: "Vivienda digna" },
      { id: 'c', text: "Educación" },
      { id: 'd', text: "Protección de la familia" }
    ],
    correct: "c",
    explanation: "Educación (27) es DF; salud (43), vivienda (47) y familia (39) son principios.",
    ley: "Constitución Española",
    articulo: "27",
    patron_examen: "diferenciar_derechos_principios",
    trampa_tipica: "confundir 'importante' con 'fundamental'",
    nivel: "alto",
    nota_preparador: "Educación (27) es DF; salud (43), vivienda (47) y familia (39) son principios.",
    pattern_source: "AGE-Admin (patrón DF vs principios)"
  },
  {
    id: "ADM-2010",
    categoria: "CE",
    topic: 1,
    question: "Conforme al artículo 87 de la Constitución, la iniciativa legislativa puede corresponder, entre otros, a:",
    options: [
      { id: 'a', text: "Solo al Gobierno y al Congreso." },
      { id: 'b', text: "Al Gobierno, al Congreso, al Senado y a las Asambleas de las CCAA, además de la iniciativa popular en los términos previstos." },
      { id: 'c', text: "Solo al Senado, por ser Cámara de representación territorial." },
      { id: 'd', text: "Al Tribunal Constitucional mediante providencia." }
    ],
    correct: "b",
    explanation: "La ILP tiene requisitos; aquí basta identificar sujetos del 87.",
    ley: "Constitución Española",
    articulo: "87",
    patron_examen: "iniciativa_legislativa_fuentes",
    trampa_tipica: "olvidar Asambleas autonómicas o ILP",
    nivel: "alto",
    nota_preparador: "La ILP tiene requisitos; aquí basta identificar sujetos del 87.",
    pattern_source: "AGE-Admin (patrón art.87)"
  }
];

export default ceQuestions;
