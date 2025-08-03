'use client';

import { useState } from 'react';
import FortuneWheel from '@/components/FortuneWheel';
import ParticipationForm from '@/components/ParticipationForm';

export default function Home() {
  const [hasCompletedForm, setHasCompletedForm] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Para forzar re-render del componente

  const handleFormSubmit = () => {
    setHasCompletedForm(true);
  };

  const handleWin = () => {
    // El reinicio del juego se maneja cuando el usuario hace clic en "Siguiente jugador"
    setHasCompletedForm(false);
    setGameKey(prev => prev + 1); // Forzar re-render
  };

  return (
    <main>
      {!hasCompletedForm ? (
        <ParticipationForm key={`form-${gameKey}`} onFormSubmit={handleFormSubmit} />
      ) : (
        <FortuneWheel key={`wheel-${gameKey}`} onWin={handleWin} />
      )}
    </main>
  );
}