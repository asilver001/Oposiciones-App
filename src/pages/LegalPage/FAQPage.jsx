import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: '¿Cómo funciona la repetición espaciada?',
    answer: 'La repetición espaciada (FSRS) es un método científicamente probado que programa tus repasos en el momento óptimo para maximizar la retención. Las preguntas que respondes correctamente aparecen menos frecuentemente, mientras que las que te cuestan más se repiten con mayor frecuencia.',
  },
  {
    question: '¿Puedo usar OpositaSmart sin conexión?',
    answer: 'Actualmente, OpositaSmart requiere conexión a internet para sincronizar tu progreso y acceder a las preguntas. Estamos trabajando en una función offline para versiones futuras.',
  },
  {
    question: '¿Qué oposiciones están disponibles?',
    answer: 'Actualmente estamos enfocados en Auxiliar Administrativo del Estado (AGE). Planeamos expandir a más oposiciones basándonos en la demanda de los usuarios.',
  },
  {
    question: '¿Cómo cancelo mi suscripción Premium?',
    answer: 'Puedes cancelar tu suscripción Premium en cualquier momento desde Configuración > Suscripción. Tu acceso continuará hasta el final del período pagado.',
  },
  {
    question: '¿Los datos están seguros?',
    answer: 'Sí, usamos cifrado de extremo a extremo y autenticación segura con Supabase. Cumplimos con GDPR y LOPD. Tus datos nunca se comparten con terceros.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Preguntas Frecuentes
        </h1>
        <p className="text-xl text-gray-600">
          Encuentra respuestas a las dudas más comunes
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-purple-50 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¿No encuentras tu respuesta?
        </h3>
        <p className="text-gray-600 mb-4">
          Estamos aquí para ayudarte
        </p>
        <a
          href="mailto:support@opositasmart.com"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          Contactar Soporte
        </a>
      </div>
    </div>
  );
}
