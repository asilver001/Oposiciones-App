#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 4: Publicación de preguntas aprobadas a Supabase.

Este script:
1. Lee preguntas de .claude/questions/approved/
2. Detecta duplicados usando similitud de texto
3. Inserta en la tabla 'questions' de Supabase
4. Archiva archivos procesados

NOTA: Requiere configuración de Supabase MCP o credenciales.

Parte del pipeline: Extracción → Reformulación → Validación → PUBLICACIÓN
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import re
import shutil

# Forzar UTF-8 en Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Rutas base
BASE_DIR = Path(r"C:\Users\alber\.claude-worktrees\OpositaSmart\epic-kirch\.claude")
APPROVED_DIR = BASE_DIR / "questions" / "approved"
ARCHIVE_DIR = APPROVED_DIR / "archivo"


def jaccard_similarity(text1: str, text2: str) -> float:
    """Calcula similitud Jaccard entre dos textos."""
    # Normalizar
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())

    if not words1 or not words2:
        return 0.0

    intersection = len(words1 & words2)
    union = len(words1 | words2)

    return intersection / union if union > 0 else 0.0


def transform_to_supabase_format(question: Dict) -> Dict:
    """
    Transforma una pregunta del formato draft al formato de Supabase.

    Formato de la tabla questions:
    - pregunta: texto de la pregunta
    - opciones: array de strings
    - respuesta_correcta: índice (0-3)
    - tema: número
    - materia: string
    - dificultad: string
    - explicacion: texto
    - articulo_referencia: string
    - is_active: boolean
    - validation_status: string
    """
    options = question.get("options", [])

    # Encontrar índice de respuesta correcta
    correct_index = 0
    for i, opt in enumerate(options):
        if opt.get("is_correct", False):
            correct_index = i
            break

    # Extraer textos de opciones
    opciones = [opt.get("text", "") for opt in options]

    return {
        "pregunta": question.get("question_text", ""),
        "opciones": opciones,
        "respuesta_correcta": correct_index,
        "tema": question.get("tema", 0),
        "materia": question.get("materia", ""),
        "dificultad": question.get("difficulty", "media"),
        "explicacion": question.get("explanation", ""),
        "articulo_referencia": question.get("legal_reference", ""),
        "is_active": True,
        "validation_status": "auto_validated",
        "source": question.get("source", ""),
        "origin_type": question.get("origin_type", "reformulated")
    }


def check_duplicate(new_question: Dict, existing_questions: List[Dict], threshold: float = 0.90) -> bool:
    """
    Verifica si la pregunta es duplicada.
    Retorna True si es duplicada.
    """
    new_text = new_question.get("pregunta", "")

    for existing in existing_questions:
        existing_text = existing.get("pregunta", "")
        similarity = jaccard_similarity(new_text, existing_text)
        if similarity >= threshold:
            return True

    return False


def load_approved_questions() -> List[Dict]:
    """Carga todas las preguntas aprobadas."""
    all_questions = []

    for approved_file in APPROVED_DIR.glob("*_approved.json"):
        with open(approved_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            questions = data.get("questions", [])
            for q in questions:
                q["_source_file"] = approved_file.name
            all_questions.extend(questions)

    return all_questions


def generate_publication_batch(questions: List[Dict], existing_questions: List[Dict]) -> Dict:
    """
    Genera un batch de publicación.
    Separa preguntas nuevas de duplicadas.
    """
    to_insert = []
    duplicates = []

    for q in questions:
        supabase_format = transform_to_supabase_format(q)

        if check_duplicate(supabase_format, existing_questions):
            duplicates.append({
                "question": supabase_format,
                "reason": "duplicate"
            })
        else:
            to_insert.append(supabase_format)
            # Añadir a existing para detectar duplicados dentro del mismo batch
            existing_questions.append(supabase_format)

    return {
        "to_insert": to_insert,
        "duplicates": duplicates
    }


def main():
    """Prepara las preguntas para publicación."""
    print("=" * 70)
    print("FASE 4: PUBLICACIÓN A SUPABASE")
    print("=" * 70)

    # Cargar preguntas aprobadas
    questions = load_approved_questions()

    if not questions:
        print("\nNo hay preguntas aprobadas para publicar")
        return

    print(f"\nPreguntas aprobadas encontradas: {len(questions)}")

    # Generar batch (sin conexión a Supabase real)
    # En producción, aquí se cargarían las preguntas existentes de la BD
    existing_questions = []  # Placeholder

    batch = generate_publication_batch(questions, existing_questions)

    print(f"\nPreguntas a insertar: {len(batch['to_insert'])}")
    print(f"Duplicados detectados: {len(batch['duplicates'])}")

    # Guardar batch para publicación manual o vía MCP
    batch_file = APPROVED_DIR / f"_publication_batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(batch_file, 'w', encoding='utf-8') as f:
        json.dump({
            "generated_at": datetime.now().isoformat(),
            "total_questions": len(questions),
            "to_insert_count": len(batch['to_insert']),
            "duplicates_count": len(batch['duplicates']),
            "to_insert": batch['to_insert'],
            "duplicates": batch['duplicates']
        }, f, ensure_ascii=False, indent=2)

    print(f"\nBatch guardado en: {batch_file.name}")

    # Mostrar distribución por tema
    print("\nDistribución por tema:")
    by_tema = {}
    for q in batch['to_insert']:
        tema = q.get("tema", 0)
        by_tema[tema] = by_tema.get(tema, 0) + 1

    for tema, count in sorted(by_tema.items()):
        print(f"  Tema {tema}: {count} preguntas")

    print("\n" + "-" * 70)
    print("SIGUIENTE PASO:")
    print("-" * 70)
    print(f"""
Para publicar las preguntas en Supabase, usa el MCP de Supabase:

  1. Abre el archivo: {batch_file.name}
  2. Usa mcp__supabase__execute_sql para insertar cada pregunta

O ejecuta manualmente:

  INSERT INTO questions (pregunta, opciones, respuesta_correcta, tema, ...)
  VALUES (...)

El batch contiene {len(batch['to_insert'])} preguntas listas para insertar.
""")


if __name__ == "__main__":
    main()
