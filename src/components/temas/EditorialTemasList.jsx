/**
 * EditorialTemasList — editorial index of 28 temas.
 *
 * Faithful to Claude Design:
 *   /tmp/claude-design/oposita-smart/project/screens/temas.jsx
 *
 * Mobile (<1024px): masthead + big headline + tab bar (All/Block I/II)
 *                   + running list of temas
 * Desktop (>=1024px): masthead + 1.2fr/1fr grid hero (headline + progress)
 *                     + 2-column list (Bloque I / Bloque II)
 */

import React, { useMemo, useState } from 'react';
import {
  Masthead, Eyebrow, Headline, UnfurlBar, TabBar,
  useReveal, useMediaQuery, OS,
} from '../editorial/EditorialPrimitives';

function strengthColor(strength) {
  return {
    firme: OS.inkSoft,
    'en curso': OS.gold,
    frágil: OS.warm,
    pendiente: OS.mutedSoft,
  }[strength];
}

function strengthFromProgress(topic) {
  const p = Number(topic.progress ?? 0);
  const acc = Number(topic.accuracy ?? topic.accuracyRate ?? 0);
  if (p === 0 && !topic.questionsAnswered) return 'pendiente';
  if (p >= 75 && acc >= 80) return 'firme';
  if (p >= 40) return 'en curso';
  return 'frágil';
}

function TemaRow({ tema, delay = 0, onClick, locked = false }) {
  const rev = useReveal(delay);
  const [hover, setHover] = useState(false);
  const strength = tema.strength || strengthFromProgress(tema);
  const progress = Math.round(tema.progress ?? 0);
  const lawLabel = tema.law || tema.subject || tema.materia || '';

  return (
    <button
      onClick={locked ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={locked}
      style={{
        ...rev,
        display: 'grid',
        gridTemplateColumns: '32px 1fr 80px 56px',
        gap: 14,
        padding: '14px 2px',
        borderBottom: `1px solid ${OS.rule}`,
        cursor: locked ? 'not-allowed' : 'pointer',
        alignItems: 'baseline',
        transform: hover && !locked ? 'translateX(4px)' : rev.transform,
        transition: rev.transition + ', transform 0.25s ease',
        width: '100%',
        background: 'none',
        border: 'none',
        borderBottomStyle: 'solid',
        textAlign: 'left',
        fontFamily: OS.sans,
        opacity: locked ? 0.5 : 1,
      }}
    >
      <div style={{
        fontFamily: OS.serif, fontSize: 14, fontStyle: 'italic',
        color: OS.muted, fontVariantNumeric: 'tabular-nums',
      }}>
        T{String(tema.number ?? tema.n).padStart(2, '0')}
      </div>
      <div>
        <div style={{
          fontFamily: OS.serif, fontSize: 17, color: OS.ink,
          letterSpacing: -0.2, lineHeight: 1.25,
        }}>
          {tema.name || tema.t}
        </div>
        {lawLabel && (
          <div style={{
            fontSize: 10, color: OS.muted, marginTop: 3,
            letterSpacing: 0.5, textTransform: 'uppercase',
          }}>{lawLabel}</div>
        )}
      </div>
      <div style={{
        fontSize: 10, color: strengthColor(strength),
        letterSpacing: 1.5, textTransform: 'uppercase',
        fontWeight: 500, textAlign: 'right',
      }}>{strength}</div>
      <div style={{
        fontFamily: OS.serif, fontSize: 20, color: OS.ink,
        textAlign: 'right', fontVariantNumeric: 'tabular-nums', letterSpacing: -0.4,
      }}>
        {progress}<span style={{ fontSize: 10, color: OS.muted }}>%</span>
      </div>
    </button>
  );
}

function useSortedTemas(topics) {
  return useMemo(() => {
    return [...(topics || [])].sort((a, b) => {
      const na = Number(a.number ?? 99);
      const nb = Number(b.number ?? 99);
      return na - nb;
    });
  }, [topics]);
}

function useBlockStats(temas) {
  return useMemo(() => {
    if (!temas.length) return { avg: 0, firme: 0, enCurso: 0, fragil: 0, pendiente: 0 };
    const avg = Math.round(temas.reduce((s, t) => s + (t.progress || 0), 0) / temas.length);
    const counts = { firme: 0, 'en curso': 0, frágil: 0, pendiente: 0 };
    temas.forEach((t) => {
      const s = strengthFromProgress(t);
      counts[s]++;
    });
    return {
      avg,
      firme: counts.firme,
      enCurso: counts['en curso'],
      fragil: counts.frágil,
      pendiente: counts.pendiente,
    };
  }, [temas]);
}

// ------- MOBILE -------

function TemasMobile({ temas, onTopicSelect, block1, block2 }) {
  const [tab, setTab] = useState('all');
  const tabs = [
    { key: 'all', label: 'Todos' },
    { key: 'b1', label: 'Bloque I' },
    { key: 'b2', label: 'Bloque II' },
  ];
  const list = tab === 'b1' ? block1 : tab === 'b2' ? block2 : temas;

  return (
    <div style={{
      minHeight: '100vh', padding: '20px 22px 40px',
      background: OS.paper, fontFamily: OS.sans,
    }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Masthead label="Temario · AGE" meta={`${temas.length} temas`} />
        <div style={{ marginTop: 22 }}>
          <Headline size={36} italic as="h1">
            Índice del <span style={{ color: OS.inkSoft, fontStyle: 'normal' }}>temario</span>.
          </Headline>
          <div style={{ fontSize: 12, color: OS.textMuted, marginTop: 10, lineHeight: 1.55 }}>
            {temas.length} temas en dos bloques según la Orden HFP/435. Toca uno para practicar.
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <TabBar tabs={tabs} active={tab} onChange={setTab} />
        </div>

        <div style={{ marginTop: 8 }}>
          {list.map((t, i) => (
            <TemaRow
              key={t.id ?? t.number ?? t.n}
              tema={t}
              delay={i * 25}
              onClick={() => onTopicSelect?.(t)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ------- DESKTOP -------

function TemasDesktop({ temas, onTopicSelect, block1, block2 }) {
  const rev0 = useReveal(0);
  const stats = useBlockStats(temas);

  return (
    <div style={{
      minHeight: '100vh', padding: '40px 56px 56px',
      background: OS.paper, fontFamily: OS.sans,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={rev0}>
          <Masthead
            label="Temario · Aux. Administrativo AGE"
            meta={`${temas.length} temas · Orden HFP/435`}
          />
          <div style={{
            marginTop: 32, display: 'grid',
            gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'end',
          }}>
            <Headline size={64} italic as="h1">
              Índice del <span style={{ color: OS.inkSoft, fontStyle: 'normal' }}>temario</span>.
            </Headline>
            <div style={{ paddingBottom: 8 }}>
              <div style={{ fontSize: 14, color: OS.textMuted, lineHeight: 1.55 }}>
                Progreso medio actual: <span style={{ color: OS.ink, fontWeight: 500 }}>{stats.avg}%</span>.
                {' '}
                {stats.firme > 0 && `${stats.firme} firmes · `}
                {stats.enCurso > 0 && `${stats.enCurso} en curso · `}
                {stats.fragil > 0 && `${stats.fragil} frágiles · `}
                {stats.pendiente > 0 && `${stats.pendiente} pendientes`}
              </div>
              <div style={{ marginTop: 16 }}>
                <UnfurlBar value={stats.avg} delay={400} />
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 48, display: 'grid',
          gridTemplateColumns: '1fr 1fr', columnGap: 72, rowGap: 0,
        }}>
          <div>
            <Masthead label="Bloque I · Organización pública" meta={`T01–T${String(block1.length).padStart(2, '0')}`} />
            <div style={{ marginTop: 16 }}>
              {block1.map((t, i) => (
                <TemaRow
                  key={t.id ?? t.number}
                  tema={t}
                  delay={200 + i * 20}
                  onClick={() => onTopicSelect?.(t)}
                />
              ))}
            </div>
          </div>
          <div>
            <Masthead
              label="Bloque II · Actividad y ofimática"
              meta={block2.length
                ? `T${String((block1.length) + 1).padStart(2, '0')}–T${String(temas.length).padStart(2, '0')}`
                : '—'}
            />
            <div style={{ marginTop: 16 }}>
              {block2.length
                ? block2.map((t, i) => (
                    <TemaRow
                      key={t.id ?? t.number}
                      tema={t}
                      delay={400 + i * 20}
                      onClick={() => onTopicSelect?.(t)}
                    />
                  ))
                : (
                  <div style={{
                    padding: '24px 2px', fontSize: 13, color: OS.muted,
                    fontStyle: 'italic', fontFamily: OS.serif,
                  }}>
                    Bloque II próximamente.
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------- DISPATCHER -------

export default function EditorialTemasList({
  topics = [],
  userProgress: _userProgress = {},
  onTopicSelect,
  loading = false,
}) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const sorted = useSortedTemas(topics);

  // Split by block1/block2 using block field if present, else by number (<=16 = block1)
  const block1 = sorted.filter((t) => {
    if (t.block) return t.block === 1 || t.block === 'I' || t.block === '1';
    return Number(t.number) <= 16;
  });
  const block2 = sorted.filter((t) => {
    if (t.block) return t.block === 2 || t.block === 'II' || t.block === '2';
    return Number(t.number) > 16;
  });

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: OS.paper,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: OS.serif, fontStyle: 'italic', color: OS.muted, fontSize: 13,
      }}>
        Cargando temario…
      </div>
    );
  }

  return isDesktop
    ? <TemasDesktop temas={sorted} onTopicSelect={onTopicSelect} block1={block1} block2={block2} />
    : <TemasMobile temas={sorted} onTopicSelect={onTopicSelect} block1={block1} block2={block2} />;
}
