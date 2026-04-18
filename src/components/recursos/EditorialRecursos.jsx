/**
 * EditorialRecursos — library of laws, schemes and summaries in
 * Calma Editorial style.
 *
 * Based on Claude Design handoff:
 *   /tmp/claude-design/oposita-smart/project/screens/fortaleza-recursos.jsx
 *
 * Mobile-first layout; desktop gets wider max-width but same single
 * column of entries. Filter tabs: Todo · Leyes · Esquemas · Favoritos.
 */

import React, { useMemo, useState } from 'react';
import {
  Masthead, Eyebrow, Headline, TabBar,
  useReveal, useMediaQuery, OS,
} from '../editorial/EditorialPrimitives';

// Curated catalog — same items as the original RecursosPage but flattened
// into the editorial row format. Each item has kind, title, meta, fav, href.
const CATALOG = [
  { kind: 'LEY', title: 'Constitución Española', meta: '169 arts · 1978', fav: true,  href: 'https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229' },
  { kind: 'LEY', title: 'Ley 39/2015 · LPAC',    meta: '133 arts · Procedimiento administrativo común', fav: true,  href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-10565' },
  { kind: 'LEY', title: 'Ley 40/2015 · LRJSP',   meta: '158 arts · Régimen jurídico del Sector Público', fav: false, href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-10566' },
  { kind: 'LEY', title: 'Ley 50/1997 · del Gobierno', meta: '29 arts', fav: false, href: 'https://www.boe.es/buscar/act.php?id=BOE-A-1997-25336' },
  { kind: 'LEY', title: 'TREBEP', meta: '100 arts · Estatuto Básico del Empleado Público', fav: true,  href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719' },
  { kind: 'LEY', title: 'LOTC (LO 2/1979)', meta: 'Tribunal Constitucional', fav: false, href: 'https://www.boe.es/buscar/act.php?id=BOE-A-1979-23709' },
  { kind: 'LEY', title: 'LBRL (Ley 7/1985)', meta: 'Bases del Régimen Local', fav: false, href: 'https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392' },
  { kind: 'LEY', title: 'LOPDGDD (LO 3/2018)', meta: 'Protección de Datos y Garantía de Derechos Digitales', fav: false, href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673' },
  { kind: 'LEY', title: 'LO 3/2007 · Igualdad efectiva',  meta: 'Mujeres y hombres', fav: false, href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2007-6115' },
  { kind: 'ESQ', title: 'Jerarquía normativa',  meta: '1 pág · resumen visual', fav: false, href: null },
  { kind: 'ESQ', title: 'Tipos de silencio administrativo', meta: 'Esquema visual', fav: true, href: null },
  { kind: 'RES', title: 'LPAC en 20 cuadros', meta: 'PDF · 18 pág', fav: false, href: null },
  { kind: 'RES', title: 'CE en 10 preguntas clave',    meta: 'PDF · 12 pág', fav: true, href: null },
  { kind: 'RES', title: 'Plazos en el procedimiento',    meta: 'Tabla · 2 pág', fav: false, href: null },
];

const TAB_KEYS = {
  all: (_i) => true,
  leyes: (i) => i.kind === 'LEY',
  esq: (i) => i.kind === 'ESQ',
  fav: (i) => !!i.fav,
};

function ResourceRow({ item, delay = 0, onToggleFav }) {
  const rev = useReveal(delay);
  const [hover, setHover] = useState(false);
  const isLink = Boolean(item.href);

  const content = (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...rev,
        display: 'grid',
        gridTemplateColumns: '40px 1fr 28px',
        gap: 12,
        padding: '14px 0',
        borderBottom: `1px solid ${OS.rule}`,
        alignItems: 'center',
        cursor: isLink ? 'pointer' : 'default',
        transform: hover && isLink ? 'translateX(4px)' : rev.transform,
        transition: rev.transition + ', transform 0.25s ease',
        fontFamily: OS.sans,
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: 1.5,
          color: OS.muted,
          fontWeight: 500,
        }}
      >
        {item.kind}
      </div>
      <div>
        <div
          style={{
            fontFamily: OS.serif,
            fontSize: 17,
            color: OS.ink,
            letterSpacing: -0.15,
            lineHeight: 1.25,
          }}
        >
          {item.title}
        </div>
        <div style={{ fontSize: 11, color: OS.muted, marginTop: 3 }}>{item.meta}</div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFav?.(item);
        }}
        aria-label={item.fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        style={{
          background: 'none',
          border: 'none',
          fontSize: 16,
          color: item.fav ? OS.gold : OS.mutedSoft,
          cursor: 'pointer',
          padding: 4,
          lineHeight: 1,
        }}
      >
        {item.fav ? '★' : '☆'}
      </button>
    </div>
  );

  if (isLink) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'block' }}
      >
        {content}
      </a>
    );
  }
  return content;
}

export default function EditorialRecursos({ onNavigate: _onNavigate }) {
  const [tab, setTab] = useState('all');
  const [favorites, setFavorites] = useState(
    () => new Set(CATALOG.filter((i) => i.fav).map((i) => i.title))
  );
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const catalog = useMemo(
    () => CATALOG.map((i) => ({ ...i, fav: favorites.has(i.title) })),
    [favorites]
  );

  const toggleFav = (item) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(item.title)) next.delete(item.title);
      else next.add(item.title);
      return next;
    });
  };

  const filterFn = TAB_KEYS[tab] || TAB_KEYS.all;
  const filtered = catalog.filter(filterFn);

  const rev0 = useReveal(0);

  const tabs = [
    { key: 'all', label: 'Todo' },
    { key: 'leyes', label: 'Leyes' },
    { key: 'esq', label: 'Esquemas' },
    { key: 'fav', label: 'Favoritos' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: isDesktop ? '40px 56px 56px' : '20px 22px 40px',
        background: OS.paper,
        fontFamily: OS.sans,
      }}
    >
      <div
        style={{
          maxWidth: isDesktop ? 820 : 560,
          margin: '0 auto',
        }}
      >
        <Masthead
          label="Recursos · biblioteca"
          meta={`${catalog.length} documentos`}
        />

        <div style={{ ...rev0, marginTop: 22 }}>
          <Headline size={isDesktop ? 56 : 36} italic as="h1">
            Tu <span style={{ color: OS.inkSoft, fontStyle: 'normal' }}>biblioteca</span>.
          </Headline>
          <div
            style={{
              fontSize: isDesktop ? 14 : 12,
              color: OS.textMuted,
              marginTop: 12,
              lineHeight: 1.55,
              maxWidth: 580,
            }}
          >
            Leyes, esquemas y resúmenes oficiales. Todo apunta al BOE cuando hay enlace vigente.
          </div>
        </div>

        <div style={{ marginTop: 26 }}>
          <TabBar tabs={tabs} active={tab} onChange={setTab} />
        </div>

        <div style={{ marginTop: 8 }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '28px 0',
                fontSize: 13,
                color: OS.muted,
                fontStyle: 'italic',
                fontFamily: OS.serif,
              }}
            >
              Sin resultados en esta categoría.
            </div>
          ) : (
            filtered.map((item, i) => (
              <ResourceRow
                key={item.title}
                item={item}
                delay={i * 30}
                onToggleFav={toggleFav}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
