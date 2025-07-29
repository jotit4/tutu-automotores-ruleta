'use client';

import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

interface FortuneWheelProps {
  onWin: () => void;
}

// Funciones para manejar el historial de juegos
const getGameHistory = (): boolean[] => {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem('roulette_history');
  return history ? JSON.parse(history) : [];
};

const saveGameResult = (won: boolean) => {
  if (typeof window === 'undefined') return;
  const history = getGameHistory();
  history.push(won);
  // Mantener solo los últimos 20 juegos para optimizar
  if (history.length > 20) {
    history.shift();
  }
  localStorage.setItem('roulette_history', JSON.stringify(history));
};

// Premios asignados a cada casillero (8 secciones)
const prizes = [
  "Vasito de Shot Buhero",
  "Stickers nocturnos", 
  "Remera o Bandana Buhero",
  "Abanico Buhero",
  "Acceso a zona especial del show",
  "Entrada a sorteo para experiencia VIP",
  "Un trago para vos y tu sombra",
  "Girá de nuevo, hay un premio oculto!"
];

export default function FortuneWheel({ onWin }: FortuneWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [wonPrize, setWonPrize] = useState<string>("");
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    
    // Definir secciones
    const sectionsCount = 8;
    
    // Seleccionar una sección aleatoria (todos los casilleros son premios)
    const targetSection = Math.floor(Math.random() * sectionsCount);
    
    // Calcular rotación para que apunte al centro de la sección objetivo
    const degreesPerSection = 360 / sectionsCount; // 45 grados por sección
    const sectionCenterAngle = targetSection * degreesPerSection + (degreesPerSection / 2); // Centro de la sección
    
    // Mínimo 5 vueltas completas + rotación para apuntar al centro de la sección seleccionada (más rápido)
    const minRotation = 1800; // 5 vueltas completas para mayor velocidad
    const finalRotation = minRotation + sectionCenterAngle;

    if (wheelRef.current) {
      // Resetear la rotación antes de cada nuevo giro
      gsap.set(wheelRef.current, { rotation: 0 });
      
      gsap.to(wheelRef.current, {
        rotation: finalRotation,
        duration: 6, // Reducido a 6 segundos para mayor velocidad
        ease: "power3.out",
        onComplete: () => {
          // Determinar el premio ganado basado en la sección
          const prizeWon = prizes[targetSection];
          setWonPrize(prizeWon);
          
          // Todos los casilleros son ganadores ahora
          setIsWinner(true);
          
          // Guardar el resultado en el historial (siempre true ahora)
          saveGameResult(true);
          
          setIsSpinning(false);
          setTimeout(() => {
            setShowResult(true);
            onWin();
          }, 1000);
        }
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/fondo.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Capa oscura sobre el fondo */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="text-center mb-6 sm:mb-10 md:mb-12 mt-4 sm:mt-8 md:mt-12 px-4">
          <div className="bg-gradient-to-br from-black/30 via-black/15 via-black/8 to-transparent backdrop-blur-md p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] mx-auto w-fit">
            <h1 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.6)'
              }}
            >
              ¡Gira la Ruleta!
            </h1>
          </div>
        </div>

        <div className="relative mb-6 sm:mb-8 md:mb-10">
          {/* Pointer */}
          <div className="wheel-pointer"></div>
          
          {/* Wheel Container - Sin transparencia */}
          <div 
            ref={wheelRef}
            className="relative"
          >
            <Image
              src="/buho editado.webp"
              alt="Ruleta del Búho"
              width={400}
              height={400}
              className="w-80 h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] mx-auto"
            />
          </div>
        </div>

        {!showResult && (
          <div className="bg-gradient-to-br from-black/30 via-black/15 via-black/8 to-transparent backdrop-blur-md rounded-[2rem] p-2 mx-auto w-fit">
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="btn-primary text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs rounded-[1.5rem]"
            >
              {isSpinning ? 'Girando...' : '¡GIRAR!'}
            </button>
          </div>
        )}

        {showResult && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md w-full text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🎉</div>
              {wonPrize === "Girá de nuevo, hay un premio oculto!" ? (
                <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6 font-semibold">
                  {wonPrize}
                </p>
              ) : (
                <>
                  <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6 font-semibold">
                    ¡Ganaste: {wonPrize}!
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Nos pondremos en contacto para entregarte tu premio.
                  </p>
                </>
              )}
              <button
                onClick={() => {
                  setShowResult(false);
                  if (wonPrize !== "Girá de nuevo, hay un premio oculto!") {
                    onWin();
                  }
                  // Si es "Girá de nuevo", simplemente cierra el modal para permitir otro giro
                }}
                className="btn-secondary w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
              >
                {wonPrize === "Girá de nuevo, hay un premio oculto!" ? '¡Girar de nuevo!' : '¡Genial!'}
              </button>
            </div>
          </div>
        )}

        {!showResult && !isSpinning && (
          <div className="text-center mt-4">
            <div className="bg-gradient-to-br from-black/30 via-black/15 via-black/8 to-transparent backdrop-blur-md p-4 rounded-[2rem] mx-auto w-fit">
              <p className="text-white text-lg">
                ¡Gira la ruleta y prueba tu suerte!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}