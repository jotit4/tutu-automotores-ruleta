'use client';

import { useState } from 'react';
import ParticipationForm from '@/components/ParticipationForm';
import FortuneWheel from '@/components/FortuneWheel';

export default function Home() {
  const [hasWon, setHasWon] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleWin = () => {
    setHasWon(true);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    // Reiniciar el juego después del envío exitoso del formulario
    console.log('Formulario enviado exitosamente');
    setHasWon(false);
    setShowForm(false);
  };

  return (
    <main>
      {!showForm ? (
        <FortuneWheel onWin={handleWin} />
      ) : (
        <ParticipationForm onFormSubmit={handleFormSubmit} />
      )}
    </main>
  );
}