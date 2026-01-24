#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para completar preguntas con información de IA.

Este script lee los archivos draft que tienen needs_ai_completion=True
y completa los campos faltantes:
- Identifica la respuesta correcta
- Añade explicación
- Añade referencia legal
- Asigna confidence_score

Uso:
  python ai_complete_questions.py                    # Procesar todos
  python ai_complete_questions.py --file ARCHIVO    # Procesar uno
  python ai_complete_questions.py --check           # Verificar estado
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple

# Forzar UTF-8 en Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Rutas
BASE_DIR = Path(r"C:\Users\alber\.claude-worktrees\OpositaSmart\epic-kirch\.claude")
DRAFT_DIR = BASE_DIR / "questions" / "draft"

# ============================================================================
# BASE DE CONOCIMIENTO DE RESPUESTAS CORRECTAS
# ============================================================================

# Constitución Española - Datos clave
CE_KNOWLEDGE = {
    # Fechas importantes
    "entrada_vigor_ce": "29 de diciembre de 1978",
    "referendum_ce": "6 de diciembre de 1978",
    "sancion_ce": "27 de diciembre de 1978",
    "primeras_elecciones_democraticas": "1977",

    # Estructura CE
    "forma_politica": "Monarquía Parlamentaria",
    "estructura_ce": "Preámbulo, 169 artículos, 4 disposiciones adicionales, 9 transitorias, 1 derogatoria, 1 final",

    # Títulos
    "titulo_preliminar": "Artículos 1-9",
    "titulo_i": "De los derechos y deberes fundamentales (Art. 10-55)",
    "titulo_ii": "De la Corona (Art. 56-65)",
    "titulo_iii": "De las Cortes Generales (Art. 66-96)",
    "titulo_iv": "Del Gobierno y la Administración (Art. 97-107)",
    "titulo_v": "Relaciones Gobierno y Cortes (Art. 108-116)",
    "titulo_vi": "Del Poder Judicial (Art. 117-127)",
    "titulo_vii": "Economía y Hacienda (Art. 128-136)",
    "titulo_viii": "Organización Territorial del Estado (Art. 137-158)",
    "titulo_ix": "Del Tribunal Constitucional (Art. 159-165)",
    "titulo_x": "De la Reforma Constitucional (Art. 166-169)",

    # Valores superiores
    "valores_superiores": ["libertad", "justicia", "igualdad", "pluralismo político"],

    # Estado
    "estado_social_democratico": "Art. 1.1 CE",
    "soberania": "pueblo español",

    # Corona
    "rey_actual": "Felipe VI",
    "sucesion": "línea directa, varones sobre mujeres en mismo grado",
    "mayoria_edad_rey": "18 años",
    "tutela_rey_menor": "padre, madre o pariente mayor de edad más próximo",

    # Derechos fundamentales
    "derecho_vida": "Art. 15 CE",
    "libertad_ideologica": "Art. 16 CE",
    "libertad_personal": "Art. 17 CE",
    "derecho_honor": "Art. 18 CE",
    "libertad_residencia": "Art. 19 CE",
    "libertad_expresion": "Art. 20 CE",
    "derecho_reunion": "Art. 21 CE",
    "derecho_asociacion": "Art. 22 CE",
    "derecho_participacion": "Art. 23 CE",
    "tutela_judicial": "Art. 24 CE",
    "principio_legalidad_penal": "Art. 25 CE",
    "prohibicion_tribunales_honor": "Art. 26 CE",
    "derecho_educacion": "Art. 27 CE",
    "derecho_sindicacion": "Art. 28 CE",
    "derecho_peticion": "Art. 29 CE",

    # Defensor del Pueblo
    "defensor_pueblo_articulo": "Art. 54 CE",
    "defensor_pueblo_mandato": "5 años",

    # Tribunal Constitucional
    "tc_composicion": "12 magistrados",
    "tc_mandato": "9 años",
    "tc_presidente_mandato": "3 años",
    "tc_propuesta": "4 Congreso, 4 Senado, 2 Gobierno, 2 CGPJ",

    # Cortes Generales
    "congreso_diputados": "300-400 diputados",
    "senado": "Cámara de representación territorial",
    "iniciativa_legislativa_popular": "500.000 firmas",

    # Reforma constitucional
    "reforma_ordinaria": "Art. 167 CE - 3/5 ambas Cámaras",
    "reforma_agravada": "Art. 168 CE - 2/3, disolución, nuevas Cortes, 2/3, referéndum",
    "materias_reforma_agravada": ["Título Preliminar", "Derechos Fundamentales Sección 1ª Cap. II Título I", "Corona"],
}

# Respuestas conocidas para preguntas específicas
RESPUESTAS_CONOCIDAS = {
    # Constitución - Fechas
    "entrada en vigor.*constitución": {
        "respuesta_contiene": "29 de diciembre",
        "explicacion": "La Constitución Española de 1978 entró en vigor el 29 de diciembre de 1978, día de su publicación en el BOE.",
        "referencia": "Disposición Final CE"
    },
    "referéndum.*constitución": {
        "respuesta_contiene": "6 de diciembre",
        "explicacion": "El referéndum de ratificación de la Constitución se celebró el 6 de diciembre de 1978, con un 87,78% de votos afirmativos.",
        "referencia": "Historia constitucional"
    },
    "primeras elecciones democráticas": {
        "respuesta_contiene": "1977",
        "explicacion": "Las primeras elecciones democráticas tras el franquismo se celebraron el 15 de junio de 1977.",
        "referencia": "Historia constitucional"
    },

    # Forma política
    "forma política del estado": {
        "respuesta_contiene": "parlamentaria",
        "explicacion": "El Art. 1.3 CE establece que la forma política del Estado español es la Monarquía Parlamentaria.",
        "referencia": "Art. 1.3 CE"
    },

    # Títulos
    "título ii.*constitución": {
        "respuesta_contiene": "corona",
        "explicacion": "El Título II de la CE (Arts. 56-65) está dedicado a la Corona, regulando la figura del Rey, sucesión y funciones.",
        "referencia": "Título II CE (Arts. 56-65)"
    },
    "título i.*constitución": {
        "respuesta_contiene": "derechos",
        "explicacion": "El Título I de la CE (Arts. 10-55) regula los derechos y deberes fundamentales.",
        "referencia": "Título I CE (Arts. 10-55)"
    },

    # Valores superiores
    "valores superiores": {
        "respuesta_contiene": ["libertad", "justicia", "igualdad", "pluralismo"],
        "explicacion": "El Art. 1.1 CE establece los valores superiores del ordenamiento: libertad, justicia, igualdad y pluralismo político.",
        "referencia": "Art. 1.1 CE"
    },

    # Soberanía
    "soberanía nacional": {
        "respuesta_contiene": "pueblo español",
        "explicacion": "El Art. 1.2 CE establece que la soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado.",
        "referencia": "Art. 1.2 CE"
    },

    # Tribunal Constitucional
    "magistrados.*tribunal constitucional": {
        "respuesta_contiene": "12",
        "explicacion": "El TC está compuesto por 12 magistrados nombrados por el Rey: 4 a propuesta del Congreso, 4 del Senado, 2 del Gobierno y 2 del CGPJ.",
        "referencia": "Art. 159.1 CE"
    },
    "mandato.*magistrados.*tc": {
        "respuesta_contiene": "9 años",
        "explicacion": "Los magistrados del TC son designados por un período de 9 años, renovándose por terceras partes cada 3 años.",
        "referencia": "Art. 159.3 CE"
    },

    # Defensor del Pueblo
    "defensor del pueblo.*mandato": {
        "respuesta_contiene": "5 años",
        "explicacion": "El Defensor del Pueblo es designado por las Cortes Generales por un período de 5 años.",
        "referencia": "Art. 2 LODP"
    },

    # Derechos fundamentales
    "derecho a la vida": {
        "respuesta_contiene": "15",
        "explicacion": "El derecho a la vida está reconocido en el Art. 15 CE, que también prohíbe la tortura y las penas o tratos inhumanos.",
        "referencia": "Art. 15 CE"
    },
    "libertad ideológica": {
        "respuesta_contiene": "16",
        "explicacion": "La libertad ideológica, religiosa y de culto está garantizada en el Art. 16 CE.",
        "referencia": "Art. 16 CE"
    },
    "tutela judicial efectiva": {
        "respuesta_contiene": "24",
        "explicacion": "El derecho a la tutela judicial efectiva se reconoce en el Art. 24 CE.",
        "referencia": "Art. 24 CE"
    },

    # Procedimiento Administrativo (Ley 39/2015)
    "plazo.*resolución.*procedimiento": {
        "respuesta_contiene": "3 meses",
        "explicacion": "El plazo máximo para resolver es de 3 meses cuando la norma no fije plazo específico (Art. 21.3 Ley 39/2015).",
        "referencia": "Art. 21.3 Ley 39/2015"
    },
    "silencio administrativo.*positivo": {
        "respuesta_contiene": "positivo",
        "explicacion": "Como regla general, el silencio es positivo en procedimientos iniciados a solicitud del interesado (Art. 24.1 Ley 39/2015).",
        "referencia": "Art. 24.1 Ley 39/2015"
    },

    # TREBEP
    "clases.*funcionarios": {
        "respuesta_contiene": ["carrera", "interinos"],
        "explicacion": "El Art. 9 TREBEP distingue funcionarios de carrera e interinos.",
        "referencia": "Art. 9 TREBEP"
    },

    # Contratos del Sector Público
    "contratos.*armonizados": {
        "respuesta_contiene": "publicidad",
        "explicacion": "Los contratos armonizados (SARA) requieren publicidad en el DOUE.",
        "referencia": "Art. 135 LCSP"
    },
}


def fix_encoding(text: str) -> str:
    """Corrige problemas de encoding en texto."""
    if not text:
        return text

    # Reemplazos directos de caracteres corruptos
    replacements = {
        '�': '',  # Eliminar caracteres de reemplazo
        'á': 'á', 'é': 'é', 'í': 'í', 'ó': 'ó', 'ú': 'ú',
        'ñ': 'ñ', 'Ñ': 'Ñ',
        'ü': 'ü', 'Ü': 'Ü',
        '¿': '¿', '¡': '¡',
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    # Patrones comunes de mojibake
    mojibake_patterns = [
        (r'\?Qu\?', '¿Qué'),
        (r'\?Cu\?l', '¿Cuál'),
        (r'\?C\?mo', '¿Cómo'),
        (r'Constituci\?n', 'Constitución'),
        (r'Espa\?a', 'España'),
        (r'espa\?ol', 'español'),
        (r'art\?culo', 'artículo'),
        (r'jur\?dic', 'jurídic'),
        (r'pol\?tic', 'polític'),
        (r'p\?blic', 'públic'),
        (r'administraci\?n', 'administración'),
        (r'funci\?n', 'función'),
        (r'disposici\?n', 'disposición'),
        (r'regulaci\?n', 'regulación'),
        (r'organizaci\?n', 'organización'),
        (r'informaci\?n', 'información'),
        (r'decisi\?n', 'decisión'),
        (r'comisi\?n', 'comisión'),
        (r'sesi\?n', 'sesión'),
        (r'relaci\?n', 'relación'),
        (r'resoluci\?n', 'resolución'),
        (r'Monarqu\?a', 'Monarquía'),
        (r'democr\?tic', 'democrátic'),
        (r'a\?o', 'año'),
        (r'Seg\?n', 'Según'),
        (r'seg\?n', 'según'),
        (r'ser\?', 'será'),
        (r'est\?', 'está'),
        (r'podr\?', 'podrá'),
        (r'deber\?', 'deberá'),
        (r'tendr\?', 'tendrá'),
        (r'm\?s', 'más'),
        (r'tambi\?n', 'también'),
        (r'd\?a', 'día'),
        (r'T\?tulo', 'Título'),
        (r't\?tulo', 'título'),
        (r'Pre\?mbulo', 'Preámbulo'),
        (r'pre\?mbulo', 'preámbulo'),
        (r'Aut\?nom', 'Autónom'),
        (r'aut\?nom', 'autónom'),
        (r'\?rgano', 'órgano'),
        (r'car\?cter', 'carácter'),
        (r'per\?odo', 'período'),
        (r'mayor\?a', 'mayoría'),
        (r'minor\?a', 'minoría'),
        (r'antig\?edad', 'antigüedad'),
    ]

    for pattern, replacement in mojibake_patterns:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

    return text


def find_correct_answer(question_text: str, options: List[Dict]) -> Tuple[int, str, str, float]:
    """
    Identifica la respuesta correcta usando la base de conocimiento.

    Returns:
        (correct_index, explanation, legal_reference, confidence)
    """
    q_lower = question_text.lower()
    q_clean = fix_encoding(q_lower)

    # Buscar en respuestas conocidas
    for pattern, data in RESPUESTAS_CONOCIDAS.items():
        if re.search(pattern, q_clean, re.IGNORECASE):
            respuesta_clave = data["respuesta_contiene"]

            # Buscar en las opciones
            for i, opt in enumerate(options):
                opt_text = fix_encoding(opt.get("text", "").lower())

                if isinstance(respuesta_clave, list):
                    # Debe contener todas las palabras clave
                    if all(k.lower() in opt_text for k in respuesta_clave):
                        return (i, data["explicacion"], data["referencia"], 0.95)
                else:
                    if respuesta_clave.lower() in opt_text:
                        return (i, data["explicacion"], data["referencia"], 0.95)

    # Heurísticas para casos comunes

    # Preguntas sobre fechas de la CE
    if "constitución" in q_clean and ("vigor" in q_clean or "entró" in q_clean):
        for i, opt in enumerate(options):
            if "29 de diciembre" in opt.get("text", "").lower():
                return (i,
                       "La CE entró en vigor el 29 de diciembre de 1978, día de su publicación en el BOE.",
                       "Disposición Final CE",
                       0.95)

    if "referéndum" in q_clean and "constitución" in q_clean:
        for i, opt in enumerate(options):
            if "6 de diciembre" in opt.get("text", "").lower():
                return (i,
                       "El referéndum de la CE se celebró el 6 de diciembre de 1978.",
                       "Historia constitucional",
                       0.95)

    # Forma política
    if "forma política" in q_clean:
        for i, opt in enumerate(options):
            if "parlamentaria" in opt.get("text", "").lower():
                return (i,
                       "La forma política del Estado español es la Monarquía Parlamentaria (Art. 1.3 CE).",
                       "Art. 1.3 CE",
                       0.95)

    # Títulos de la CE
    if "título ii" in q_clean and "constitución" in q_clean:
        for i, opt in enumerate(options):
            if "corona" in opt.get("text", "").lower():
                return (i,
                       "El Título II CE (Arts. 56-65) regula la Corona.",
                       "Título II CE",
                       0.95)

    if "título i" in q_clean and ("constitución" in q_clean or "derechos" in q_clean):
        for i, opt in enumerate(options):
            if "derechos" in opt.get("text", "").lower():
                return (i,
                       "El Título I CE (Arts. 10-55) regula los derechos y deberes fundamentales.",
                       "Título I CE",
                       0.95)

    # Si no encontramos respuesta, devolver -1
    return (-1, "", "", 0.0)


def complete_question(question: Dict) -> Dict:
    """Completa una pregunta con la información faltante."""
    completed = question.copy()

    # Corregir encoding en todos los campos de texto
    completed["question_text"] = fix_encoding(completed.get("question_text", ""))
    completed["original_text"] = fix_encoding(completed.get("original_text", ""))

    options = completed.get("options", [])
    for opt in options:
        opt["text"] = fix_encoding(opt.get("text", ""))

    # Buscar respuesta correcta
    correct_idx, explanation, reference, confidence = find_correct_answer(
        completed["question_text"],
        options
    )

    if correct_idx >= 0:
        # Marcar la respuesta correcta
        for i, opt in enumerate(options):
            opt["is_correct"] = (i == correct_idx)

        completed["options"] = options
        completed["explanation"] = explanation
        completed["legal_reference"] = reference
        completed["confidence_score"] = confidence
        completed["needs_ai_completion"] = False
    else:
        # No pudimos identificar la respuesta - requiere revisión manual
        completed["confidence_score"] = 0.0
        completed["needs_ai_completion"] = True
        completed["review_note"] = "No se pudo identificar la respuesta correcta automáticamente"

    return completed


def process_draft_file(file_path: Path) -> Tuple[int, int, int]:
    """
    Procesa un archivo draft y completa las preguntas.

    Returns:
        (total, completed, failed)
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data.get("questions", [])
    total = len(questions)
    completed = 0
    failed = 0

    new_questions = []
    for q in questions:
        completed_q = complete_question(q)
        new_questions.append(completed_q)

        if completed_q.get("confidence_score", 0) > 0:
            completed += 1
        else:
            failed += 1

    # Actualizar datos
    data["questions"] = new_questions
    data["metadata"]["ai_completion_date"] = datetime.now().isoformat()
    data["metadata"]["status"] = "ai_completed" if failed == 0 else "partial_completion"
    data["metadata"]["completed_count"] = completed
    data["metadata"]["failed_count"] = failed

    # Guardar
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return (total, completed, failed)


def check_status():
    """Muestra el estado de completado de los archivos draft."""
    print("=" * 70)
    print("ESTADO DE COMPLETADO IA")
    print("=" * 70)

    draft_files = sorted(DRAFT_DIR.glob("*_draft.json"))

    total_questions = 0
    total_completed = 0
    total_pending = 0

    for f in draft_files:
        with open(f, 'r', encoding='utf-8') as fp:
            data = json.load(fp)

        questions = data.get("questions", [])
        completed = sum(1 for q in questions if q.get("confidence_score", 0) > 0)
        pending = len(questions) - completed

        total_questions += len(questions)
        total_completed += completed
        total_pending += pending

        status = "✓" if pending == 0 else f"[{pending} pendientes]"
        print(f"  {status} {f.name}: {completed}/{len(questions)}")

    print(f"\n{'='*70}")
    print(f"TOTAL: {total_completed}/{total_questions} completadas ({total_pending} pendientes)")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Completar preguntas con IA")
    parser.add_argument('--file', type=str, help='Archivo específico a procesar')
    parser.add_argument('--check', action='store_true', help='Verificar estado')

    args = parser.parse_args()

    if args.check:
        check_status()
        return

    print("=" * 70)
    print("COMPLETADO DE PREGUNTAS CON IA")
    print("=" * 70)

    if args.file:
        files = [DRAFT_DIR / args.file]
    else:
        files = sorted(DRAFT_DIR.glob("*_draft.json"))

    print(f"\nArchivos a procesar: {len(files)}")

    grand_total = 0
    grand_completed = 0
    grand_failed = 0

    for file_path in files:
        if not file_path.exists():
            print(f"  [ERROR] No existe: {file_path.name}")
            continue

        print(f"  Procesando: {file_path.name}")
        total, completed, failed = process_draft_file(file_path)

        grand_total += total
        grand_completed += completed
        grand_failed += failed

        status = "✓" if failed == 0 else f"[{failed} sin completar]"
        print(f"    {status} {completed}/{total} completadas")

    print(f"\n{'='*70}")
    print("RESUMEN")
    print(f"{'='*70}")
    print(f"Total preguntas: {grand_total}")
    print(f"Completadas: {grand_completed}")
    print(f"Sin completar: {grand_failed}")
    print(f"Tasa de éxito: {grand_completed/grand_total*100:.1f}%")


if __name__ == "__main__":
    main()
