'use client';

import { useState } from 'react';
import FortuneWheel from '@/components/FortuneWheel';
import ParticipationForm from '@/components/ParticipationForm';

export default function Home() {
  const [hasCompletedForm, setHasCompletedForm] = useState(false);

  const handleFormSubmit = () => {
    setHasCompletedForm(true);
  };

  const handleWin = () => {
    // El premio ya se muestra en el modal de la ruleta
    console.log('Premio ganado y mostrado en la ruleta');
  };

  return (
    <main>
      {!hasCompletedForm ? (
        <ParticipationForm onFormSubmit={handleFormSubmit} />
      ) : (
        <FortuneWheel onWin={handleWin} />
      )}
    </main>
  );
}