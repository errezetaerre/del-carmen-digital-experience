# Web Analytics

## Alcance

Integración de Vercel Web Analytics solicitada por Rolando el 28/10/2026. Las estadísticas agregadas de páginas públicas son independientes del catálogo, Contact, Newsletter y la preferencia Standard/Glass. No se añaden eventos personalizados, cookies de analítica, identificadores de clientes ni datos de formularios.

El componente `SiteAnalytics` se monta una sola vez en el layout de idioma y solo cuando `VERCEL_ENV === "production"`. Local y Preview no montan el SDK. No se requieren claves ni nuevas variables de entorno.

## Instalación y activación

Instalar `@vercel/analytics@2.0.1` con `npm install --save-exact @vercel/analytics@2.0.1`, conservando las versiones del proyecto. Incluir los cambios de `package.json` y `package-lock.json` generados por npm en el mismo commit que el código.

Activar **Web Analytics → Enable** en el proyecto de Vercel y desplegar la integración mediante el flujo normal de rama, PR, revisión y merge. Activar el panel por sí solo no instala el componente. Añadir el componente tampoco acredita la recepción de estadísticas hasta verificar el despliegue y el panel.

## Filtrado y privacidad

`analyticsPrivacy.mjs` permite las páginas editoriales públicas, incluidos sus prefijos EN/ES, y las rutas de detalle conocidas de Artworks, Series y Journal. Excluye API, acciones del boletín y rutas privadas o desconocidas. Elimina todos los parámetros y fragmentos de la URL antes de devolver el pageview al SDK, incluidos parámetros de compartir despliegues o enlaces de confirmación. Una futura ruta pública necesita incorporarse expresamente a esta lista.

El filtro descarta eventos personalizados y vistas consecutivas con la misma URL ya saneada. Los cambios de filtro, capítulo o experiencia que solo afectan la query no añaden una vista. La navegación real a otra ruta o idioma sí puede contarse; cada recarga crea un filtro nuevo. No usa almacenamiento ni altera navegación, gestos, imágenes o formularios.

El filtro controla la URL de la vista, no todos los campos internos del proveedor. Vercel procesa las categorías de dispositivo, procedencia y ubicación aproximada según su documentación. El aviso de privacidad EN/ES incorpora este uso; esta actualización no certifica el cierre legal general ni cambia Terms o sus directivas de indexación.

## Verificación

1. `node --test tests/web-analytics.test.mjs`: rutas permitidas, exclusión de acciones/privadas, limpieza de URL, deduplicación de capítulos/modos y navegación real.
2. `npm run lint` y `npm run build` sobre el proyecto local vigente.
3. En Preview y local, confirmar que no se monta Analytics.
4. Tras desplegar en Production y habilitar el panel, visitar rutas públicas y confirmar que se reciben vistas con rutas saneadas. Revisar Network y el panel: el SDK puede emplear rutas de ingestión generadas; no asumir un endpoint fijo.
5. Confirmar que pasar capítulos del mismo libro o cambiar Standard/Glass no produce vistas adicionales; navegar a otra página sí. No utilizar enlaces reales de confirmación ni tokens de terceros para esta comprobación.

El bloqueo por extensiones, la configuración del navegador o el límite del plan puede impedir la recopilación. La falta de un evento no debe interrumpir la navegación. Consultar el uso y los límites vigentes en Vercel antes de modificar el plan; esta integración no contrata un servicio de pago.

## Lanzamiento público

Rolando autoriza expresamente el lanzamiento el 28/10/2026. Se abre el dominio oficial de la versión existente de Production, SHA `99ca5add377c6a8d5008c955786a8a81ac4e507d`, sin crear un despliegue de código. La protección se conserva para Previews y URLs generadas de despliegue con Standard Protection (`prod_deployment_urls_and_all_previews`). Esto es independiente de instalar o activar Analytics.

Documentación primaria:

- https://vercel.com/docs/analytics/quickstart
- https://vercel.com/docs/analytics/package
- https://vercel.com/docs/analytics/redacting-sensitive-data
- https://vercel.com/docs/analytics/privacy-policy
