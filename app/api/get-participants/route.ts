import { NextResponse } from 'next/server';
import { getParticipants } from '@/lib/googleSheets';

export async function GET() {
  try {
    const participants = await getParticipants();
    
    return NextResponse.json({ 
      success: true, 
      data: participants,
      count: participants.length
    });
  } catch (error) {
    console.error('Error al obtener participantes:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener participantes de Google Sheets' },
      { status: 500 }
    );
  }
}