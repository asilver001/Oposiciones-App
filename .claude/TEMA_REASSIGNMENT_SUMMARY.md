# Tema Reassignment Analysis - Executive Summary

**Date:** 2026-02-14
**Database:** Supabase Project `yutfgmiyndmhsjhzxkdr`
**Total Active Questions:** 1,325

---

## 📊 Current State (11 Old Temas)

| Tema | Questions | With legal_ref | Without legal_ref | Primary Content |
|------|-----------|----------------|-------------------|-----------------|
| 1    | 257       | 240 (93.4%)    | 17 (6.6%)         | Mixed CE (derechos, reforma, territorial, Ley 50/1997) |
| 2    | 98        | 95 (96.9%)     | 3 (3.1%)          | CE derechos fundamentales + territorial |
| 3    | 234       | 219 (93.6%)    | 15 (6.4%)         | CE Corona + TC + LOTC |
| 4    | 23        | 17 (73.9%)     | 6 (26.1%)         | CE Gobierno + EBEP |
| 5    | 146       | 129 (88.4%)    | 17 (11.6%)        | CE Cortes + Ley 50/1997 + Informática |
| 6    | 44        | 40 (90.9%)     | 4 (9.1%)          | Ley 50/1997 + mixed |
| 7    | 190       | 190 (100%)     | 0 (0%)            | CE Poder Judicial + LOPJ + LRJSP |
| 8    | 142       | 141 (99.3%)    | 1 (0.7%)          | Ley 40/2015 LRJSP Título II (AGE) |
| 9    | 5         | 5 (100%)       | 0 (0%)            | Ley 39/2015 LPAC |
| 10   | 75        | 75 (100%)      | 0 (0%)            | CE Territorial + LBRL |
| 11   | 151       | 149 (98.7%)    | 2 (1.3%)          | LBRL + LRJSP procedural |

**Total:** 1,325 questions | 1,260 with legal_ref (95.1%) | 65 without legal_ref (4.9%)

---

## 🎯 Projected State (16 New Temas)

| New Tema | Description | Est. Questions | Status | Primary Sources |
|----------|-------------|----------------|--------|-----------------|
| **1**    | CE Derechos (1-55) | ~175 | ✅ Ready | CE Título Preliminar + Título I |
| **2**    | CE Corona, TC, Reforma | ~360 | ⚠️ Very Large | CE Títulos II, IX, X + LOTC |
| **3**    | CE Cortes (66-96) | ~130 | ✅ Ready | CE Título III + Defensor del Pueblo |
| **4**    | CE Poder Judicial | ~133 | ✅ Ready | CE Título VI + LOPJ |
| **5**    | CE Gobierno + Ley 50/1997 | ~90 | ✅ Ready | CE Títulos IV-V + Ley 50/1997 |
| **6**    | Gobierno Abierto | ~25 | ⚠️ Manual Review | Transparencia, modernización |
| **7**    | Ley 19/2013 Transparencia | 0 | ❌ Empty | No questions in DB |
| **8**    | LRJSP AGE (Título II) | ~180 | ✅ Ready | Ley 40/2015 Arts 54-79, 87-93 |
| **9**    | CE Territorial + LBRL | ~180 | ✅ Ready | CE Título VIII + LBRL |
| **10**   | UE, Tratados | 0 | ❌ Empty | No questions in DB |
| **11**   | LPAC + LRJSP procedural | ~50 | ✅ Ready | Ley 39/2015 + LRJSP Arts 83-138 |
| **12**   | LOPDGDD, RGPD | 0 | ❌ Empty | No questions in DB |
| **13**   | TREBEP (selección) | 0 | ❌ Empty | No questions in DB |
| **14**   | TREBEP (derechos) | 0 | ❌ Empty | No questions in DB |
| **15**   | Presupuestos | 0 | ❌ Empty | No questions in DB |
| **16**   | Igualdad, género | 0 | ❌ Empty | No questions in DB |

**Mapped:** ~1,260 questions | **Manual Review:** ~65 questions

---

## 🔍 Key Findings

### 1. Legal Reference Coverage
- **95.1%** of questions have `legal_reference` field populated
- **65 questions** (4.9%) need manual legal reference assignment before reassignment

### 2. Distribution Analysis by Law

| Law/Document | Questions | Current Temas | Target Tema(s) |
|--------------|-----------|---------------|----------------|
| **CE Articles** | ~600 | 1, 2, 3, 5, 7, 10, 11 | 1, 2, 3, 4, 5, 9 |
| **LOTC** | ~60 | 3 | 2 |
| **Ley 50/1997** | ~45 | 1, 5, 6 | 5 |
| **LOPJ** | ~65 | 7 | 4 |
| **Ley 40/2015 LRJSP** | ~220 | 7, 8, 11 | 8, 11 |
| **Ley 39/2015 LPAC** | ~5 | 9 | 11 |
| **LBRL/LRBRL** | ~70 | 10, 11 | 9 |
| **Defensor del Pueblo** | ~20 | 1 | 3 |
| **Informática/Office** | 17 | 5 | ⚠️ Decision needed |
| **EBEP** | 6 | 4 | ⚠️ No target (T13-14 empty) |
| **Other laws** | ~15 | 6, 11 | Manual review |

### 3. Ley 40/2015 LRJSP Article Split (Critical)

**Challenge:** This law appears across 3 old temas with ~220 questions total.

**Proposed Split by Article Range:**
- **Articles 54-79** (Órganos AGE, superiores, directivos) → **Tema 8** (~120 questions)
- **Articles 87-93** (Delegados del Gobierno) → **Tema 8** (~20 questions)
- **Articles 83-103** (Convenios, órganos colegiados) → **Tema 11** (~45 questions)
- **Articles 108-138** (Funcionamiento, procedimiento) → **Tema 11** (~35 questions)

**Distribution:**
- Old Tema 8: 141 questions → **All to Tema 8** (organizational)
- Old Tema 7: ~40 questions → **Tema 8** (Arts 54-79) or **Tema 11** (procedural)
- Old Tema 11: ~45 questions → **Tema 11** (procedural articles)

---

## ⚠️ Critical Decisions Needed

### Decision 1: Tema 2 Size (360 questions)
**Issue:** After reassignment, Tema 2 will have ~360 questions (27% of total), nearly double the next largest.

**Options:**
- **A) Accept imbalance** - Tema 2 naturally covers more content (Corona + TC + Reforma)
- **B) Split into 2A/2B** - Corona+TC vs Reforma
- **C) Move Reforma to Tema 1** - Keep with other CE structure

**Recommendation:** Option A - The official syllabus defines Tema 2 this way, accept the size.

---

### Decision 2: Informática Questions (17 from Tema 5)
**Issue:** Questions about Windows, Office, peripherals - NOT in official AGE Auxiliar syllabus.

**Sample Questions:**
- "¿Cuál de las siguientes opciones corresponde a un sistema operativo?"
- "En Word 365, ¿qué característica es más adecuada para marcar términos clave?"
- "¿Qué es una dirección IP?"

**Options:**
- **A) Mark inactive** (`is_active = false`) - Remove from exam pool
- **B) Create Tema 17 - Informática** (unofficial)
- **C) Move to Tema 16** (Otros temas)
- **D) Keep in Tema 5** (legacy)

**Recommendation:** Option A - These don't belong to the current syllabus. Mark inactive.

---

### Decision 3: EBEP Questions (6 from Tema 4)
**Issue:** Questions about TREBEP/EBEP but target Temas 13-14 are empty.

**Options:**
- **A) Mark inactive** until Temas 13-14 are populated
- **B) Create questions for Temas 13-14** and reassign these
- **C) Keep in current tema** until decision

**Recommendation:** Option C - Keep in Tema 4 temporarily, revisit when creating EBEP content.

---

### Decision 4: Questions Without legal_reference (65 total)
**Issue:** Cannot auto-assign without knowing which law they reference.

**Breakdown by Content:**
- **17 questions** - CE general (estructura, fechas históricas) → Likely Tema 1
- **15 questions** - LPAC procedural (sin art. específico) → Likely Tema 11
- **17 questions** - Informática (Windows, Office) → Mark inactive
- **6 questions** - EBEP (funcionarios) → Keep in Tema 4
- **4 questions** - Contratos, presupuestos → Tema 6 or 15
- **6 questions** - Mixed/unclear → Manual review

**Required Action:**
1. Export to CSV for human review
2. Assign correct `legal_reference` to each question
3. Then apply automatic reassignment rules

---

## 📋 Questions Without legal_reference - Manual Review List

**Total:** 65 questions

### Tema 1 (17 questions) - CE General & History
Examples:
- ID 240: "¿En qué año se aprobó la Constitución Española vigente?"
- ID 242: "¿Cuántos artículos tiene la Constitución Española?"
- ID 424: "Primeras elecciones democráticas fecha"

**Recommendation:** Add `legal_reference = "CE estructura/historia"` → Assign to Tema 1

---

### Tema 3 (15 questions) - LPAC Procedural
Examples:
- ID 303: "Conforme al artículo 74 de la Ley 39/2015, las cuestiones incidentales..."
- ID 306: "Plazo procedimientos simplificados"
- ID 312: "Recurso de alzada"

**Recommendation:** Add specific article references from question text → Assign to Tema 11

---

### Tema 5 (17 questions) - Informática
Examples:
- ID 318: "Señale la opción verdadera sobre periféricos"
- ID 324: "En Windows 10, el atajo Windows + E sirve para"
- ID 330: "¿Qué es una dirección IP?"

**Recommendation:** Mark `is_active = false` (not in syllabus)

---

### Tema 4 (6 questions) - EBEP
Examples:
- ID 333: "Personal eventual se caracteriza porque"
- ID 335: "Adquirir condición de funcionario de carrera"

**Recommendation:** Add EBEP article references → Keep in Tema 4 until Temas 13-14 ready

---

### Tema 6 (4 questions) - Contratos, Presupuestos
Examples:
- ID 338: "Ley 9/2017 Contratos - duración concesión obras"
- ID 340: "Ley 47/2003 Presupuestaria - Ordenador General pagos"

**Recommendation:** Add legal references → Assign to Tema 6 or 15

---

### Others (6 questions) - Mixed
- Tema 2 (3): Comunidades Autónomas, Defensor, provincias → Need CE article refs → Tema 1 or 9
- Tema 8 (1): Direcciones Generales → Add LRJSP reference → Tema 8
- Tema 11 (2): Organismos Autónomos, mancomunidades → Add references → Tema 8 or 9

---

## 🚀 Execution Plan

### Phase 1: Preparation ⏳ **User Action Required**
- [ ] **Decision 1:** Approve Tema 2 size (360 questions)
- [ ] **Decision 2:** Decide on Informática questions (recommend: mark inactive)
- [ ] **Decision 3:** Decide on EBEP questions (recommend: keep in Tema 4)
- [ ] **Decision 4:** Human review of 65 questions without legal_ref
  - Assign legal_reference to each
  - Classify which tema they should go to

### Phase 2: Backup 🔒 **Automated**
```sql
CREATE TABLE questions_backup_20260214 AS SELECT * FROM questions;
```

### Phase 3: Execute Migration 🤖 **Automated**
Run SQL script: `/workspaces/Oposiciones-App/.claude/tema_reassignment_migration.sql`

**Estimated Time:** 5-10 minutes
**SQL Statements:** ~15 UPDATE queries

### Phase 4: Validation ✅ **Automated**
Run validation queries from migration script:
- Total count by tema
- Verify no orphaned questions
- Spot-check 20 random questions per tema

### Phase 5: Frontend Updates 💻 **Manual**
Update application code:
- `TEMAS` constant (tema labels 1-16)
- Any hardcoded tema references
- Analytics/progress calculations
- Study session tema selectors

---

## 📁 Generated Files

1. **`TEMA_REASSIGNMENT_PLAN.md`** (this file) - Full detailed analysis
2. **`tema_reassignment_migration.sql`** - Complete SQL migration script with:
   - Backup creation
   - UPDATE statements for each tema
   - Validation queries
   - Rollback procedure

3. **Manual Review List** (65 questions exported above) - CSV format ready

---

## 🎲 Risk Assessment

### HIGH RISK ⚠️
1. **Ley 40/2015 Article Range Split**
   - Risk: Articles 50-140 could be misclassified organizational vs procedural
   - Mitigation: Manual spot-check after migration, verify article ranges

2. **Tema 2 Size (360 questions)**
   - Risk: UX issues in study sessions (very long)
   - Mitigation: Frontend pagination, study session limits

### MEDIUM RISK ⚠️
3. **Questions Without legal_ref (65)**
   - Risk: Human error in manual classification
   - Mitigation: Double-check with reference materials

4. **Regex Pattern Edge Cases**
   - Risk: Article number extraction may miss formats like "Arts. 54-62"
   - Mitigation: Validation queries, spot-checking

### LOW RISK ✅
5. **CE Article Ranges**
   - Clear boundaries (1-55, 56-65, 66-96, etc.)
   - Low ambiguity

6. **LOPJ, LOTC, LBRL References**
   - Clear law names, easy pattern matching

---

## 🔄 Rollback Plan

If critical issues are found:

```sql
-- Restore from backup
TRUNCATE questions;
INSERT INTO questions SELECT * FROM questions_backup_20260214;

-- Verify restoration
SELECT COUNT(*) FROM questions WHERE is_active = true;
-- Expected: 1,325
```

**Backup retention:** Keep for 30 days after successful migration.

---

## 📊 Expected Final Distribution

After migration (excluding manual review items):

| Tema | Questions | % of Total | Status |
|------|-----------|------------|--------|
| 1    | ~175      | 13%        | ✅ Populated |
| 2    | ~360      | 27%        | ✅ Populated (LARGE) |
| 3    | ~130      | 10%        | ✅ Populated |
| 4    | ~133      | 10%        | ✅ Populated |
| 5    | ~90       | 7%         | ✅ Populated |
| 6    | ~25       | 2%         | ⚠️ Needs review |
| 7    | 0         | 0%         | ❌ Empty |
| 8    | ~180      | 14%        | ✅ Populated |
| 9    | ~180      | 14%        | ✅ Populated |
| 10   | 0         | 0%         | ❌ Empty |
| 11   | ~50       | 4%         | ✅ Populated |
| 12   | 0         | 0%         | ❌ Empty |
| 13   | 0         | 0%         | ❌ Empty |
| 14   | 0         | 0%         | ❌ Empty |
| 15   | 0         | 0%         | ❌ Empty |
| 16   | 0         | 0%         | ❌ Empty |

**Total Mapped:** ~1,323 questions
**Empty Temas:** 7, 10, 12-16 (need content creation)

---

## ✅ Next Steps - Action Items

### For User:
1. Review and approve Decision 1-4 above
2. Perform human review of 65 questions without legal_ref (exported above)
3. Approve migration execution

### For Claude:
1. ✅ **COMPLETED:** Database analysis
2. ✅ **COMPLETED:** Generate migration SQL script
3. ✅ **COMPLETED:** Export manual review list
4. ⏳ **PENDING:** Execute migration (awaiting approval)
5. ⏳ **PENDING:** Run validation queries
6. ⏳ **PENDING:** Update frontend code

---

**Document Status:** ✅ READY FOR REVIEW
**Approval Required:** User decision on 4 critical items
**Estimated Total Time:** 2-3 hours (including manual review + migration + frontend updates)

