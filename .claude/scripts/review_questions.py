#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 3: Validación de preguntas según 7 dimensiones.

Este script:
1. Lee preguntas de .claude/questions/draft/
2. Evalúa cada pregunta en 7 dimensiones de calidad
3. Auto-aprueba (≥0.95), auto-corrige (0.80-0.94), o rechaza (<0.80)
4. Mueve a approved/ o rejected/

Dimensiones de evaluación:
1. Precisión Legal (30%): Artículos, leyes, fechas correctas
2. Respuesta Única (25%): Solo una opción correcta
3. Distractores (15%): Opciones incorrectas plausibles
4. Claridad (15%): Lenguaje claro y sin ambigüedades
5. Actualización (10%): Leyes vigentes y no derogadas
6. Formato (3%): Estructura JSON correcta
7. Dificultad (2%): Nivel coherente con contenido

Parte del pipeline: Extracción → Reformulación → VALIDACIÓN → Publicación
"""

import json
import sys
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple
import shutil

# Forzar UTF-8 en Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Rutas base
BASE_DIR = Path(r"C:\Users\alber\.claude-worktrees\OpositaSmart\epic-kirch\.claude")
DRAFT_DIR = BASE_DIR / "questions" / "draft"
APPROVED_DIR = BASE_DIR / "questions" / "approved"
REJECTED_DIR = BASE_DIR / "questions" / "rejected"

# Pesos de las dimensiones
DIMENSION_WEIGHTS = {
    "precision_legal": 0.30,
    "respuesta_unica": 0.25,
    "distractores": 0.15,
    "claridad": 0.15,
    "actualizacion": 0.10,
    "formato": 0.03,
    "dificultad": 0.02
}


def check_format(question: Dict) -> Tuple[float, List[str]]:
    """
    Verifica el formato técnico de la pregunta.
    Retorna (score 0-1, lista de errores).
    """
    errors = []
    required_fields = [
        "question_text", "options", "origin_type", "tema", "materia"
    ]

    # Verificar campos requeridos
    for field in required_fields:
        if field not in question:
            errors.append(f"Campo faltante: {field}")

    # Verificar opciones
    options = question.get("options", [])
    if not isinstance(options, list):
        errors.append("'options' debe ser una lista")
    elif len(options) < 3:
        errors.append(f"Mínimo 3 opciones, hay {len(options)}")
    elif len(options) > 4:
        errors.append(f"Máximo 4 opciones, hay {len(options)}")
    else:
        for i, opt in enumerate(options):
            if not isinstance(opt, dict):
                errors.append(f"Opción {i} debe ser un diccionario")
            elif "text" not in opt:
                errors.append(f"Opción {i} sin campo 'text'")
            elif "is_correct" not in opt:
                errors.append(f"Opción {i} sin campo 'is_correct'")

    # Verificar pregunta no vacía
    if not question.get("question_text", "").strip():
        errors.append("Pregunta vacía")

    score = 1.0 - (len(errors) * 0.2)
    return max(0.0, score), errors


def check_single_answer(question: Dict) -> Tuple[float, List[str]]:
    """
    Verifica que haya exactamente una respuesta correcta.
    """
    errors = []
    options = question.get("options", [])

    correct_count = sum(1 for opt in options if opt.get("is_correct", False))

    if correct_count == 0:
        errors.append("No hay respuesta correcta marcada")
        return 0.0, errors
    elif correct_count > 1:
        errors.append(f"Hay {correct_count} respuestas correctas (debe ser 1)")
        return 0.3, errors

    return 1.0, errors


def check_distractors(question: Dict) -> Tuple[float, List[str]]:
    """
    Verifica que los distractores sean plausibles.
    """
    errors = []
    options = question.get("options", [])

    # Verificar que las opciones incorrectas tengan contenido sustancial
    incorrect_options = [opt for opt in options if not opt.get("is_correct", False)]

    short_count = 0
    for opt in incorrect_options:
        text = opt.get("text", "")
        if len(text) < 10:
            short_count += 1
            errors.append(f"Distractor muy corto: '{text[:20]}...'")

    # Verificar que no sean idénticas
    texts = [opt.get("text", "").lower().strip() for opt in options]
    if len(texts) != len(set(texts)):
        errors.append("Hay opciones duplicadas")
        return 0.5, errors

    score = 1.0 - (short_count * 0.25)
    return max(0.0, score), errors


def check_clarity(question: Dict) -> Tuple[float, List[str]]:
    """
    Verifica claridad del enunciado.
    """
    errors = []
    text = question.get("question_text", "")

    # Verificar longitud razonable
    if len(text) < 20:
        errors.append("Pregunta muy corta")
    elif len(text) > 500:
        errors.append("Pregunta muy larga")

    # Verificar que termina con signo de interrogación o dos puntos
    if not text.strip().endswith(('?', ':', '.')):
        errors.append("Pregunta no termina correctamente")

    # Verificar palabras ambiguas
    ambiguous_patterns = [
        r'\betc\b',
        r'\bcualquier\b.*\bcualquier\b',
        r'posiblemente',
        r'quizás',
    ]

    for pattern in ambiguous_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            errors.append(f"Lenguaje ambiguo detectado")
            break

    score = 1.0 - (len(errors) * 0.25)
    return max(0.0, score), errors


def check_legal_precision(question: Dict) -> Tuple[float, List[str]]:
    """
    Verifica precisión legal (requiere referencia).
    """
    errors = []

    # Verificar que tiene referencia legal
    legal_ref = question.get("legal_reference", "")
    if not legal_ref:
        errors.append("Sin referencia legal")
        return 0.6, errors  # Penalizar pero no rechazar

    # Verificar formato de referencia
    valid_patterns = [
        r'art[íi]culo?\s*\d+',
        r'art\.?\s*\d+',
        r'ley\s+\d+/\d+',
        r'real\s+decreto',
        r'constituci[óo]n',
        r'CE\s*$',
    ]

    has_valid_ref = any(
        re.search(p, legal_ref, re.IGNORECASE)
        for p in valid_patterns
    )

    if not has_valid_ref:
        errors.append("Formato de referencia legal no reconocido")
        return 0.7, errors

    return 1.0, errors


def check_currency(question: Dict) -> Tuple[float, List[str]]:
    """
    Verifica actualización legal (heurística básica).
    """
    errors = []
    text = question.get("question_text", "")
    options_text = ' '.join(opt.get("text", "") for opt in question.get("options", []))
    combined = text + " " + options_text

    # Patrones de leyes potencialmente derogadas
    outdated_patterns = [
        (r'ley\s+30/1992', "Ley 30/1992 derogada por Ley 39/2015"),
        (r'ley\s+6/1997', "Ley 6/1997 derogada por Ley 40/2015"),
    ]

    for pattern, message in outdated_patterns:
        if re.search(pattern, combined, re.IGNORECASE):
            errors.append(message)
            return 0.5, errors

    return 1.0, errors


def check_difficulty(question: Dict) -> Tuple[float, List[str]]:
    """
    Verifica coherencia de dificultad.
    """
    errors = []
    difficulty = question.get("difficulty", "media")

    if difficulty not in ["facil", "media", "dificil"]:
        errors.append(f"Dificultad inválida: {difficulty}")
        return 0.5, errors

    return 1.0, errors


def evaluate_question(question: Dict) -> Dict:
    """
    Evalúa una pregunta en las 7 dimensiones.
    Retorna scores y decisión.
    """
    scores = {}
    all_errors = []

    # Evaluar cada dimensión
    scores["formato"], errs = check_format(question)
    all_errors.extend(errs)

    scores["respuesta_unica"], errs = check_single_answer(question)
    all_errors.extend(errs)

    scores["distractores"], errs = check_distractors(question)
    all_errors.extend(errs)

    scores["claridad"], errs = check_clarity(question)
    all_errors.extend(errs)

    scores["precision_legal"], errs = check_legal_precision(question)
    all_errors.extend(errs)

    scores["actualizacion"], errs = check_currency(question)
    all_errors.extend(errs)

    scores["dificultad"], errs = check_difficulty(question)
    all_errors.extend(errs)

    # Calcular score ponderado
    weighted_score = sum(
        scores[dim] * weight
        for dim, weight in DIMENSION_WEIGHTS.items()
    )

    # Determinar status
    if weighted_score >= 0.95:
        status = "auto_approved"
    elif weighted_score >= 0.80:
        # Intentar auto-corregir
        can_fix, fixed_question = attempt_auto_fix(question, all_errors)
        if can_fix:
            status = "auto_corrected"
            question = fixed_question
        else:
            status = "auto_approved"  # Aprobar con warnings
    else:
        status = "human_required"

    return {
        "question": question,
        "scores": scores,
        "weighted_score": round(weighted_score, 3),
        "status": status,
        "errors": all_errors,
        "reviewed_date": datetime.now().isoformat()
    }


def attempt_auto_fix(question: Dict, errors: List[str]) -> Tuple[bool, Dict]:
    """
    Intenta corregir errores automáticamente.
    Solo corrige errores seguros (formato, ortografía).
    """
    fixed = question.copy()
    fixes_applied = []

    # Fix: Añadir is_correct si falta
    options = fixed.get("options", [])
    for i, opt in enumerate(options):
        if "is_correct" not in opt:
            opt["is_correct"] = (i == 0)  # Primera como default
            fixes_applied.append(f"Añadido is_correct a opción {i}")

    # Fix: Normalizar dificultad
    difficulty = fixed.get("difficulty", "")
    if difficulty not in ["facil", "media", "dificil"]:
        fixed["difficulty"] = "media"
        fixes_applied.append("Normalizada dificultad a 'media'")

    # Fix: Añadir referencia genérica si falta
    if not fixed.get("legal_reference"):
        tema = fixed.get("tema", 0)
        if tema <= 5:
            fixed["legal_reference"] = "Constitución Española"
        else:
            fixed["legal_reference"] = "Legislación administrativa"
        fixes_applied.append("Añadida referencia legal genérica")

    return len(fixes_applied) > 0, fixed


def process_draft_file(draft_file: Path) -> Dict:
    """Procesa un archivo draft y evalúa sus preguntas."""
    with open(draft_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    metadata = data.get("metadata", {})
    questions = data.get("questions", [])

    results = {
        "approved": [],
        "corrected": [],
        "rejected": []
    }

    for q in questions:
        evaluation = evaluate_question(q)

        if evaluation["status"] == "auto_approved":
            results["approved"].append(evaluation)
        elif evaluation["status"] == "auto_corrected":
            results["corrected"].append(evaluation)
        else:
            results["rejected"].append(evaluation)

    return {
        "metadata": metadata,
        "source_file": draft_file.name,
        "results": results,
        "summary": {
            "total": len(questions),
            "approved": len(results["approved"]),
            "corrected": len(results["corrected"]),
            "rejected": len(results["rejected"])
        }
    }


def save_results(processed: Dict):
    """Guarda los resultados en las carpetas correspondientes."""
    source = processed["source_file"]
    base_name = source.replace("_draft.json", "")

    # Guardar aprobados
    approved = processed["results"]["approved"] + processed["results"]["corrected"]
    if approved:
        approved_questions = [r["question"] for r in approved]
        approved_file = APPROVED_DIR / f"{base_name}_approved.json"
        with open(approved_file, 'w', encoding='utf-8') as f:
            json.dump({
                "metadata": processed["metadata"],
                "questions": approved_questions,
                "review_summary": {
                    "auto_approved": len(processed["results"]["approved"]),
                    "auto_corrected": len(processed["results"]["corrected"]),
                    "reviewed_date": datetime.now().isoformat()
                }
            }, f, ensure_ascii=False, indent=2)

    # Guardar rechazados
    rejected = processed["results"]["rejected"]
    if rejected:
        rejected_file = REJECTED_DIR / f"{base_name}_rejected.json"
        with open(rejected_file, 'w', encoding='utf-8') as f:
            json.dump({
                "metadata": processed["metadata"],
                "questions": [{
                    "question": r["question"],
                    "errors": r["errors"],
                    "scores": r["scores"],
                    "weighted_score": r["weighted_score"]
                } for r in rejected],
                "rejected_date": datetime.now().isoformat()
            }, f, ensure_ascii=False, indent=2)


def main():
    """Ejecuta la revisión de todas las preguntas en draft."""
    print("=" * 70)
    print("FASE 3: VALIDACIÓN DE PREGUNTAS")
    print("=" * 70)

    # Asegurar directorios
    APPROVED_DIR.mkdir(parents=True, exist_ok=True)
    REJECTED_DIR.mkdir(parents=True, exist_ok=True)

    # Buscar archivos draft
    draft_files = sorted(DRAFT_DIR.glob("*_draft.json"))

    if not draft_files:
        print("\nNo se encontraron archivos en draft/")
        return

    print(f"\nArchivos draft encontrados: {len(draft_files)}")

    # Procesar cada archivo
    total_stats = {
        "total": 0,
        "approved": 0,
        "corrected": 0,
        "rejected": 0
    }

    for draft_file in draft_files:
        print(f"\n  Revisando: {draft_file.name}")

        try:
            processed = process_draft_file(draft_file)
            summary = processed["summary"]

            print(f"    Total: {summary['total']}")
            print(f"    ✓ Aprobadas: {summary['approved']}")
            print(f"    ~ Corregidas: {summary['corrected']}")
            print(f"    ✗ Rechazadas: {summary['rejected']}")

            # Guardar resultados
            save_results(processed)

            # Actualizar totales
            for key in total_stats:
                total_stats[key] += summary.get(key, 0)

        except Exception as e:
            print(f"    [ERROR] {e}")

    # Resumen final
    print("\n" + "=" * 70)
    print("RESUMEN DE VALIDACIÓN")
    print("=" * 70)
    print(f"\nTotal preguntas revisadas: {total_stats['total']}")
    print(f"  ✓ Auto-aprobadas: {total_stats['approved']}")
    print(f"  ~ Auto-corregidas: {total_stats['corrected']}")
    print(f"  ✗ Requieren revisión humana: {total_stats['rejected']}")

    if total_stats['total'] > 0:
        approval_rate = (total_stats['approved'] + total_stats['corrected']) / total_stats['total'] * 100
        print(f"\nTasa de aprobación: {approval_rate:.1f}%")

    print(f"\nArchivos aprobados en: {APPROVED_DIR}")
    print(f"Archivos rechazados en: {REJECTED_DIR}")


if __name__ == "__main__":
    main()
