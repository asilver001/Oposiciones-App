#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 1: Extracción de preguntas desde exámenes Word/PDF.

Este script:
1. Lee archivos .docx, .doc y .pdf usando markitdown
2. Extrae preguntas y opciones en formato crudo
3. Guarda en .claude/questions/raw/ para procesamiento posterior

Parte del pipeline: EXTRACCIÓN → Reformulación → Validación → Publicación
"""

import subprocess
import json
import re
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Tuple

# Forzar UTF-8 en Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Rutas base
BASE_DIR = Path(r"C:\Users\alber\.claude-worktrees\OpositaSmart\epic-kirch\.claude")
EXAMS_DIR = BASE_DIR / "references" / "examenes"
RAW_DIR = BASE_DIR / "questions" / "raw"


def extract_with_markitdown(file_path: Path) -> str:
    """Extrae contenido markdown de un archivo usando markitdown."""
    try:
        result = subprocess.run(
            ['python', '-m', 'markitdown', str(file_path)],
            capture_output=True,
            text=True,
            timeout=120,
            encoding='utf-8',
            errors='replace'
        )
        return result.stdout
    except subprocess.TimeoutExpired:
        print(f"    [TIMEOUT] {file_path.name}")
        return ""
    except Exception as e:
        print(f"    [ERROR] {file_path.name}: {e}")
        return ""


def parse_format_bold(text: str) -> List[Dict]:
    """
    Formato 1: Preguntas en negrita
    1. **Pregunta texto:**
       1. Opción a
       2. Opción b
    """
    questions = []
    lines = text.split('\n')

    current_question = None
    current_options = []

    for line in lines:
        stripped = line.strip()

        # Detectar pregunta (número. **texto**)
        q_match = re.match(r'^(\d+)\.\s*\*\*(.+?)\*\*:?\s*$', stripped)
        if q_match:
            if current_question and len(current_options) >= 3:
                questions.append({
                    "raw_text": current_question,
                    "raw_options": current_options[:4],
                    "correct_index": None
                })
            current_question = q_match.group(2).strip()
            current_options = []
            continue

        # Detectar opción
        opt_match = re.match(r'^\s*(\d+)\.\s+(.+)$', stripped)
        if opt_match and current_question:
            opt_text = opt_match.group(2).strip()
            if opt_text and len(opt_text) > 2:
                current_options.append(opt_text)

    # Última pregunta
    if current_question and len(current_options) >= 3:
        questions.append({
            "raw_text": current_question,
            "raw_options": current_options[:4],
            "correct_index": None
        })

    return questions


def parse_format_hash(text: str) -> List[Dict]:
    """
    Formato 2: Preguntas con # títulos
    # Pregunta texto:
    * 1. Opción a
      2. Opción b
    """
    questions = []
    lines = text.split('\n')

    current_question = None
    current_options = []

    for line in lines:
        stripped = line.strip()

        # Detectar pregunta (# Texto)
        q_match = re.match(r'^#\s*(.+?)[:?]?\s*$', stripped)
        if q_match and not stripped.startswith('##'):
            if current_question and len(current_options) >= 3:
                questions.append({
                    "raw_text": current_question,
                    "raw_options": current_options[:4],
                    "correct_index": None
                })

            question_text = q_match.group(1).strip()
            # Filtrar títulos de tema
            if not re.match(r'^(TEMA|TEST|ORGANIZA|BLOQUE)', question_text, re.IGNORECASE):
                current_question = question_text
                current_options = []
            continue

        # Detectar opción
        opt_match = re.match(r'^\*?\s*(\d+)\.\s+(.+)$', stripped)
        if opt_match and current_question:
            opt_text = opt_match.group(2).strip()
            if opt_text and len(opt_text) > 2:
                current_options.append(opt_text)

    # Última pregunta
    if current_question and len(current_options) >= 3:
        questions.append({
            "raw_text": current_question,
            "raw_options": current_options[:4],
            "correct_index": None
        })

    return questions


def parse_format_letters(text: str) -> List[Dict]:
    """
    Formato 3: Preguntas numeradas con opciones a), b), c), d)
    1. Pregunta texto
    a) Opción a
    b) Opción b
    """
    questions = []
    lines = text.split('\n')

    current_question = None
    current_options = []

    for line in lines:
        stripped = line.strip()

        # Detectar pregunta (número. texto sin opciones)
        q_match = re.match(r'^(\d+)[\.\)]\s+(.+)$', stripped)
        if q_match:
            text = q_match.group(2).strip()
            # Verificar que no es una opción
            if not re.match(r'^[a-d]\)', text, re.IGNORECASE):
                if current_question and len(current_options) >= 3:
                    questions.append({
                        "raw_text": current_question,
                        "raw_options": current_options[:4],
                        "correct_index": None
                    })
                current_question = text
                current_options = []
                continue

        # Detectar opción con letra
        opt_match = re.match(r'^[a-dA-D][\)\.]?\s*(.+)$', stripped)
        if opt_match and current_question:
            opt_text = opt_match.group(1).strip()
            if opt_text and len(opt_text) > 2:
                current_options.append(opt_text)

    # Última pregunta
    if current_question and len(current_options) >= 3:
        questions.append({
            "raw_text": current_question,
            "raw_options": current_options[:4],
            "correct_index": None
        })

    return questions


def extract_questions(text: str) -> List[Dict]:
    """Intenta extraer preguntas usando múltiples formatos."""
    results = [
        ("bold", parse_format_bold(text)),
        ("hash", parse_format_hash(text)),
        ("letters", parse_format_letters(text)),
    ]

    # Devolver el formato que extraiga más preguntas
    best = max(results, key=lambda x: len(x[1]))
    return best[1]


def get_tema_from_path(file_path: Path) -> Tuple[int, str]:
    """
    Extrae el número de tema y categoría del path del archivo.
    Retorna (tema_num, categoria).
    """
    filename = file_path.name.upper()
    parent = file_path.parent.name.lower()

    # Detectar tema por nombre de archivo
    tema_patterns = [
        r'TEMA\s*(\d+)',
        r'TEST\s+TEMA\s*(\d+)',
        r'^(\d+)\s+TEST',
        r'TEMA(\d+)',
    ]

    tema_num = 0
    for pattern in tema_patterns:
        match = re.search(pattern, filename, re.IGNORECASE)
        if match:
            tema_num = int(match.group(1))
            break

    # Detectar categoría por carpeta padre
    categoria = "general"
    if "administrativo" in parent:
        categoria = "administrativo"
    elif "contratos" in parent:
        categoria = "contratos"
    elif "financiero" in parent:
        categoria = "financiero"
    elif "politica" in parent:
        categoria = "politicas"
    elif "ue" in parent:
        categoria = "union-europea"
    elif "repaso" in parent:
        categoria = "repaso"

    return tema_num, categoria


def process_file(file_path: Path) -> Optional[Dict]:
    """Procesa un archivo y extrae preguntas en formato raw."""
    print(f"  Procesando: {file_path.name}")

    # Extraer contenido
    content = extract_with_markitdown(file_path)
    if not content:
        print(f"    [SKIP] No se pudo extraer contenido")
        return None

    # Extraer preguntas
    questions = extract_questions(content)
    if not questions:
        print(f"    [SKIP] No se encontraron preguntas")
        return None

    # Metadata
    tema_num, categoria = get_tema_from_path(file_path)

    result = {
        "metadata": {
            "source_file": file_path.name,
            "source_path": str(file_path.relative_to(EXAMS_DIR)),
            "extraction_date": datetime.now().isoformat(),
            "tema": tema_num,
            "categoria": categoria,
            "total_questions": len(questions)
        },
        "questions": questions
    }

    print(f"    [OK] {len(questions)} preguntas extraídas (tema {tema_num}, {categoria})")
    return result


def scan_exam_files() -> List[Path]:
    """Escanea recursivamente todos los archivos de examen."""
    extensions = ['*.pdf', '*.docx', '*.doc']
    files = []

    for ext in extensions:
        # Archivos en raíz
        files.extend(EXAMS_DIR.glob(ext))
        # Archivos en subcarpetas
        files.extend(EXAMS_DIR.glob(f'**/{ext}'))

    # Eliminar duplicados y ordenar
    files = sorted(set(files))
    return files


def main():
    """Ejecuta la extracción de todos los exámenes."""
    print("=" * 70)
    print("FASE 1: EXTRACCIÓN DE PREGUNTAS")
    print("=" * 70)

    # Asegurar que existe el directorio de salida
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    # Escanear archivos
    exam_files = scan_exam_files()
    print(f"\nArchivos encontrados: {len(exam_files)}")

    # Agrupar por carpeta para mejor visualización
    by_folder = {}
    for f in exam_files:
        folder = f.parent.name if f.parent != EXAMS_DIR else "raiz"
        by_folder.setdefault(folder, []).append(f)

    print("\nDistribución por carpeta:")
    for folder, files in sorted(by_folder.items()):
        print(f"  {folder}: {len(files)} archivos")

    # Procesar cada archivo
    print("\n" + "-" * 70)
    results = []
    total_questions = 0

    for file_path in exam_files:
        result = process_file(file_path)
        if result:
            results.append(result)
            total_questions += result["metadata"]["total_questions"]

            # Guardar archivo individual
            safe_name = re.sub(r'[^\w\-]', '_', file_path.stem)
            output_file = RAW_DIR / f"{safe_name}_raw.json"

            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)

    # Resumen final
    print("\n" + "=" * 70)
    print("RESUMEN DE EXTRACCIÓN")
    print("=" * 70)
    print(f"\nArchivos procesados: {len(exam_files)}")
    print(f"Archivos con preguntas: {len(results)}")
    print(f"Total preguntas extraídas: {total_questions}")

    # Guardar resumen
    summary = {
        "extraction_date": datetime.now().isoformat(),
        "total_files_scanned": len(exam_files),
        "files_with_questions": len(results),
        "total_questions": total_questions,
        "by_categoria": {},
        "by_tema": {},
        "files": []
    }

    for r in results:
        meta = r["metadata"]
        cat = meta["categoria"]
        tema = meta["tema"]

        summary["by_categoria"][cat] = summary["by_categoria"].get(cat, 0) + meta["total_questions"]
        if tema > 0:
            summary["by_tema"][str(tema)] = summary["by_tema"].get(str(tema), 0) + meta["total_questions"]

        summary["files"].append({
            "file": meta["source_file"],
            "path": meta["source_path"],
            "tema": tema,
            "categoria": cat,
            "questions": meta["total_questions"]
        })

    summary_file = RAW_DIR / "_extraction_summary.json"
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print(f"\nResumen guardado en: {summary_file.name}")

    # Mostrar distribución
    print("\nPreguntas por categoría:")
    for cat, count in sorted(summary["by_categoria"].items()):
        print(f"  {cat}: {count}")

    print("\nPreguntas por tema (top 10):")
    sorted_temas = sorted(summary["by_tema"].items(), key=lambda x: int(x[0]))
    for tema, count in sorted_temas[:10]:
        print(f"  Tema {tema}: {count}")

    return results


if __name__ == "__main__":
    main()
