'use client';

import FortuneWheel from '@/components/FortuneWheel';

export default function Home() {
  const handleWin = () => {
    // El premio ya se muestra en el modal de la ruleta
    console.log('Premio ganado y mostrado en la ruleta');
  };

  return (
    <main>
      <FortuneWheel onWin={handleWin} />
    </main>
  );
}