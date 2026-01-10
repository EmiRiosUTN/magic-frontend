# MagicAI Platform - Frontend Setup

Este frontend está completamente integrado con tu backend y listo para usar.

## Configuración

### 1. Backend
Asegúrate de que tu backend esté corriendo en `http://localhost:3000`

### 2. Frontend
```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

## Credenciales de Acceso

### Usuario Administrador
- **Email**: admin@magicai.com
- **Contraseña**: admin123

## Funcionalidades Implementadas

### Para Usuarios Admin
1. **Gestión de Usuarios**
   - Crear usuarios (USER o ADMIN)
   - Ver lista de todos los usuarios
   - Asignar roles y suscripciones

2. **Gestión de Categorías**
   - Crear nuevas categorías (español e inglés)
   - Editar categorías existentes
   - Eliminar categorías (soft delete)
   - Configurar icono y orden de visualización

3. **Gestión de Agentes**
   - Crear agentes simples (solo con prompts)
   - Configurar proveedor de IA (OpenAI o Gemini)
   - Seleccionar modelo (gpt-4o-mini, gemini-pro, etc.)
   - Editar y eliminar agentes
   - Asignar agentes a categorías

4. **Acceso completo a todas las funcionalidades de usuario**

### Para Usuarios Normales
1. **Selección de Categorías**
   - Ver categorías disponibles con iconos SVG personalizados
   - Navegar entre categorías

2. **Chat con Agentes**
   - Seleccionar agentes por categoría
   - Sidebar con todas las conversaciones del agente
   - Crear nuevas conversaciones (máximo 5 por agente)
   - Cambiar entre conversaciones guardadas
   - Eliminar conversaciones con confirmación
   - Ver estado de límite (X/5 conversaciones)
   - Modal profesional al alcanzar el límite
   - Enviar mensajes y recibir respuestas de IA en tiempo real
   - Historial completo de mensajes por conversación
   - Indicadores de tiempo relativo (hace 5m, hace 2h, etc.)

## Estructura del Proyecto

```
src/
├── components/
│   ├── admin/              # Componentes de administración
│   │   ├── AdminPanel.tsx
│   │   ├── UserManagement.tsx
│   │   ├── CategoryManagement.tsx
│   │   └── AgentManagement.tsx
│   ├── auth/               # Autenticación
│   │   └── LoginPage.tsx
│   ├── chat/               # Sistema de chat
│   ├── icons/              # Iconos SVG personalizados
│   ├── landing/            # Selección de categorías/agentes
│   └── ui/                 # Componentes UI reutilizables
├── contexts/
│   └── AuthContext.tsx     # Contexto de autenticación global
├── services/
│   └── api.ts              # Cliente API para backend
└── types/
    └── index.ts            # Tipos TypeScript

## API Backend

El frontend se conecta automáticamente a `http://localhost:3000/api` y maneja:

- Autenticación con JWT
- Gestión de usuarios
- CRUD de categorías
- CRUD de agentes
- Conversaciones y mensajes
- Sistema de límites por suscripción

## Características Técnicas

### Autenticación
- JWT almacenado en localStorage
- Context API para estado global de autenticación
- Rutas protegidas
- Manejo automático de sesión expirada

### Gestión de Estado
- React Context para autenticación
- Estado local para datos de UI
- Llamadas API en tiempo real

### UI/UX
- Diseño responsivo con Tailwind CSS
- Iconos SVG personalizados para categorías
- Iconos de Lucide React para UI
- Animaciones y transiciones suaves
- Feedback visual para todas las acciones

## Sistema de Gestión de Conversaciones

### Características del Sidebar
- **Vista lateral colapsable**: El sidebar se puede ocultar/mostrar con un botón
- **Lista de conversaciones**: Muestra todas las conversaciones del agente actual
- **Contador de límite**: Indica cuántas conversaciones tienes (ej: 3/5)
- **Timestamps relativos**: Muestra cuándo fue la última actividad (hace 5m, hace 2h, hace 3d)
- **Indicador de conversación activa**: La conversación actual se destaca visualmente
- **Botón de nueva conversación**: Siempre visible en la parte superior

### Límite de Conversaciones
- Cada agente permite hasta 5 conversaciones simultáneas (configurable por suscripción)
- Al alcanzar el límite:
  1. Se muestra una **modal de confirmación profesional**
  2. La modal indica qué conversación se eliminará (la más antigua)
  3. Muestra el título y cantidad de mensajes de la conversación a eliminar
  4. Puedes cancelar o confirmar la creación

### Eliminación de Conversaciones
- **Doble click para eliminar**:
  1. Primer click: El botón se pone rojo
  2. Segundo click (dentro de 3 segundos): Confirma la eliminación
  3. Evita eliminaciones accidentales
- Si eliminas la conversación actual, automáticamente carga otra

### Navegación entre Conversaciones
- Click en cualquier conversación para cambiar
- Los mensajes se cargan automáticamente
- El estado se mantiene al cambiar entre conversaciones

## Próximos Pasos

1. **Agentes con Tools** (próximamente)
   - Cuando el backend soporte agentes con herramientas
   - El frontend ya está preparado con el campo `hasTools`

2. **Onboarding de Usuario**
   - Selección de idioma (ES/EN)
   - Las APIs ya están implementadas en el servicio

3. **Estadísticas Admin**
   - Dashboard con métricas
   - Las APIs están disponibles en `/admin/stats`

## Notas Importantes

- Las API keys están configuradas en el backend, no es necesario configurarlas en el frontend
- El sistema maneja automáticamente los límites de conversaciones según el tipo de suscripción
- Los mensajes tienen límite configurable por conversación
- Las categorías y agentes soportan multiidioma (ES/EN)
- El backend gestiona todo el procesamiento de IA (OpenAI y Gemini)

## Solución de Problemas

### Error de conexión con backend
- Verifica que el backend esté corriendo en `http://localhost:3000`
- Revisa la consola del navegador para errores de CORS

### Error 401 Unauthorized
- Cierra sesión y vuelve a iniciar sesión
- Verifica que el token JWT sea válido

### No se cargan las categorías
- Asegúrate de que el backend tenga categorías creadas
- Verifica que el usuario tenga permisos correctos
