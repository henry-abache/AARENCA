NUEVA VIDA AA - INSTRUCCIONES DE DESPLIEGUE

ARCHIVOS NECESARIOS:
✅ index.html
✅ manifest.json
✅ sw.js
✅ 1-192.png (tu logo)
✅ 1-512.png (tu logo)

PASOS PARA DESPLEGAR:

1. Copia los 5 archivos a tu servidor/hosting

2. Asegúrate que HTTPS esté habilitado (requerido para PWA)

3. Verifica en navegador que los 3 archivos cargen correctamente

4. Abre la app en móvil - debería aparecer el prompt de instalación automáticamente después de 3 segundos

5. Si no aparece, acepta permisos cuando lo pida y recarga la página

FEATURES INCLUIDAS:

✅ Modo Offline Real - Todo funciona sin internet
✅ Recordatorios Push - Notificaciones diarias a las 8 AM
✅ Diario Privado - Guardado 100% en el teléfono (encriptado)
✅ Botón SOS - Números de emergencia + contacto padrino
✅ Contenido AA - Reflexiones diarias oficiales
✅ Medallones - Logros por días (1, 7, 30, 90, 180, 365)
✅ Múltiples Idiomas - ES, EN, PT, FR
✅ Versión Padrino - Panel para ver apadrinados
✅ Reuniones Virtuales - Enlaces a AA.org
✅ Modo Anónimo - Opción de usar sin datos personales
✅ PWA Ready - Instalable en pantalla de inicio automáticamente
✅ Tema Adulto Mayor - Textos y botones GIGANTES

REQUISITOS TÉCNICOS:

✅ HTTPS obligatorio
✅ Service Worker activado
✅ Manifest.json en raíz
✅ Navegador moderno (último 2 años)

TESTING:

En navegador (F12):
- Abre DevTools > Application
- Verifica Service Worker "Activated and running"
- Verifica Manifest cargue correctamente
- Verifica Cache Storage tenga archivos

En móvil:
- Abre app en Chrome/Firefox
- Debería pedir instalar automáticamente (a los 3 seg)
- O abre menú > Instalar aplicación
- Debe instalarse en pantalla de inicio

DATOS GUARDADOS LOCALMENTE:

Todo en localStorage del navegador:
- daysClean: días sin consumir
- diaryEntries: entradas del diario
- currentStep: paso AA actual
- language: idioma seleccionado
- theme: tema seleccionado
- currentUser: datos de usuario (si hay)

NO requiere servidor/base de datos para funcionar (funciona 100% offline)

SEGURIDAD:

✅ Datos solo en cliente (tu teléfono)
✅ Diario encriptado localmente
✅ PIN opcional para diario
✅ Sin envíos a servidor
✅ Puedes borrar todo con 1 botón

PERSONALIZACIÓN:

En index.html busca estas secciones para personalizar:

EMERGENCY_NUMBERS - Cambia números por tu país
AA_MESSAGES - Agrega mensajes personalizados
AA_STEPS - Los 12 pasos (opcional cambiar)
LANGUAGES - Agrega más idiomas

Para agregar sede/usuario:
En localStorage antes: localStorage.setItem('currentUser', JSON.stringify({nombre: '...', sede: '...'}))

PROBLEMAS COMUNES:

"No aparece el prompt de instalar"
→ Asegúrate HTTPS esté activo
→ Abre desde móvil (no desde desktop)
→ Espera 3-5 segundos
→ O abre menú > Instalar aplicación

"Diario no se guarda"
→ Verifica que localStorage esté habilitado
→ Abre DevTools > Storage > Local Storage
→ Debe tener datos guardados

"Service Worker no se activa"
→ Verifica que HTTPS esté activo
→ Recarga la página (Ctrl+F5)
→ Borra caché y datos del sitio

"Notificaciones no llegan"
→ Otorga permisos cuando lo pida el navegador
→ Verifica que las notificaciones de la app no estén mutidas (Sistema)

ACTUALIZACIÓN:

Si cambias código:
1. Modifica CACHE_NAME en sw.js (aumenta número de versión)
2. Los usuarios actualizarán automáticamente al recargar
3. O pueden limpiar caché manualmente

Fin de instrucciones.
