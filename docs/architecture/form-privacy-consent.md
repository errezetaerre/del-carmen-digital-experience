# Información previa y consentimiento de formularios

Version: 1.0
Document ID: DOC-FORM-PRIVACY-CONSENT
Project: Del Carmen Digital Experience
Owner: Rolando Rojas Zapata
Last Updated: 2026-10-15
Status: Código y textos preparados; instalación, revisión de producción y publicación final pendientes.

## Alcance de la revisión

Cada formulario informa antes de recoger datos y pide una casilla sin marcar por su finalidad. Contact autoriza gestionar la consulta; Newsletter autoriza novedades de obras, exposiciones y estudio, con confirmación posterior por correo. Una casilla no autoriza ambas finalidades ni constituye una aceptación general de futuras ventas.

La dirección se apoya en el artículo 5 de la [Ley 8968](https://www.tse.go.cr/pdf/normativa/leydeprotecciondelapersona.pdf), que trata la información previa y el consentimiento expreso documentado electrónicamente. La presentación por capas es una decisión de implementación para revisión; esta entrega no certifica por sí sola suficiencia jurídica o cumplimiento integral.

El aviso breve identifica al responsable, la finalidad y los requisitos y permanece visible sobre los campos. El detalle desplegable nativo aporta destinatarios, manejo, negativa, conservación, derechos y domicilio. Privacy puede abrirse en otra pestaña para conservar el formulario. Los colores, tipografía, campos y botones usan el sistema existente; no se modifica el resto del sitio.

## Redacción archivada: revisión 2026-10-15.1

Conservar este apartado como referencia histórica al introducir revisiones posteriores. La configuración de texto de esta revisión es:

```ts
// Increment this revision when the notice or consent wording changes. Preserve earlier wording in docs.
export const formPrivacy = {
    version: "2026-10-15.1",
    contact: {
        purpose: "contact-enquiry",
        summary: "Your details are used to receive and respond to your enquiry.",
        requiredSummary: "All four fields and consent are required to send this optional form.",
        collection: "Your name, email, subject and message are sent to the studio inbox through Resend. Upstash uses a request identifier for form protection.",
        requirement: "All four fields and your consent are needed to send this form. Providing them is voluntary; without them, the form cannot be sent. Sending a message does not subscribe you to the newsletter.",
        retention: "Ordinary closed enquiries are kept for up to 12 months after the last substantive exchange or closure, as applicable. Ongoing transactions and disputes are assessed separately.",
        consentLabel: "I consent to the use of these details to respond to my enquiry.",
    },
    newsletter: {
        purpose: "studio-newsletter",
        summary: "Your email is used to send occasional artwork, exhibition and studio updates after confirmation.",
        requiredSummary: "Email and consent are required. Subscribing is optional.",
        collection: "Your email, subscription source, consent record, dates and status are stored in Upstash. Resend delivers confirmation emails; Upstash also handles form protection.",
        requirement: "Your email and consent are needed to request a subscription. Providing them is voluntary; without them, you will not be subscribed. You must also confirm through the email link and can unsubscribe at any time.",
        retention: "Unconfirmed requests expire after 24 hours. Active records are reviewed annually. A minimal unsubscribe record expires after 30 days.",
        consentLabel: "I consent to receive artwork, exhibition and studio updates by email.",
    },
} as const;

export type PrivacyForm = "contact" | "newsletter";
```

Identificación utilizada al preparar esta revisión:

```ts
// Public details approved for use in the site's legal notices and contact link.
// Update these values when the contact email or notification address changes.
export const legalContact = {
    responsibleName: "Rolando Rojas Zapata",
    email: "errezetaerre@gmail.com",
    addressLines: [
        "700 meters north of the Correos de Costa Rica office in Heredia, across from the Bena workshop.",
        "Blue two-story corner house with black railings, on the right-hand side.",
        "Barrio Fátima, Heredia, 40101, Costa Rica.",
    ],
} as const;
```

La presentación común indica que el responsable gestiona los datos para Del Carmen; enlaza “Privacy notice (opens in a new tab)” y presenta el detalle bajo “How your details are handled”. Ofrece navegación sin usar el formulario y acceso, rectificación, supresión o retirada por el correo público. El domicilio se muestra con las líneas de la configuración anterior. No se registra que la persona haya abierto el desplegable o la página Privacy.

## Validación independiente del servidor

Los dos endpoints esperan `consent: true` y `consentVersion: "2026-10-15.1"` en esta revisión. El servidor comprueba el booleano exacto y la versión actual de `formPrivacy`; no acepta una cadena `"true"`, un valor truthy ni una versión enviada por el cliente como si fuera válida automáticamente.

La ausencia de consentimiento devuelve HTTP 400 y `consent_required`; una versión ausente/antigua devuelve HTTP 400 y `consent_outdated`. No se genera una suscripción ni se envía el correo de la solicitud rechazada. El limitador antiabuso sigue procesando el identificador de solicitud antes de leer el cuerpo; su analítica opcional permanece desactivada. El honeypot conserva la respuesta de éxito sin procesar el envío.

Los errores de revisión solicitan recargar la página y elegir otra vez. Instalar interfaz y endpoints conjuntamente evita que formularios antiguos sigan enviando un contrato incompleto. Los cuerpos JSON inválidos, nulos o de tipo no admitido reciben 400.

## Constancia mínima y confirmación

Contact adjunta la finalidad, declaración, versión y fecha UTC de recepción al mismo correo que contiene la consulta. No crea una base de datos de mensajes. Newsletter guarda `noticeVersion`, `purpose`, `statement` y `acceptedAt` en el objeto `consent` del registro pendiente, con fecha fijada por el servidor; la confirmación conserva ese objeto y registra `confirmedAt` por separado.

La declaración refleja lo recibido por el formulario, no una firma electrónica certificada ni prueba de lectura del aviso o identidad del remitente. No se guarda IP o agente de usuario adicionales como evidencia de consentimiento. La confirmación de email sigue siendo necesaria para activar Newsletter.

Las constancias siguen el periodo de sus datos asociados. Se aplica la caducidad pendiente de 24 horas; los activos continúan sujetos a revisión anual; al darse de baja se elimina la constancia del registro y solo quedan email, estado y fecha de baja con TTL de 30 días. Contact sigue el procedimiento manual de consultas ordinarias de 12 meses y sus excepciones justificadas. Las copias de proveedores y las peticiones individuales se gestionan aparte.

## Compatibilidad e histórico

Las suscripciones y enlaces previos no reciben datos ficticios de la casilla. La confirmación de un enlace antiguo conserva su comportamiento y no añade una constancia que no existía. Revisar la evidencia y necesidad de esos registros durante el inventario histórico; esta entrega no ejecuta migraciones, reenvíos, reconfirmaciones ni eliminaciones en producción.

Nuevas solicitudes posteriores al parche sí requieren consentimiento/revisión en el endpoint. Una versión antigua no se convierte silenciosamente en la nueva. Cambiar el aviso, finalidad, destinatarios, conservación o datos del responsable requiere revisión del texto, archivo de lo anterior y actualización de la versión. Si cambia `legal.ts`, comprobar también si corresponde una revisión nueva; el archivo no la incrementa automáticamente.

## Archivos e instalación

La actualización afecta los dos formularios, los dos endpoints POST, el helper Newsletter y Privacy, y añade configuración de texto y dos componentes compartidos. Los endpoints de confirmación y baja conservan sus bytes. El README del paquete enumera los catorce archivos de código acumulados que deben copiarse conservando rutas.

No se añaden dependencias, variables secretas, un dominio comercial, proveedor, base de Contact, plataforma de consentimiento, modal global o cron. Terms y los datos del responsable conservan su contenido aprobado. El layout legal mantiene `noindex`; ambas páginas mantienen su estado de borrador.

## Pruebas y límites

Pasaron 17 escenarios de consentimiento sobre componentes TSX y endpoints reales compilados: casillas vacías y requeridas, finalidad correcta, enlace y asociaciones accesibles, bloqueo en cliente/servidor, valores no booleanos, revisiones antiguas, constancia con fecha del servidor, confirmación, mínima baja, datos históricos sin constancia inventada, envío desde ambas interfaces, errores, reintento, deshabilitado y envío repetido, protección antiabuso y JSON inválido.

También pasaron los 22 escenarios anteriores de conservación y concurrencia con el contrato actualizado. Son **39 escenarios aislados**. Se simulan React hooks/JSX, Next, Resend, Ratelimit y comandos Redis con reloj controlado; los scripts se ejecutan con Lua 5.4. No hay servidor Redis real, cuenta de correo, navegador o SDK de proveedor instalado en estas pruebas.

Los 210 archivos TS/TSX/MTS/MJS del snapshot pasan el análisis sintáctico. Frente al paquete aprobado anterior, cambian seis archivos de fuente y se añaden tres; los otros 206 son idénticos, incluidos los módulos visuales aprobados y los endpoints confirm/unsubscribe. Estos recuentos corresponden a esta revisión, no sustituyen los registros históricos de entregas anteriores.

Quedan build/typecheck completo, render de Tailwind y revisión visual/responsive/accesible en navegador, entrega de correo y transiciones en Redis de staging con las dependencias instaladas. Tampoco se han comprobado los proveedores/regiones de producción, inventario histórico o procedimiento efectivo del buzón. No se afirma despliegue, eliminación real ni publicación legal definitiva.
