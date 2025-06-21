'use client';

import { useState, useRef, useEffect } from 'react';
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

const calculateWinProbability = (): boolean => {
  const history = getGameHistory();
  
  // Si no hay historial, empezar con probabilidad alta (90%)
  if (history.length === 0) {
    return Math.random() < 0.9;
  }
  
  // Calcular estadísticas de los últimos 10 juegos
  const last10Games = history.slice(-10);
  const winsInLast10 = last10Games.filter(result => result === true).length;
  
  // Ajustar probabilidad basada en el objetivo de 9 ganadores cada 10 juegos (90%)
  let adjustedProbability = 0.9;
  
  if (last10Games.length >= 10) {
    if (winsInLast10 >= 9) {
      // Ya se alcanzó el objetivo, mantener probabilidad alta pero no 100%
      adjustedProbability = 0.8;
    } else if (winsInLast10 <= 7) {
      // Muy pocos ganadores para el objetivo del 90%, aumentar probabilidad
      adjustedProbability = 0.95;
    }
  } else {
    // Menos de 10 juegos, usar probabilidad base con ligero ajuste
    const targetWins = Math.floor((last10Games.length * 9) / 10);
    if (winsInLast10 < targetWins) {
      adjustedProbability = 0.95;
    } else if (winsInLast10 > targetWins) {
      adjustedProbability = 0.85;
    }
  }
  
  return Math.random() < adjustedProbability;
};

export default function FortuneWheel({ onWin }: FortuneWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    
    // Definir secciones
    const sectionsCount = 8;
    const allSections = [0, 1, 2, 3, 4, 5, 6, 7];
    
    // Sistema de probabilidades inteligente (90% de ganar en 10 intentos)
    const willWin = calculateWinProbability();
    
    // Seleccionar una sección aleatoria de todas las secciones disponibles
    const targetSection = allSections[Math.floor(Math.random() * allSections.length)];
    
    // Calcular rotación para que apunte al centro de la sección objetivo
    const degreesPerSection = 360 / sectionsCount; // 45 grados por sección
    const sectionCenterAngle = targetSection * degreesPerSection + (degreesPerSection / 2); // Centro de la sección
    
    // Mínimo 3 vueltas completas + rotación para apuntar al centro de la sección seleccionada
    const minRotation = 1080; // 3 vueltas completas
    const finalRotation = minRotation + sectionCenterAngle;

    if (wheelRef.current) {
      // Resetear la rotación antes de cada nuevo giro
      gsap.set(wheelRef.current, { rotation: 0 });
      
      gsap.to(wheelRef.current, {
        rotation: finalRotation,
        duration: 9,
        ease: "power3.out",
        onComplete: () => {
          // Guardar el resultado en el historial
          saveGameResult(willWin);
          setIsWinner(willWin);
          
          setIsSpinning(false);
          setTimeout(() => {
            setShowResult(true);
            if (willWin) {
              onWin();
            }
          }, 1000);
        }
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="text-center mb-4 sm:mb-8 mt-8 sm:mt-16 px-4">
        <div className="mb-4 sm:mb-6 bg-gradient-to-br from-black/30 via-black/15 via-black/8 to-transparent backdrop-blur-md p-3 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] mx-auto w-fit">
          <Image
            src="/02. Iso Blanco Stromberg  PNG.png"
            alt="Stromberg Logo"
            width={150}
            height={150}
            className="mx-auto w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
          />
        </div>
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

      <div className="relative mb-8">
        {/* Pointer */}
        <div className="wheel-pointer"></div>
        
        {/* Wheel Container */}
        <div className="wheel-container bg-gradient-to-br from-black/30 via-black/15 via-black/8 to-transparent backdrop-blur-md p-8 rounded-[2rem]">
          <div 
            ref={wheelRef}
            className="wheel"
          >
            {/* 8 sections */}
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="wheel-section"
                style={{
                  transform: `rotate(${index * 45}deg)`,
                }}
              >

              </div>
            ))}
            
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-stromberg-teal flex items-center justify-center">
              <div className="text-stromberg-teal font-bold text-lg">S</div>
            </div>
          </div>
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
            {isWinner ? (
              <>
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🎉</div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-stromberg-teal mb-3 sm:mb-4">
                  ¡Felicitaciones!
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6">
                  ¡Ganaste el premio Stromberg!
                </p>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Nos pondremos en contacto contigo pronto para coordinar la entrega de tu premio.
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">😔</div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-3 sm:mb-4">
                  ¡Sigue intentando!
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6">
                  Esta vez no fue tu turno, pero puedes volver a intentarlo.
                </p>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  ¡La suerte puede cambiar en el próximo giro!
                </p>
              </>
            )}
            <button
              onClick={() => {
                setShowResult(false);
                if (isWinner) {
                  onWin();
                }
              }}
              className="btn-secondary w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
            >
              {isWinner ? '¡Genial!' : '¡Intentar de nuevo!'}
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
  );
}