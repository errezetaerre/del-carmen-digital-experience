# Conservación y eliminación: procedimiento operativo

Version: 1.2
Document ID: DOC-DATA-RET-OPS
Project: Del Carmen Digital Experience
Owner: Rolando Rojas Zapata
Last Updated: 2026-10-18
Status: Plazos confirmados; código preparado, instalación y comprobación de producción pendientes.

## Plazos aprobados

| Datos | Plazo | Aplicación |
| --- | --- | --- |
| Consulta ordinaria cerrada, sin operación vigente ni disputa | 12 meses desde el último intercambio sustantivo o cierre, según corresponda | Revisión manual del buzón. |
| Solicitud de Newsletter sin confirmar | 24 horas desde la última solicitud válida | TTL del registro pendiente y de su enlace actual. |
| Suscripción activa | Mientras continúen la suscripción y su finalidad | Sin TTL; revisión manual de necesidad al menos anual. |
| Baja de Newsletter | Máximo 30 días desde la baja, para resolver incidencias | Exclusión inmediata de la audiencia; TTL del registro mínimo. |
| Petición válida de supresión | Procedimiento independiente | No esperar al vencimiento ordinario. |

Son decisiones operativas aprobadas, no plazos generales impuestos por ley. Las copias y registros de proveedores se revisan conforme al servicio y plan efectivos.

## Buzón de Contact: revisión manual

Responsable operativo: Rolando. El formulario entrega correo mediante Resend al buzón indicado por `CONTACT_EMAIL_TO`; no hay una base de mensajes Contact que este código pueda purgar.

1. Identificar únicamente la correspondencia del proyecto. El buzón temporal es personal y contiene otros mensajes que no pertenecen a este procedimiento.
2. Mantener identificadas las consultas abiertas. Una venta, obligación contable, contrato o disputa requiere su propia evaluación y no entra en el borrado ordinario de consultas.
3. Al cerrar una consulta ordinaria, anotar la fecha de cierre y comprobar el último intercambio sustantivo. Si existen ambas fechas, usar la posterior como referencia. Una respuesta automática o un mensaje comercial ajeno al asunto no renueva el periodo.
4. Revisar periódicamente los vencimientos y eliminar los hilos y adjuntos del proyecto que alcancen los 12 meses y ya no sean necesarios. La revisión debe impedir superar el plazo aprobado; no consiste en revisar una vez al año y conservar otro año adicional.
5. Comprobar cómo funcionan Papelera, copias, exportaciones y respaldos en el buzón utilizado. Mover un mensaje a Papelera no equivale por sí solo a garantizar su eliminación de todas las copias. Gestionar el vencimiento y las solicitudes válidas de eliminación de forma acorde con esas funciones.
6. Registrar solo la evidencia mínima de la revisión: fecha, ámbito, resultado y excepciones justificadas; evitar duplicar mensajes y datos personales en otra hoja de control.

Esta entrega no accede a Gmail ni configura filtros o borrados automáticos. Si cambia el correo del proyecto, trasladar también este procedimiento, revisar `CONTACT_EMAIL_TO` y actualizar el contacto público en `src/config/legal.ts`.

## Newsletter: lo que aplica el código

- Una solicitud válida crea o reemplaza un registro pendiente y un enlace actual con TTL de 86.400 segundos. No reemplaza una suscripción ya activa.
- Reenviar la solicitud vuelve inutilizable el enlace anterior por comprobación de su hash. Ese lookup anterior desaparece al vencer sus propias 24 horas; no se prolonga con cada reenvío.
- Confirmar quita el TTL del registro activo, consume el enlace y mantiene un lookup de baja sin el vencimiento de la solicitud pendiente.
- Darse de baja retira inmediatamente la pertenencia al Set de audiencia y consume el enlace. Solo conserva `email`, `status` y `unsubscribedAt`, con TTL de 2.592.000 segundos.
- Una nueva solicitud tras la baja requiere confirmación y recibe un nuevo TTL de 24 horas. Al confirmarse, deja de tener TTL otra vez.
- Un fallo tardío del correo solo puede limpiar su propia solicitud pendiente. No elimina una solicitud más reciente ni una suscripción ya confirmada.

Estas reglas se aplican a las transiciones ejecutadas después de instalar el parche. No hay un cron ni un borrado general de Redis. Los identificadores y contadores antiabuso son distintos de los registros de suscripción; `analytics: false` no elimina el histórico de analítica ya guardado ni registros de otros proveedores.

## Revisión anual de suscripciones activas

Revisar al menos una vez al año si el Newsletter sigue teniendo la finalidad comunicada y si los datos activos continúan siendo necesarios. Comprobar también que la audiencia solo incluya estados activos y que el mecanismo de baja funcione en los mensajes enviados.

La revisión no renueva el consentimiento ni autoriza otros fines. Documentar las decisiones de forma mínima. Si la finalidad termina o algún registro deja de ser necesario, definir la retirada y eliminación correspondiente mediante una operación dirigida y revisada. No poner un TTL de 24 horas o 30 días a toda la audiencia activa.

El proyecto suministrado aún no incluye un emisor de campañas. Antes de enviar Newsletter, completar y comprobar el enlace de baja específico de cada destinatario; la mera generación del token en confirmación no distribuye ese enlace por sí sola.

## Registros históricos: inventario antes de migrar

No se ha accedido a Redis real ni se ha borrado ningún dato anterior. Una implantación nueva puede tener registros pendientes o de baja creados por el código antiguo sin TTL.

Antes de dar por completada la conservación en producción:

1. Hacer inventario de solo lectura y un dry run limitado al namespace Newsletter: estado, fecha aplicable, TTL, pertenencia a audiencia y lookups relacionados. Los informes deben evitar listar correos completos cuando basten recuentos.
2. Separar estados activos, pendientes y bajas. Revisar manualmente las fechas ausentes o inválidas; no tratarlas automáticamente como antiguas ni reiniciar a cero el plazo de un registro vencido.
3. Preparar una migración concreta para revisar: TTL restante o eliminación de registros ya vencidos, siempre condicionada a que el estado y su versión leída no hayan cambiado. Una confirmación o nueva solicitud concurrente debe quedar protegida.
4. Revisar claves de confirmación, baja y miembros huérfanos del Set. No usar `FLUSHDB`, borrado por prefijos amplios ni un TTL indiscriminado sobre todos los suscriptores.
5. Validar primero en un entorno aislado y acordar la operación sobre los datos históricos. La confirmación de los plazos no autoriza una eliminación masiva a ciegas.

La entrega no incluye ni ejecuta esa migración: faltan el inventario real y su alcance concreto.

## Peticiones individuales y copias de proveedores

Las peticiones llegan al contacto público configurado. Registrar la recepción, verificar de forma proporcionada que se refieren al solicitante e identificar los datos afectados. No exigir documentación adicional que no sea necesaria.

Atender acceso, rectificación, supresión o retirada conforme a su procedimiento aplicable. La Ley 8968, artículo 7, contempla cinco días hábiles para resolver las peticiones relevantes; el vencimiento de la conservación ordinaria no sustituye ese trámite. Cualquier excepción necesita una justificación concreta, no una conservación indefinida por defecto.

Una supresión dirigida de Newsletter debe considerar registro, audiencia y lookups propios, incluidos los sustituidos que aún no hayan vencido. Verificar el resultado y evitar que un enlace antiguo reactive datos eliminados. La eliminación en Redis no borra correos recibidos ni copias de Resend, del buzón, del alojamiento o de respaldos.

Comprobar los servicios, plan, regiones y políticas efectivos antes de prometer eliminación en todas sus copias. Usar el procedimiento del proveedor cuando corresponda y conservar solo la evidencia de atención necesaria y justificada. No publicar claves, tokens ni contenido personal en incidencias o logs.

## Instalación y comprobación antes de publicar Privacy

- Copiar los catorce archivos de código del README como una sola actualización, incluido el helper y las tres rutas Newsletter. No instalar solamente un endpoint.
- Ejecutar el build y typecheck habituales del proyecto completo y comprobar la versión instalada de `@upstash/redis` y su método `eval`.
- En Redis de pruebas y con correos de prueba, verificar TTL de pending y lookup, retirada del TTL al confirmar, baja inmediata del Set, TTL de 30 días y nueva suscripción. No esperar días: inspeccionar TTL y usar claves aisladas de prueba para comprobar los límites.
- Probar enlaces sustituidos/consumidos y solicitudes simultáneas. Las transiciones deben modificar de forma coherente el registro, los lookups y el Set.
- Probar entrega con el remitente verificado y entorno correcto. El Gmail público no sustituye la configuración de remitente de Resend.
- Completar el inventario histórico y la migración que se acuerde; verificar copias de proveedores y procedimiento del buzón.
- Comprobar en el despliegue los avisos y las casillas de consentimiento ahora preparados y cerrar la revisión final de los textos. Hasta entonces se conservan el aviso de borrador y `noindex` de las páginas legales.

## Verificación de la entrega

Pasaron 22 escenarios aislados sobre las rutas y el helper TypeScript reales compilados, ejecutando sus scripts con Lua 5.4 y un modelo de comandos Redis con reloj controlado. Se simularon Next, Resend y Ratelimit. No se utilizó un servidor Redis real ni los SDK de los proveedores instalados, no hubo envíos reales y no se modificó el entorno de Rolando.

Los 207 archivos de código suministrados pasan el análisis sintáctico. Solo cambian Privacy y las tres rutas Newsletter y se añade el helper; los otros 207 archivos de fuente permanecen idénticos respecto a la propuesta anterior. Esto no equivale al build/typecheck completo ni a una comprobación de producción.

Referencias: [Ley 8968](https://www.tse.go.cr/pdf/normativa/leydeprotecciondelapersona.pdf), [Upstash EVAL](https://upstash.com/docs/redis/sdks/ts/commands/scripts/eval), [Redis SET](https://redis.io/docs/latest/commands/set/), [Resend Security](https://resend.com/security).

## Constancias de consentimiento: actualización de los formularios

Las nuevas solicitudes incluyen una casilla inicialmente vacía y una revisión del aviso comprobada en servidor. La explicación y el archivo de la revisión están en `docs/architecture/form-privacy-consent.md`.

- Contact incorpora la declaración, finalidad, versión y fecha UTC de recepción al correo de la consulta. Se conserva y elimina con esa correspondencia; no crear una copia permanente aparte por defecto.
- Newsletter conserva finalidad, declaración, versión y fecha de recepción en el registro pendiente y activo. La confirmación añade su propia fecha, sin sustituir la constancia de la solicitud.
- El vencimiento pendiente elimina la constancia con su registro. La baja la retira del registro, que queda reducido a los tres campos mínimos ya aprobados durante un máximo de 30 días.
- El código no añade consentimiento a datos históricos. Los enlaces emitidos previamente conservan su funcionamiento; el inventario debe distinguir las constancias antiguas de las nuevas y revisar su fundamento real.
- Las peticiones individuales de datos incluyen también la constancia cuando corresponda. La versión no es una prueba de que alguien abrió el aviso ni de una identidad verificada: documenta la declaración recibida por el formulario.
- Si cambian finalidad, destinatarios, conservación, texto de consentimiento o datos del responsable, revisar la información previa, archivar la redacción anterior e incrementar la revisión. No reinterpretar una constancia antigua como aceptación de un nuevo fin.

La interfaz, la configuración compartida y los endpoints deben instalarse juntos. Validar el aviso desplegado y sus errores antes de retirar el estado de borrador de las páginas legales. Esta entrega no configura el buzón ni sustituye la revisión de las copias de los proveedores.

## Idioma de la constancia EN/ES — 2026-10-18

Las nuevas solicitudes identifican el idioma de la declaración aceptada: en Contact forma parte de la constancia del correo; en Newsletter es `consent.language` junto a versión, finalidad, texto y fecha. Inglés conserva `2026-10-15.1`; español utiliza `2026-10-18.1-es`. La revisión y declaración se seleccionan/validan en el servidor. No se infiere retrospectivamente un idioma o aceptación para registros antiguos.

Esta metadata sigue exactamente la conservación de su consulta/suscripción. Pendientes: 24 horas; activos: mientras continúen suscripción/finalidad y revisión anual; baja: solo email/estado/fecha durante 30 días. La confirmación conserva la constancia, la baja la elimina del registro mínimo. Los scripts Redis, TTL, audiencia, limpieza protegida de fallos y procedimiento manual del buzón mantienen sus bytes/reglas. No se accede, elimina, reenvía, reconfirma ni migra información real en esta entrega.

Revisar el idioma/revisión/texto efectivamente registrados durante las pruebas operativas posteriores, sin duplicar correos o datos en una nueva planilla. Las copias de proveedores y los requerimientos individuales continúan tratándose según este procedimiento. Ver DOC-FORM-PRIVACY-CONSENT y DOC-I18N para copias archivadas y verificación.
