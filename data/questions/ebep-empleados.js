/**
 * Categoría: EBEP - Estatuto Básico del Empleado Público
 * Preguntas con metadatos para preparadores
 */

export const ebepQuestions = [
  {
    id: "ADM-2031",
    categoria: "EBEP",
    topic: 4,
    question: "Según el EBEP, la figura del personal eventual se caracteriza porque:",
    options: [
      { id: 'a', text: "Desempeña funciones técnicas permanentes y se accede por oposición." },
      { id: 'b', text: "Realiza funciones de confianza o asesoramiento especial y su nombramiento y cese son libres." },
      { id: 'c', text: "Solo puede prestar servicios en régimen de interinidad por vacante." },
      { id: 'd', text: "Se rige exclusivamente por el Estatuto de los Trabajadores." }
    ],
    correct: "b",
    explanation: "Muy preguntable por confusión conceptual.",
    ley: "EBEP (RDL 5/2015)",
    articulo: "12",
    patron_examen: "eventual_confianza",
    trampa_tipica: "confundir eventual con interino o laboral",
    nivel: "alto",
    nota_preparador: "Muy preguntable por confusión conceptual.",
    pattern_source: "AGE-Admin (patrón empleo público)"
  },
  {
    id: "ADM-2032",
    categoria: "EBEP",
    topic: 4,
    question: "Señale la afirmación correcta sobre el nombramiento de funcionarios interinos:",
    options: [
      { id: 'a', text: "Se realiza por libre designación para puestos de confianza." },
      { id: 'b', text: "Solo puede realizarse para la sustitución transitoria de titulares y nunca para vacantes." },
      { id: 'c', text: "Puede realizarse por razones expresamente justificadas de necesidad y urgencia en los supuestos legalmente previstos." },
      { id: 'd', text: "Equivale a adquirir la condición de funcionario de carrera tras un periodo de prueba." }
    ],
    correct: "c",
    explanation: "El examen busca 'necesidad y urgencia' + supuestos tasados.",
    ley: "EBEP (RDL 5/2015)",
    articulo: "10",
    patron_examen: "interinos_supuestos",
    trampa_tipica: "restringir indebidamente los supuestos o equipararlo a carrera",
    nivel: "alto",
    nota_preparador: "El examen busca 'necesidad y urgencia' + supuestos tasados.",
    pattern_source: "AGE-Admin (patrón interinos)"
  },
  {
    id: "ADM-2033",
    categoria: "EBEP",
    topic: 4,
    question: "Conforme al artículo 62 del EBEP, para adquirir la condición de funcionario de carrera es requisito, entre otros:",
    options: [
      { id: 'a', text: "Suscribir contrato laboral indefinido con la Administración." },
      { id: 'b', text: "Acatamiento de la Constitución y del resto del ordenamiento jurídico (juramento o promesa), y toma de posesión." },
      { id: 'c', text: "Acreditar cinco años de servicios previos como interino." },
      { id: 'd', text: "Superar una entrevista de idoneidad discrecional." }
    ],
    correct: "b",
    explanation: "La clave es el acto formal de acatamiento + toma de posesión.",
    ley: "EBEP (RDL 5/2015)",
    articulo: "62",
    patron_examen: "adquisicion_condicion_funcionario",
    trampa_tipica: "meter requisitos inexistentes (antigüedad/entrevista)",
    nivel: "alto",
    nota_preparador: "La clave es el acto formal de acatamiento + toma de posesión.",
    pattern_source: "AGE-Admin (patrón art.62 EBEP)"
  },
  {
    id: "ADM-2034",
    categoria: "EBEP",
    topic: 4,
    question: "El acceso al empleo público se rige, entre otros, por los principios de:",
    options: [
      { id: 'a', text: "Confianza, discrecionalidad y oportunidad." },
      { id: 'b', text: "Igualdad, mérito y capacidad, con publicidad." },
      { id: 'c', text: "Preferencia territorial y antigüedad." },
      { id: 'd', text: "Libre elección del órgano convocante." }
    ],
    correct: "b",
    explanation: "Muy frecuente en test por descarte.",
    ley: "EBEP (RDL 5/2015)",
    articulo: "55",
    patron_examen: "principios_acceso",
    trampa_tipica: "confundir con rasgos del personal eventual",
    nivel: "medio",
    nota_preparador: "Muy frecuente en test por descarte.",
    pattern_source: "AGE-Admin (patrón acceso)"
  },
  {
    id: "ADM-2035",
    categoria: "EBEP",
    topic: 4,
    question: "Señale cuál de las siguientes causas puede implicar pérdida de la condición de funcionario, conforme al EBEP:",
    options: [
      { id: 'a', text: "Cambio de destino por concurso" },
      { id: 'b', text: "Separación del servicio como sanción disciplinaria" },
      { id: 'c', text: "Comisión de servicios" },
      { id: 'd', text: "Excedencia por cuidado de hijos" }
    ],
    correct: "b",
    explanation: "Separación del servicio = pérdida; excedencia no.",
    ley: "EBEP (RDL 5/2015)",
    articulo: "63",
    patron_examen: "perdida_condicion",
    trampa_tipica: "confundir situaciones administrativas con pérdida de condición",
    nivel: "alto",
    nota_preparador: "Separación del servicio = pérdida; excedencia no.",
    pattern_source: "AGE-Admin (patrón pérdida condición)"
  }
];

export default ebepQuestions;
