import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar que los datos requeridos estén presentes
    if (!data.nombre || !data.apellido || !data.telefono || !data.email) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }
    
    // Guardar en Google Sheets
    await appendToSheet({
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      email: data.email
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Participante guardado exitosamente en Google Sheets' 
    });
  } catch (error) {
    console.error('Error al guardar participante:', error);
    return NextResponse.json(
      { success: false, message: 'Error al guardar en Google Sheets' },
      { status: 500 }
    );
  }
}