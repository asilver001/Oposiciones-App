import React from 'react';
import { Heart, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sobre OpositaSmart
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Una plataforma de estudio inteligente para preparar oposiciones,
          diseñada pensando en tu bienestar.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-purple-50 rounded-2xl p-6">
          <Heart className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Bienestar primero
          </h3>
          <p className="text-gray-600">
            Sin gamificación tóxica, sin presión artificial. Estudia a tu ritmo,
            sin agobios.
          </p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-6">
          <Target className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            A tu ritmo
          </h3>
          <p className="text-gray-600">
            "Unos minutos al día, sin agobios". Establece metas realistas y
            alcanzables.
          </p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-6">
          <Zap className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ciencia del aprendizaje
          </h3>
          <p className="text-gray-600">
            Basado en repetición espaciada (FSRS). Maximiza tu retención de
            conocimiento.
          </p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-6">
          <Users className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Hecho para opositores
          </h3>
          <p className="text-gray-600">
            Entendemos los desafíos únicos de preparar oposiciones. Herramientas
            diseñadas específicamente para ti.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border-2 border-purple-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Nuestra Misión
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Hacer que la preparación de oposiciones sea más efectiva, sostenible
          y humana. Creemos que el éxito no debería venir al costo de tu salud
          mental o bienestar.
        </p>
      </div>
    </div>
  );
}
