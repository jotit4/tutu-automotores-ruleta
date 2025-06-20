# Ruleta Stromberg - Aplicación Web Interactiva

Una aplicación web moderna con una ruleta de la fortuna interactiva para la marca Stromberg, desarrollada con Next.js, Tailwind CSS, GSAP y Firebase.

## 🚀 Características

- **Formulario de participación obligatorio** con validación completa
- **Control de participación por IP** - solo una oportunidad por persona
- **Ruleta interactiva** con animaciones suaves usando GSAP
- **Diseño responsive** optimizado para móviles
- **Integración con Google Sheets** para almacenamiento de participantes
- **Estética moderna** siguiendo el branding de Stromberg

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **GSAP** - Animaciones de la ruleta
- **Google Sheets API** - Almacenamiento de datos
- **React Hook Form** - Manejo de formularios
- **Yup** - Validación de esquemas

## 📦 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar Google Sheets API:**
   - Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
   - Habilita la Google Sheets API
   - Crea una cuenta de servicio y descarga el archivo JSON de credenciales
   - Crea un archivo `.env.local` con las siguientes variables:

   ```env
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEETS_CLIENT_EMAIL="tu-service-account@proyecto.iam.gserviceaccount.com"
   GOOGLE_SHEETS_SHEET_ID="tu-google-sheet-id"
   GOOGLE_CLOUD_PROJECT_ID="tu-project-id"
   GOOGLE_SHEETS_PRIVATE_KEY_ID="key-id"
   GOOGLE_SHEETS_CLIENT_ID="client-id"
   ```

   - Comparte tu Google Sheet con el email de la cuenta de servicio

3. **Configurar Google Sheet:**
   - Crea una nueva hoja de cálculo en Google Sheets
   - La primera fila debe contener los encabezados: `nombre`, `apellido`, `telefono`, `email`, `ip`, `fecha`
   - Copia el ID de la hoja desde la URL (la parte entre `/d/` y `/edit`)
   ```

## 🚀 Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🏗️ Construcción para Producción

```bash
# Construir la aplicación
npm run build

# Ejecutar en producción
npm start
```

## 🚀 Despliegue en Vercel

### Preparación
1. **Instala Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Inicia sesión en Vercel:**
   ```bash
   vercel login
   ```

### Configuración de Variables de Entorno
En el dashboard de Vercel, configura las siguientes variables de entorno:

```
GOOGLE_SHEETS_PRIVATE_KEY
GOOGLE_SHEETS_CLIENT_EMAIL
GOOGLE_SHEETS_SHEET_ID
GOOGLE_CLOUD_PROJECT_ID
GOOGLE_SHEETS_PRIVATE_KEY_ID
GOOGLE_SHEETS_CLIENT_ID
```

### Despliegue
```bash
# Despliegue automático
vercel

# O conecta tu repositorio de GitHub para despliegues automáticos
```

### Verificación
- ✅ Build exitoso sin errores de TypeScript
- ✅ Variables de entorno configuradas
- ✅ Google Sheets API funcionando
- ✅ Aplicación responsive en todos los dispositivos

## 📱 Funcionalidades

### Formulario de Participación
- Campos obligatorios: Nombre, Apellido, Teléfono, Email
- Validación en tiempo real
- Control de IP para evitar participaciones duplicadas
- Almacenamiento seguro en Google Sheets

### Ruleta de la Fortuna
- 8 secciones visuales
- Animación suave con GSAP
- Resultado aleatorio garantizado
- Modal de felicitaciones al ganar
- Bloqueo después de participar

### Diseño Responsive
- Optimizado para dispositivos móviles
- Colores del branding Stromberg (turquesa/teal y rojo)
- Fondo personalizado con la imagen de marca
- Interfaz moderna y atractiva

## 🎨 Personalización

### Colores de Marca
Los colores están definidos en `tailwind.config.js`:
- `stromberg-teal`: #00B4A6
- `stromberg-dark-teal`: #008B7F
- `stromberg-red`: #E53E3E
- `stromberg-dark-red`: #C53030

### Imágenes
- `background.png`: Imagen de fondo principal
- `03. Iso negro Stromberg PNG.png`: Logo de Stromberg
- `logo stromberg.png`: Logo alternativo de Stromberg

## 🔧 Configuración Adicional

### Variables de Entorno
El archivo `.env.local` debe contener las configuraciones de Google Sheets API:

```env
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="tu-service-account@proyecto.iam.gserviceaccount.com"
GOOGLE_SHEETS_SHEET_ID="tu-google-sheet-id"
GOOGLE_CLOUD_PROJECT_ID="tu-project-id"
GOOGLE_SHEETS_PRIVATE_KEY_ID="key-id"
GOOGLE_SHEETS_CLIENT_ID="client-id"
```

## 📊 Estructura de Datos

Los participantes se almacenan en Google Sheets con la siguiente estructura:

| nombre | apellido | telefono | email | ip | fecha |
|--------|----------|----------|-------|----|---------|
| Juan | Pérez | +1234567890 | juan@email.com | 192.168.1.1 | 2024-01-15 10:30:00 |

## 🐛 Solución de Problemas

1. **Error de Google Sheets API**: Verifica que las variables de entorno estén configuradas correctamente
2. **Problemas de IP**: En desarrollo local, se usa una IP de fallback (127.0.0.1)
3. **Animaciones no funcionan**: Asegúrate de que GSAP esté instalado correctamente

## 📄 Licencia

Este proyecto está desarrollado para Stromberg. Todos los derechos reservados.