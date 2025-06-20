import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    private_key_id: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export interface Participant {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fecha?: string;
}

export async function appendToSheet(participant: Participant) {
  try {
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
    
    if (!sheetId) {
      throw new Error('GOOGLE_SHEETS_SHEET_ID no está configurado');
    }

    const fecha = new Date().toLocaleString('es-ES', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const values = [
      [participant.nombre, participant.apellido, participant.telefono, participant.email, fecha]
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A:E',
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Participante agregado a Google Sheets:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al agregar participante a Google Sheets:', error);
    throw error;
  }
}

export async function getParticipants(): Promise<Participant[]> {
  try {
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
    
    if (!sheetId) {
      throw new Error('GOOGLE_SHEETS_SHEET_ID no está configurado');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A:E',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Asumiendo que la primera fila son los headers
    const participants: Participant[] = rows.slice(1).map(row => ({
      nombre: row[0] || '',
      apellido: row[1] || '',
      telefono: row[2] || '',
      email: row[3] || '',
      fecha: row[4] || ''
    }));

    return participants;
  } catch (error) {
    console.error('Error al obtener participantes de Google Sheets:', error);
    throw error;
  }
}