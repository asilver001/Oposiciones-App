/**
 * EditorialOposicionStep — Step 1 of editorial onboarding.
 * Select which oposición to prepare for.
 */

import React, { useState } from 'react';
import EditorialOnboardingShell, { OnboardingOption } from './EditorialOnboardingShell';

const OPOSICION_OPTIONS = [
  { key: 'age-aux', title: 'Auxiliar Administrativo AGE', meta: 'Administración General del Estado · C2', active: true },
  { key: 'age-adm', title: 'Administrativo AGE', meta: 'C1 · próximamente', active: false },
  { key: 'ayun', title: 'Auxiliar Administrativo Ayto.', meta: 'Corporaciones locales · próximamente', active: false },
  { key: 'otro', title: 'Otra oposición', meta: 'Avísame cuando esté lista', active: false },
];

export default function EditorialOposicionStep({ onSelect, onBack }) {
  const [selected, setSelected] = useState('age-aux');

  return (
    <EditorialOnboardingShell
      stepNumber={1}
      stepLabel="Oposición"
      eyebrow="Bienvenido"
      headline="¿A qué oposición te"
      headlineAccent="presentas?"
      helperText="Empezamos por saber a cuál aspiras. Puedes cambiarlo en cualquier momento."
      onBack={onBack}
      primaryLabel="Continuar"
      primaryDisabled={!selected}
      onPrimary={() => onSelect?.(selected === 'age-aux' ? 'auxiliar-age' : selected)}
    >
      {OPOSICION_OPTIONS.map((opt, i) => (
        <OnboardingOption
          key={opt.key}
          title={opt.title}
          meta={opt.meta}
          active={opt.active}
          selected={selected === opt.key}
          firstInGroup={i === 0}
          onClick={() => opt.active && setSelected(opt.key)}
        />
      ))}
    </EditorialOnboardingShell>
  );
}
