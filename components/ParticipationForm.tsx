'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';

interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}

interface ParticipationFormProps {
  onFormSubmit: () => void;
}

const schema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio'),
  apellido: yup.string().required('El apellido es obligatorio'),
  telefono: yup.string()
    .matches(/^[0-9+\-\s()]+$/, 'Formato de teléfono inválido')
    .required('El teléfono es obligatorio'),
  email: yup.string()
    .email('Formato de email inválido')
    .required('El email es obligatorio'),
});

export default function ParticipationForm({ onFormSubmit }: ParticipationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });



  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/save-participant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los datos');
      }

      console.log('Participante registrado exitosamente:', data);
      setIsSubmitting(false);
      onFormSubmit();
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un error al procesar tu participación. Inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <Image
              src="/logo stromberg.png"
              alt="Stromberg Logo"
              width={150}
              height={60}
              className="mx-auto w-24 h-auto sm:w-32 md:w-36"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            ¡Ganaste!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Completa el formulario para participar en el sorteo y ganar increíbles premios
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div>
            <label className="form-label text-sm sm:text-base">Nombre *</label>
            <input
              type="text"
              {...register('nombre')}
              className="form-input text-sm sm:text-base"
              placeholder="Ingresa tu nombre"
            />
            {errors.nombre && (
              <p className="error-message text-xs sm:text-sm">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="form-label text-sm sm:text-base">Apellido *</label>
            <input
              type="text"
              {...register('apellido')}
              className="form-input text-sm sm:text-base"
              placeholder="Ingresa tu apellido"
            />
            {errors.apellido && (
              <p className="error-message text-xs sm:text-sm">{errors.apellido.message}</p>
            )}
          </div>

          <div>
            <label className="form-label text-sm sm:text-base">Teléfono *</label>
            <input
              type="tel"
              {...register('telefono')}
              className="form-input text-sm sm:text-base"
              placeholder="Ingresa tu teléfono"
            />
            {errors.telefono && (
              <p className="error-message text-xs sm:text-sm">{errors.telefono.message}</p>
            )}
          </div>

          <div>
            <label className="form-label text-sm sm:text-base">Correo Electrónico *</label>
            <input
              type="email"
              {...register('email')}
              className="form-input text-sm sm:text-base"
              placeholder="Ingresa tu email"
            />
            {errors.email && (
              <p className="error-message text-xs sm:text-sm">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-3 sm:py-4"
          >
            {isSubmitting ? 'Procesando...' : 'Enviar'}
          </button>
        </form>

        <p className="text-xs sm:text-sm text-gray-500 text-center mt-4 sm:mt-6">
          * Todos los campos son obligatorios.
        </p>
      </div>
    </div>
  );
}