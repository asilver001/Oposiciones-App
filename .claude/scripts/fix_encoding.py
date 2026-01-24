#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para corregir problemas de encoding en archivos JSON extraídos.
"""

import json
import re
import sys
from pathlib import Path

# Forzar UTF-8
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_text(text: str) -> str:
    """Corrige problemas de encoding en un texto."""
    if not text:
        return text

    # Intentar detectar y corregir mojibake
    try:
        # Si el texto fue codificado en UTF-8 pero interpretado como latin-1
        fixed = text.encode('latin-1').decode('utf-8')
        return fixed
    except (UnicodeDecodeError, UnicodeEncodeError):
        pass

    # Patrones de palabras comunes con acentos
    replacements = [
        # Palabras con í
        (r'art[�ií]culo', 'artículo'),
        (r'jur[�ií]dica', 'jurídica'),
        (r'pol[�ií]tic', 'polític'),
        (r'p[�úu]blica', 'pública'),
        (r'Constituci[�óo]n', 'Constitución'),
        (r'disposici[�óo]n', 'disposición'),
        (r'funci[�óo]n', 'función'),
        (r'Administraci[�óo]n', 'Administración'),
        (r'legislaci[�óo]n', 'legislación'),
        (r'regulaci[�óo]n', 'regulación'),
        (r'organizaci[�óo]n', 'organización'),
        (r'informaci[�óo]n', 'información'),
        (r'actuaci[�óo]n', 'actuación'),
        (r'decisi[�óo]n', 'decisión'),
        (r'comisi[�óo]n', 'comisión'),
        (r'votaci[�óo]n', 'votación'),
        (r'elecci[�óo]n', 'elección'),
        (r'sesi[�óo]n', 'sesión'),
        (r'misi[�óo]n', 'misión'),
        (r'relaci[�óo]n', 'relación'),
        (r'resoluci[�óo]n', 'resolución'),
        (r'notificaci[�óo]n', 'notificación'),
        # Palabras con ñ
        (r'Espa[�ñn]a', 'España'),
        (r'espa[�ñn]ol', 'español'),
        (r'a[�ñn]o', 'año'),
        (r'Se[�ñn]al', 'Señal'),
        # Palabras con é/á/ó/ú
        (r'Qu[�ée]', 'Qué'),
        (r'C[�óo]mo', 'Cómo'),
        (r'Cu[�áa]l', 'Cuál'),
        (r'tambi[�ée]n', 'también'),
        (r's[�óo]lo', 'sólo'),
        (r'[�óo]rgano', 'órgano'),
        (r'dem[�áa]s', 'demás'),
        (r'seg[�úu]n', 'según'),
        (r'Rep[�úu]blica', 'República'),
        (r'[�úu]ltim', 'últim'),
        (r'[�úu]nic', 'únic'),
        (r'car[�áa]cter', 'carácter'),
        (r'est[�áa]', 'está'),
        (r'ser[�áa]', 'será'),
        (r'podr[�áa]', 'podrá'),
        (r'deber[�áa]', 'deberá'),
        (r'tendr[�áa]', 'tendrá'),
        (r'habr[�áa]', 'habrá'),
        (r'm[�áa]s\b', 'más'),
        (r'adem[�áa]s', 'además'),
        # Otras
        (r'Est[�áa]n', 'Están'),
        (r'inter[�ée]s', 'interés'),
        (r'leg[�ií]tim', 'legítim'),
        (r'Aut[�óo]nom', 'Autónom'),
        (r'aut[�óo]nom', 'autónom'),
        (r'int[�ée]rprete', 'intérprete'),
        (r'independiente', 'independiente'),
        (r'publicar[�áa]n', 'publicarán'),
        (r'dictar[�áa]', 'dictará'),
        (r'd[�ií]as', 'días'),
        (r'ampliaci[�óo]n', 'ampliación'),
        (r'm[�áa]ximo', 'máximo'),
        (r'cuesti[�óo]n', 'cuestión'),
        (r'concluso', 'concluso'),
        (r'procedimiento', 'procedimiento'),
        (r'per[�ií]odo', 'período'),
        (r'prueba', 'prueba'),
        (r'incompatible', 'incompatible'),
        (r'mandato', 'mandato'),
        (r'administrativos', 'administrativos'),
        (r'desempe[�ñn]o', 'desempeño'),
        (r'sindicato', 'sindicato'),
        (r'ejercicio', 'ejercicio'),
        (r'Judicial', 'Judicial'),
        (r'profesional', 'profesional'),
        (r'mercantil', 'mercantil'),
        (r'defensa', 'defensa'),
        (r'Local', 'Local'),
        (r'originaria', 'originaria'),
        (r'introducidos', 'introducidos'),
        (r'reglamentario', 'reglamentario'),
        (r'lesionen', 'lesionen'),
        (r'garantizada', 'garantizada'),
        (r'sentencia', 'sentencia'),
        (r'pronunciamientos', 'pronunciamientos'),
        (r'Otorgamiento', 'Otorgamiento'),
        (r'desestimaci[�óo]n', 'desestimación'),
        (r'denegaci[�óo]n', 'denegación'),
        (r'Preside', 'Preside'),
        (r'defecto', 'defecto'),
        (r'magistrado', 'magistrado'),
        (r'antig[�üu]edad', 'antigüedad'),
        (r'mayor[�ií]a', 'mayoría'),
        (r'Absoluta', 'Absoluta'),
        (r'reelegido', 'reelegido'),
        (r'afirmaciones', 'afirmaciones'),
        (r'aclaraci[�óo]n', 'aclaración'),
        (r'qu[�óo]rum', 'quórum'),
        (r'adopci[�óo]n', 'adopción'),
        (r'acuerdos', 'acuerdos'),
        (r'miembros', 'miembros'),
        (r'Apreciar[�áa]', 'Apreciará'),
        (r'oficio', 'oficio'),
        (r'instancia', 'instancia'),
        (r'jurisdicci[�óo]n', 'jurisdicción'),
        (r'competencia', 'competencia'),
        (r'gratuito', 'gratuito'),
        (r'temeridad', 'temeridad'),
        (r'condenarse', 'condenarse'),
        (r'costas', 'costas'),
        (r'inconstitucionalidad', 'inconstitucionalidad'),
        (r'conocido', 'conocido'),
        (r'aplicaci[�óo]n', 'aplicación'),
        (r'doctrina', 'doctrina'),
        (r'atribuirse', 'atribuirse'),
        (r'Magistrados', 'Magistrados'),
        (r'proponer', 'proponer'),
        (r'candidatos', 'candidatos'),
        (r'propuestos', 'propuestos'),
        (r'Comisi[�óo]n', 'Comisión'),
        (r'General', 'General'),
        (r'Comunidades', 'Comunidades'),
        (r'Asambleas', 'Asambleas'),
        (r'Legislativas', 'Legislativas'),
        (r'conflictos', 'conflictos'),
        (r'competencias', 'competencias'),
        (r'previo', 'previo'),
        (r'requerimiento', 'requerimiento'),
        (r'Obligatorio', 'Obligatorio'),
        (r'potestativo', 'potestativo'),
    ]

    for pattern, replacement in replacements:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

    # Limpiar caracteres de reemplazo restantes
    text = text.replace('\ufffd', '')

    return text

def fix_question(question: dict) -> dict:
    """Corrige el encoding de todos los campos de texto de una pregunta."""
    fixed = question.copy()

    if 'pregunta' in fixed:
        fixed['pregunta'] = fix_text(fixed['pregunta'])

    if 'opciones' in fixed:
        fixed['opciones'] = [fix_text(opt) for opt in fixed['opciones']]

    if 'explicacion' in fixed:
        fixed['explicacion'] = fix_text(fixed['explicacion'])

    if 'articulo_referencia' in fixed:
        fixed['articulo_referencia'] = fix_text(fixed['articulo_referencia'])

    return fixed

def process_file(file_path: Path) -> tuple:
    """Procesa un archivo JSON y corrige el encoding."""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    original_questions = len(data.get('questions', []))
    fixed_count = 0

    if 'questions' in data:
        new_questions = []
        for q in data['questions']:
            original = json.dumps(q, ensure_ascii=False)
            fixed = fix_question(q)
            if json.dumps(fixed, ensure_ascii=False) != original:
                fixed_count += 1
            new_questions.append(fixed)
        data['questions'] = new_questions

    # Guardar archivo corregido
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return original_questions, fixed_count

def main():
    draft_dir = Path(r"C:\Users\alber\.claude-worktrees\OpositaSmart\epic-kirch\.claude\questions\draft")

    json_files = list(draft_dir.glob("*_extracted*.json"))

    if not json_files:
        print("No se encontraron archivos para procesar")
        return

    print(f"Procesando {len(json_files)} archivos...\n")

    total_questions = 0
    total_fixed = 0

    for file_path in sorted(json_files):
        questions, fixed = process_file(file_path)
        total_questions += questions
        total_fixed += fixed
        status = f"[FIXED {fixed}]" if fixed > 0 else "[OK]"
        print(f"  {status} {file_path.name}: {questions} preguntas")

    print(f"\n{'='*60}")
    print(f"Total preguntas procesadas: {total_questions}")
    print(f"Preguntas con encoding corregido: {total_fixed}")

if __name__ == "__main__":
    main()
