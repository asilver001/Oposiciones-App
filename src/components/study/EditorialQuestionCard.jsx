/**
 * EditorialQuestionCard — active question UI in Calma Editorial style.
 *
 * Faithful port of the session design:
 *   /tmp/claude-design/oposita-smart/project/screens/session.jsx
 *
 * Preserves the original QuestionCard's data-parsing logic (options JSONB,
 * individual columns, guest format) and auto-advance behaviour so it's a
 * drop-in replacement.
 */

import React, { useState } from 'react';
import { SkipForward } from 'lucide-react';
import { useReveal, useMediaQuery, OS } from '../editorial/EditorialPrimitives';

function parseOptions(question) {
  let options = [];
  let correctKey = null;

  if (question.opciones) {
    // Guest question format
    options = question.opciones.map((text, idx) => ({
      key: ['a', 'b', 'c', 'd'][idx],
      text,
      isCorrect: idx === question.correcta,
    }));
    correctKey = ['a', 'b', 'c', 'd'][question.correcta];
  } else {
    let rawOpts = question.options;
    if (typeof rawOpts === 'string') {
      try { rawOpts = JSON.parse(rawOpts); } catch { rawOpts = null; }
    }

    if (Array.isArray(rawOpts) && rawOpts.length > 0) {
      options = rawOpts.map((opt, idx) => ({
        key: opt.id || ['a', 'b', 'c', 'd'][idx] || `${idx}`,
        text: opt.text || '',
        isCorrect: Boolean(opt.is_correct),
      }));
    } else {
      const keys = ['a', 'b', 'c', 'd'];
      options = keys
        .filter((k) => question[`option_${k}`])
        .map((k) => ({
          key: k,
          text: question[`option_${k}`],
          isCorrect: question.correct_answer === k,
        }));
    }
    const correctOpt = options.find((o) => o.isCorrect);
    correctKey = correctOpt?.key;
  }

  return { options, correctKey };
}

export default function EditorialQuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  onSkip,
  onNext,
  showFeedback: _showFeedback = true,
  currentIndex: _currentIndex,
  total: _total,
  isReview: _isReview,
}) {
  const [localSelected, setLocalSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const rev0 = useReveal(0);
  const rev1 = useReveal(160);

  const { options, correctKey } = parseOptions(question);
  const selected = localSelected || selectedAnswer;

  const questionText = question.question_text || question.enunciado || '';
  const legalRef = question.legal_reference || question.referencia || null;
  const tema = question.tema;
  const temaName = question.temaName;

  const handleSelect = (key) => {
    if (answered || selected) return;
    setLocalSelected(key);
    setAnswered(true);
    onSelectAnswer(key);
    if (onNext) setTimeout(() => onNext(), 600);
  };

  const eyebrowText =
    legalRef ||
    (tema ? `Tema ${tema}${temaName ? ` · ${temaName}` : ''}` : null);

  const bodyPadding = isDesktop ? '40px 72px 32px' : '28px 24px 24px';
  const optionsPadding = isDesktop ? '0 72px' : '0 24px';
  const footerPadding = isDesktop ? '20px 72px 32px' : '14px 22px 26px';
  const questionFontSize = isDesktop ? 34 : 26;
  const optionFontSize = isDesktop ? 16 : 14;
  const letterFontSize = isDesktop ? 24 : 20;
  const optionVerticalPadding = isDesktop ? '18px 8px' : '16px 4px';
  const maxWidth = isDesktop ? 860 : 'none';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: OS.paper,
        color: OS.text,
        fontFamily: OS.sans,
        minHeight: 0,
      }}
    >
      {/* Scrollable reading area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth, margin: '0 auto' }}>
          {/* Question */}
          <div style={{ ...rev0, padding: bodyPadding }}>
            {eyebrowText && (
              <div
                style={{
                  fontSize: 10,
                  color: OS.muted,
                  letterSpacing: 1.8,
                  textTransform: 'uppercase',
                  marginBottom: 14,
                  fontWeight: 500,
                }}
              >
                {eyebrowText}
              </div>
            )}
            <div
              style={{
                fontFamily: OS.serif,
                fontSize: questionFontSize,
                lineHeight: 1.25,
                color: OS.ink,
                letterSpacing: -0.3,
              }}
            >
              {questionText}
            </div>
          </div>

          {/* Options */}
          <div style={{ ...rev1, padding: optionsPadding }}>
            {options.map((opt, i) => {
              const isSelected = selected === opt.key;
              const isCorrect = answered && opt.key === correctKey;
              const isWrong = answered && isSelected && opt.key !== correctKey;
              let borderColor = OS.rule;
              let textColor = OS.text;
              if (isCorrect) { borderColor = OS.inkSoft; textColor = OS.ink; }
              else if (isWrong) { borderColor = OS.warm; textColor = OS.warm; }
              else if (isSelected) { borderColor = OS.ink; }

              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelect(opt.key)}
                  disabled={answered || !!selected}
                  style={{
                    display: 'flex',
                    gap: isDesktop ? 20 : 14,
                    width: '100%',
                    padding: optionVerticalPadding,
                    background: 'none',
                    border: 'none',
                    borderTop: i === 0 ? `1px solid ${OS.rule}` : 'none',
                    borderBottom: `1px solid ${borderColor}`,
                    alignItems: 'flex-start',
                    cursor: answered || selected ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontFamily: OS.sans,
                    transition: 'border-color 0.3s ease, color 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      fontFamily: OS.serif,
                      fontSize: letterFontSize,
                      fontStyle: 'italic',
                      color:
                        isSelected || isCorrect || isWrong ? textColor : OS.muted,
                      width: isDesktop ? 28 : 20,
                      transition: 'color 0.3s',
                      flexShrink: 0,
                    }}
                  >
                    {opt.key})
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontSize: optionFontSize,
                      lineHeight: 1.5,
                      color: textColor,
                      transition: 'color 0.3s',
                    }}
                  >
                    {opt.text}
                  </div>
                  {isCorrect && (
                    <div style={{ color: OS.inkSoft, fontSize: 18 }} aria-label="Correcta">✓</div>
                  )}
                  {isWrong && (
                    <div style={{ color: OS.warm, fontSize: 18 }} aria-label="Incorrecta">✕</div>
                  )}
                </button>
              );
            })}

            {/* Skip button: only before selecting */}
            {onSkip && !answered && !selected && (
              <button
                onClick={onSkip}
                style={{
                  marginTop: 20,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px 0',
                  background: 'none',
                  border: 'none',
                  color: OS.muted,
                  fontSize: 12,
                  letterSpacing: 0.3,
                  cursor: 'pointer',
                  fontFamily: OS.sans,
                }}
              >
                <SkipForward size={14} />
                Dejar en blanco
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
