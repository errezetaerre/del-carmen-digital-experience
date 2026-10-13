# Del Carmen Digital Experience
## Documento de continuidad técnica y decisiones
**Corte:** 10 octubre 2026 · **Estado:** Handoff operativo, no reemplaza Project Memory

## 01 · Propósito y autoridad

Documento de traspaso para abrir un nuevo chat sin perder decisiones. No reemplaza la documentación canónica. Jerarquía: project-memory-audited-v1.8.md (decisiones aprobadas), README-AI.md (protocolo de reconstrucción), documentación de arquitectura/roadmap según su estado, código fuente (verdad de lo implementado), y este documento (estado operativo y defectos recientes). Si hay conflicto, no sobrescribir: señalarlo y solicitar revisión. Fecha de corte: 10 de octubre de 2026.

## 02 · Identidad y principios aprobados

Nombre del proyecto: Del Carmen Digital Experience; marca matriz: Rō Visual. Experiencia editorial, contemplativa, humana, pictórica y atemporal; el arte prima sobre la interfaz. Evitar plantillas genéricas, espectáculo tecnológico gratuito y rediseños no solicitados. Identidad de luz, silencio, calidez y materialidad refinada. Conservar jerarquía de documentación y trazabilidad de decisiones. Diferenciar siempre aprobado, implementado, propuesto y pendiente.

## 03 · Arquitectura y páginas: base conocida

Stack de trabajo: Next.js 16, React, TypeScript, Tailwind, App Router. Dominio ArtworkSeries canónico. /collections: índice editorial; /series/[slug]: detalle de colección; /artworks/[slug]: experiencia de detalle. Alias de navegación: About → /artist; Collections permanece activo dentro de /series/*. Home: Hero → Featured Artwork → Artist Statement → Featured Collection → Selected Works → Journal Preview → Invitation → Footer. Featured Collection y Selected Works son escenas distintas. Los medios primary, collection y thumbnail tienen responsabilidades diferentes. Journal Phase 1 es preview/fundación; plataforma editorial completa, futura. Prisma/CMS/Admin/Marketplace y museo 3D son dirección futura, no capacidades implementadas verificadas aquí.

## 04 · Colecciones y experiencia visual

Cuatro series con imágenes hero vertical y horizontal según decisiones previas. Hero de colección: degradado discreto, diseño editorial, layouts alternos, mobile sin miniaturas; media vídeo sin datos superpuestos. Detalle de serie: tarjetas mayores, Statement + descripción, Works in this collection, fondo atmosférico; lightbox de Collections sin zoom y de Artworks con zoom. Navegación kinetic y componentes compartidos deben conservarse mientras no se autorice sustitución. Los cambios deben ser incrementales, aislados y comprobados.

## 05 · The Glass Artbook: dirección aprobada

Experimento independiente para una futura experiencia /artworks/[slug], sin permiso de integración al sitio. Libro frontal de dos hojas rígidas de cristal óptico ultrafino, cantos marfil/champán y esquinas luminosas discretas; nunca papel flexible. Pintura a la izquierda, información completa a la derecha. La hoja gira alrededor del lomo central; frente/reverso deben revelar de forma continua la obra siguiente o anterior. Arrastre mouse/touch, inercia con peso, posibilidad de volver a agarrar hoja en movimiento, giro reversible, aterrizaje sin salto. Perspectiva 1040 px. Física/interacción de 08.5 aprobada como referencia; conservar su comportamiento salvo reparación demostrada.

## 06 · Optical Lab 10: referencia visual aprobada

Optical Material Lab 10 fue aprobado visualmente. La reflexión especular realista WebGL2, cálida y concentrada, responde a normales, luz y cámara; no sustituirla por una banda CSS, máscara gris ni óvalo desenfocado. Posición horizontal de luz: 35°. Intensidad original aprobada: 35%; preferencia más reciente del usuario para el libro: 45% (usar 45% como valor inicial en la próxima iteración; preservar 35°). El laboratorio es referencia de apariencia, no evidencia de que la integración posterior funcione.

## 07 · Historial de prototipos y estado

07: geometría/física aprobadas. 08.5: física, reagarre durante movimiento y continuidad de reflejo CSS aprobados como referencia de interacción. 09: rechazado por no mejorar suficientemente el material. Optical Lab 10: aprobado visualmente. 11A–11A.3: fallaron al trasladar el reflejo, con overlays WebGL. 11A.4: mejora visible al renderizar material completo con WebGL; surgieron limitaciones de composición. 11A.5: capturas recientes muestran defectos aún presentes. Ninguna versión 11A.x está aprobada como integración final. No modificar sitio de producción.

## 08 · Defectos abiertos, prioridad máxima

P0 — Página derecha de información: reflejo no se comporta como el de la izquierda. Ambas hojas requieren respuesta óptica coherente, incluso durante giro y al reposar. P0 — Duplicación de imagen: durante el arrastre, la obra detrás puede repetir la que está girando; al soltar aparece bruscamente la obra correcta. Corregir mapeo de contenidos y commit de estado: obra anterior/actual/siguiente y front/back/base deben ser inequívocos antes, durante y después del giro, sin swap visible. P1 — Banda luminosa/degradada junto al lomo: gusta y debe conservarse, pero aparece en un lado y desaparece del reverso tras superar ~50% de giro en ambos sentidos. Mantener continuidad física y visual entre caras. P1 — Evitar blinking al aterrizar o cambiar de obra. P1 — Usar intensidad inicial 45%. P2 — Refinamiento de cantos y esquinas 11B: posponer hasta que 11A sea funcional. El usuario dejó los puntos «4.» y «5.» incompletos; no inventar su contenido.

## 09 · Diagnóstico técnico a verificar, no dar por probado

La duplicación puede originarse en un mapeo incorrecto de baseLeft/baseRight/turnFront/turnBack, orden de capas o actualización anticipada/tardía de index. El parpadeo puede resultar de recreación de canvases, commit de DOM, doble render o sincronización de caras. La asimetría del reflejo puede deberse a asignación de material/normal/orientación distinta entre página artística e informativa. El degradado del lomo debe anclarse a una definición de cara/normal coherente. Estas son hipótesis de depuración, no causas demostradas. Inspeccionar código 11A.5 y comparar con 08.5 y Lab 10 antes de reescribir.

## 10 · Protocolo obligatorio para la próxima sesión

1) Leer README-AI.md y project-memory-audited-v1.8.md, después roadmap/arquitectura pertinentes. 2) Inspeccionar archivos fuente exactos 08.5, Optical Lab 10 y 11A.5. 3) Hacer un diagnóstico por defecto con evidencia en código; no simular resultados. 4) Corregir primero duplicación/commit de estado y blinking; después material derecho y continuidad de lomo; mantener intensidad 45%. 5) Generar un HTML autocontenido con versión/título/filename coincidentes. 6) Comprobar sintaxis, existencia de archivo, interacción de avance y retroceso y, si hay navegador disponible, inspección visual en posiciones 0°, ~45°, ~90°, ~135°, 180°. 7) No declarar «solucionado» sin prueba; pedir validación visual del usuario. 8) No integrar en Next.js hasta autorización explícita.

## 11 · Matriz de estados

APROBADO: filosofía de marca; autoridad documental; arquitectura de colecciones descrita; experiencia de interacción 08.5 como referencia; apariencia Optical Lab 10; perspectiva 1040 px; luz 35°; nuevo valor preferido 45% para el libro. IMPLEMENTADO SEGÚN HISTORIAL, NO REAUDITADO EN ESTE DOCUMENTO: rutas/componentes y decisiones UX de colecciones, Journal y navegación. PROTOTIPO NO APROBADO: integración Glass Artbook 11A.5. PENDIENTE: corregir defectos P0/P1; validar WebGL en ambas hojas; 11B cantos/esquinas; integración al sitio (no autorizada). FUTURO: CMS, comercio, academia, museo 3D y otras fases del roadmap.

## 12 · Archivos a entregar al nuevo chat

Mínimo imprescindible: este documento; README-AI.md; project-memory-audited-v1.8.md; glass-artbook-prototype-08-5.html; glass-artbook-optical-lab-10.html; glass-artbook-prototype-11A-5.html (si está disponible en tu equipo); capturas de defectos. Para continuar desarrollo global: project-roadmap-audited-v1.7.md; system-architecture-audited-v1.3.md (documento global Draft/Audited, no promover a Approved); project-overview-conservative-v1.2.md; folder-architecture-conservative-v1.1.md; código fuente actual pertinente. Si falta 11A.5, pedirlo expresamente; no asumir que el 11A.4 equivale a él.

## 13 · Mensaje inicial recomendado para el nuevo chat

Continúa Del Carmen Digital Experience respetando la autoridad de project-memory-audited-v1.8.md y README-AI.md. Este documento es un handoff operativo, no autorización para modificar el sitio. Nuestra tarea inmediata es depurar The Glass Artbook 11A.5 sin alterar la física aprobada de 08.5 ni el material óptico aprobado de Lab 10. Prioridades: reflejo en página derecha, eliminar duplicación/salto de obra durante el giro, continuidad de luz en lomo y reversos, evitar blinking y fijar intensidad inicial 45% con luz 35° y perspectiva 1040 px. Revisa los HTML reales antes de cambiar código. Genera prototipo independiente, valida lo comprobable y solicita aprobación antes de integrar.

