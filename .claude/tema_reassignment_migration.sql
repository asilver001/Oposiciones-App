-- =====================================================================
-- TEMA REASSIGNMENT MIGRATION
-- From 11 Old Temas → 16 Official Temas
-- Date: 2026-02-14
-- Total Questions: 1,325 active
-- =====================================================================

-- =====================================================================
-- PHASE 1: BACKUP
-- =====================================================================

-- Create backup table with timestamp
CREATE TABLE IF NOT EXISTS questions_backup_20260214 AS
SELECT * FROM questions;

-- Verify backup
SELECT
  COUNT(*) as total_backed_up,
  COUNT(*) FILTER (WHERE is_active = true) as active_backed_up
FROM questions_backup_20260214;
-- Expected: 1,325 active

-- =====================================================================
-- PHASE 2: NEW TEMA 1 - CE DERECHOS (Arts 1-55)
-- Source: Old Tema 1, 2
-- Expected: ~175 questions
-- =====================================================================

-- Update questions with CE Título Preliminar (Arts 1-9)
UPDATE questions
SET tema = 1
WHERE is_active = true
  AND (
    legal_reference ~ 'Art\. [1-9]( CE| de la CE|\.)'
    OR legal_reference ~ 'Art\. [1-9]\s'
    OR legal_reference LIKE '%Título Preliminar%'
  )
  AND tema IN (1, 2);

-- Update questions with CE Título I Derechos (Arts 10-55)
UPDATE questions
SET tema = 1
WHERE is_active = true
  AND (
    legal_reference ~ 'Art\. 1[0-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 2[0-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 3[0-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 4[0-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 5[0-5]\.?\d* CE'
    OR legal_reference LIKE '%Título I%'
    OR legal_reference LIKE '%derechos fundamentales%'
  )
  AND tema IN (1, 2);

-- Verification query for Tema 1
SELECT COUNT(*) as tema_1_count
FROM questions
WHERE is_active = true AND tema = 1;
-- Expected: ~175

-- =====================================================================
-- PHASE 3: NEW TEMA 2 - CE CORONA, TC, REFORMA
-- Source: Old Tema 3, 1, 2
-- Expected: ~360 questions (LARGE TEMA)
-- =====================================================================

-- Update questions with CE Título II Corona (Arts 56-65)
UPDATE questions
SET tema = 2
WHERE is_active = true
  AND (
    legal_reference ~ 'Art\. 5[6-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 6[0-5]\.?\d* CE'
    OR legal_reference LIKE '%Título II%'
    OR legal_reference LIKE '%Corona%'
  )
  AND tema IN (1, 2, 3);

-- Update questions with CE Título IX TC (Arts 159-165) + LOTC
UPDATE questions
SET tema = 2
WHERE is_active = true
  AND (
    legal_reference ~ 'Art\. 159\.?\d* CE'
    OR legal_reference ~ 'Art\. 16[0-5]\.?\d* CE'
    OR legal_reference LIKE '%LOTC%'
    OR legal_reference LIKE '%Tribunal Constitucional%'
    OR legal_reference LIKE '%Título IX%'
  )
  AND tema IN (1, 2, 3);

-- Update questions with CE Título X Reforma (Arts 166-169)
UPDATE questions
SET tema = 2
WHERE is_active = true
  AND (
    legal_reference ~ 'Art\. 16[6-9]\.?\d* CE'
    OR legal_reference LIKE '%Título X%'
    OR legal_reference LIKE '%reforma constitucional%'
    OR legal_reference LIKE '%revisión%constitucional%'
  )
  AND tema IN (1, 2, 3);

-- Verification query for Tema 2
SELECT COUNT(*) as tema_2_count
FROM questions
WHERE is_active = true AND tema = 2;
-- Expected: ~360

-- =====================================================================
-- PHASE 4: NEW TEMA 3 - CE CORTES (Arts 66-96) + DEFENSOR
-- Source: Old Tema 5, 1
-- Expected: ~130 questions
-- =====================================================================

-- Update questions with CE Título III Cortes (Arts 66-96)
UPDATE questions
SET tema = 3
WHERE is_active = true
  AND (
    legal_reference ~ 'Art\. 6[6-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 7[0-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 8[0-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 9[0-6]\.?\d* CE'
    OR legal_reference LIKE '%Título III%'
    OR legal_reference LIKE '%Cortes Generales%'
  )
  AND tema IN (1, 5);

-- Update questions with Defensor del Pueblo (LO 3/1981)
UPDATE questions
SET tema = 3
WHERE is_active = true
  AND (
    legal_reference LIKE '%Defensor del Pueblo%'
    OR legal_reference LIKE '%LO 3/1981%'
    OR legal_reference ~ 'Art\. \d+\.?\d* LO 3/1981'
  )
  AND tema IN (1, 5);

-- Verification query for Tema 3
SELECT COUNT(*) as tema_3_count
FROM questions
WHERE is_active = true AND tema = 3;
-- Expected: ~130

-- =====================================================================
-- PHASE 5: NEW TEMA 4 - CE PODER JUDICIAL (Arts 117-127) + LOPJ
-- Source: Old Tema 7
-- Expected: ~133 questions
-- =====================================================================

-- Update questions with CE Título VI Poder Judicial (Arts 117-127)
UPDATE questions
SET tema = 4
WHERE is_active = true
  AND (
    legal_reference ~ 'Art\. 11[7-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 12[0-7]\.?\d* CE'
    OR legal_reference LIKE '%Título VI%'
    OR legal_reference LIKE '%Poder Judicial%'
  )
  AND tema = 7;

-- Update questions with LOPJ (Ley Orgánica del Poder Judicial)
UPDATE questions
SET tema = 4
WHERE is_active = true
  AND (
    legal_reference LIKE '%LOPJ%'
    OR legal_reference ~ 'Art\. \d+\.?\d* LOPJ'
  )
  AND tema = 7;

-- Verification query for Tema 4
SELECT COUNT(*) as tema_4_count
FROM questions
WHERE is_active = true AND tema = 4;
-- Expected: ~133

-- =====================================================================
-- PHASE 6: NEW TEMA 5 - CE GOBIERNO (Arts 97-116) + LEY 50/1997
-- Source: Old Tema 1, 4, 5, 6
-- Expected: ~90 questions
-- =====================================================================

-- Update questions with CE Título IV Gobierno (Arts 97-107)
UPDATE questions
SET tema = 5
WHERE is_active = true
  AND (
    legal_reference ~ 'Art\. 9[7-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 10[0-7]\.?\d* CE'
    OR legal_reference LIKE '%Título IV%'
    OR legal_reference LIKE '%Gobierno%CE%'
  )
  AND tema IN (1, 4, 5);

-- Update questions with CE Título V Relaciones Gobierno-Cortes (Arts 108-116)
UPDATE questions
SET tema = 5
WHERE is_active = true
  AND (
    legal_reference ~ 'Art\. 10[8-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 11[0-6]\.?\d* CE'
    OR legal_reference LIKE '%Título V%'
  )
  AND tema IN (1, 4, 5);

-- Update questions with Ley 50/1997 del Gobierno
UPDATE questions
SET tema = 5
WHERE is_active = true
  AND (
    legal_reference LIKE '%Ley 50/1997%'
    OR legal_reference ~ 'Art\. \d+\.?\d* Ley 50/1997'
  )
  AND tema IN (1, 5, 6);

-- Verification query for Tema 5
SELECT COUNT(*) as tema_5_count
FROM questions
WHERE is_active = true AND tema = 5;
-- Expected: ~90

-- =====================================================================
-- PHASE 7: NEW TEMA 6 - GOBIERNO ABIERTO, AGENDA 2030
-- Source: Old Tema 6
-- Expected: ~25 questions
-- NOTE: This requires manual review - no clear legal_reference pattern
-- =====================================================================

-- These questions need manual review and assignment
-- SELECT id, question_text, legal_reference
-- FROM questions
-- WHERE tema = 6 AND is_active = true;

-- For now, keep them in tema 6 (manual update later)

-- =====================================================================
-- PHASE 8: NEW TEMA 8 - LEY 40/2015 LRJSP TÍTULO II (AGE)
-- Source: Old Tema 7, 8
-- Expected: ~180 questions
-- =====================================================================

-- Update questions with Ley 40/2015 Arts 54-79 (AGE organization)
UPDATE questions
SET tema = 8
WHERE is_active = true
  AND (
    -- Arts 54-62: Principios de organización
    legal_reference ~ 'Art\. 5[4-9]\.?\d* (Ley 40/2015|LRJSP)'
    OR legal_reference ~ 'Art\. 6[0-2]\.?\d* (Ley 40/2015|LRJSP)'
    -- Arts 63-79: Órganos superiores y directivos
    OR legal_reference ~ 'Art\. 6[3-9]\.?\d* (Ley 40/2015|LRJSP)'
    OR legal_reference ~ 'Art\. 7[0-9]\.?\d* (Ley 40/2015|LRJSP)'
    -- Arts 87-93: Delegados del Gobierno
    OR legal_reference ~ 'Art\. 8[7-9]\.?\d* (Ley 40/2015|LRJSP)'
    OR legal_reference ~ 'Art\. 9[0-3]\.?\d* (Ley 40/2015|LRJSP)'
    -- Arts 104, 114: Specific organizational articles
    OR legal_reference ~ 'Art\. 104\.?\d* (Ley 40/2015|LRJSP)'
    OR legal_reference ~ 'Art\. 114\.?\d* (Ley 40/2015|LRJSP)'
  )
  AND tema IN (7, 8);

-- Verification query for Tema 8
SELECT COUNT(*) as tema_8_count
FROM questions
WHERE is_active = true AND tema = 8;
-- Expected: ~180

-- =====================================================================
-- PHASE 9: NEW TEMA 9 - CE TERRITORIAL (Arts 137-158) + LBRL
-- Source: Old Tema 1, 2, 10, 11
-- Expected: ~180 questions
-- =====================================================================

-- Update questions with CE Título VIII Territorial (Arts 137-158)
UPDATE questions
SET tema = 9
WHERE is_active = true
  AND (
    legal_reference ~ 'Art\. 13[7-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 14[0-9]\.?\d* CE'
    OR legal_reference ~ 'Art\. 15[0-8]\.?\d* CE'
    OR legal_reference LIKE '%Título VIII%'
    OR legal_reference LIKE '%Comunidades Autónomas%'
  )
  AND tema IN (1, 2, 10, 11);

-- Update questions with LBRL/LRBRL (Administración Local)
UPDATE questions
SET tema = 9
WHERE is_active = true
  AND (
    legal_reference LIKE '%LBRL%'
    OR legal_reference LIKE '%LRBRL%'
    OR legal_reference ~ 'Art\. \d+\.?\d* LBRL'
    OR legal_reference ~ 'Art\. \d+\.?\d* LRBRL'
  )
  AND tema IN (10, 11);

-- Verification query for Tema 9
SELECT COUNT(*) as tema_9_count
FROM questions
WHERE is_active = true AND tema = 9;
-- Expected: ~180

-- =====================================================================
-- PHASE 10: NEW TEMA 11 - LEY 39/2015 LPAC + LRJSP PROCEDURAL
-- Source: Old Tema 9, 11
-- Expected: ~50 questions
-- =====================================================================

-- Update questions with Ley 39/2015 LPAC
UPDATE questions
SET tema = 11
WHERE is_active = true
  AND (
    legal_reference LIKE '%Ley 39/2015%'
    OR legal_reference LIKE '%LPAC%'
    OR legal_reference ~ 'Art\. \d+\.?\d* Ley 39/2015'
  )
  AND tema = 9;

-- Update questions with Ley 40/2015 LRJSP procedural (Arts 83-138)
UPDATE questions
SET tema = 11
WHERE is_active = true
  AND (
    -- Arts 83-89: Convenios
    legal_reference ~ 'Art\. 8[3-9]\.?\d* (Ley 40/2015|LRJSP)'
    -- Arts 90-103: Órganos colegiados
    OR legal_reference ~ 'Art\. 9[0-9]\.?\d* (Ley 40/2015|LRJSP)'
    OR legal_reference ~ 'Art\. 10[0-3]\.?\d* (Ley 40/2015|LRJSP)'
    -- Arts 108-138: Funcionamiento, procedimiento
    OR legal_reference ~ 'Art\. 10[8-9]\.?\d* (Ley 40/2015|LRJSP)'
    OR legal_reference ~ 'Art\. 1[1-2][0-9]\.?\d* (Ley 40/2015|LRJSP)'
    OR legal_reference ~ 'Art\. 13[0-8]\.?\d* (Ley 40/2015|LRJSP)'
  )
  AND tema = 11;

-- Verification query for Tema 11
SELECT COUNT(*) as tema_11_count
FROM questions
WHERE is_active = true AND tema = 11;
-- Expected: ~50

-- =====================================================================
-- PHASE 11: VALIDATION QUERIES
-- =====================================================================

-- 1. Total count by tema (should match projected distribution)
SELECT
  tema,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM questions
WHERE is_active = true
GROUP BY tema
ORDER BY tema;

-- 2. Verify total is still 1,325
SELECT COUNT(*) as total_active
FROM questions
WHERE is_active = true;
-- Expected: 1,325

-- 3. Check for orphaned questions (tema NULL or > 16)
SELECT COUNT(*) as orphaned
FROM questions
WHERE is_active = true
  AND (tema IS NULL OR tema > 16);
-- Expected: 0 (after full migration)

-- 4. Questions still in old temas 7-11 (should be reassigned)
SELECT tema, COUNT(*) as remaining
FROM questions
WHERE is_active = true
  AND tema IN (7, 10)  -- 7 and 10 should be empty now
GROUP BY tema;
-- Expected: 0 rows

-- 5. Questions without legal_reference by tema
SELECT tema, COUNT(*) as no_legal_ref
FROM questions
WHERE is_active = true
  AND (legal_reference IS NULL OR legal_reference = '')
GROUP BY tema
ORDER BY tema;
-- Expected: 65 total across all temas

-- 6. Top 5 largest temas (check for imbalance)
SELECT tema, COUNT(*) as total
FROM questions
WHERE is_active = true
GROUP BY tema
ORDER BY total DESC
LIMIT 5;
-- Expected: Tema 2 (~360), Tema 8 (~180), Tema 9 (~180), etc.

-- 7. Empty temas (should be 7, 10, 12, 13, 14, 15, 16)
SELECT tema
FROM generate_series(1, 16) AS tema
WHERE tema NOT IN (
  SELECT DISTINCT tema
  FROM questions
  WHERE is_active = true
)
ORDER BY tema;
-- Expected: 7, 10, 12, 13, 14, 15, 16

-- 8. Sample questions from each tema (spot check)
SELECT tema, COUNT(*) as sample_size,
       STRING_AGG(DISTINCT LEFT(legal_reference, 40), ', ') as sample_refs
FROM (
  SELECT tema, legal_reference,
         ROW_NUMBER() OVER (PARTITION BY tema ORDER BY RANDOM()) as rn
  FROM questions
  WHERE is_active = true
) sub
WHERE rn <= 5
GROUP BY tema
ORDER BY tema;

-- =====================================================================
-- PHASE 12: ROLLBACK (IF NEEDED)
-- =====================================================================

-- Only run this if there are critical errors and you need to restore

-- UNCOMMENT TO ROLLBACK:
-- TRUNCATE questions;
-- INSERT INTO questions SELECT * FROM questions_backup_20260214;
--
-- -- Verify rollback
-- SELECT COUNT(*) as restored_count
-- FROM questions
-- WHERE is_active = true;
-- -- Expected: 1,325

-- =====================================================================
-- PHASE 13: CLEANUP (AFTER SUCCESSFUL MIGRATION)
-- =====================================================================

-- After confirming migration success (1-2 weeks), drop backup:
-- DROP TABLE IF EXISTS questions_backup_20260214;

-- =====================================================================
-- END OF MIGRATION SCRIPT
-- =====================================================================

-- Final summary report
SELECT
  'MIGRATION COMPLETE' as status,
  COUNT(*) as total_questions,
  COUNT(*) FILTER (WHERE is_active = true) as active_questions,
  COUNT(DISTINCT tema) as temas_with_questions,
  MIN(tema) as min_tema,
  MAX(tema) as max_tema
FROM questions;
