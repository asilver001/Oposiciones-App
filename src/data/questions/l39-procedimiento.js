/**
 * Categoría: L39 - Ley 39/2015 del Procedimiento Administrativo Común
 * Preguntas con metadatos para preparadores
 */

export const l39Questions = [
  {
    id: "ADM-2011",
    categoria: "L39",
    topic: 3,
    question: "Conforme al artículo 74 de la Ley 39/2015, las cuestiones incidentales que se susciten en un procedimiento:",
    options: [
      { id: 'a', text: "Suspenderán siempre la tramitación del procedimiento." },
      { id: 'b', text: "No suspenderán la tramitación del procedimiento en ningún caso." },
      { id: 'c', text: "Suspenderán la tramitación del procedimiento, salvo la recusación." },
      { id: 'd', text: "No suspenderán la tramitación del procedimiento, salvo la recusación." }
    ],
    correct: "d",
    explanation: "Regla: no suspenden; excepción: la recusación sí suspende.",
    ley: "Ley 39/2015",
    articulo: "74",
    patron_examen: "cuestiones_incidentales_recusacion",
    trampa_tipica: "invertir la excepción de la recusación",
    nivel: "alto",
    nota_preparador: "Regla: no suspenden; excepción: la recusación sí suspende.",
    pattern_source: "Promo-Interna-Admin (patrón art.74)"
  },
  {
    id: "ADM-2012",
    categoria: "L39",
    topic: 3,
    question: "Según la Ley 39/2015, contra las disposiciones administrativas de carácter general:",
    options: [
      { id: 'a', text: "No cabe recurso en vía administrativa." },
      { id: 'b', text: "Cabe recurso de alzada en todo caso." },
      { id: 'c', text: "Cabe recurso potestativo de reposición." },
      { id: 'd', text: "Solo cabe recurso extraordinario de revisión." }
    ],
    correct: "a",
    explanation: "Se impugnan directamente en vía contenciosa (regla del examen).",
    ley: "Ley 39/2015",
    articulo: "112-113 (régimen general)",
    patron_examen: "disposiciones_generales_sin_recurso_administrativo",
    trampa_tipica: "creer que cabe reposición por ser potestativo",
    nivel: "alto",
    nota_preparador: "Se impugnan directamente en vía contenciosa (regla del examen).",
    pattern_source: "Promo-Interna-Admin (patrón disposiciones generales)"
  },
  {
    id: "ADM-2013",
    categoria: "L39",
    topic: 3,
    question: "De acuerdo con el artículo 114 de la Ley 39/2015, ponen fin a la vía administrativa:",
    options: [
      { id: 'a', text: "Las resoluciones de los recursos de alzada." },
      { id: 'b', text: "Las resoluciones de los recursos de reposición." },
      { id: 'c', text: "Las resoluciones de órganos administrativos, salvo que una Ley establezca lo contrario." },
      { id: 'd', text: "Los acuerdos, pactos o convenios que no tengan la consideración de finalizadores del procedimiento." }
    ],
    correct: "b",
    explanation: "La alzada NO pone fin; la reposición sí (porque ya es contra acto que pone fin).",
    ley: "Ley 39/2015",
    articulo: "114",
    patron_examen: "fin_via_administrativa",
    trampa_tipica: "marcar alzada por intuición",
    nivel: "alto",
    nota_preparador: "La alzada NO pone fin; la reposición sí (porque ya es contra acto que pone fin).",
    pattern_source: "Promo-Interna-Admin (patrón art.114)"
  },
  {
    id: "ADM-2014",
    categoria: "L39",
    topic: 3,
    question: "Con arreglo a la Ley 39/2015, salvo que reste menos para su tramitación ordinaria, ¿en qué plazo deberán resolverse los procedimientos tramitados de manera simplificada, contado desde el día siguiente a la notificación del acuerdo de tramitación simplificada?",
    options: [
      { id: 'a', text: "10 días" },
      { id: 'b', text: "30 días" },
      { id: 'c', text: "45 días" },
      { id: 'd', text: "3 meses" }
    ],
    correct: "b",
    explanation: "El examen suele jugar con el dies a quo.",
    ley: "Ley 39/2015",
    articulo: "96 (tramitación simplificada)",
    patron_examen: "procedimiento_simplificado_plazo",
    trampa_tipica: "distinguir 'desde notificación' vs 'desde el siguiente'",
    nivel: "alto",
    nota_preparador: "El examen suele jugar con el dies a quo.",
    pattern_source: "AGE-Admin (patrón tramitación simplificada)"
  },
  {
    id: "ADM-2015",
    categoria: "L39",
    topic: 3,
    question: "Señale la opción correcta: son nulos de pleno derecho, entre otros, los actos administrativos que:",
    options: [
      { id: 'a', text: "Establezcan retroactividad de disposiciones sancionadoras favorables." },
      { id: 'b', text: "Sean dictados por órgano manifiestamente competente por razón de la materia o del territorio." },
      { id: 'c', text: "Tengan un contenido imposible." },
      { id: 'd', text: "Vulneren disposiciones administrativas de rango inferior." }
    ],
    correct: "c",
    explanation: "Contenido imposible = nulidad. Ojo con opciones que suenan jurídicas.",
    ley: "Ley 39/2015",
    articulo: "47.1",
    patron_examen: "nulidad_contenido_imposible",
    trampa_tipica: "confundir nulidad con invalidez por infracción jerárquica",
    nivel: "alto",
    nota_preparador: "Contenido imposible = nulidad. Ojo con opciones que suenan jurídicas.",
    pattern_source: "AGE-Admin (patrón nulidad 47.1)"
  },
  {
    id: "ADM-2016",
    categoria: "L39",
    topic: 3,
    question: "En los procedimientos iniciados a solicitud del interesado, si se produce su paralización por causa imputable al mismo, ¿cuánto tiempo debe transcurrir para que se produzca la caducidad del procedimiento?",
    options: [
      { id: 'a', text: "2 meses" },
      { id: 'b', text: "3 meses" },
      { id: 'c', text: "6 meses" },
      { id: 'd', text: "12 meses" }
    ],
    correct: "b",
    explanation: "Clásica de examen: 3 meses por causa imputable al interesado.",
    ley: "Ley 39/2015",
    articulo: "95 (caducidad)",
    patron_examen: "caducidad_por_paralizacion_interesado",
    trampa_tipica: "confundir con plazos máximos de resolución",
    nivel: "alto",
    nota_preparador: "Clásica de examen: 3 meses por causa imputable al interesado.",
    pattern_source: "Promo-Interna-Admin (patrón caducidad 3 meses)"
  },
  {
    id: "ADM-2017",
    categoria: "L39",
    topic: 3,
    question: "En el cómputo de plazos por días en la Ley 39/2015, salvo que por Ley o por el Derecho de la Unión Europea se exprese otro criterio, se entiende que los días son:",
    options: [
      { id: 'a', text: "Naturales" },
      { id: 'b', text: "Hábiles" },
      { id: 'c', text: "Laborables" },
      { id: 'd', text: "Lectivos" }
    ],
    correct: "b",
    explanation: "Regla general: días = hábiles.",
    ley: "Ley 39/2015",
    articulo: "30.2",
    patron_examen: "computo_plazos_dias",
    trampa_tipica: "automatismo de 'naturales'",
    nivel: "alto",
    nota_preparador: "Regla general: días = hábiles.",
    pattern_source: "Promo-Interna-Admin (patrón cómputo)"
  },
  {
    id: "ADM-2018",
    categoria: "L39",
    topic: 3,
    question: "Cuando los plazos se señalen por meses o años, según la Ley 39/2015, éstos se computarán:",
    options: [
      { id: 'a', text: "Por días hábiles" },
      { id: 'b', text: "Por días naturales" },
      { id: 'c', text: "De fecha a fecha" },
      { id: 'd', text: "Excluyendo del cómputo los sábados" }
    ],
    correct: "c",
    explanation: "La trampa del sábado aparece en exámenes.",
    ley: "Ley 39/2015",
    articulo: "30.4",
    patron_examen: "computo_meses_anos",
    trampa_tipica: "mezclar con regla de días y sábados",
    nivel: "alto",
    nota_preparador: "La trampa del sábado aparece en exámenes.",
    pattern_source: "Promo-Interna-Admin (patrón cómputo meses)"
  },
  {
    id: "ADM-2019",
    categoria: "L39",
    topic: 3,
    question: "Conforme a la Ley 39/2015, ¿cuál de las siguientes afirmaciones es correcta respecto a las notificaciones?",
    options: [
      { id: 'a', text: "Se practicarán siempre por comparecencia presencial." },
      { id: 'b', text: "Se practicarán preferentemente por medios electrónicos." },
      { id: 'c', text: "Se practicarán exclusivamente mediante publicación en diario oficial." },
      { id: 'd', text: "No es posible la notificación electrónica si el interesado no dispone de firma electrónica cualificada." }
    ],
    correct: "b",
    explanation: "Preferencia electrónica no implica siempre exclusividad.",
    ley: "Ley 39/2015",
    articulo: "41",
    patron_examen: "notificaciones_regla_general",
    trampa_tipica: "confundir preferencia con exclusividad",
    nivel: "medio",
    nota_preparador: "Preferencia electrónica no implica siempre exclusividad.",
    pattern_source: "AGE-Admin (patrón notificaciones)"
  },
  {
    id: "ADM-2020",
    categoria: "L39",
    topic: 3,
    question: "En relación con el recurso de alzada, señale la opción correcta:",
    options: [
      { id: 'a', text: "Se interpone ante el mismo órgano que dictó el acto." },
      { id: 'b', text: "Se interpone ante el órgano superior jerárquico del que dictó el acto." },
      { id: 'c', text: "Pone fin a la vía administrativa siempre." },
      { id: 'd', text: "Su plazo de interposición frente a acto expreso es de 3 meses." }
    ],
    correct: "b",
    explanation: "Alzada: superior; plazo típico acto expreso: 1 mes.",
    ley: "Ley 39/2015",
    articulo: "121",
    patron_examen: "alzada_organo_plazo_efectos",
    trampa_tipica: "confundir con reposición (mismo órgano) y con plazos",
    nivel: "alto",
    nota_preparador: "Alzada: superior; plazo típico acto expreso: 1 mes.",
    pattern_source: "Promo-Interna-Admin (patrón recursos)"
  },
  {
    id: "ADM-2021",
    categoria: "L39",
    topic: 3,
    question: "Respecto al recurso potestativo de reposición, indique la afirmación correcta:",
    options: [
      { id: 'a', text: "Se interpone ante el órgano superior jerárquico." },
      { id: 'b', text: "Su resolución pone fin a la vía administrativa." },
      { id: 'c', text: "Su plazo de resolución es de 3 meses." },
      { id: 'd', text: "Es preceptivo antes de acudir a la jurisdicción contencioso-administrativa." }
    ],
    correct: "b",
    explanation: "Es potestativo; no es requisito obligatorio.",
    ley: "Ley 39/2015",
    articulo: "123-124",
    patron_examen: "reposicion_caracteristicas",
    trampa_tipica: "confundir reposición con alzada y con requisitos de procedibilidad",
    nivel: "alto",
    nota_preparador: "Es potestativo; no es requisito obligatorio.",
    pattern_source: "Promo-Interna-Admin (patrón recursos)"
  },
  {
    id: "ADM-2022",
    categoria: "L39",
    topic: 3,
    question: "En la ejecución forzosa, ¿cuál de las siguientes NO es un medio de ejecución previsto en la Ley 39/2015?",
    options: [
      { id: 'a', text: "Apremio sobre el patrimonio" },
      { id: 'b', text: "Multa coercitiva" },
      { id: 'c', text: "Ejecución subsidiaria" },
      { id: 'd', text: "Arresto administrativo" }
    ],
    correct: "d",
    explanation: "No hay arresto como medio de ejecución forzosa.",
    ley: "Ley 39/2015",
    articulo: "100",
    patron_examen: "medios_ejecucion_forzosa",
    trampa_tipica: "introducir medidas no previstas en la ley administrativa",
    nivel: "medio",
    nota_preparador: "No hay arresto como medio de ejecución forzosa.",
    pattern_source: "AGE-Admin (patrón ejecución forzosa)"
  },
  {
    id: "ADM-2023",
    categoria: "L39",
    topic: 3,
    question: "Señale la opción correcta sobre la obligación de resolver:",
    options: [
      { id: 'a', text: "La Administración queda exonerada de resolver si opera el silencio administrativo." },
      { id: 'b', text: "La obligación de resolver solo existe en procedimientos iniciados de oficio." },
      { id: 'c', text: "La Administración está obligada a dictar resolución expresa y a notificarla en todos los procedimientos, salvo excepciones legales." },
      { id: 'd', text: "La Administración solo está obligada a resolver si el interesado lo solicita expresamente." }
    ],
    correct: "c",
    explanation: "El silencio no elimina el deber de resolver.",
    ley: "Ley 39/2015",
    articulo: "21",
    patron_examen: "obligacion_resolver",
    trampa_tipica: "pensar que el silencio sustituye la resolución",
    nivel: "medio",
    nota_preparador: "El silencio no elimina el deber de resolver.",
    pattern_source: "AGE-Admin (patrón art.21)"
  },
  {
    id: "ADM-2024",
    categoria: "L39",
    topic: 3,
    question: "Con carácter general, la eficacia de un acto administrativo queda supeditada a:",
    options: [
      { id: 'a', text: "Su inscripción registral" },
      { id: 'b', text: "Su notificación o publicación cuando proceda" },
      { id: 'c', text: "La aceptación del interesado" },
      { id: 'd', text: "La aprobación por el órgano superior" }
    ],
    correct: "b",
    explanation: "Muy típica: validez ≠ eficacia.",
    ley: "Ley 39/2015",
    articulo: "39-40",
    patron_examen: "validez_vs_eficacia",
    trampa_tipica: "confundir eficacia con validez",
    nivel: "alto",
    nota_preparador: "Muy típica: validez ≠ eficacia.",
    pattern_source: "AGE-Admin (patrón efectos del acto)"
  },
  {
    id: "ADM-2025",
    categoria: "L39",
    topic: 3,
    question: "En materia de representación, señale el medio correcto de acreditación que suele plantear el examen:",
    options: [
      { id: 'a', text: "Exclusivamente mediante escritura pública notarial" },
      { id: 'b', text: "Mediante apoderamiento apud acta" },
      { id: 'c', text: "Solo mediante documento privado sin más requisitos" },
      { id: 'd', text: "No cabe representación en procedimientos administrativos" }
    ],
    correct: "b",
    explanation: "Apud acta es la respuesta-trampa clásica.",
    ley: "Ley 39/2015",
    articulo: "5",
    patron_examen: "representacion_apud_acta",
    trampa_tipica: "sobrevalorar el requisito notarial",
    nivel: "alto",
    nota_preparador: "Apud acta es la respuesta-trampa clásica.",
    pattern_source: "AGE-Admin (patrón representación)"
  }
];

export default l39Questions;
