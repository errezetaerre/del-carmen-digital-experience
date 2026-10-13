# The Glass Artbook — versión oficial 11B-23

**Aprobación de Rolando:** 12 de octubre de 2026, 19:55, Costa Rica.
**Estado:** prototipo independiente aprobado; acabado cerrado. La revisión visual en `/artworks/[slug]` corresponde a la integración.

La referencia oficial es `glass-artbook-prototype-11B-23.html`. Esta aprobación conserva exactamente el HTML entregado. No crea una versión 11B-24 ni introduce otro ajuste visual.

Huella SHA-256 del archivo aprobado:
`4ae0de0273fe3eeae079067e92a82719cfa16cde8823a50b6e3e1560dd8383d2`

## Acabado y comportamiento que se conservan

| Elemento | Estado aprobado |
| --- | --- |
| Hoja | Cristal rígido, giro sobre el eje Y alrededor del lomo; dimensiones constantes |
| Interacción | Arrastre, giro reversible, caída ágil con inercia y reagarre durante el movimiento |
| Perspectiva | 1040 px |
| Luz principal | 35°; apoyo óptico en la hoja informativa |
| Reflejo del cristal | 60% |
| Brillo de cantos | 90%, independiente del reflejo del cristal |
| Cantos | Bronce/ocre, curva luminosa y difusión tenue; conservan su material cuando pasa el destello |
| Contorno | Fino, con su grosor y color aprobados; película al 50% |
| Línea bajo la técnica | Fina, con luz horizontal difusa y matiz bronce |
| Esquinas | Luz integrada en la curva; núcleo puntual destacado retirado |
| Fondo | Atmósfera sutil, con pausa y respeto de movimiento reducido |

## Preparación para `/artworks/[slug]`

1. Leer el código actual del detalle de obra y su documentación vigente: `README-AI.md` y `project-memory-audited-v1.8.md`, además de la arquitectura pertinente. Mantener `ArtworkSeries` como dominio canónico.
2. Adaptar el prototipo como una experiencia aislada dentro de la composición existente. Conservar geometría, física, material óptico y separación de intensidades.
3. Sustituir las ilustraciones procedurales de muestra por imágenes reales dentro del material del libro. Usar los datos reales para título, año, técnica y descripción. Conservar la convención de nombres de assets con guiones bajos.
4. Abrir la obra correspondiente al slug y obtener la secuencia de navegación de los datos y del comportamiento vigentes. Retirar la lista fija de tres obras del prototipo al hacer esa adaptación.
5. Verificar en navegador la carga de las imágenes, encuadre, legibilidad, mouse/touch, tamaños de pantalla y movimiento reducido. Revisar avance, retroceso, cancelación y reagarre, especialmente en 0°, 45°, 90°, 135° y 180°.
6. Evaluar el libro en el fondo, tipografía y composición reales de `/artworks/[slug]`. Si hace falta, ajustar allí el resultado visual usando 11B-23 como referencia aprobada.

## Evidencia y alcance

La versión aprobada pasó 25 comprobaciones de interacción en un entorno determinista, compilación y render del shader real, continuidad de materiales en los extremos del giro y comprobación del canto bajo el reflejo. Esas comprobaciones no equivalen a una prueba de integración en el navegador del sitio.

Este cierre complementa el documento de continuidad del 10 de octubre. Las referencias históricas a 11A.5 pendiente y al reflejo inicial de 45% describen aquel corte; para este prototipo rigen la aprobación de 11B-23 y los valores 60% / 90% indicados aquí. La arquitectura general conserva su propia autoridad documental.
