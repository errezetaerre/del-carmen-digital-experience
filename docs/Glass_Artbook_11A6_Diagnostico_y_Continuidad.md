# The Glass Artbook — Diagnóstico y continuidad 11A.6

**Proyecto:** Del Carmen Digital Experience · Rō Visual  
**Referencia temporal:** handoff del 10 de octubre de 2026  
**Estado:** registro operativo y prototipo correctivo experimental; pendiente de aprobación visual  
**Archivo:** `glass-artbook-prototype-11A-6.html`

Este registro complementa el documento de continuidad. No sustituye Project Memory 1.8, README-AI 1.0 ni las referencias aprobadas. La autorización de esta sesión comprende el diagnóstico y una corrección independiente de 11A.5. La integración en el sitio principal sigue pendiente de autorización expresa.

## Base reconstruida

Se inspeccionaron los cuatro Markdown adjuntos, los HTML exactos 08.5, Optical Lab 10 y 11A.5, y las siete capturas. Los archivos originales permanecen conservados.

| Referencia | Estado y uso |
| --- | --- |
| Project Memory 1.8 y README-AI 1.0 | Autoridad canónica del proyecto y protocolo de trabajo |
| Handoff del 10 de octubre | Estado operativo de Glass Artbook y prioridades recientes |
| Prototype 08.5 | Interacción aprobada: arrastre, inercia, reagarre, reversibilidad y aterrizaje |
| Optical Lab 10 | Apariencia óptica aprobada como referencia; no prueba de integración |
| Prototype 11A.5 | Base experimental inspeccionada; conserva defectos documentados |
| Prototype 11A.6 | Nueva corrección independiente; comprobada en lógica y shader, pendiente de validación visual |
| 11B | Refinamiento de cantos y esquinas pospuesto |

Se mantienen perspectiva inicial **1040 px**, luz horizontal **35°** e intensidad inicial **45%**. El libro permanece frontal y las hojas rígidas. Las tres ilustraciones procedurales existentes siguen siendo material provisional; no representan las pinturas originales ni nuevos assets aprobados.

La captura de Deployments muestra `4ae0c33` en `main`, marcado Ready y Production, con el mensaje visible `chore(journal): update optimized Inside the Studi…`. Este es el último despliegue visible en la captura aportada, no una comprobación del estado actual de Vercel. El código completo correspondiente a ese commit no forma parte de esta revisión.

## Diagnóstico por defecto

| Defecto | Evidencia en 11A.5 | Alcance de la conclusión |
| --- | --- | --- |
| Obra repetida durante retroceso y cambio brusco al aterrizar | `configure(-1)` asigna `art(works[target])` a `baseLeft`; `paintMaterialFrame()` envía siempre `index` como su `uPalette`. El texto muestra la obra anterior y el shader dibuja la actual. Al terminar, cambia `index` y aparece la paleta correcta. | Causa demostrada en código y diferencia de píxeles reproducida con el shader anterior. |
| Parpadeo al iniciar o terminar | `configure()`, `idle()` y `finish()` sustituyen contenido con `innerHTML`; los canvases son hijos de ese contenido. `disposeMaterials()` pierde sus contextos mediante `WEBGL_lose_context`. Dos bucles RAF separados actualizan física y material. | Se demuestran recreación y desincronización potencial. Su contribución al parpadeo observado es una hipótesis fuerte, no una medición del compositor de Chrome/Safari. |
| Respuesta óptica de información distinta | Ambas páginas sí tienen canvas y shader. La posición óptica se calcula con una hoja centrada, sin distinguir lado ni pivote del lomo. Además, `.face:before` agrega un reflejo CSS solo a la cara móvil; el valor CSS inicial es `.68`, aunque el control y el shader usan `.45`. | Se demuestra una composición y un sistema de coordenadas incoherentes. No se atribuye todo el defecto visual a una única causa sin inspección en navegador. |
| Banda del lomo que cambia entre caras | El acento anterior usa bordes/sombras del canvas con reglas diferentes para `.face` y `.back`, sin una coordenada de lomo que considere ambos sentidos de giro. | Implementación dependiente de capa/orientación, pendiente de contrastar visualmente tras corrección. |

La duplicación del fondo identificada se demuestra específicamente durante **retroceso**. No se afirma que explique todas las posibles repeticiones o parpadeos en avance.

## Correcciones en 11A.6

1. **Descriptor único por cara.** `kind`, `workIndex` y `side` alimentan tanto las etiquetas HTML como los uniformes del shader. El renderer no vuelve a inferir la obra desde `index`.
2. **Transición fijada al empezar.** `transition.from` y `transition.to` permanecen constantes durante giro, reagarre y reversión. El commit elige origen o destino según el resultado, y dibuja las hojas de reposo antes de ocultar la hoja móvil.
3. **Cuatro canvases persistentes.** Se montan una vez; cambiar obra solo actualiza el contenido textual y sus descriptores. Desaparecen las pérdidas de contexto provocadas por la navegación. Los materiales ocultos se preparan con las dimensiones de la hoja fija.
4. **Un solo ciclo de animación.** `render()` aplica la transformación y dibuja el material dentro de la misma actualización. Se conserva el contenido del drawing buffer y se informa de pérdida/restauración de WebGL.
5. **Coordenadas ópticas desde el lomo.** `uSide` identifica el lado del pivote; frente y reverso comparten la posición física de la hoja y normales opuestas. Los extremos coinciden con sus hojas estáticas correspondientes. Se conservan luz, cámara y ecuaciones de especular, Fresnel y brillo rasante de la referencia.
6. **Acento de lomo en el shader.** Una contribución cálida discreta existe en todas las caras y se ancla al lado del lomo. Se elimina la iluminación CSS adicional de la cara móvil. La apariencia de este acento requiere aprobación visual.
7. **Normalización y accesibilidad.** Intensidad inicial 45% también en CSS; los controles range conservan sus flechas de teclado. Con movimiento reducido, la navegación automática y el asentamiento tras soltar se completan directamente; el arrastre manual sigue respondiendo al gesto.
8. **GLSL definido.** Se sustituye el `smoothstep` de límites descendentes de la ilustración por su complemento con límites ascendentes, conservando la transición pretendida.

Las funciones **`down`, `move`, `up` y `tick` son idénticas al archivo 08.5**. Se conservan los valores de rigidez 230/130, amortiguación 24/20, recorrido de arrastre, umbral de decisión, velocidad y criterios de aterrizaje. Los ajustes de esquinas y borde exterior al retroceder corrigen su orientación; no constituyen el refinamiento artístico 11B.

### Matriz de contenido durante el giro

`i` representa la obra de origen y `j = i + dirección` su destino. La obra del reverso y la hoja revelada se asignan antes del primer frame y no cambian al soltar.

| Cara | Avance | Retroceso |
| --- | --- | --- |
| `baseLeft` | Pintura `i` | Pintura `j` |
| `baseRight` | Información `j` | Información `i` |
| `turnFront` | Información `i` | Pintura `i` |
| `turnBack` | Pintura `j` | Información `j` |
| Tras completar | Pintura e información `j` | Pintura e información `j` |
| Tras cancelar | Pintura e información `i` | Pintura e información `i` |

## Verificación realizada y límites

| Comprobación | Resultado |
| --- | --- |
| Sintaxis JavaScript | Correcta con `node --check` |
| Comparación de funciones físicas contra 08.5 | Las cuatro funciones coinciden exactamente |
| JavaScript original ejecutado en Node VM, con DOM/WebGL instrumentados | 21 comprobaciones superadas |
| Mapeo y uniformes a 0°, 45°, 90°, 135° y 180°, ambos sentidos | Coinciden con la matriz esperada |
| Avance, retroceso, cancelación, reagarre y reversión | Comprobados en el modelo de ejecución instrumentado |
| 40 transiciones repetidas | Cuatro identidades de canvas conservadas; ninguna destrucción de contexto por navegación |
| Extremos, movimiento reducido, controles range y restauración WebGL | Comprobados en el entorno instrumentado |
| Compilación/enlace y renderizado real de shaders GLSL ES | Correctos con Mesa EGL / llvmpipe, OpenGL ES 3.2 |
| 40 renderizados de caras, en la matriz de ángulos | Sin errores GL; sustrato opaco |
| Píxeles de frente/origen a 0° y reverso/destino a 180° | Igualdad exacta del material renderizado en ambos sentidos |
| Reproducción del error de paleta con shader 11A.5 | Diferencia objetiva entre obra anterior y actual |
| Hoja de información con intensidad 0% y 45% | Aporte óptico presente y medible |
| HTML autocontenido | Sin dependencias ni URLs externas; título y nombre corresponden a 11A.6 |

**Estas comprobaciones no equivalen a QA visual en navegador.** El DOM y WebGL instrumentados permiten comprobar estado y llamadas; Mesa EGL ejecuta el shader real, pero no renderiza tipografía, perspectiva CSS, clipping ni composición de capas del HTML.

El navegador remoto de esta sesión no pudo acceder al servidor local y su política impide abrir archivos con protocolo `file:`. No se realizó una inspección del HTML en Chrome/Safari ni una prueba real táctil/mobile. El aspecto del reflejo, la banda del lomo y la ausencia perceptual de parpadeo siguen pendientes de validación en el navegador del usuario. La igualdad de píxeles del shader tampoco elimina por sí sola las pequeñas diferencias geométricas heredadas entre cara móvil y hoja estática.

## Discrepancias documentales conservadas

- **Lab 10:** el HTML adjunto arranca en 65%; el handoff registra una aprobación a 35% y una preferencia posterior de 45% para el libro. 11A.6 usa el 45% explícito más reciente. El archivo Lab 10 no se reescribe ni su valor predeterminado se presenta como aprobado.
- **Journal:** el handoff resume Phase 1 como preview/fundación; README-AI y la actualización final del Master Index describen `/journal`, `/journal/[slug]` y documentación reconstruida. Se conserva esta discrepancia sin degradar el estado canónico ni afirmar que se auditó el código del último deployment.
- **Navegación About:** el handoff usa la expresión `About → /artist`; Project Memory describe `/about` como página institucional y `/artist` como página del artista. La asociación de estado activo de navegación no demuestra que `/about` haya desaparecido o deba redirigirse.
- **Project Memory:** Decision 001 figura como superseded por Decision 022, aunque Decision 022 trata espaciado y dice sustituir Decision 009. También permanece texto con anomalías de codificación en el registro histórico. No se corrigen ni se reinterpretan esas decisiones dentro de este experimento.
- **Documentos referidos no adjuntos:** roadmap, arquitectura completa y algunas especificaciones aparecen citados, pero no se consideran leídos ni reauditados en esta sesión. No hacen falta para el arreglo aislado del HTML; serán necesarios al preparar integración.
- Los puntos incompletos «4.» y «5.» de observaciones anteriores permanecen sin contenido inventado.

La resolución de estas discrepancias en documentación canónica requiere una revisión específica con el usuario. No bloquea esta corrección experimental porque no cambia rutas, arquitectura, decisiones aprobadas ni referencias originales.

## Validación visual pendiente

Abrir `glass-artbook-prototype-11A-6.html` en el navegador habitual y conservar inicialmente 1040 px / 45% / 35°.

1. Avanzar Sendero del Sol → Epifanía Nupcial → Yasemi II y volver. En retroceso, comprobar que la pintura revelada pertenece a la obra anterior durante todo el movimiento.
2. Sostener la hoja cerca de 0°, 45°, 90°, 135° y 180° en ambos sentidos. Comparar las dos hojas y sus reversos, atendiendo a continuidad óptica y a la banda del lomo.
3. Soltar antes y después de la mitad, reagarrar durante el asentamiento y volver hacia el origen. Observar si el contenido y el material permanecen estables.
4. Comprobar el aterrizaje y los primeros frames del giro; registrar cualquier flash o cambio perceptible de brillo.
5. Validar lectura y gesto en mobile, además del comportamiento con movimiento reducido.

Solo después de esta revisión se decidirá si 11A.6 se aprueba, necesita otra corrección o exige una alternativa de renderizado. 11B y la integración en Next.js continúan pendientes.
