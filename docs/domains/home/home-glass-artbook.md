# Home Glass ArtBook

Referencia: prototipo Home v5 aprobado el 28/10/2026. Implementación adicional a la composición Standard del Home.

`HomeExperience` conserva los componentes originales como su vista Standard y carga `HomeGlassArtbook` mediante `next/dynamic` cuando la preferencia global elige Glass. Al salir se restaura Standard, foco y posición de lectura. La nueva vista utiliza la preferencia y la barra de controles existentes; no declara otra preferencia global.

Los siete capítulos editoriales se derivan de los selectores del Home, `homeCuration`, el catálogo público de Journal y las traducciones existentes. Un octavo capítulo cierra el libro con créditos y enlaces legales. El modelo canónico de colección continúa siendo ArtworkSeries. No se mantiene una copia del catálogo del prototipo.

El motor rígido de portrait sirve también a la composición editorial en dos páginas de este Home, tal como en el prototipo. El eje coincide con el centro del libro y toda la superficie editorial gira unida. Se importan el controlador, caché y material aprobados; no se reescribe su física. La capa Material comparte los parámetros de Series: reflejo .60 y cantos .90.

Solo se montan el capítulo activo y sus vecinos. Las claves React corresponden a la identidad de capítulo, no a su posición. La preparación limita la espera a las imágenes visibles y una demora de giro conserva el libro visible. La guía usa el controlador existente y deja de insistir después de aprender el gesto.

Landscape comparte la propuesta de escritorio en todos los dispositivos. Portrait muestra la misma portada de colección en móvil y tablet, y el Journal baja en una sola columna. Las miniaturas se reutilizan desde CollectionArtwork; sus proporciones y efectos pertenecen al componente original. Los estilos de la composición están aislados en un CSS Module, con las fuentes y tokens del proyecto.

El clic en una pintura abre su ruta real de detalle en Glass. El arrastre llega al motor y suprime ese clic. El enlace al Journal o a una serie utiliza la navegación localizada. Newsletter muestra su formulario original directamente dentro de la invitación; el envío, consentimiento y doble opt-in siguen en los módulos existentes.

Foto y firma se centralizan en `homeVisualAssets`. La firma referencia el WebP optimizado. El formulario Standard y el libro no se montan a la vez, evitando identificadores de formulario duplicados entre ambas experiencias.

Validación de la integración inicial: siete pruebas de datos/navegación/preparación, TypeScript, lint de archivos nuevos y compilación de 125 páginas con las dependencias de revisión disponibles. Antes de un commit se requiere build con las versiones y assets reales del proyecto, revisión EN/ES, teclado, dispositivos y ambas orientaciones. La revisión con imágenes de prueba no acredita delivery del optimizador, email ni hardware físico.


## Ajuste local v2 — 28/10/2026

- Portada desktop: firma editorial «by Rõ Visual» e insignia en la esquina superior derecha del título, fuera del flujo que comparte con Explore Collection.
- Artista en landscape: panorama desplazado ocho puntos porcentuales a la izquierda; el copy conserva su posición aprobada.
- Colección en landscape: imagen Glass configurada en `homeVisualAssets.collectionSpread`; la v2 usaba `/series/yasemi/yasemi_I_collection_hero_landscape.webp`. Portrait móvil utiliza la imagen de la obra de portada del Home (`coverArtwork.images.collection`, con fallback a primary). Standard no cambia de componentes ni de selectores.
- Journal portrait: enlace de imagen con display block y proporción editorial, sin ocultar la información del primer artículo.
- Journal landscape: portada de título compartido por ambas páginas y, después, una página por entrada pública. La primera muestra imagen a la izquierda; la siguiente invierte el orden. La secuencia y los puntos se calculan a partir del catálogo real; no se duplican relatos. Con los dos artículos actuales son nueve superficies, mientras portrait conserva siete. Al rotar desde un artículo individual hacia portrait se muestra el capítulo Journal, conservando la identidad de URL para volver al mismo artículo en landscape.
- Invitación: formulario Newsletter visible, sin pulsar un enlace para desplegarlo, y CTA Contact. Reutiliza la validación, el consentimiento y el envío existentes; no introduce otro endpoint.
- Gestos: el motor comparte exactamente la física previa. Se añade un callback opcional de selección de superficies que solo utiliza el Home. Sus enlaces y tarjetas aceptan arrastre; los controles y formularios conservan el comportamiento nativo. Las áreas de lectura Glass Home dejan de usar el marcador que excluía horizontalmente la navegación. El desplazamiento vertical y pinch no se consumen. Una protección local suprime el clic que podría seguir a un arrastre.

Las pruebas v2 ejercitan el motor real con eventos de mouse, touch y wheel, y comprueban que los otros consumidores conservan la exclusión anterior de enlaces. El navegador de revisión usa la salida compilada estática, imágenes de revisión y optimizador deshabilitado únicamente en ese entorno. No acredita el envío real de email, el optimizador de producción ni la fluidez de hardware físico. Es necesaria la revisión local con Next 16.4.2 antes de un commit.


## Ajuste local v3 — 28/10/2026

- Featured y Honourable Mention: el grupo de insignias se centra en tablet portrait. El margen automático del listado deja que una cinta que exceda el ancho siga desplazándose desde su comienzo; no se altera el componente global de insignias.
- Corrección de alcance de Rolando: el problema señalado corresponde a la página 2 (obra destacada) en tablet portrait, no a la galería de página 4. La galería mantiene sus dos miniaturas. La obra destacada recibe un contenedor con ancho explícito y centrado, y la imagen conserva su proporción dentro del tope 49svh. En la copia de revisión la imagen ya decodificaba correctamente; no se reprodujo un archivo ausente. El checker previo a la aplicación verifica la referencia real de la obra en el proyecto del propietario.
- Colección desktop/landscape: panorama `/series/yasemi/yasemi_I_hero_landscape.webp`. Se retira el desplazamiento horizontal adicional del antiguo panorama, para no empujar esta nueva composición fuera del libro. Standard conserva su selector y sus rutas actuales.
- Invitación desktop/landscape, página 9 con los dos journals actuales: dos hojas simultáneas. A la izquierda permanecen la introducción y el cierre editorial; a la derecha, Newsletter real, Contact y privacidad. Cada hoja tiene su lectura vertical si la altura no alcanza, con una sola divisoria en el lomo. Es una composición del capítulo existente; no se agrega un capítulo número diez. Portrait mantiene su columna original.
- No se modifica ningún controlador de gestos, animación, preferencia, material, API ni configuración.

Las quince pruebas existentes siguen comprobando navegación y motores. La ruta del panorama se actualiza a la indicada por Rolando. Antes del commit corresponde revisar esta v3 en el Mac con Next 16.4.2 y archivos reales.


## Ajuste local v4 — 28/10/2026

- Reflejo durante el giro: al construir las copias, el overlay todavía estaba oculto; sus contenedores de reflejo medían cero y el render se omitía. El bucle de movimiento solo repintaba el frente/reverso de la hoja móvil, dejando las mitades fijas sin reflejo hasta el aterrizaje. El motor ahora muestra el overlay y pinta ambas mitades fijas antes del primer frame girado. La hoja móvil continúa su render según el ángulo. No se alteran shader, intensidad .60, cantos .90, geometría, inercia o material.
- La corrección está en el callback de superficies existente del controlador compartido. Home y Series pueden mantener sus reflejos en las copias. Los consumidores sin ese callback conservan sus superficies CSS como antes.
- Regresión: una prueba del controlador real, con reloj GSAP controlado y DOM con dimensiones cero cuando se oculta, reproduce el fallo contra v3 y pasa con v4 en ambos sentidos, desde el inicio hasta el aterrizaje. No es una simulación del shader ni sustituye la inspección visual.
- Tablet portrait página 6: Journal en una columna vertical, igual que móvil. La secuencia de páginas independientes en landscape permanece igual.
- Tablet portrait página 4: se sustituye la pareja de miniaturas por la misma imagen de portada que utiliza mobile portrait, con la misma fuente de datos, proporción contenida y tope 46svh. Es la nueva petición explícita de esta revisión; la galería de obras seleccionadas, página 5, no cambia.
- Se conservan la imagen landscape yasemi_I_hero_landscape.webp, la página final en dos hojas, el centrado de insignias y la corrección de contenedor de página 2.

Validación automatizada: dieciséis pruebas, incluida la regresión del reflejo, lint de los módulos modificados y build/TypeScript de revisión. La prueba visual utiliza salida Next compilada con assets de revisión; validar la fluidez y el resultado en la instalación Next 16.4.2 del propietario antes del commit.

## Ajuste local v5 — 28/10/2026

Revisión solicitada tras la aprobación visual del 99.95% de v4. La vista Standard y el material/motor compartidos permanecen idénticos a v4.

- Portada de tablet portrait (desde 768 px): bloque de imagen y editorial más ancho, imagen mayor y tipografía de portada ampliada; centrado horizontal y vertical seguro. Cuando no cabe, el área interior permite leer con scroll sin cortar el comienzo.
- Journal portrait: se elimina la proporción forzada 16:9 y el límite de altura. Cada fotografía conserva su proporción natural y se recorre con el scroll interior, en una sola columna. No se alteran las fotografías del catálogo ni del Standard.
- Journal landscape, incluidos desktop y mobile: la imagen de cada artículo mantiene su hoja correspondiente y alternancia aprobada, con un margen reducido de 8–16 px. `object-fit: contain` muestra la fotografía entera, sin estirarla; el espacio sobrante depende de su proporción.
- Se traslada el copyright a un capítulo `credits` independiente, después de Newsletter/Contact. Con los dos artículos públicos actuales, son diez superficies en landscape y ocho en portrait. El total se deriva del contenido real, no de un contador fijo.
- Créditos reutiliza los textos de derechos, privacidad y términos existentes en EN/ES. La URL `chapter=credits`, los puntos, Previous/Next, el cambio de orientación y los enlaces de idioma identifican la misma página. Newsletter conserva un único formulario en su capítulo anterior.

Verificación de revisión: 16 pruebas del contenido, navegación y motor real correctas; ESLint del ámbito modificado sin incidencias y build/TypeScript de 125 páginas con Next 16.2.12. Revisión visual con salida compilada: portada tablet centrada, Journal portrait sin recorte con scroll, imágenes landscape en sus hojas, formulario único sin copyright al pie y créditos localizados con contador 10/10 y 8/8. Se usan assets de QA derivados del prototipo para la inspección: no reemplazan los WebP del propietario. El entorno utiliza fallback del material, sin acreditar GPU ni dispositivos físicos. Corresponde ejecutar lint/build en Next 16.4.2 y aprobar el resultado en local antes del commit. No hay modificaciones de APIs, proveedores, variables, repositorio remoto o despliegues.
