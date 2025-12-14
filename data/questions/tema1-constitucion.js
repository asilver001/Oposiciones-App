/**
 * Tema 1: Constitución Española
 * Preguntas sobre principios generales, derechos y deberes, Corona, Cortes, Gobierno, etc.
 */

export const tema1Questions = [
  // ========== PRINCIPIOS GENERALES ==========
  {
    id: 1, topic: 1, subtopic: "Principios generales",
    question: "¿En qué año se aprobó la Constitución Española vigente?",
    options: [
      { id: 'a', text: '1976' },
      { id: 'b', text: '1978' },
      { id: 'c', text: '1979' },
      { id: 'd', text: '1977' }
    ],
    correct: 'b',
    explanation: "La Constitución Española fue aprobada por las Cortes Generales el 31 de octubre de 1978, ratificada por referéndum el 6 de diciembre de 1978 y sancionada por el Rey el 27 de diciembre de 1978."
  },
  {
    id: 2, topic: 1, subtopic: "Principios generales",
    question: "¿Cuál es la forma política del Estado español según la Constitución?",
    options: [
      { id: 'a', text: 'República parlamentaria' },
      { id: 'b', text: 'Monarquía absoluta' },
      { id: 'c', text: 'Monarquía parlamentaria' },
      { id: 'd', text: 'Estado federal' }
    ],
    correct: 'c',
    explanation: "Según el artículo 1.3 de la Constitución Española, 'La forma política del Estado español es la Monarquía parlamentaria'."
  },
  {
    id: 3, topic: 1, subtopic: "Estructura",
    question: "¿Cuántos artículos tiene la Constitución Española?",
    options: [
      { id: 'a', text: '169 artículos' },
      { id: 'b', text: '165 artículos' },
      { id: 'c', text: '150 artículos' },
      { id: 'd', text: '180 artículos' }
    ],
    correct: 'a',
    explanation: "La Constitución Española consta de 169 artículos, distribuidos en un Título Preliminar y diez Títulos, además de disposiciones adicionales, transitorias, una derogatoria y una final."
  },
  {
    id: 4, topic: 1, subtopic: "Reforma constitucional",
    question: "¿Qué mayoría se necesita en el Congreso para reformar la Constitución en el procedimiento ordinario?",
    options: [
      { id: 'a', text: 'Mayoría simple' },
      { id: 'b', text: 'Mayoría absoluta' },
      { id: 'c', text: 'Tres quintos' },
      { id: 'd', text: 'Dos tercios' }
    ],
    correct: 'c',
    explanation: "Según el artículo 167 de la Constitución, la reforma requerirá la aprobación por una mayoría de tres quintos de cada una de las Cámaras."
  },
  {
    id: 5, topic: 1, subtopic: "Derechos fundamentales",
    question: "¿Cuál de los siguientes NO es un derecho fundamental reconocido en la Sección 1ª del Capítulo II del Título I?",
    options: [
      { id: 'a', text: 'Derecho a la vida' },
      { id: 'b', text: 'Derecho a la educación' },
      { id: 'c', text: 'Derecho al trabajo' },
      { id: 'd', text: 'Libertad ideológica' }
    ],
    correct: 'c',
    explanation: "El derecho al trabajo (art. 35) no está en la Sección 1ª sino en la Sección 2ª del Capítulo II. Los derechos de la Sección 1ª gozan de mayor protección constitucional."
  },
  {
    id: 6, topic: 1, subtopic: "Principios generales",
    question: "Según el artículo 1.1 de la Constitución, España se constituye en un Estado social y democrático de Derecho que propugna como valores superiores:",
    options: [
      { id: 'a', text: 'La libertad, la justicia, la igualdad y el pluralismo político' },
      { id: 'b', text: 'La libertad, la justicia, la solidaridad y el pluralismo político' },
      { id: 'c', text: 'La libertad, la seguridad, la igualdad y el pluralismo político' },
      { id: 'd', text: 'La libertad, la justicia, la igualdad y la solidaridad' }
    ],
    correct: 'a',
    explanation: "El artículo 1.1 establece textualmente estos cuatro valores superiores del ordenamiento jurídico español."
  },
  {
    id: 7, topic: 1, subtopic: "Principios generales",
    question: "¿En qué artículo de la Constitución se establece que la soberanía nacional reside en el pueblo español?",
    options: [
      { id: 'a', text: 'Artículo 1.1' },
      { id: 'b', text: 'Artículo 1.2' },
      { id: 'c', text: 'Artículo 2' },
      { id: 'd', text: 'Artículo 3' }
    ],
    correct: 'b',
    explanation: "El artículo 1.2 establece que 'La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado'."
  },
  {
    id: 8, topic: 1, subtopic: "Lenguas",
    question: "Según la Constitución, ¿cuál es la lengua oficial del Estado?",
    options: [
      { id: 'a', text: 'El español y las lenguas cooficiales' },
      { id: 'b', text: 'El castellano' },
      { id: 'c', text: 'El español' },
      { id: 'd', text: 'Todas las lenguas de España' }
    ],
    correct: 'b',
    explanation: "El artículo 3.1 establece que 'El castellano es la lengua española oficial del Estado. Todos los españoles tienen el deber de conocerla y el derecho a usarla'."
  },
  {
    id: 9, topic: 1, subtopic: "Símbolos",
    question: "¿Cuáles son los colores de la bandera de España según la Constitución?",
    options: [
      { id: 'a', text: 'Roja, amarilla, roja' },
      { id: 'b', text: 'Roja, gualda, roja' },
      { id: 'c', text: 'Roja, amarilla y gualda' },
      { id: 'd', text: 'Amarilla, roja, amarilla' }
    ],
    correct: 'a',
    explanation: "El artículo 4.1 establece que 'La bandera de España está formada por tres franjas horizontales, roja, amarilla y roja, siendo la amarilla de doble anchura que cada una de las rojas'."
  },
  {
    id: 10, topic: 1, subtopic: "Capital",
    question: "¿Dónde se establece que Madrid es la capital del Estado?",
    options: [
      { id: 'a', text: 'En el artículo 4 de la Constitución' },
      { id: 'b', text: 'En el artículo 5 de la Constitución' },
      { id: 'c', text: 'En una Ley Orgánica' },
      { id: 'd', text: 'En el Estatuto de Autonomía de Madrid' }
    ],
    correct: 'b',
    explanation: "El artículo 5 de la Constitución establece que 'La capital del Estado es la villa de Madrid'."
  },
  {
    id: 11, topic: 1, subtopic: "Partidos políticos",
    question: "Según el artículo 6 de la Constitución, los partidos políticos:",
    options: [
      { id: 'a', text: 'Son el único instrumento de participación política' },
      { id: 'b', text: 'Expresan el pluralismo político y son instrumento fundamental para la participación política' },
      { id: 'c', text: 'Son organizaciones de derecho privado sin relevancia constitucional' },
      { id: 'd', text: 'Deben ser autorizados por el Gobierno' }
    ],
    correct: 'b',
    explanation: "El artículo 6 establece que los partidos políticos expresan el pluralismo político, concurren a la formación y manifestación de la voluntad popular y son instrumento fundamental para la participación política."
  },
  {
    id: 12, topic: 1, subtopic: "Sindicatos",
    question: "¿Qué artículo de la Constitución reconoce el derecho a la libre sindicación?",
    options: [
      { id: 'a', text: 'Artículo 7' },
      { id: 'b', text: 'Artículo 28' },
      { id: 'c', text: 'Artículo 37' },
      { id: 'd', text: 'Los artículos 7 y 28' }
    ],
    correct: 'd',
    explanation: "El artículo 7 reconoce a los sindicatos y el artículo 28.1 desarrolla el derecho a la libre sindicación como derecho fundamental."
  },
  // ========== DERECHOS Y DEBERES ==========
  {
    id: 13, topic: 1, subtopic: "Derechos fundamentales",
    question: "La mayoría de edad en España se alcanza a los:",
    options: [
      { id: 'a', text: '16 años' },
      { id: 'b', text: '18 años' },
      { id: 'c', text: '21 años' },
      { id: 'd', text: 'Depende de cada Comunidad Autónoma' }
    ],
    correct: 'b',
    explanation: "El artículo 12 de la Constitución establece que 'Los españoles son mayores de edad a los dieciocho años'."
  },
  {
    id: 14, topic: 1, subtopic: "Derechos fundamentales",
    question: "El derecho a la vida está reconocido en el artículo:",
    options: [
      { id: 'a', text: 'Artículo 10' },
      { id: 'b', text: 'Artículo 14' },
      { id: 'c', text: 'Artículo 15' },
      { id: 'd', text: 'Artículo 17' }
    ],
    correct: 'c',
    explanation: "El artículo 15 establece que 'Todos tienen derecho a la vida y a la integridad física y moral, sin que, en ningún caso, puedan ser sometidos a tortura ni a penas o tratos inhumanos o degradantes'."
  },
  {
    id: 15, topic: 1, subtopic: "Derechos fundamentales",
    question: "¿Cuál es el plazo máximo de detención preventiva según la Constitución?",
    options: [
      { id: 'a', text: '24 horas' },
      { id: 'b', text: '48 horas' },
      { id: 'c', text: '72 horas' },
      { id: 'd', text: '96 horas' }
    ],
    correct: 'c',
    explanation: "El artículo 17.2 establece que la detención preventiva no podrá durar más del tiempo estrictamente necesario y, en todo caso, en el plazo máximo de setenta y dos horas."
  },
  {
    id: 16, topic: 1, subtopic: "Derechos fundamentales",
    question: "El derecho al honor, a la intimidad personal y familiar y a la propia imagen está recogido en:",
    options: [
      { id: 'a', text: 'Artículo 15' },
      { id: 'b', text: 'Artículo 18' },
      { id: 'c', text: 'Artículo 20' },
      { id: 'd', text: 'Artículo 24' }
    ],
    correct: 'b',
    explanation: "El artículo 18.1 garantiza el derecho al honor, a la intimidad personal y familiar y a la propia imagen."
  },
  {
    id: 17, topic: 1, subtopic: "Derechos fundamentales",
    question: "¿Qué requisitos son necesarios para entrar en un domicilio sin consentimiento del titular?",
    options: [
      { id: 'a', text: 'Solo autorización judicial' },
      { id: 'b', text: 'Autorización judicial o flagrante delito' },
      { id: 'c', text: 'Consentimiento del titular, resolución judicial o flagrante delito' },
      { id: 'd', text: 'Orden del Ministerio Fiscal' }
    ],
    correct: 'c',
    explanation: "El artículo 18.2 establece que el domicilio es inviolable y que ninguna entrada o registro podrá hacerse sin consentimiento del titular o resolución judicial, salvo en caso de flagrante delito."
  },
  {
    id: 18, topic: 1, subtopic: "Derechos fundamentales",
    question: "¿En qué artículo se reconoce el derecho de reunión pacífica y sin armas?",
    options: [
      { id: 'a', text: 'Artículo 20' },
      { id: 'b', text: 'Artículo 21' },
      { id: 'c', text: 'Artículo 22' },
      { id: 'd', text: 'Artículo 23' }
    ],
    correct: 'b',
    explanation: "El artículo 21 reconoce el derecho de reunión pacífica y sin armas, sin necesidad de autorización previa."
  },
  {
    id: 19, topic: 1, subtopic: "Derechos fundamentales",
    question: "El derecho de petición está regulado en:",
    options: [
      { id: 'a', text: 'Artículo 23' },
      { id: 'b', text: 'Artículo 27' },
      { id: 'c', text: 'Artículo 29' },
      { id: 'd', text: 'Artículo 30' }
    ],
    correct: 'c',
    explanation: "El artículo 29 reconoce el derecho de petición individual y colectiva, por escrito, en la forma y con los efectos que determine la ley."
  },
  {
    id: 20, topic: 1, subtopic: "Deberes constitucionales",
    question: "Según el artículo 30 de la Constitución, ¿cuál es el deber y derecho de los españoles?",
    options: [
      { id: 'a', text: 'Trabajar' },
      { id: 'b', text: 'Defender a España' },
      { id: 'c', text: 'Pagar impuestos' },
      { id: 'd', text: 'Votar en las elecciones' }
    ],
    correct: 'b',
    explanation: "El artículo 30.1 establece que 'Los españoles tienen el derecho y el deber de defender a España'."
  },
  // ========== LA CORONA ==========
  {
    id: 21, topic: 1, subtopic: "La Corona",
    question: "¿Cuál es el Título de la Constitución dedicado a la Corona?",
    options: [
      { id: 'a', text: 'Título I' },
      { id: 'b', text: 'Título II' },
      { id: 'c', text: 'Título III' },
      { id: 'd', text: 'Título Preliminar' }
    ],
    correct: 'b',
    explanation: "El Título II de la Constitución Española está dedicado a la Corona (artículos 56 a 65)."
  },
  {
    id: 22, topic: 1, subtopic: "La Corona",
    question: "Según la Constitución, el Rey:",
    options: [
      { id: 'a', text: 'Tiene poder ejecutivo' },
      { id: 'b', text: 'Arbitra y modera el funcionamiento regular de las instituciones' },
      { id: 'c', text: 'Puede vetar las leyes aprobadas por las Cortes' },
      { id: 'd', text: 'Nombra libremente a los ministros' }
    ],
    correct: 'b',
    explanation: "El artículo 56.1 establece que el Rey arbitra y modera el funcionamiento regular de las instituciones, asume la más alta representación del Estado y ejerce las funciones que le atribuyen expresamente la Constitución y las leyes."
  },
  {
    id: 23, topic: 1, subtopic: "La Corona",
    question: "¿Quién refrenda los actos del Rey?",
    options: [
      { id: 'a', text: 'Solo el Presidente del Gobierno' },
      { id: 'b', text: 'El Presidente del Congreso' },
      { id: 'c', text: 'El Presidente del Gobierno, los Ministros competentes y el Presidente del Congreso en casos determinados' },
      { id: 'd', text: 'El Consejo de Ministros' }
    ],
    correct: 'c',
    explanation: "El artículo 64 establece que los actos del Rey serán refrendados por el Presidente del Gobierno y, en su caso, por los Ministros competentes. El Presidente del Congreso refrenda la propuesta y nombramiento del Presidente del Gobierno y la disolución prevista en el artículo 99."
  },
  // ========== CORTES GENERALES ==========
  {
    id: 24, topic: 1, subtopic: "Cortes Generales",
    question: "Las Cortes Generales están formadas por:",
    options: [
      { id: 'a', text: 'El Congreso de los Diputados únicamente' },
      { id: 'b', text: 'El Congreso de los Diputados y el Senado' },
      { id: 'c', text: 'El Senado únicamente' },
      { id: 'd', text: 'El Congreso, el Senado y el Consejo de Estado' }
    ],
    correct: 'b',
    explanation: "El artículo 66.1 establece que 'Las Cortes Generales representan al pueblo español y están formadas por el Congreso de los Diputados y el Senado'."
  },
  {
    id: 25, topic: 1, subtopic: "Cortes Generales",
    question: "¿Cuántos diputados pueden componer el Congreso según la Constitución?",
    options: [
      { id: 'a', text: 'Entre 300 y 400' },
      { id: 'b', text: 'Entre 350 y 400' },
      { id: 'c', text: 'Exactamente 350' },
      { id: 'd', text: 'Entre 300 y 350' }
    ],
    correct: 'a',
    explanation: "El artículo 68.1 establece que el Congreso se compone de un mínimo de 300 y un máximo de 400 Diputados. Actualmente, por ley, son 350."
  },
  {
    id: 26, topic: 1, subtopic: "Cortes Generales",
    question: "¿Cuál es la duración del mandato de los Diputados y Senadores?",
    options: [
      { id: 'a', text: '3 años' },
      { id: 'b', text: '4 años' },
      { id: 'c', text: '5 años' },
      { id: 'd', text: '6 años' }
    ],
    correct: 'b',
    explanation: "Los artículos 68.4 y 69.6 establecen que el Congreso y el Senado son elegidos por cuatro años."
  },
  {
    id: 27, topic: 1, subtopic: "Cortes Generales",
    question: "El Senado es, según la Constitución:",
    options: [
      { id: 'a', text: 'La Cámara de representación territorial' },
      { id: 'b', text: 'La Cámara Alta' },
      { id: 'c', text: 'La Cámara de segunda lectura' },
      { id: 'd', text: 'La Cámara de control del Gobierno' }
    ],
    correct: 'a',
    explanation: "El artículo 69.1 establece que 'El Senado es la Cámara de representación territorial'."
  },
  // ========== EL GOBIERNO ==========
  {
    id: 28, topic: 1, subtopic: "El Gobierno",
    question: "¿Qué Título de la Constitución regula el Gobierno y la Administración?",
    options: [
      { id: 'a', text: 'Título III' },
      { id: 'b', text: 'Título IV' },
      { id: 'c', text: 'Título V' },
      { id: 'd', text: 'Título VI' }
    ],
    correct: 'b',
    explanation: "El Título IV de la Constitución está dedicado al Gobierno y la Administración (artículos 97 a 107)."
  },
  {
    id: 29, topic: 1, subtopic: "El Gobierno",
    question: "Según el artículo 97, el Gobierno dirige:",
    options: [
      { id: 'a', text: 'La política interior y exterior' },
      { id: 'b', text: 'La política interior, exterior, la Administración civil y militar y la defensa del Estado' },
      { id: 'c', text: 'Solo la Administración del Estado' },
      { id: 'd', text: 'Las Fuerzas Armadas exclusivamente' }
    ],
    correct: 'b',
    explanation: "El artículo 97 establece que 'El Gobierno dirige la política interior y exterior, la Administración civil y militar y la defensa del Estado. Ejerce la función ejecutiva y la potestad reglamentaria'."
  },
  {
    id: 30, topic: 1, subtopic: "El Gobierno",
    question: "¿Quién propone al Rey el nombramiento del Presidente del Gobierno?",
    options: [
      { id: 'a', text: 'El Congreso de los Diputados' },
      { id: 'b', text: 'El Senado' },
      { id: 'c', text: 'El Presidente del Congreso' },
      { id: 'd', text: 'El candidato que obtenga más votos' }
    ],
    correct: 'a',
    explanation: "Según el artículo 99, tras las consultas con los representantes designados por los grupos políticos con representación parlamentaria, el Rey propone un candidato y el Congreso de los Diputados otorga su confianza."
  },
  // ========== TRIBUNAL CONSTITUCIONAL ==========
  {
    id: 31, topic: 1, subtopic: "Tribunal Constitucional",
    question: "¿Cuántos miembros componen el Tribunal Constitucional?",
    options: [
      { id: 'a', text: '10 miembros' },
      { id: 'b', text: '12 miembros' },
      { id: 'c', text: '15 miembros' },
      { id: 'd', text: '20 miembros' }
    ],
    correct: 'b',
    explanation: "El artículo 159.1 establece que el Tribunal Constitucional se compone de 12 miembros nombrados por el Rey."
  },
  {
    id: 32, topic: 1, subtopic: "Tribunal Constitucional",
    question: "Los miembros del Tribunal Constitucional son propuestos por:",
    options: [
      { id: 'a', text: '4 por el Congreso, 4 por el Senado, 2 por el Gobierno y 2 por el CGPJ' },
      { id: 'b', text: '6 por el Congreso y 6 por el Senado' },
      { id: 'c', text: '4 por las Cortes, 4 por el Gobierno y 4 por el CGPJ' },
      { id: 'd', text: 'Todos por el Congreso de los Diputados' }
    ],
    correct: 'a',
    explanation: "El artículo 159.1 establece que de los 12 miembros, 4 son propuestos por el Congreso, 4 por el Senado, 2 por el Gobierno y 2 por el Consejo General del Poder Judicial."
  },
  {
    id: 33, topic: 1, subtopic: "Tribunal Constitucional",
    question: "¿Cuál es la duración del mandato de los magistrados del Tribunal Constitucional?",
    options: [
      { id: 'a', text: '6 años' },
      { id: 'b', text: '9 años' },
      { id: 'c', text: '12 años' },
      { id: 'd', text: 'Vitalicio' }
    ],
    correct: 'b',
    explanation: "El artículo 159.3 establece que los miembros del Tribunal Constitucional serán designados por un período de nueve años y se renovarán por terceras partes cada tres."
  },
  // ========== REFORMA CONSTITUCIONAL Y OTROS ==========
  {
    id: 46, topic: 1, subtopic: "Reforma constitucional",
    question: "¿Qué procedimiento requiere la reforma del Título Preliminar de la Constitución?",
    options: [
      { id: 'a', text: 'Procedimiento ordinario del artículo 167' },
      { id: 'b', text: 'Procedimiento agravado del artículo 168' },
      { id: 'c', text: 'Solo mayoría absoluta' },
      { id: 'd', text: 'No puede reformarse' }
    ],
    correct: 'b',
    explanation: "El artículo 168 establece un procedimiento agravado para la revisión total de la Constitución o parcial que afecte al Título Preliminar, al Capítulo II, Sección 1ª del Título I, o al Título II."
  },
  {
    id: 47, topic: 1, subtopic: "Suspensión de derechos",
    question: "¿Qué derechos pueden suspenderse durante un estado de excepción?",
    options: [
      { id: 'a', text: 'Todos los derechos fundamentales' },
      { id: 'b', text: 'Solo el derecho de reunión' },
      { id: 'c', text: 'Los señalados en el artículo 55.1 de la Constitución' },
      { id: 'd', text: 'Ninguno puede suspenderse' }
    ],
    correct: 'c',
    explanation: "El artículo 55.1 enumera los derechos que pueden ser suspendidos cuando se acuerde la declaración del estado de excepción o de sitio."
  },
  {
    id: 50, topic: 1, subtopic: "Derechos fundamentales",
    question: "¿Qué recurso específico protege los derechos fundamentales ante el Tribunal Constitucional?",
    options: [
      { id: 'a', text: 'Recurso de inconstitucionalidad' },
      { id: 'b', text: 'Recurso de amparo' },
      { id: 'c', text: 'Cuestión de inconstitucionalidad' },
      { id: 'd', text: 'Conflicto de competencias' }
    ],
    correct: 'b',
    explanation: "El recurso de amparo constitucional es el instrumento procesal específico para la tutela de los derechos fundamentales ante el Tribunal Constitucional, regulado en el artículo 53.2 de la Constitución."
  },
  {
    id: 51, topic: 1, subtopic: "Principios generales",
    question: "¿Qué artículo de la Constitución establece el principio de legalidad de la Administración?",
    options: [
      { id: 'a', text: 'Artículo 9.1' },
      { id: 'b', text: 'Artículo 9.3' },
      { id: 'c', text: 'Artículo 103' },
      { id: 'd', text: 'Artículo 106' }
    ],
    correct: 'c',
    explanation: "El artículo 103.1 establece que 'La Administración Pública sirve con objetividad los intereses generales y actúa de acuerdo con los principios de eficacia, jerarquía, descentralización, desconcentración y coordinación, con sometimiento pleno a la ley y al Derecho'."
  },
  {
    id: 52, topic: 1, subtopic: "Derechos fundamentales",
    question: "El derecho a la tutela judicial efectiva está recogido en:",
    options: [
      { id: 'a', text: 'Artículo 17' },
      { id: 'b', text: 'Artículo 24' },
      { id: 'c', text: 'Artículo 25' },
      { id: 'd', text: 'Artículo 117' }
    ],
    correct: 'b',
    explanation: "El artículo 24.1 establece que 'Todas las personas tienen derecho a obtener la tutela efectiva de los jueces y tribunales en el ejercicio de sus derechos e intereses legítimos, sin que, en ningún caso, pueda producirse indefensión'."
  },
  {
    id: 54, topic: 1, subtopic: "Derechos fundamentales",
    question: "¿Cuál de los siguientes derechos NO está incluido en la Sección 1ª del Capítulo II del Título I?",
    options: [
      { id: 'a', text: 'Derecho a la libertad ideológica' },
      { id: 'b', text: 'Derecho a la propiedad privada' },
      { id: 'c', text: 'Derecho a la educación' },
      { id: 'd', text: 'Derecho de asociación' }
    ],
    correct: 'b',
    explanation: "El derecho a la propiedad privada está regulado en el artículo 33, que pertenece a la Sección 2ª del Capítulo II, no a la Sección 1ª de derechos fundamentales y libertades públicas."
  }
];

export default tema1Questions;
