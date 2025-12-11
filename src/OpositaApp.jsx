import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Trophy, Clock, TrendingUp, ArrowLeft, CheckCircle, XCircle, Target, Flame, Zap, Star, Lock, Crown, BarChart3, Calendar, History, GraduationCap, Lightbulb, Info } from 'lucide-react';

export default function OpositaApp() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [activeTab, setActiveTab] = useState('inicio');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    examDate: '',
    dailyGoal: 15,
    dailyGoalMinutes: 15,
    accountCreated: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [testResults, setTestResults] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalTrigger, setPremiumModalTrigger] = useState('general');
  const [dailyTestsCount, setDailyTestsCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [lastStudyDate, setLastStudyDate] = useState(null);
  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0,
    lastCompletedDate: null
  });
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [signupFormShownCount, setSignupFormShownCount] = useState(0);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [showStreakBanner, setShowStreakBanner] = useState(true);

  const badges = [
    { id: 1, name: 'Constancia', days: 3, icon: '🔥', color: 'orange' },
    { id: 2, name: 'Compromiso', days: 7, icon: '💪', color: 'red' },
    { id: 3, name: 'Dedicación', days: 14, icon: '⭐', color: 'yellow' },
    { id: 4, name: 'Imparable', days: 30, icon: '🏆', color: 'gold' },
    { id: 5, name: 'Leyenda', days: 100, icon: '👑', color: 'purple' }
  ];

  const [totalStats, setTotalStats] = useState({
    testsCompleted: 0,
    questionsCorrect: 0,
    todayQuestions: 0,
    currentStreak: 0,
    totalDaysStudied: 0,
    accuracyRate: 0,
    weeklyProgress: [12, 15, 10, 15, 20, 8, 0]
  });

  const [topicsProgress, setTopicsProgress] = useState({
    1: { completed: 0, total: 150, streak: 7 },
    2: { completed: 0, total: 120, streak: 0, locked: false },
    3: { completed: 0, total: 200, streak: 0, locked: true },
    4: { completed: 0, total: 180, streak: 0, locked: true }
  });

  const topicsList = [
    { id: 1, title: "Constitución Española", icon: "📖" },
    { id: 2, title: "Organización del Estado", icon: "🏛️" },
    { id: 3, title: "Derecho Administrativo", icon: "⚖️" },
    { id: 4, title: "Administración Pública", icon: "🏢" }
  ];

  // Base de datos de preguntas organizadas por temas
  const allQuestions = [
    // ========== TEMA 1: CONSTITUCIÓN ESPAÑOLA - PRINCIPIOS GENERALES ==========
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
    // ========== TEMA 1: CONSTITUCIÓN ESPAÑOLA - DERECHOS Y DEBERES ==========
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
    // ========== TEMA 1: CONSTITUCIÓN ESPAÑOLA - CORONA ==========
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
    // ========== TEMA 1: CONSTITUCIÓN ESPAÑOLA - CORTES GENERALES ==========
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
    // ========== TEMA 1: CONSTITUCIÓN ESPAÑOLA - GOBIERNO ==========
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
    // ========== TEMA 1: CONSTITUCIÓN ESPAÑOLA - TRIBUNAL CONSTITUCIONAL ==========
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
    // ========== TEMA 2: ORGANIZACIÓN DEL ESTADO ==========
    {
      id: 34, topic: 2, subtopic: "Organización territorial",
      question: "¿Cuántas Comunidades Autónomas hay en España?",
      options: [
        { id: 'a', text: '15' },
        { id: 'b', text: '17' },
        { id: 'c', text: '19' },
        { id: 'd', text: '20' }
      ],
      correct: 'b',
      explanation: "España está organizada territorialmente en 17 Comunidades Autónomas y 2 Ciudades Autónomas (Ceuta y Melilla)."
    },
    {
      id: 35, topic: 2, subtopic: "Organización territorial",
      question: "¿Qué artículo de la Constitución reconoce el derecho a la autonomía de las nacionalidades y regiones?",
      options: [
        { id: 'a', text: 'Artículo 1' },
        { id: 'b', text: 'Artículo 2' },
        { id: 'c', text: 'Artículo 137' },
        { id: 'd', text: 'Artículo 143' }
      ],
      correct: 'b',
      explanation: "El artículo 2 de la Constitución reconoce y garantiza el derecho a la autonomía de las nacionalidades y regiones que la integran y la solidaridad entre todas ellas."
    },
    {
      id: 36, topic: 2, subtopic: "Administración General del Estado",
      question: "La Administración General del Estado actúa de acuerdo con los principios de:",
      options: [
        { id: 'a', text: 'Eficacia y jerarquía' },
        { id: 'b', text: 'Eficacia, jerarquía, descentralización, desconcentración y coordinación' },
        { id: 'c', text: 'Centralización y jerarquía' },
        { id: 'd', text: 'Autonomía y descentralización' }
      ],
      correct: 'b',
      explanation: "El artículo 103.1 de la Constitución establece que la Administración Pública sirve con objetividad los intereses generales y actúa de acuerdo con los principios de eficacia, jerarquía, descentralización, desconcentración y coordinación."
    },
    {
      id: 37, topic: 2, subtopic: "Poder Judicial",
      question: "¿Cuál es el órgano de gobierno del Poder Judicial?",
      options: [
        { id: 'a', text: 'El Tribunal Supremo' },
        { id: 'b', text: 'El Ministerio de Justicia' },
        { id: 'c', text: 'El Consejo General del Poder Judicial' },
        { id: 'd', text: 'La Audiencia Nacional' }
      ],
      correct: 'c',
      explanation: "El artículo 122.2 de la Constitución establece que el Consejo General del Poder Judicial es el órgano de gobierno del mismo."
    },
    {
      id: 38, topic: 2, subtopic: "Poder Judicial",
      question: "¿Cuántos vocales componen el Consejo General del Poder Judicial?",
      options: [
        { id: 'a', text: '12 vocales' },
        { id: 'b', text: '20 vocales' },
        { id: 'c', text: '21 vocales' },
        { id: 'd', text: '25 vocales' }
      ],
      correct: 'b',
      explanation: "El artículo 122.3 establece que el CGPJ estará integrado por el Presidente del Tribunal Supremo, que lo presidirá, y por veinte vocales."
    },
    {
      id: 39, topic: 2, subtopic: "Tribunal Supremo",
      question: "El Tribunal Supremo tiene jurisdicción en:",
      options: [
        { id: 'a', text: 'Solo Madrid' },
        { id: 'b', text: 'Todo el territorio nacional' },
        { id: 'c', text: 'Las Comunidades Autónomas que lo soliciten' },
        { id: 'd', text: 'Solo asuntos constitucionales' }
      ],
      correct: 'b',
      explanation: "El artículo 123.1 establece que 'El Tribunal Supremo, con jurisdicción en toda España, es el órgano jurisdiccional superior en todos los órdenes, salvo lo dispuesto en materia de garantías constitucionales'."
    },
    {
      id: 40, topic: 2, subtopic: "Defensor del Pueblo",
      question: "¿Quién designa al Defensor del Pueblo?",
      options: [
        { id: 'a', text: 'El Rey' },
        { id: 'b', text: 'El Gobierno' },
        { id: 'c', text: 'Las Cortes Generales' },
        { id: 'd', text: 'El Consejo General del Poder Judicial' }
      ],
      correct: 'c',
      explanation: "El artículo 54 establece que el Defensor del Pueblo es un alto comisionado de las Cortes Generales, designado por éstas."
    },
    {
      id: 41, topic: 2, subtopic: "Defensor del Pueblo",
      question: "¿Cuál es la función principal del Defensor del Pueblo?",
      options: [
        { id: 'a', text: 'Defender los derechos del Título I de la Constitución' },
        { id: 'b', text: 'Supervisar la actividad del Gobierno' },
        { id: 'c', text: 'Controlar las Comunidades Autónomas' },
        { id: 'd', text: 'Resolver conflictos entre ciudadanos' }
      ],
      correct: 'a',
      explanation: "El Defensor del Pueblo está designado para la defensa de los derechos comprendidos en el Título I de la Constitución."
    },
    {
      id: 42, topic: 2, subtopic: "Tribunal de Cuentas",
      question: "El Tribunal de Cuentas depende directamente de:",
      options: [
        { id: 'a', text: 'El Gobierno' },
        { id: 'b', text: 'El Poder Judicial' },
        { id: 'c', text: 'Las Cortes Generales' },
        { id: 'd', text: 'El Ministerio de Hacienda' }
      ],
      correct: 'c',
      explanation: "El artículo 136.1 establece que 'El Tribunal de Cuentas es el supremo órgano fiscalizador de las cuentas y de la gestión económica del Estado, así como del sector público. Dependerá directamente de las Cortes Generales'."
    },
    // ========== TEMA 2: ORGANIZACIÓN DEL ESTADO - COMUNIDADES AUTÓNOMAS ==========
    {
      id: 43, topic: 2, subtopic: "Comunidades Autónomas",
      question: "¿Qué artículo de la Constitución establece las competencias exclusivas del Estado?",
      options: [
        { id: 'a', text: 'Artículo 148' },
        { id: 'b', text: 'Artículo 149' },
        { id: 'c', text: 'Artículo 150' },
        { id: 'd', text: 'Artículo 151' }
      ],
      correct: 'b',
      explanation: "El artículo 149 de la Constitución enumera las materias sobre las que el Estado tiene competencia exclusiva."
    },
    {
      id: 44, topic: 2, subtopic: "Comunidades Autónomas",
      question: "¿Qué tipo de norma es un Estatuto de Autonomía?",
      options: [
        { id: 'a', text: 'Ley ordinaria' },
        { id: 'b', text: 'Ley orgánica' },
        { id: 'c', text: 'Real Decreto' },
        { id: 'd', text: 'Decreto-ley' }
      ],
      correct: 'b',
      explanation: "El artículo 81.1 de la Constitución establece que son leyes orgánicas las relativas al desarrollo de los derechos fundamentales y de las libertades públicas, las que aprueben los Estatutos de Autonomía..."
    },
    {
      id: 45, topic: 2, subtopic: "Comunidades Autónomas",
      question: "El control de la actividad de los órganos de las Comunidades Autónomas se ejerce por:",
      options: [
        { id: 'a', text: 'Solo el Tribunal Constitucional' },
        { id: 'b', text: 'Solo el Gobierno' },
        { id: 'c', text: 'El Tribunal Constitucional, el Gobierno, la jurisdicción contencioso-administrativa y el Tribunal de Cuentas' },
        { id: 'd', text: 'Las Cortes Generales exclusivamente' }
      ],
      correct: 'c',
      explanation: "El artículo 153 establece los distintos tipos de control: constitucionalidad (TC), delegación legislativa (Gobierno), administración autónoma (contencioso-administrativo) y económico-presupuestario (Tribunal de Cuentas)."
    },
    // ========== TEMA 3 y 4: PREGUNTAS ADICIONALES ==========
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
      id: 48, topic: 2, subtopic: "Administración Local",
      question: "¿Cuál es el órgano de gobierno y administración de los municipios?",
      options: [
        { id: 'a', text: 'El Alcalde' },
        { id: 'b', text: 'El Pleno' },
        { id: 'c', text: 'El Ayuntamiento' },
        { id: 'd', text: 'La Junta de Gobierno Local' }
      ],
      correct: 'c',
      explanation: "El artículo 140 de la Constitución establece que 'El gobierno y la administración de los municipios corresponde a sus respectivos Ayuntamientos, integrados por los Alcaldes y los Concejales'."
    },
    {
      id: 49, topic: 2, subtopic: "Administración Local",
      question: "¿Cómo se eligen los Concejales?",
      options: [
        { id: 'a', text: 'Por designación del Alcalde' },
        { id: 'b', text: 'Por los vecinos del municipio mediante sufragio universal, igual, libre, directo y secreto' },
        { id: 'c', text: 'Por las Comunidades Autónomas' },
        { id: 'd', text: 'Por sorteo entre los vecinos' }
      ],
      correct: 'b',
      explanation: "El artículo 140 establece que los Concejales serán elegidos por los vecinos del municipio mediante sufragio universal, igual, libre, directo y secreto."
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
      id: 53, topic: 2, subtopic: "Función pública",
      question: "¿Qué artículo de la Constitución regula el acceso a la función pública?",
      options: [
        { id: 'a', text: 'Artículo 23.2' },
        { id: 'b', text: 'Artículo 103.3' },
        { id: 'c', text: 'Ambos artículos' },
        { id: 'd', text: 'Artículo 35' }
      ],
      correct: 'c',
      explanation: "El artículo 23.2 reconoce el derecho a acceder en condiciones de igualdad a las funciones y cargos públicos, mientras que el artículo 103.3 desarrolla los principios de mérito y capacidad para el acceso a la función pública."
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
    },
    {
      id: 55, topic: 2, subtopic: "Organización territorial",
      question: "¿Cuántas provincias hay en España?",
      options: [
        { id: 'a', text: '48' },
        { id: 'b', text: '50' },
        { id: 'c', text: '52' },
        { id: 'd', text: '17' }
      ],
      correct: 'b',
      explanation: "España está dividida en 50 provincias, que son entidades locales con personalidad jurídica propia, determinadas por la agrupación de municipios."
    }
  ];

  // Seleccionar preguntas aleatorias para cada test (5 preguntas)
  const [questions, setQuestions] = useState([]);

  const selectRandomQuestions = (count = 5) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Inicializar preguntas
  useEffect(() => {
    if (questions.length === 0) {
      setQuestions(selectRandomQuestions(5));
    }
  }, []);

  // Calcular progreso total del temario
  const calculateTotalProgress = () => {
    const totalCompleted = Object.values(topicsProgress).reduce((sum, t) => sum + t.completed, 0);
    const totalQuestions = Object.values(topicsProgress).reduce((sum, t) => sum + t.total, 0);
    return Math.round((totalCompleted / totalQuestions) * 100);
  };

  // Calcular días restantes para el examen
  const getDaysUntilExam = () => {
    if (!userData.examDate || userData.examDate === 'sin fecha') return null;

    const examMappings = {
      '< 6 meses': 90,
      '6-12 meses': 270,
      '> 1 año': 450
    };

    return examMappings[userData.examDate] || null;
  };

  const completeOnboarding = async () => {
    try {
      await window.storage.set('oposita-onboarding-complete', 'true');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAnswerSelect = (answerId) => {
    if (!answers[currentQuestion]) {
      setSelectedAnswer(answerId);
      setAnswers({ ...answers, [currentQuestion]: answerId });
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || null);
      setShowExplanation(!!answers[currentQuestion + 1]);
    }
  };

  const handleFinishTest = async () => {
    const correctAnswers = Object.entries(answers).filter(
      ([idx, answer]) => answer === questions[idx].correct
    );

    const results = {
      total: questions.length,
      answered: Object.keys(answers).length,
      correct: correctAnswers.length,
      incorrect: Object.keys(answers).length - correctAnswers.length,
      percentage: Math.round((correctAnswers.length / questions.length) * 100),
      time: timeElapsed
    };

    const today = new Date().toDateString();
    let newStreak = streakData.current;
    let shouldCelebrate = false;
    let newBadge = null;

    try {
      if (streakData.lastCompletedDate !== today) {
        const lastDate = streakData.lastCompletedDate ? new Date(streakData.lastCompletedDate) : null;
        const todayDate = new Date(today);

        if (!lastDate) {
          newStreak = 1;
        } else {
          const diffDays = Math.floor((todayDate - new Date(lastDate)) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            newStreak = streakData.current + 1;
            const unlockedBadge = badges.find(b => b.days === newStreak);
            if (unlockedBadge) {
              newBadge = unlockedBadge;
              shouldCelebrate = true;
            }
          } else if (diffDays === 0) {
            newStreak = streakData.current;
          } else {
            newStreak = 1;
          }
        }

        const newStreakData = {
          current: newStreak,
          longest: Math.max(newStreak, streakData.longest),
          lastCompletedDate: today
        };

        setStreakData(newStreakData);
        await window.storage.set('oposita-streak', JSON.stringify(newStreakData));
      }
    } catch (error) {
      console.error('Error actualizando racha:', error);
    }

    const newWeeklyProgress = [...totalStats.weeklyProgress];
    newWeeklyProgress[6] = (newWeeklyProgress[6] || 0) + questions.length;

    setTotalStats(prev => ({
      testsCompleted: prev.testsCompleted + 1,
      questionsCorrect: prev.questionsCorrect + correctAnswers.length,
      todayQuestions: prev.todayQuestions + questions.length,
      currentStreak: newStreak,
      totalDaysStudied: prev.totalDaysStudied + (prev.todayQuestions === 0 ? 1 : 0),
      accuracyRate: Math.round(((prev.questionsCorrect + correctAnswers.length) / ((prev.testsCompleted + 1) * questions.length)) * 100),
      weeklyProgress: newWeeklyProgress
    }));

    setTopicsProgress(prev => ({
      ...prev,
      1: {
        ...prev[1],
        completed: Math.min(prev[1].completed + questions.length, prev[1].total),
        streak: prev[1].streak
      }
    }));

    try {
      const newCount = dailyTestsCount + 1;
      setDailyTestsCount(newCount);
      await window.storage.set('oposita-daily-tests', JSON.stringify({ date: today, count: newCount }));
    } catch (error) {
      console.error('Error guardando tests diarios:', error);
    }

    setTestResults(results);

    if (shouldCelebrate && newBadge) {
      setEarnedBadge(newBadge);
      setShowStreakCelebration(true);
      setTimeout(() => {
        setShowStreakCelebration(false);
        setCurrentPage('onboarding-results');
      }, 2000);
    } else {
      setCurrentPage('onboarding-results');
    }
  };

  const handleCreateAccount = async () => {
    if (!privacyAccepted) return;

    const newUserData = {
      ...userData,
      name: formName || userData.name,
      email: formEmail,
      accountCreated: true
    };

    setUserData(newUserData);

    try {
      await window.storage.set('oposita-user', JSON.stringify(newUserData));
      await window.storage.set('oposita-signup-count', JSON.stringify(signupFormShownCount + 1));
    } catch (error) {
      console.error('Error guardando cuenta:', error);
    }

    setCurrentPage('home');
  };

  const handleSkipSignup = async () => {
    try {
      const newCount = signupFormShownCount + 1;
      setSignupFormShownCount(newCount);
      await window.storage.set('oposita-signup-count', JSON.stringify(newCount));
    } catch (error) {
      console.error('Error:', error);
    }
    setCurrentPage('home');
  };

  const goToSignupOrHome = () => {
    if (!userData.accountCreated && signupFormShownCount < 2) {
      setFormName(userData.name);
      setCurrentPage('signup');
    } else {
      setCurrentPage('home');
    }
  };

  const getMotivationalMessage = () => {
    if (streakData.current >= 7) return "¡Vas imparable! 🔥 Solo 3 días más para tu siguiente insignia";
    if (totalStats.accuracyRate >= 80) return "¡Brutal! Estás dominando este tema 💪";
    if (streakData.current >= 3) return `¡${streakData.current} días seguidos! La constancia es clave ✊`;
    return "Cada pregunta te acerca a tu objetivo ✅";
  };

  const startTest = () => {
    setQuestions(selectRandomQuestions(5));
    setCurrentPage('first-test');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setShowExplanation(false);
    setTimeElapsed(0);
  };

  useEffect(() => {
    if (currentPage === 'first-test') {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentPage]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsResult = await window.storage.get('oposita-stats-v2');
        if (statsResult && statsResult.value) {
          setTotalStats(JSON.parse(statsResult.value));
        }

        const progressResult = await window.storage.get('oposita-progress-v2');
        if (progressResult && progressResult.value) {
          setTopicsProgress(JSON.parse(progressResult.value));
        }

        const userResult = await window.storage.get('oposita-user');
        if (userResult && userResult.value) {
          setUserData(JSON.parse(userResult.value));
        }

        const signupCountResult = await window.storage.get('oposita-signup-count');
        if (signupCountResult && signupCountResult.value) {
          setSignupFormShownCount(JSON.parse(signupCountResult.value));
        }

        const streakResult = await window.storage.get('oposita-streak');
        if (streakResult && streakResult.value) {
          const savedStreak = JSON.parse(streakResult.value);
          setStreakData(savedStreak);

          if (savedStreak.lastCompletedDate) {
            const lastDate = new Date(savedStreak.lastCompletedDate);
            const today = new Date();
            const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
              setStreakData({ current: 0, longest: savedStreak.longest, lastCompletedDate: null });
              await window.storage.set('oposita-streak', JSON.stringify({
                current: 0,
                longest: savedStreak.longest,
                lastCompletedDate: null
              }));
            }
          }
        }

        const dailyTestsResult = await window.storage.get('oposita-daily-tests');
        if (dailyTestsResult && dailyTestsResult.value) {
          const savedData = JSON.parse(dailyTestsResult.value);
          const today = new Date().toDateString();
          if (savedData.date === today) {
            setDailyTestsCount(savedData.count);
          } else {
            setDailyTestsCount(0);
            await window.storage.set('oposita-daily-tests', JSON.stringify({ date: today, count: 0 }));
          }
        }

        const premiumResult = await window.storage.get('oposita-premium');
        if (premiumResult && premiumResult.value === 'true') {
          setIsPremium(true);
        }

        const onboardingResult = await window.storage.get('oposita-onboarding-complete');
        if (onboardingResult && onboardingResult.value === 'true') {
          setCurrentPage('home');
        }
      } catch (error) {
        console.log('Primera vez usando la app');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading && currentPage === 'home') {
      const saveStats = async () => {
        try {
          await window.storage.set('oposita-stats-v2', JSON.stringify(totalStats));
        } catch (error) {
          console.error('Error:', error);
        }
      };
      saveStats();
    }
  }, [totalStats, isLoading, currentPage]);

  useEffect(() => {
    if (!isLoading && currentPage === 'home') {
      const saveProgress = async () => {
        try {
          await window.storage.set('oposita-progress-v2', JSON.stringify(topicsProgress));
        } catch (error) {
          console.error('Error:', error);
        }
      };
      saveProgress();
    }
  }, [topicsProgress, isLoading, currentPage]);

  // Premium Modal Component - Versión "Próximamente"
  const PremiumModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowPremiumModal(false)}>
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-t-3xl relative">
          <button
            onClick={() => setShowPremiumModal(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <XCircle className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-16 h-16 text-white drop-shadow-lg" />
            <span className="bg-white/30 text-white text-sm font-bold px-3 py-1 rounded-full">🚀 Próximamente</span>
          </div>
          <h2 className="text-3xl font-bold text-white text-center drop-shadow">Premium</h2>
          <p className="text-white/90 text-center mt-2 font-medium">Muy pronto disponible</p>
        </div>

        <div className="p-6">
          {/* Mensaje próximamente */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
            <p className="text-purple-800 text-center font-medium">
              La suscripción premium estará disponible próximamente con acceso a todas las preguntas y funciones avanzadas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3">
              <div className="text-gray-500 text-sm font-bold mb-3">GRATIS (ACTUAL)</div>
              <div className="text-sm text-gray-600 space-y-2">
                <div>✓ Tests diarios</div>
                <div>✓ 2 temas</div>
                <div>✓ Resultados básicos</div>
                <div>✓ Sistema de rachas</div>
              </div>
            </div>
            <div className="text-center border-2 border-gray-300 rounded-xl p-3 bg-gray-50 opacity-75">
              <div className="text-gray-500 font-bold text-sm mb-3 flex items-center justify-center gap-1">
                <Crown className="w-4 h-4" />
                PREMIUM
                <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded ml-1">Pronto</span>
              </div>
              <div className="text-sm text-gray-500 space-y-2">
                <div>Tests ilimitados</div>
                <div>4 temas completos</div>
                <div className="flex items-center justify-center gap-1">
                  <span>Análisis IA</span>
                </div>
                <div>Simulacros reales</div>
              </div>
            </div>
          </div>

          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 font-bold py-4 px-6 rounded-2xl shadow-lg mb-3 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            Próximamente
          </button>

          <button
            onClick={() => setShowPremiumModal(false)}
            className="w-full text-purple-600 font-semibold py-3 hover:text-purple-800"
          >
            Continuar con plan gratuito
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Te avisaremos cuando esté disponible
          </p>
        </div>
      </div>
    </div>
  );

  // Bottom Tab Bar Component
  const BottomTabBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="max-w-4xl mx-auto flex justify-around">
        {[
          { id: 'inicio', label: 'Inicio', icon: Home },
          { id: 'actividad', label: 'Actividad', icon: History },
          { id: 'temas', label: 'Temas', icon: BookOpen },
          { id: 'recursos', label: 'Recursos', icon: GraduationCap }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'text-purple-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'stroke-2' : ''}`} />
            <span className={`text-xs mt-1 ${activeTab === tab.id ? 'font-semibold' : ''}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-800 font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  // PANTALLA 1: BIENVENIDA
  if (currentPage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="inline-block bg-yellow-400 rounded-full p-8 mb-6 shadow-2xl animate-bounce">
              <Trophy className="w-20 h-20 text-purple-700" />
            </div>

            <h1 className="text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              OpoÁgil
            </h1>
            <p className="text-2xl font-semibold text-yellow-300 mb-4">
              Entrena tu oposición de forma inteligente
            </p>

            <p className="text-purple-100 text-xl font-medium">
              Prepara tu oposición de Administrativo del Estado
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('onboarding1')}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-5 px-8 rounded-2xl text-xl shadow-2xl transform hover:scale-105 transition-all mb-4"
          >
            Comenzar gratis
          </button>

          <p className="text-purple-200 text-sm">
            Sin tarjeta. Cancela cuando quieras.
          </p>

          {/* DEV: Skip button */}
          <button
            onClick={() => {
              completeOnboarding();
              setCurrentPage('home');
            }}
            className="mt-6 text-purple-300 text-xs underline hover:text-white"
          >
            [DEV] Saltar al Home
          </button>

          {/* DEV: Reset all data */}
          <button
            onClick={async () => {
              await window.storage.remove('oposita-onboarding-complete');
              await window.storage.remove('oposita-user');
              await window.storage.remove('oposita-stats-v2');
              await window.storage.remove('oposita-progress-v2');
              await window.storage.remove('oposita-streak');
              await window.storage.remove('oposita-daily-tests');
              await window.storage.remove('oposita-signup-count');
              await window.storage.remove('oposita-premium');
              window.location.reload();
            }}
            className="mt-2 text-red-300 text-xs underline hover:text-red-100"
          >
            [DEV] Resetear TODO y recargar
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA 2: ¿CUÁNDO ES TU EXAMEN?
  if (currentPage === 'onboarding1') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-6 drop-shadow">
              ¿Cuándo es tu examen?
            </h2>

            <div className="flex justify-center gap-2 mt-6">
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { value: '< 6 meses', label: 'En menos de 6 meses', emoji: '⚡' },
              { value: '6-12 meses', label: 'Entre 6-12 meses', emoji: '📅' },
              { value: '> 1 año', label: 'En más de 1 año', emoji: '🎯' },
              { value: 'sin fecha', label: 'Aún no tengo fecha', emoji: '🤔' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setUserData({ ...userData, examDate: option.value });
                  setCurrentPage('onboarding2');
                }}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white text-white font-semibold py-5 px-6 rounded-2xl transition-all text-left flex items-center gap-4 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <span className="text-3xl">{option.emoji}</span>
                <span className="text-lg">{option.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage('welcome')}
            className="w-full mt-6 text-white/70 hover:text-white font-medium py-3 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA 3: OBJETIVO DIARIO
  if (currentPage === 'onboarding2') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow">
              ¿Cuánto tiempo tienes cada día?
            </h2>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <p className="text-white font-semibold text-lg">
                Solo 15 min/día = 5,475 preguntas al año
              </p>
            </div>

            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { minutes: 15, questions: 10, label: '15 minutos', sublabel: '10 preguntas', emoji: '⏱️' },
              { minutes: 30, questions: 20, label: '30 minutos', sublabel: '20 preguntas', emoji: '📚' },
              { minutes: 60, questions: 40, label: '1 hora', sublabel: '40 preguntas', emoji: '🎓' },
              { minutes: 120, questions: 80, label: '2+ horas', sublabel: '80+ preguntas', emoji: '🚀' }
            ].map((option) => (
              <button
                key={option.minutes}
                onClick={() => {
                  setUserData({ ...userData, dailyGoal: option.questions, dailyGoalMinutes: option.minutes });
                  setCurrentPage('onboarding3');
                }}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white text-white font-semibold py-5 px-6 rounded-2xl transition-all text-left shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{option.emoji}</span>
                  <div className="flex-1">
                    <div className="text-xl font-bold">{option.label}</div>
                    <div className="text-purple-100 text-sm">{option.sublabel}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage('onboarding1')}
            className="w-full mt-6 text-white/70 hover:text-white font-medium py-3 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA 4: PRIMER TEST
  if (currentPage === 'onboarding3') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            {/* Plan confirmado */}
            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-green-400/30">
              <p className="text-green-100 font-semibold">
                ✅ Perfecto, creamos un plan con <span className="text-white font-bold">{userData.dailyGoal} preguntas al día</span> para ti.
              </p>
            </div>

            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow">
              Vamos a hacer tu primer test ahora
            </h2>

            <div className="flex justify-center gap-2 mt-6">
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-3xl blur-xl opacity-50 animate-pulse"></div>

            <div className="relative bg-gradient-to-br from-purple-400 to-purple-500 p-8 rounded-3xl shadow-2xl border-2 border-white/30">
              <div className="text-6xl mb-6 text-center animate-bounce">📖</div>
              <h3 className="text-3xl font-bold text-white mb-3 text-center drop-shadow">
                Constitución Española
              </h3>
              <div className="flex items-center justify-center gap-4 text-purple-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">2 minutos</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-purple-200"></div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">5 preguntas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Texto de calibración */}
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-blue-400/30">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />
              <p className="text-blue-100 text-sm">
                Este primer test solo sirve para calibrar tu nivel, no te preocupes por la nota 😉
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              startTest();
              completeOnboarding();
            }}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-6 px-8 rounded-2xl text-xl shadow-2xl transform hover:scale-105 transition-all mb-4"
          >
            Empezar mi primer test
          </button>

          <button
            onClick={() => setCurrentPage('onboarding2')}
            className="w-full text-white/70 hover:text-white font-medium py-3 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA TEST
  if (currentPage === 'first-test') {
    const question = questions[currentQuestion];
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 text-white hover:text-purple-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-semibold">Salir</span>
            </button>

            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 text-white" />
              <span className="font-bold text-white">{formatTime(timeElapsed)}</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-white text-sm mb-2">
              <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
              <span>{answeredCount}/{questions.length} respondidas</span>
            </div>
            <div className="bg-white/30 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-purple-100 text-purple-600 font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-lg">
                  {currentQuestion + 1}
                </div>
                <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
                  {question.question}
                </h2>
              </div>

              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrect = option.id === question.correct;
                  const showResult = showExplanation;

                  let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";

                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += "border-green-500 bg-green-50 ";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "border-red-500 bg-red-50 ";
                    } else {
                      buttonClass += "border-gray-200 bg-gray-50 ";
                    }
                  } else if (isSelected) {
                    buttonClass += "border-purple-500 bg-purple-50 ";
                  } else {
                    buttonClass += "border-gray-200 hover:border-purple-300 hover:bg-purple-50 ";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      disabled={showExplanation}
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${
                          showResult && isCorrect ? 'border-green-500 bg-green-500 text-white' :
                          showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                          isSelected ? 'border-purple-500 bg-purple-500 text-white' :
                          'border-gray-300 text-gray-600'
                        }`}>
                          {option.id.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 flex-1">{option.text}</span>
                        {showResult && isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className={`mt-6 p-4 rounded-xl ${
                  selectedAnswer === question.correct ? 'bg-green-50 border-2 border-green-200' : 'bg-blue-50 border-2 border-blue-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        {selectedAnswer === question.correct ? '¡Correcto!' : 'Explicación'}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className="flex-1 bg-white hover:bg-gray-100 disabled:bg-white/50 disabled:cursor-not-allowed text-purple-600 font-bold py-4 px-6 rounded-2xl transition shadow-lg"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleFinishTest}
                disabled={!selectedAnswer}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition shadow-lg"
              >
                Finalizar Test ✓
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA RESULTADOS
  if (currentPage === 'onboarding-results') {
    const isGoodScore = testResults?.percentage >= 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {isGoodScore && (
            <div className="text-center mb-6 animate-bounce">
              <div className="text-7xl">🎉</div>
            </div>
          )}

          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-3">
                ¡{testResults?.correct} de {testResults?.total} correctas! {isGoodScore ? '🎉' : '💪'}
              </h2>
              <div className="text-6xl font-bold text-gray-800 mb-2">
                {testResults?.percentage}%
              </div>
              <p className="text-gray-600 text-lg">de acierto</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 mb-6 border-2 border-purple-100">
              <div className="flex items-center gap-3 justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <p className="text-purple-900 font-bold">
                  Estás en el TOP 45% de nuevos usuarios
                </p>
              </div>
            </div>

            <div className="border-2 border-purple-200 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-white">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-900 text-lg">Los usuarios Premium tienen:</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span><strong>127% más</strong> preguntas acertadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Acceso a <strong>15.000+ preguntas</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Simulacros de <strong>examen real</strong></span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setShowPremiumModal(true)}
            className="w-full bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold py-4 px-6 rounded-2xl mb-3 hover:bg-white/30 transition-all shadow-lg"
          >
            Ver planes Premium
          </button>

          <button
            onClick={goToSignupOrHome}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl transition-all"
          >
            Continuar con plan gratuito
          </button>

          {/* DEV: Skip to home */}
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full mt-4 text-purple-300 text-xs underline hover:text-white"
          >
            [DEV] Saltar al Home directamente
          </button>
        </div>

        {showPremiumModal && <PremiumModal />}
      </div>
    );
  }

  // PANTALLA SIGNUP
  if (currentPage === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-block bg-purple-100 rounded-full p-4 mb-4">
                <CheckCircle className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Guarda tu progreso</h2>
              <p className="text-gray-600">
                Crea tu cuenta para no perder tu racha, tu progreso y tus resultados.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tu nombre</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: María"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tu correo electrónico</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Ej: maria@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Te enviaremos recordatorios útiles y recursos para tu oposición. Nada de spam.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="privacy" className="text-sm text-gray-600">
                  He leído y acepto la{' '}
                  <a href="/privacidad" className="text-purple-600 underline hover:text-purple-700">
                    Política de Privacidad
                  </a>
                </label>
              </div>

              <button
                onClick={handleCreateAccount}
                disabled={!privacyAccepted || !formEmail}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all disabled:cursor-not-allowed"
              >
                Crear mi cuenta
              </button>

              <p className="text-xs text-gray-500 text-center">
                Al crear tu cuenta aceptas nuestra Política de Privacidad. Nunca compartimos tus datos con terceros.
              </p>

              <div className="border-t pt-4">
                <button
                  onClick={handleSkipSignup}
                  className="w-full text-gray-500 font-medium py-2 hover:text-gray-700 transition"
                >
                  Continuar sin crear cuenta
                </button>
                <p className="text-xs text-gray-400 text-center mt-1">
                  Podrías perder tu progreso si cambias de dispositivo.
                </p>
              </div>

              {/* DEV: Skip */}
              <button
                onClick={() => setCurrentPage('home')}
                className="w-full text-gray-300 text-xs underline hover:text-gray-500"
              >
                [DEV] Saltar formulario
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA DE PRIVACIDAD
  if (currentPage === 'privacy') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Política de Privacidad</h1>
            <div className="prose prose-sm text-gray-600 space-y-4">
              <p><strong>Última actualización:</strong> Diciembre 2024</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">1. Responsable del tratamiento</h2>
              <p>OpoÁgil es una aplicación web educativa. Todos los datos se almacenan localmente en tu dispositivo mediante localStorage.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">2. Datos que recopilamos</h2>
              <p>Almacenamos localmente en tu navegador:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Progreso de estudio y estadísticas</li>
                <li>Preferencias de configuración</li>
                <li>Nombre y email (solo si los proporcionas voluntariamente)</li>
              </ul>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">3. Uso de los datos</h2>
              <p>Los datos se utilizan exclusivamente para:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Guardar tu progreso de estudio</li>
                <li>Personalizar tu experiencia</li>
                <li>Mostrar estadísticas de rendimiento</li>
              </ul>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">4. Almacenamiento local</h2>
              <p>Todos los datos se guardan en el localStorage de tu navegador. No enviamos datos a servidores externos. Puedes eliminar estos datos en cualquier momento borrando los datos de navegación.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">5. Tus derechos</h2>
              <p>Conforme al RGPD, tienes derecho a acceder, rectificar y eliminar tus datos. Como los datos están en tu dispositivo, tienes control total sobre ellos.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">6. Contacto</h2>
              <p>Para cualquier consulta sobre privacidad, puedes contactarnos a través de la sección de contacto de la aplicación.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA DE TÉRMINOS Y CONDICIONES
  if (currentPage === 'terms') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Términos y Condiciones</h1>
            <div className="prose prose-sm text-gray-600 space-y-4">
              <p><strong>Última actualización:</strong> Diciembre 2024</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">1. Aceptación de los términos</h2>
              <p>Al utilizar OpoÁgil, aceptas estos términos y condiciones. Si no estás de acuerdo, por favor no utilices la aplicación.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">2. Descripción del servicio</h2>
              <p>OpoÁgil es una aplicación web gratuita de preparación para oposiciones de Administrativo del Estado. Ofrecemos tests de práctica, seguimiento de progreso y material de estudio.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">3. Uso permitido</h2>
              <p>Te comprometes a:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Usar la aplicación solo con fines educativos personales</li>
                <li>No intentar copiar o redistribuir el contenido</li>
                <li>No realizar ingeniería inversa del software</li>
              </ul>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">4. Propiedad intelectual</h2>
              <p>Todo el contenido de OpoÁgil, incluyendo textos, diseños y funcionalidades, está protegido por derechos de autor.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">5. Limitación de responsabilidad</h2>
              <p>OpoÁgil se proporciona "tal cual". No garantizamos que el uso de la aplicación resulte en la aprobación de oposiciones. El contenido es orientativo y complementario a otros materiales de estudio.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">6. Modificaciones</h2>
              <p>Nos reservamos el derecho de modificar estos términos. Los cambios serán efectivos desde su publicación en la aplicación.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA DE AVISO LEGAL
  if (currentPage === 'legal') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Aviso Legal</h1>
            <div className="prose prose-sm text-gray-600 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mt-6">1. Información general</h2>
              <p>OpoÁgil es una aplicación web educativa para la preparación de oposiciones.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">2. Objeto</h2>
              <p>Esta aplicación tiene como finalidad proporcionar herramientas de estudio y práctica para personas que se preparan para oposiciones de Administrativo del Estado.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">3. Condiciones de acceso</h2>
              <p>El acceso a OpoÁgil es gratuito. Algunas funcionalidades premium pueden requerir suscripción en el futuro.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">4. Propiedad intelectual</h2>
              <p>Todos los contenidos de esta aplicación (textos, imágenes, código, diseño) son propiedad de OpoÁgil o se utilizan con autorización.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">5. Legislación aplicable</h2>
              <p>Este aviso legal se rige por la legislación española. Para cualquier controversia, serán competentes los juzgados y tribunales de España.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">6. LSSI-CE</h2>
              <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico, le informamos que esta es una aplicación web de carácter educativo.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA ACERCA DE
  if (currentPage === 'about') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-block bg-purple-100 rounded-full p-4 mb-4">
                <Trophy className="w-12 h-12 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">OpoÁgil</h1>
              <p className="text-purple-600 font-medium">Entrena tu oposición de forma inteligente</p>
            </div>

            <div className="prose prose-sm text-gray-600 space-y-4">
              <p>OpoÁgil nace con la misión de hacer la preparación de oposiciones más accesible, efectiva y motivadora.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">Nuestra misión</h2>
              <p>Creemos que preparar unas oposiciones no tiene por qué ser un proceso solitario y tedioso. Nuestra aplicación está diseñada para ayudarte a estudiar de forma más inteligente, con seguimiento de progreso, rachas de estudio y contenido actualizado.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">Características</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tests de práctica con explicaciones detalladas</li>
                <li>Seguimiento de progreso y estadísticas</li>
                <li>Sistema de rachas para mantener la motivación</li>
                <li>Contenido actualizado según el temario oficial</li>
                <li>Funciona offline una vez cargada</li>
              </ul>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">Tecnología</h2>
              <p>OpoÁgil es una Progressive Web App (PWA) que puedes instalar en tu dispositivo y usar sin conexión. Tus datos se guardan localmente para máxima privacidad.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA FAQ
  if (currentPage === 'faq') {
    const faqs = [
      {
        q: "¿Es gratis OpoÁgil?",
        a: "Sí, OpoÁgil es completamente gratuito. Ofrecemos acceso a tests de práctica, seguimiento de progreso y material de estudio sin coste."
      },
      {
        q: "¿Puedo usar la app sin conexión?",
        a: "Sí, OpoÁgil es una Progressive Web App (PWA). Una vez cargada, puedes usarla sin conexión a internet. Tu progreso se guarda localmente."
      },
      {
        q: "¿Cómo se guarda mi progreso?",
        a: "Tu progreso se guarda automáticamente en el almacenamiento local de tu navegador (localStorage). No necesitas crear una cuenta para guardar tu avance."
      },
      {
        q: "¿El contenido está actualizado?",
        a: "Sí, nuestras preguntas están basadas en el temario oficial de oposiciones de Administrativo del Estado y se actualizan regularmente."
      },
      {
        q: "¿Puedo instalar la app en mi móvil?",
        a: "Sí, puedes instalar OpoÁgil como una app en tu móvil. En el navegador, busca la opción 'Añadir a pantalla de inicio' o 'Instalar aplicación'."
      },
      {
        q: "¿Qué pasa si borro los datos del navegador?",
        a: "Si borras los datos de navegación o el localStorage, perderás tu progreso guardado. Recomendamos no limpiar los datos de este sitio si quieres conservar tu avance."
      },
      {
        q: "¿Cómo funciona el sistema de rachas?",
        a: "El sistema de rachas cuenta los días consecutivos que estudias. Completa al menos un test cada día para mantener tu racha activa y ganar insignias."
      },
      {
        q: "¿Puedo sugerir mejoras o reportar errores?",
        a: "¡Por supuesto! Usa la sección de contacto para enviarnos tus sugerencias, reportar errores o cualquier otra consulta."
      }
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h1>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA DE CONTACTO
  if (currentPage === 'contact') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Contacto</h1>
            <p className="text-gray-600 mb-6">¿Tienes alguna pregunta, sugerencia o has encontrado un error? Nos encantaría saber de ti.</p>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              alert('Gracias por tu mensaje. Te responderemos lo antes posible.');
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Sugerencia</option>
                  <option>Reportar error</option>
                  <option>Pregunta general</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="4"
                  placeholder="Escribe tu mensaje aquí..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // HOME
  const daysUntilExam = getDaysUntilExam();
  const totalProgress = calculateTotalProgress();

  // Contenido de Actividad
  const ActividadContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tu actividad</h2>

      {totalStats.testsCompleted === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no hay actividad</h3>
          <p className="text-gray-600 mb-4">Completa tu primer test para ver tu progreso aquí</p>
          <button
            onClick={startTest}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            Hacer mi primer test
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                <span className="text-gray-600 text-sm font-medium">Tests completados</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalStats.testsCompleted}</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-green-600" />
                <span className="text-gray-600 text-sm font-medium">Tasa de acierto</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalStats.accuracyRate}%</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <span className="text-gray-600 text-sm font-medium">Preguntas correctas</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalStats.questionsCorrect}</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-orange-600" />
                <span className="text-gray-600 text-sm font-medium">Días estudiando</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalStats.totalDaysStudied}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Progreso semanal</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg flex-1 relative">
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all"
                      style={{ height: `${Math.min((totalStats.weeklyProgress[i] / 20) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Contenido de Temas
  const TemasContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tus temas</h2>

      <div className="space-y-4">
        {topicsList.map((topic) => {
          const progress = topicsProgress[topic.id];
          const percentage = Math.round((progress.completed / progress.total) * 100);
          const isLocked = progress.locked;

          return (
            <div
              key={topic.id}
              className={`rounded-xl p-4 transition-all ${
                isLocked
                  ? 'bg-gray-50 border-2 border-gray-200'
                  : 'bg-gradient-to-r from-purple-50 to-white border-2 border-purple-200 hover:border-purple-400 cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{topic.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{topic.title}</h4>
                    {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                    {progress.streak > 0 && !isLocked && (
                      <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
                        <Flame className="w-3 h-3 text-orange-600" />
                        <span className="text-xs font-bold text-orange-600">{progress.streak} días</span>
                      </div>
                    )}
                  </div>

                  {isLocked ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {progress.total} preguntas · Simulacros incluidos
                      </p>
                      <p className="text-xs text-purple-600 font-medium mb-2">Solo disponible en Premium</p>
                      <button
                        onClick={() => {
                          setPremiumModalTrigger('locked-topic');
                          setShowPremiumModal(true);
                        }}
                        className="flex items-center gap-2 bg-purple-100 text-purple-700 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-purple-200 transition"
                      >
                        <Lock className="w-3 h-3" />
                        Desbloquear con Premium
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-2">
                        {progress.completed} de {progress.total} preguntas completadas
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full h-2 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-700">{percentage}%</span>
                      </div>
                      {topic.id === 1 && (
                        <button
                          onClick={startTest}
                          className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all"
                        >
                          Continuar
                        </button>
                      )}
                      {topic.id === 2 && progress.completed === 0 && (
                        <button className="mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Empezar tema
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Contenido de Recursos
  const RecursosContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Recursos para tu oposición</h2>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Consejos de estudio
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            <span>Estudia a la misma hora cada día para crear un hábito</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            <span>Repasa los errores del día anterior antes de empezar</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            <span>Haz descansos cortos cada 25-30 minutos</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            <span>Practica con simulacros completos una vez por semana</span>
          </li>
        </ul>
      </div>

      <div className="bg-gray-100 rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gray-200 p-2 rounded-lg">
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-500">Análisis con IA</h3>
            <span className="text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded">Próximamente</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Pronto podrás recibir análisis personalizados de tu rendimiento y recomendaciones de estudio basadas en IA.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4">Enlaces útiles</h3>
        <div className="space-y-3">
          <a href="#" className="block text-purple-600 hover:text-purple-700 font-medium">
            📄 BOE - Convocatorias oficiales
          </a>
          <a href="#" className="block text-purple-600 hover:text-purple-700 font-medium">
            📚 Temario oficial actualizado
          </a>
          <a href="#" className="block text-purple-600 hover:text-purple-700 font-medium">
            ❓ Preguntas frecuentes
          </a>
        </div>
      </div>
    </div>
  );

  // Contenido de Inicio
  const InicioContent = () => (
    <>
      {/* Banner protege tu racha */}
      {streakData.current >= 3 && !userData.accountCreated && showStreakBanner && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Flame className="w-6 h-6 text-yellow-300 flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Protege tu racha de {streakData.current} días</p>
                <p className="text-white/80 text-sm">Crea tu cuenta para no perder tu progreso si cambias de móvil.</p>
              </div>
            </div>
            <button onClick={() => setShowStreakBanner(false)} className="text-white/60 hover:text-white">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setCurrentPage('signup')}
            className="mt-3 w-full bg-white text-orange-600 font-bold py-2 px-4 rounded-xl hover:bg-orange-50 transition"
          >
            Crear cuenta gratis
          </button>
        </div>
      )}

      {/* Info examen y progreso */}
      <div className="bg-white/80 backdrop-blur rounded-xl p-4 mb-6 border border-white/50">
        {daysUntilExam ? (
          <p className="text-gray-700 font-medium">
            📅 Te quedan aproximadamente <span className="font-bold text-purple-600">{daysUntilExam} días</span> para tu examen
          </p>
        ) : (
          <p className="text-gray-600">
            🤔 Aún no tienes fecha de examen. Te ayudamos a construir el hábito igualmente.
          </p>
        )}
        <p className="text-gray-600 text-sm mt-1">
          📊 Llevas aproximadamente <span className="font-bold">{totalProgress}%</span> del temario
        </p>
      </div>

      {/* Racha */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <Flame className="w-12 h-12 text-yellow-300 drop-shadow" />
            <div>
              <div className="text-white/80 text-sm font-medium">Racha</div>
              <div className="text-white text-4xl font-bold drop-shadow">{streakData.current} días</div>
            </div>
          </div>

          <div className="bg-white/20 rounded-full h-3 mb-2">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${(streakData.current % 10) * 10}%` }}
            ></div>
          </div>
          <p className="text-white text-sm mb-3 drop-shadow">
            ¡Solo {Math.max(0, badges.find(b => b.days > streakData.current)?.days - streakData.current || 10 - (streakData.current % 10))} días más para tu próxima insignia!
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {badges.map(badge => {
              const isUnlocked = streakData.current >= badge.days || streakData.longest >= badge.days;
              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                    isUnlocked
                      ? 'bg-yellow-400 text-gray-900 shadow-lg'
                      : 'bg-white/20 text-white/50'
                  }`}
                >
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-xs">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Objetivo diario */}
      <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tu objetivo de hoy</h2>
        <div className="flex items-center gap-6 mb-4">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="50" fill="none" stroke="#E5E7EB" strokeWidth="10"></circle>
              <circle
                cx="56"
                cy="56"
                r="50"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="10"
                strokeDasharray={`${Math.min((totalStats.todayQuestions / userData.dailyGoal) * 314, 314)} 314`}
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">
                {Math.min(Math.round((totalStats.todayQuestions / userData.dailyGoal) * 100), 100)}%
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-gray-600 mb-2">
              <span className="text-2xl font-bold text-gray-900">{totalStats.todayQuestions}</span>
              <span className="text-gray-600">/{userData.dailyGoal} preguntas</span>
            </div>
            <p className="text-sm text-gray-500">
              Te quedan {Math.max(0, userData.dailyGoal - totalStats.todayQuestions)} preguntas · ~{Math.max(0, Math.round(((userData.dailyGoal - totalStats.todayQuestions) / userData.dailyGoal) * userData.dailyGoalMinutes))} minutos
            </p>
          </div>
        </div>

        {totalStats.todayQuestions >= userData.dailyGoal ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-green-800 font-bold">¡Objetivo cumplido! Mañana a por el siguiente</p>
          </div>
        ) : (
          <button
            onClick={startTest}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all hover:scale-105"
          >
            Completar mi objetivo →
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-purple-600" />
            <span className="text-gray-600 text-sm font-medium">Tests completados</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalStats.testsCompleted}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-green-600" />
            <span className="text-gray-600 text-sm font-medium">Tasa de acierto</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalStats.accuracyRate}%</div>
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
        <p className="text-purple-900 font-semibold text-center">
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Desafío del día */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-6 shadow-xl border-2 border-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative">
          <div className="flex items-start gap-4">
            <Zap className="w-10 h-10 text-white flex-shrink-0 drop-shadow" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow">⚡ DESAFÍO DEL DÍA</h3>
              <p className="text-white/90 font-semibold mb-3">
                Responde 10 preguntas sin fallar
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="text-white/80">Recompensa:</div>
                  <div className="text-white font-bold">+50 puntos XP</div>
                </div>
                <div className="text-sm text-right">
                  <div className="text-white/80">Caduca en:</div>
                  <div className="text-white font-bold">18h 42m</div>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-white hover:bg-gray-100 text-orange-600 font-bold py-3 px-6 rounded-xl shadow-lg transition-all">
            Aceptar desafío
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-400 pb-24">
      <div className="max-w-4xl mx-auto p-4">
        <div className="pt-6 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Hola{userData.name ? `, ${userData.name}` : ''}! 👋
              </h1>
            </div>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 font-bold px-4 py-2 rounded-full text-sm flex items-center gap-1 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Crown className="w-4 h-4" />
              Premium
            </button>
          </div>

          {/* Contenido según tab activo */}
          {activeTab === 'inicio' && <InicioContent />}
          {activeTab === 'actividad' && <ActividadContent />}
          {activeTab === 'temas' && <TemasContent />}
          {activeTab === 'recursos' && <RecursosContent />}

          {/* Footer con enlaces legales */}
          <footer className="mt-12 pt-6 border-t border-gray-300/50">
            <div className="text-center">
              <p className="text-gray-700 font-semibold mb-3">OpoÁgil</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm mb-4">
                <button onClick={() => setCurrentPage('about')} className="text-gray-600 hover:text-purple-700 transition">
                  Acerca de
                </button>
                <button onClick={() => setCurrentPage('faq')} className="text-gray-600 hover:text-purple-700 transition">
                  FAQ
                </button>
                <button onClick={() => setCurrentPage('contact')} className="text-gray-600 hover:text-purple-700 transition">
                  Contacto
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-xs mb-4">
                <button onClick={() => setCurrentPage('privacy')} className="text-gray-500 hover:text-purple-700 transition">
                  Privacidad
                </button>
                <button onClick={() => setCurrentPage('terms')} className="text-gray-500 hover:text-purple-700 transition">
                  Términos
                </button>
                <button onClick={() => setCurrentPage('legal')} className="text-gray-500 hover:text-purple-700 transition">
                  Aviso Legal
                </button>
              </div>
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} OpoÁgil. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* DEV Controls */}
      <div className="fixed top-2 right-2 z-50 flex gap-2">
        <button
          onClick={async () => {
            await window.storage.remove('oposita-onboarding-complete');
            await window.storage.remove('oposita-user');
            await window.storage.remove('oposita-stats-v2');
            await window.storage.remove('oposita-progress-v2');
            await window.storage.remove('oposita-streak');
            await window.storage.remove('oposita-daily-tests');
            await window.storage.remove('oposita-signup-count');
            await window.storage.remove('oposita-premium');
            window.location.reload();
          }}
          className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-2 py-1 rounded shadow"
        >
          [DEV] Reset
        </button>
      </div>

      <BottomTabBar />
      {showPremiumModal && <PremiumModal />}
    </div>
  );
}
