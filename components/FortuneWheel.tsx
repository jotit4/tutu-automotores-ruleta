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

// Premios con sus probabilidades
const prizes = [
  { name: "Lapicera", probability: 50, color: "#ffffff" }, // Blanco
  { name: "Voucher Lomito Nostra", probability: 25, color: "#60a5fa" }, // Azul muy claro
  { name: "Lapicera", probability: 20, color: "#ffffff" }, // Blanco
  { name: "Voucher Lomito Nostra", probability: 5, color: "#60a5fa" } // Azul muy claro
];

// Función para seleccionar premio basado en probabilidades
const selectPrizeByProbability = () => {
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (let i = 0; i < prizes.length; i++) {
    cumulative += prizes[i].probability;
    if (random <= cumulative) {
      return i;
    }
  }
  return prizes.length - 1; // Fallback al último premio
};

export default function FortuneWheel({ onWin }: FortuneWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [wonPrize, setWonPrize] = useState<string>("");
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    
    // Seleccionar premio basado en probabilidades
    const targetPrizeIndex = selectPrizeByProbability();
    
    // Definir secciones
    const sectionsCount = 4;
    
    // Calcular rotación para que apunte al centro de la sección objetivo
    const degreesPerSection = 360 / sectionsCount; // 90 grados por sección
    const sectionCenterAngle = targetPrizeIndex * degreesPerSection + (degreesPerSection / 2); // Centro de la sección
    
    // Mínimo 5 vueltas completas + rotación para apuntar al centro de la sección seleccionada
    const minRotation = 1800; // 5 vueltas completas
    const finalRotation = minRotation + sectionCenterAngle;

    if (wheelRef.current) {
      // Resetear la rotación antes de cada nuevo giro
      gsap.set(wheelRef.current, { rotation: 0 });
      
      gsap.to(wheelRef.current, {
        rotation: finalRotation,
        duration: 6,
        ease: "power3.out",
        onComplete: () => {
          // Determinar el premio ganado basado en la probabilidad
          const prizeWon = prizes[targetPrizeIndex].name;
          setWonPrize(prizeWon);
          
          // Todos los casilleros son ganadores
          setIsWinner(true);
          
          // Guardar el resultado en el historial
          saveGameResult(true);
          
          setIsSpinning(false);
          setTimeout(() => {
            setShowResult(true);
          }, 1000);
        }
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/nuevo.webp)',
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
          
          {/* Wheel Container */}
          <div 
            ref={wheelRef}
            className="relative"
          >
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              className="w-80 h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] mx-auto"
            >
              {/* Círculo exterior */}
              <circle cx="200" cy="200" r="190" fill="#1f2937" stroke="#374151" strokeWidth="4"/>
              
              {/* Secciones de la ruleta */}
              {prizes.map((prize, index) => {
                const angle = (360 / prizes.length) * index;
                const nextAngle = (360 / prizes.length) * (index + 1);
                const startAngleRad = (angle * Math.PI) / 180;
                const endAngleRad = (nextAngle * Math.PI) / 180;
                
                const x1 = 200 + 180 * Math.cos(startAngleRad);
                const y1 = 200 + 180 * Math.sin(startAngleRad);
                const x2 = 200 + 180 * Math.cos(endAngleRad);
                const y2 = 200 + 180 * Math.sin(endAngleRad);
                
                const largeArcFlag = nextAngle - angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 200 200`,
                  `L ${x1} ${y1}`,
                  `A 180 180 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `Z`
                ].join(' ');
                
                // Calcular posición del texto
                const textAngle = angle + (360 / prizes.length) / 2;
                const textAngleRad = (textAngle * Math.PI) / 180;
                const textX = 200 + 120 * Math.cos(textAngleRad);
                const textY = 200 + 120 * Math.sin(textAngleRad);
                
                return (
                  <g key={index}>
                    <path d={pathData} fill={prize.color} stroke="white" strokeWidth="2"/>
                    <image
                         x={textX - 60}
                         y={textY - 60}
                         width="120"
                         height="120"
                         href="/signo pregunta.webp"
                         transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                       />
                  </g>
                );
              })}
              
              {/* Círculo central */}
              <circle cx="200" cy="200" r="20" fill="#374151" stroke="white" strokeWidth="3"/>
            </svg>
          </div>
        </div>

        {!showResult && (
          <div className="bg-gradient-to-br from-black/30 via-black/15 via-black/8 to-transparent backdrop-blur-md rounded-[2rem] p-2 mx-auto w-fit">
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="bg-white text-black text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs rounded-[1.5rem] font-bold hover:bg-gray-100 transition-colors"
            >
              {isSpinning ? 'Girando...' : '¡GIRAR!'}
            </button>
          </div>
        )}

        {showResult && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md w-full text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🎉</div>
              <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6 font-semibold">
                ¡Ganaste: {wonPrize}!
              </p>
              <button
                onClick={() => {
                  setShowResult(false);
                  onWin();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors w-full sm:w-auto text-sm sm:text-base"
              >
                ¡Siguiente Jugador!
              </button>
            </div>
          </div>
        )}

        {!showResult && !isSpinning && (
          <div className="text-center mt-4">
            <div className="bg-gradient-to-br from-black/30 via-black/15 via-black/8 to-transparent backdrop-blur-md p-4 rounded-[2rem] mx-auto w-fit mb-6">
              <p className="text-white text-lg">
                ¡Gira la ruleta y prueba tu suerte!
              </p>
            </div>
            <Image
              src="/03-LOGO-BLANCO.webp"
              alt="Logo Stromberg"
              width={500}
              height={354}
              className="mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}