#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script maestro del pipeline de procesamiento de preguntas.

Pipeline completo:
  EXTRACCIÓN → REFORMULACIÓN → VALIDACIÓN → PUBLICACIÓN

Uso:
  python run_pipeline.py --all          # Ejecuta todo el pipeline
  python run_pipeline.py --extract      # Solo extracción
  python run_pipeline.py --reformulate  # Solo reformulación
  python run_pipeline.py --review       # Solo revisión
  python run_pipeline.py --publish      # Solo publicación
  python run_pipeline.py --status       # Ver estado actual
"""

import sys
import argparse
import json
from pathlib import Path
from datetime import datetime

# Forzar UTF-8 en Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Rutas
BASE_DIR = Path(r"C:\Users\alber\.claude-worktrees\OpositaSmart\epic-kirch\.claude")
SCRIPTS_DIR = BASE_DIR / "scripts"
RAW_DIR = BASE_DIR / "questions" / "raw"
DRAFT_DIR = BASE_DIR / "questions" / "draft"
APPROVED_DIR = BASE_DIR / "questions" / "approved"
REJECTED_DIR = BASE_DIR / "questions" / "rejected"


def count_questions_in_dir(directory: Path, pattern: str = "*.json") -> int:
    """Cuenta preguntas en archivos JSON de un directorio."""
    total = 0
    for f in directory.glob(pattern):
        if f.name.startswith("_"):
            continue
        try:
            with open(f, 'r', encoding='utf-8') as fp:
                data = json.load(fp)
                total += len(data.get("questions", []))
        except:
            pass
    return total


def show_status():
    """Muestra el estado actual del pipeline."""
    print("=" * 70)
    print("ESTADO DEL PIPELINE")
    print("=" * 70)

    # Contar archivos y preguntas en cada etapa
    stages = [
        ("raw/", RAW_DIR, "*_raw.json"),
        ("draft/", DRAFT_DIR, "*_draft.json"),
        ("approved/", APPROVED_DIR, "*_approved.json"),
        ("rejected/", REJECTED_DIR, "*_rejected.json"),
    ]

    print(f"\n{'Carpeta':<15} {'Archivos':<12} {'Preguntas':<12}")
    print("-" * 40)

    for name, directory, pattern in stages:
        if directory.exists():
            files = list(directory.glob(pattern))
            files = [f for f in files if not f.name.startswith("_")]
            questions = count_questions_in_dir(directory, pattern)
            print(f"{name:<15} {len(files):<12} {questions:<12}")
        else:
            print(f"{name:<15} {'N/A':<12} {'N/A':<12}")

    # Mostrar último resumen de extracción
    summary_file = RAW_DIR / "_extraction_summary.json"
    if summary_file.exists():
        with open(summary_file, 'r', encoding='utf-8') as f:
            summary = json.load(f)
        print(f"\n{'='*40}")
        print("Última extracción:")
        print(f"  Fecha: {summary.get('extraction_date', 'N/A')}")
        print(f"  Archivos procesados: {summary.get('total_files_scanned', 0)}")
        print(f"  Total preguntas: {summary.get('total_questions', 0)}")


def run_extract():
    """Ejecuta la fase de extracción."""
    print("\n>>> Ejecutando FASE 1: EXTRACCIÓN")
    import extract_questions
    extract_questions.main()


def run_reformulate():
    """Ejecuta la fase de reformulación."""
    print("\n>>> Ejecutando FASE 2: REFORMULACIÓN")
    import reformulate_questions
    reformulate_questions.main()


def run_review():
    """Ejecuta la fase de revisión."""
    print("\n>>> Ejecutando FASE 3: VALIDACIÓN")
    import review_questions
    review_questions.main()


def run_publish():
    """Ejecuta la fase de publicación."""
    print("\n>>> Ejecutando FASE 4: PUBLICACIÓN")
    import publish_questions
    publish_questions.main()


def run_all():
    """Ejecuta todo el pipeline."""
    print("=" * 70)
    print("PIPELINE COMPLETO DE PROCESAMIENTO")
    print("=" * 70)
    print(f"\nInicio: {datetime.now().isoformat()}")

    run_extract()
    run_reformulate()
    run_review()
    run_publish()

    print("\n" + "=" * 70)
    print("PIPELINE COMPLETADO")
    print("=" * 70)
    print(f"Fin: {datetime.now().isoformat()}")
    show_status()


def main():
    parser = argparse.ArgumentParser(
        description="Pipeline de procesamiento de preguntas de oposiciones",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  python run_pipeline.py --status        Ver estado actual
  python run_pipeline.py --extract       Solo extracción
  python run_pipeline.py --all           Pipeline completo
        """
    )

    parser.add_argument('--status', action='store_true',
                        help='Mostrar estado actual del pipeline')
    parser.add_argument('--extract', action='store_true',
                        help='Ejecutar solo extracción (Fase 1)')
    parser.add_argument('--reformulate', action='store_true',
                        help='Ejecutar solo reformulación (Fase 2)')
    parser.add_argument('--review', action='store_true',
                        help='Ejecutar solo revisión (Fase 3)')
    parser.add_argument('--publish', action='store_true',
                        help='Ejecutar solo publicación (Fase 4)')
    parser.add_argument('--all', action='store_true',
                        help='Ejecutar pipeline completo')

    args = parser.parse_args()

    # Cambiar al directorio de scripts para imports
    import os
    os.chdir(SCRIPTS_DIR)
    sys.path.insert(0, str(SCRIPTS_DIR))

    # Ejecutar según argumentos
    if args.status:
        show_status()
    elif args.extract:
        run_extract()
    elif args.reformulate:
        run_reformulate()
    elif args.review:
        run_review()
    elif args.publish:
        run_publish()
    elif args.all:
        run_all()
    else:
        # Por defecto mostrar estado
        show_status()
        print("\nUsa --help para ver opciones disponibles")


if __name__ == "__main__":
    main()
