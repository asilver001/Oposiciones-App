/**
 * Categoría: INF - Informática y TIC
 * Preguntas con metadatos para preparadores
 */

export const infQuestions = [
  {
    id: "ADM-2036",
    categoria: "INF",
    topic: 5,
    question: "Señale la opción verdadera sobre periféricos:",
    options: [
      { id: 'a', text: "El escáner es un periférico de entrada." },
      { id: 'b', text: "La impresora es un periférico de entrada." },
      { id: 'c', text: "La función principal de una tarjeta de red es la impresión." },
      { id: 'd', text: "Linux no admite impresoras." }
    ],
    correct: "a",
    explanation: "Muy típica; solo una es verdadera.",
    ley: "Informática (Windows/Ofimática)",
    articulo: "",
    patron_examen: "perifericos_entrada_salida",
    trampa_tipica: "frases categóricas falsas (Linux no admite)",
    nivel: "alto",
    nota_preparador: "Muy típica; solo una es verdadera.",
    pattern_source: "AGE-Admin (patrón periféricos)"
  },
  {
    id: "ADM-2037",
    categoria: "INF",
    topic: 5,
    question: "¿Cuál de las siguientes opciones corresponde a un sistema operativo?",
    options: [
      { id: 'a', text: "AMD" },
      { id: 'b', text: "PostgreSQL" },
      { id: 'c', text: "macOS" },
      { id: 'd', text: "RJ45" }
    ],
    correct: "c",
    explanation: "Examen clásico de clasificación.",
    ley: "Informática (conceptos)",
    articulo: "",
    patron_examen: "sistema_operativo_identificacion",
    trampa_tipica: "confundir hardware, BD y conectores con SO",
    nivel: "alto",
    nota_preparador: "Examen clásico de clasificación.",
    pattern_source: "AGE-Admin (patrón SO vs otros)"
  },
  {
    id: "ADM-2038",
    categoria: "INF",
    topic: 5,
    question: "¿Cuál de los siguientes programas corresponde a una aplicación ofimática?",
    options: [
      { id: 'a', text: "Windows" },
      { id: 'b', text: "Excel" },
      { id: 'c', text: "MySQL" },
      { id: 'd', text: "Chrome" }
    ],
    correct: "b",
    explanation: "Excel = Office/ofimática.",
    ley: "Informática (Ofimática)",
    articulo: "",
    patron_examen: "ofimatica_identificacion",
    trampa_tipica: "confundir SO y navegador con ofimática",
    nivel: "medio",
    nota_preparador: "Excel = Office/ofimática.",
    pattern_source: "AGE-Admin (patrón ofimática)"
  },
  {
    id: "ADM-2039",
    categoria: "INF",
    topic: 5,
    question: "¿Qué se describe mejor como un documento digital que vincula la identidad del titular con datos para verificación de firma y confirma su identidad?",
    options: [
      { id: 'a', text: "Certificado electrónico de persona física (FNMT u otra AC)" },
      { id: 'b', text: "Certificación HACCP" },
      { id: 'c', text: "Norma ISO 9001" },
      { id: 'd', text: "Número de serie del dispositivo" }
    ],
    correct: "a",
    explanation: "Buscan que identifiques 'certificado electrónico'.",
    ley: "Informática/Administración electrónica",
    articulo: "",
    patron_examen: "certificado_electronico_definicion",
    trampa_tipica: "confundir certificaciones de calidad con certificado digital",
    nivel: "alto",
    nota_preparador: "Buscan que identifiques 'certificado electrónico'.",
    pattern_source: "AGE-Admin (patrón certificado FNMT)"
  },
  {
    id: "ADM-2040",
    categoria: "INF",
    topic: 5,
    question: "Necesitas grabar un tutorial de uso de Windows 10 con pasos y ejemplos de interacción del usuario. ¿Qué herramienta resulta más adecuada en Windows para registrar acciones?",
    options: [
      { id: 'a', text: "Escritorio remoto" },
      { id: 'b', text: "Herramienta Recortes" },
      { id: 'c', text: "Paint" },
      { id: 'd', text: "Grabación de acciones de usuario (Problem Steps Recorder)" }
    ],
    correct: "d",
    explanation: "Recortes captura imagen; la de acciones registra pasos.",
    ley: "Informática (Windows 10)",
    articulo: "",
    patron_examen: "herramientas_windows_captura",
    trampa_tipica: "elegir 'Recortes' por asociación con capturas",
    nivel: "alto",
    nota_preparador: "Recortes captura imagen; la de acciones registra pasos.",
    pattern_source: "AGE-Admin (patrón herramienta tutorial)"
  },
  {
    id: "ADM-2041",
    categoria: "INF",
    topic: 5,
    question: "¿Cuál de las siguientes es una herramienta de accesibilidad de Windows 10 orientada a lectura/voz?",
    options: [
      { id: 'a', text: "Cámara" },
      { id: 'b', text: "Visor XPS" },
      { id: 'c', text: "Narrador" },
      { id: 'd', text: "Sway" }
    ],
    correct: "c",
    explanation: "Narrador es accesibilidad.",
    ley: "Informática (Windows 10)",
    articulo: "",
    patron_examen: "accesibilidad_windows",
    trampa_tipica: "confundir apps de Office/Windows con accesibilidad",
    nivel: "alto",
    nota_preparador: "Narrador es accesibilidad.",
    pattern_source: "AGE-Admin (patrón accesibilidad)"
  },
  {
    id: "ADM-2042",
    categoria: "INF",
    topic: 5,
    question: "En Windows 10 (ES), el atajo de teclado Windows + E sirve para:",
    options: [
      { id: 'a', text: "Abrir el Explorador de archivos" },
      { id: 'b', text: "Minimizar todas las ventanas" },
      { id: 'c', text: "Cambiar entre aplicaciones abiertas" },
      { id: 'd', text: "Maximizar la ventana activa" }
    ],
    correct: "a",
    explanation: "Windows+E = Explorador.",
    ley: "Informática (Windows 10)",
    articulo: "",
    patron_examen: "atajos_teclado",
    trampa_tipica: "mezclar con Windows+D o Alt+Tab",
    nivel: "medio",
    nota_preparador: "Windows+E = Explorador.",
    pattern_source: "AGE-Admin (patrón atajos)"
  },
  {
    id: "ADM-2043",
    categoria: "INF",
    topic: 5,
    question: "Respecto a WordPad en Windows 10, señale la afirmación correcta:",
    options: [
      { id: 'a', text: "Solo guarda en .txt" },
      { id: 'b', text: "Puede guardar en formatos como .rtf y .txt, y otros compatibles según configuración" },
      { id: 'c', text: "Usa un formato propio incompatible con Word" },
      { id: 'd', text: "Solo guarda como imagen (.png/.jpeg)" }
    ],
    correct: "b",
    explanation: "El examen juega con 'solo' para inducir error.",
    ley: "Informática (Windows 10)",
    articulo: "",
    patron_examen: "wordpad_formatos",
    trampa_tipica: "absolutismos ('solo')",
    nivel: "alto",
    nota_preparador: "El examen juega con 'solo' para inducir error.",
    pattern_source: "AGE-Admin (patrón WordPad)"
  },
  {
    id: "ADM-2044",
    categoria: "INF",
    topic: 5,
    question: "Para ver procesos en ejecución y el consumo de CPU y memoria en Windows 10, ¿qué herramienta es la adecuada?",
    options: [
      { id: 'a', text: "Propiedades del disco (C:)" },
      { id: 'b', text: "Visor de eventos" },
      { id: 'c', text: "Administrador de tareas" },
      { id: 'd', text: "Explorador de archivos" }
    ],
    correct: "c",
    explanation: "Task Manager: procesos/rendimiento.",
    ley: "Informática (Windows 10)",
    articulo: "",
    patron_examen: "monitorizacion_sistema",
    trampa_tipica: "confundir eventos con rendimiento",
    nivel: "medio",
    nota_preparador: "Task Manager: procesos/rendimiento.",
    pattern_source: "AGE-Admin (patrón procesos CPU)"
  },
  {
    id: "ADM-2045",
    categoria: "INF",
    topic: 5,
    question: "Trabajas con dos pantallas en Windows 10 y quieres que cada una muestre ventanas diferentes. ¿Qué configuración seleccionas?",
    options: [
      { id: 'a', text: "Duplicar estas pantallas" },
      { id: 'b', text: "Mostrar únicamente en 1" },
      { id: 'c', text: "Extender estas pantallas" },
      { id: 'd', text: "Mostrar únicamente en 2" }
    ],
    correct: "c",
    explanation: "Extender = escritorios en varias pantallas.",
    ley: "Informática (Windows 10)",
    articulo: "",
    patron_examen: "configuracion_pantallas",
    trampa_tipica: "duplicar vs extender",
    nivel: "medio",
    nota_preparador: "Extender = escritorios en varias pantallas.",
    pattern_source: "AGE-Admin (patrón pantallas)"
  },
  {
    id: "ADM-2046",
    categoria: "INF",
    topic: 5,
    question: "En Word 365, ¿qué característica es más adecuada para marcar términos clave y generar un listado con las páginas donde aparecen?",
    options: [
      { id: 'a', text: "Insertar índice" },
      { id: 'b', text: "Insertar nota al final" },
      { id: 'c', text: "Elementos rápidos" },
      { id: 'd', text: "Comentarios" }
    ],
    correct: "a",
    explanation: "Índice (analítico) ≠ tabla de contenido.",
    ley: "Informática (Word 365)",
    articulo: "",
    patron_examen: "word_indice_referencias",
    trampa_tipica: "confundir tabla de contenido con índice analítico",
    nivel: "alto",
    nota_preparador: "Índice (analítico) ≠ tabla de contenido.",
    pattern_source: "AGE-Admin (patrón Word índice)"
  },
  {
    id: "ADM-2047",
    categoria: "INF",
    topic: 5,
    question: "En Word 365, si deseas aplicar formatos preestablecidos para que luego puedas generar una tabla de contenido automáticamente, debes usar:",
    options: [
      { id: 'a', text: "Tamaño de letra" },
      { id: 'b', text: "Espaciado" },
      { id: 'c', text: "Estilos" },
      { id: 'd', text: "Tipo de fuente" }
    ],
    correct: "c",
    explanation: "Los estilos alimentan la tabla de contenido.",
    ley: "Informática (Word 365)",
    articulo: "",
    patron_examen: "word_estilos_toc",
    trampa_tipica: "creer que basta con cambiar tamaño/fuente",
    nivel: "alto",
    nota_preparador: "Los estilos alimentan la tabla de contenido.",
    pattern_source: "AGE-Admin (patrón Word estilos)"
  },
  {
    id: "ADM-2048",
    categoria: "INF",
    topic: 5,
    question: "¿Qué es una dirección IP?",
    options: [
      { id: 'a', text: "La dirección de la página principal de un sitio web" },
      { id: 'b', text: "Un identificador único de un dispositivo en Internet o en una red local" },
      { id: 'c', text: "La dirección física de la sede de una empresa" },
      { id: 'd', text: "Un enlace a la página de inicio de una organización" }
    ],
    correct: "b",
    explanation: "IP identifica dispositivo; URL identifica recurso web.",
    ley: "Informática (Redes)",
    articulo: "",
    patron_examen: "redes_ip_definicion",
    trampa_tipica: "confundir URL con IP",
    nivel: "alto",
    nota_preparador: "IP identifica dispositivo; URL identifica recurso web.",
    pattern_source: "AGE-Admin (patrón IP)"
  },
  {
    id: "ADM-2049",
    categoria: "INF",
    topic: 5,
    question: "¿Qué abreviación corresponde al modelo de servicio en la nube en el que se proporciona software como servicio?",
    options: [
      { id: 'a', text: "SaaS" },
      { id: 'b', text: "ISO" },
      { id: 'c', text: "SAI" },
      { id: 'd', text: "SSD" }
    ],
    correct: "a",
    explanation: "SaaS = Software as a Service.",
    ley: "Informática (Cloud)",
    articulo: "",
    patron_examen: "cloud_saas",
    trampa_tipica: "siglas parecidas",
    nivel: "alto",
    nota_preparador: "SaaS = Software as a Service.",
    pattern_source: "AGE-Admin (patrón SaaS)"
  },
  {
    id: "ADM-2050",
    categoria: "INF",
    topic: 5,
    question: "Para crear una copia de seguridad del sistema y archivos esenciales en una unidad USB, ¿qué herramienta es adecuada en Windows 10?",
    options: [
      { id: 'a', text: "Administrador de equipos" },
      { id: 'b', text: "Servicios" },
      { id: 'c', text: "Unidad de recuperación" },
      { id: 'd', text: "Administrador de tareas" }
    ],
    correct: "c",
    explanation: "Unidad de recuperación crea medios de recuperación/backup del sistema.",
    ley: "Informática (Windows 10)",
    articulo: "",
    patron_examen: "backup_recuperacion",
    trampa_tipica: "elegir Task Manager por familiaridad",
    nivel: "alto",
    nota_preparador: "Unidad de recuperación crea medios de recuperación/backup del sistema.",
    pattern_source: "AGE-Admin (patrón unidad de recuperación)"
  }
];

export default infQuestions;
