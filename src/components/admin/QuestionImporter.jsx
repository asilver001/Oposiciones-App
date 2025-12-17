import React, { useState, useRef } from 'react';
import { Upload, FileJson, CheckCircle, XCircle, AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';
import { parseAndValidateJSON } from '../../utils/questionValidator';
import { importQuestions } from '../../services/questionImportService';

export default function QuestionImporter({ onImportComplete }) {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setJsonInput(e.target.result);
      setValidationResult(null);
      setImportResult(null);
    };
    reader.readAsText(file);
  };

  // Validate JSON
  const handleValidate = () => {
    setIsValidating(true);
    setImportResult(null);

    // Small delay to show loading state
    setTimeout(() => {
      const result = parseAndValidateJSON(jsonInput);
      setValidationResult(result);
      setIsValidating(false);
    }, 100);
  };

  // Import questions
  const handleImport = async () => {
    if (!validationResult?.valid || !validationResult?.data?.questions) {
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await importQuestions(validationResult.data.questions, {
        skipDuplicates: true,
        validateBeforeImport: false // Already validated
      });
      setImportResult(result);

      // Auto-refresh stats after successful import
      if (result.imported > 0 && onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      setImportResult({
        imported: 0,
        duplicates: 0,
        errors: [error.message]
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Clear all
  const handleClear = () => {
    setJsonInput('');
    setValidationResult(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Load example JSON
  const loadExample = () => {
    const example = {
      questions: [
        {
          question_text: "Según el artículo 1.1 de la Constitución, España se constituye en:",
          options: [
            { text: "Una república federal", is_correct: false },
            { text: "Un Estado social y democrático de Derecho", is_correct: true },
            { text: "Una monarquía absoluta", is_correct: false },
            { text: "Una confederación de estados", is_correct: false }
          ],
          explanation: "El artículo 1.1 CE establece que España se constituye en un Estado social y democrático de Derecho.",
          legal_reference: "Art. 1.1 CE",
          tema: 1,
          materia: "constitucion",
          difficulty: 2,
          source: "examen_oficial",
          source_year: 2023,
          confidence_score: 0.95,
          tier: "free"
        }
      ]
    };
    setJsonInput(JSON.stringify(example, null, 2));
    setValidationResult(null);
    setImportResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Importar Preguntas
          </h2>
          <p className="text-purple-100 text-sm mt-1">
            Importa preguntas en formato JSON a Supabase
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                JSON de preguntas
              </label>
              <div className="flex gap-2">
                <button
                  onClick={loadExample}
                  className="text-xs text-purple-600 hover:underline"
                >
                  Cargar ejemplo
                </button>
                <button
                  onClick={handleClear}
                  className="text-xs text-red-600 hover:underline"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setValidationResult(null);
                setImportResult(null);
              }}
              placeholder='{"questions": [...]}'
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl font-mono text-sm focus:border-purple-500 focus:outline-none resize-y"
            />

            {/* File Upload */}
            <div className="mt-3 flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
              >
                <FileJson className="w-4 h-4" />
                Subir archivo .json
              </button>
              <span className="text-xs text-gray-500">
                o pega el JSON directamente arriba
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleValidate}
              disabled={!jsonInput.trim() || isValidating}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition disabled:cursor-not-allowed"
            >
              {isValidating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              Validar
            </button>

            <button
              onClick={handleImport}
              disabled={!validationResult?.valid || isImporting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition disabled:cursor-not-allowed"
            >
              {isImporting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              Importar {validationResult?.summary?.valid || 0} preguntas
            </button>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div className={`p-4 rounded-xl ${validationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start gap-3">
                {validationResult.valid ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className={`font-semibold ${validationResult.valid ? 'text-green-800' : 'text-red-800'}`}>
                    {validationResult.valid ? 'Validación exitosa' : 'Errores de validación'}
                  </h4>

                  {validationResult.summary && (
                    <p className="text-sm text-gray-600 mt-1">
                      Total: {validationResult.summary.total} |
                      Válidas: {validationResult.summary.valid} |
                      Inválidas: {validationResult.summary.invalid}
                    </p>
                  )}

                  {/* Errors List */}
                  {validationResult.errors.length > 0 && (
                    <div className="mt-3 max-h-40 overflow-y-auto">
                      <ul className="text-sm text-red-700 space-y-1">
                        {validationResult.errors.slice(0, 20).map((error, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-400">•</span>
                            {error}
                          </li>
                        ))}
                        {validationResult.errors.length > 20 && (
                          <li className="text-red-500 font-medium">
                            ... y {validationResult.errors.length - 20} errores más
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Resultado de importación</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">{importResult.imported}</p>
                  <p className="text-xs text-gray-500">Importadas</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-2xl font-bold text-yellow-600">{importResult.duplicates}</p>
                  <p className="text-xs text-gray-500">Duplicadas</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-2xl font-bold text-red-600">{importResult.errors.length}</p>
                  <p className="text-xs text-gray-500">Errores</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-700 mb-1">Errores:</p>
                  <ul className="text-sm text-red-600 space-y-1">
                    {importResult.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Preview */}
          {validationResult?.valid && validationResult?.data?.questions?.length > 0 && (
            <div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-sm text-purple-600 hover:underline"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Ocultar' : 'Ver'} preview de preguntas
              </button>

              {showPreview && (
                <div className="mt-3 max-h-96 overflow-y-auto border rounded-xl divide-y">
                  {validationResult.data.questions.slice(0, 10).map((q, i) => (
                    <div key={i} className="p-4">
                      <p className="font-medium text-gray-900 mb-2">
                        {i + 1}. {q.question_text}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {q.options.map((opt, j) => (
                          <div
                            key={j}
                            className={`p-2 rounded ${opt.is_correct ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-100 text-gray-600'}`}
                          >
                            {['A', 'B', 'C', 'D'][j]}. {opt.text}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <p className="text-xs text-gray-500 mt-2">
                          {q.legal_reference && <span className="font-medium">{q.legal_reference}: </span>}
                          {q.explanation}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                          Tema {q.tema}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          {q.tier || 'free'}
                        </span>
                        {q.difficulty && (
                          <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                            Dificultad {q.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {validationResult.data.questions.length > 10 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      ... y {validationResult.data.questions.length - 10} preguntas más
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
