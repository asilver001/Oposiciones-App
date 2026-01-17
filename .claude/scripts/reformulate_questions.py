#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 2: Reformulación de preguntas extraídas.

Este script:
1. Lee preguntas crudas de .claude/questions/raw/
2. Identifica la respuesta correcta
3. Añade explicación y referencia legal
4. Crea variantes reformuladas (opcional)
5. Guarda en .claude/questions/draft/

NOTA: Este script prepara el JSON pero la reformulación real
debe hacerse invocando a Claude con el prompt adecuado.

Parte del pipeline: Extracción → REFORMULACIÓN → Validación → Publicación
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import re

# Forzar UTF-8 en Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Rutas base
BASE_DIR = Path(r"C:\Users\alber\.claude-worktrees\OpositaSmart\epic-kirch\.claude")
RAW_DIR = BASE_DIR / "questions" / "raw"
DRAFT_DIR = BASE_DIR / "questions" / "draft"


def get_materia_for_tema(tema: int, categoria: str) -> str:
    """Determina la materia basada en tema y categoría."""
    if categoria == "contratos":
        return "contratos-publicos"
    elif categoria == "financiero":
        return "gestion-financiera"
    elif categoria == "union-europea":
        return "union-europea"
    elif categoria == "administrativo":
        return "proc-administrativo"
    elif tema <= 5:
        return "ce-constitucion"
    elif tema <= 10:
        return "org-administrativa"
    elif tema <= 13:
        return "funcion-publica"
    elif tema <= 18:
        return "proc-administrativo"
    else:
        return "ofimatica"


def estimate_difficulty(text: str, options: List[str]) -> str:
    """Estima la dificultad basada en características del texto."""
    # Indicadores de dificultad
    high_indicators = [
        r'excep(to|ción)',
        r'NO\s+es',
        r'FALSA',
        r'incorrecta',
        r'cual.*no.*es',
        r'todas.*siguientes.*excepto',
    ]

    medium_indicators = [
        r'según.*art[íi]culo',
        r'plazo',
        r'mayor[ií]a',
        r'quor[úu]m',
    ]

    text_lower = text.lower()
    options_text = ' '.join(options).lower()
    combined = text_lower + ' ' + options_text

    # Contar indicadores
    high_count = sum(1 for p in high_indicators if re.search(p, combined, re.IGNORECASE))
    medium_count = sum(1 for p in medium_indicators if re.search(p, combined, re.IGNORECASE))

    if high_count >= 2:
        return "dificil"
    elif high_count >= 1 or medium_count >= 2:
        return "media"
    else:
        return "facil"


def clean_text(text: str) -> str:
    """Limpia el texto de caracteres extraños."""
    # Reemplazar caracteres de control
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    # Normalizar espacios
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def prepare_question_for_reformulation(raw_question: Dict, metadata: Dict) -> Dict:
    """
    Prepara una pregunta cruda para el proceso de reformulación.

    Retorna un objeto que necesita ser completado por Claude con:
    - correct_index: Índice de la respuesta correcta (0-3)
    - explanation: Explicación detallada
    - legal_reference: Artículo/ley de referencia
    """
    raw_text = clean_text(raw_question.get("raw_text", ""))
    raw_options = [clean_text(opt) for opt in raw_question.get("raw_options", [])]

    tema = metadata.get("tema", 0)
    categoria = metadata.get("categoria", "general")

    return {
        "question_text": raw_text,
        "options": [
            {"text": opt, "is_correct": False}  # Por determinar
            for opt in raw_options[:4]
        ],
        "explanation": "",  # Por completar
        "legal_reference": "",  # Por completar
        "origin_type": "reformulated",
        "original_text": raw_text,
        "source": metadata.get("source_file", "unknown"),
        "reformulation_type": "clarificacion",  # Por defecto
        "confidence_score": 0.0,  # Por determinar tras revisión
        "tema": tema,
        "materia": get_materia_for_tema(tema, categoria),
        "difficulty": estimate_difficulty(raw_text, raw_options),
        "needs_ai_completion": True,  # Flag para indicar que necesita procesamiento
    }


def generate_reformulation_prompt(questions: List[Dict], source_file: str) -> str:
    """
    Genera un prompt para que Claude complete las preguntas.

    Este prompt se puede usar manualmente o con la API.
    """
    prompt = f"""# Reformulación de Preguntas de Examen

**Archivo fuente:** {source_file}
**Total preguntas:** {len(questions)}

## Instrucciones

Para cada pregunta, debes:

1. **Identificar la respuesta correcta** (índice 0-3)
2. **Añadir explicación** (2-3 oraciones con fundamento legal)
3. **Añadir referencia legal** (artículo/ley específica)
4. **Asignar confidence_score** (0.70-0.99 según certeza)

## Formato de Respuesta

Responde en JSON con este formato para cada pregunta:

```json
{{
  "question_index": 0,
  "correct_option_index": 0,
  "explanation": "Explicación detallada...",
  "legal_reference": "Art. X de la Ley Y",
  "confidence_score": 0.95
}}
```

## Preguntas a Procesar

"""

    for i, q in enumerate(questions):
        prompt += f"""
### Pregunta {i + 1}

**Texto:** {q['question_text']}

**Opciones:**
"""
        for j, opt in enumerate(q['options']):
            prompt += f"  {j}. {opt['text']}\n"

        prompt += "\n---\n"

    return prompt


def process_raw_file(raw_file: Path) -> Dict:
    """Procesa un archivo raw y prepara para reformulación."""
    with open(raw_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    metadata = data.get("metadata", {})
    raw_questions = data.get("questions", [])

    prepared_questions = []
    for raw_q in raw_questions:
        prepared = prepare_question_for_reformulation(raw_q, metadata)
        prepared_questions.append(prepared)

    # Generar prompt para Claude
    prompt = generate_reformulation_prompt(prepared_questions, metadata.get("source_file", raw_file.name))

    return {
        "metadata": {
            "source_file": metadata.get("source_file", raw_file.name),
            "source_path": metadata.get("source_path", ""),
            "tema": metadata.get("tema", 0),
            "categoria": metadata.get("categoria", "general"),
            "extraction_date": metadata.get("extraction_date", ""),
            "reformulation_date": datetime.now().isoformat(),
            "total_questions": len(prepared_questions),
            "status": "pending_ai_completion"
        },
        "questions": prepared_questions,
        "reformulation_prompt": prompt
    }


def save_draft(output_data: Dict, output_file: Path):
    """Guarda el archivo draft sin el prompt (solo las preguntas)."""
    # Crear versión sin el prompt para guardar
    save_data = {
        "metadata": output_data["metadata"],
        "questions": output_data["questions"]
    }

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(save_data, f, ensure_ascii=False, indent=2)


def main():
    """Prepara todas las preguntas para reformulación."""
    print("=" * 70)
    print("FASE 2: PREPARACIÓN PARA REFORMULACIÓN")
    print("=" * 70)

    # Asegurar que existe el directorio de salida
    DRAFT_DIR.mkdir(parents=True, exist_ok=True)

    # Buscar archivos raw
    raw_files = sorted(RAW_DIR.glob("*_raw.json"))

    if not raw_files:
        print("\nNo se encontraron archivos en raw/")
        return

    print(f"\nArchivos raw encontrados: {len(raw_files)}")

    # Procesar cada archivo
    total_questions = 0
    processed_files = 0

    for raw_file in raw_files:
        if raw_file.name.startswith("_"):  # Ignorar summary
            continue

        print(f"\n  Procesando: {raw_file.name}")

        try:
            output_data = process_raw_file(raw_file)
            num_questions = output_data["metadata"]["total_questions"]
            total_questions += num_questions

            # Guardar archivo draft
            output_name = raw_file.stem.replace("_raw", "_draft") + ".json"
            output_file = DRAFT_DIR / output_name
            save_draft(output_data, output_file)

            # Guardar prompt separado para referencia
            prompt_file = DRAFT_DIR / f"{raw_file.stem.replace('_raw', '_prompt')}.txt"
            with open(prompt_file, 'w', encoding='utf-8') as f:
                f.write(output_data["reformulation_prompt"])

            print(f"    [OK] {num_questions} preguntas preparadas")
            print(f"    → {output_file.name}")
            print(f"    → {prompt_file.name}")
            processed_files += 1

        except Exception as e:
            print(f"    [ERROR] {e}")

    # Resumen
    print("\n" + "=" * 70)
    print("RESUMEN DE PREPARACIÓN")
    print("=" * 70)
    print(f"\nArchivos procesados: {processed_files}")
    print(f"Total preguntas preparadas: {total_questions}")
    print(f"\nArchivos guardados en: {DRAFT_DIR}")

    print("\n" + "-" * 70)
    print("SIGUIENTE PASO:")
    print("-" * 70)
    print("""
Las preguntas están preparadas pero necesitan completarse con:
  1. Respuesta correcta (correct_option_index)
  2. Explicación detallada
  3. Referencia legal
  4. Confidence score

Para completar, usa los archivos *_prompt.txt con Claude o
ejecuta el script de revisión que procesará las preguntas.
""")


if __name__ == "__main__":
    main()
