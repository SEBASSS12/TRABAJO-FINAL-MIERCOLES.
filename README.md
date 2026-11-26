# Taller Final de Programación de Redes
## Servicio Web REST – Consulta y Registro de Inventario

**Institución:** Corporación Instituto de Administración y Finanzas – CIAF  
**Programa:** Tecnología en Desarrollo de Software  
**Asignatura:** Programación de Redes  
**Grupo:** 2 – Miércoles  
**Proyecto:** API REST para consulta y registro de inventario  
**Puerto:** 3000

---

## 1. Integrantes del equipo

Los integrantes están organizados alfabéticamente por apellido, de acuerdo con el listado oficial:

| N.º de lista | Nombre completo |
|---:|---|
| 7 | Miguel Ángel Gallego Cadena |
| 24 | Johan Sebastián Salinas Sánchez |
| 26 | Duvan Felipe Valencia Altamar |

### Identificación del equipo

El número N se obtiene tomando el número de lista del primer integrante al ordenar alfabéticamente los apellidos.

- **Número N:** 7
- **Encabezado obligatorio:** `X-Red-Equipo: CIAF-7`
- **Encabezado de respuesta:** `X-Servidor-Procesado: Equipo-7`

---

## 2. Descripción del proyecto

El proyecto consiste en desarrollar un servicio web REST utilizando Node.js y Express, que permita consultar y registrar productos de inventario.

El servicio utiliza el protocolo HTTP para recibir solicitudes y enviar respuestas en formato JSON. Además, implementa encabezados HTTP personalizados para controlar el acceso y una política CORS para permitir solicitudes desde un origen definido.

El servidor cuenta con dos endpoints principales:

- GET `/api/recurso`: permite consultar los productos registrados.
- POST `/api/recurso`: permite registrar nuevos productos.

Los productos se almacenan temporalmente en memoria mientras el servidor está ejecutándose. No se utiliza una base de datos.

### Cliente que consumiría el servicio

Este servicio podría ser utilizado por un navegador web o una aplicación móvil de los empleados encargados del inventario de diferentes sucursales.

Por ejemplo, un empleado podría consultar la cantidad de teclados disponibles o registrar la llegada de nuevos monitores.

### Riesgos de utilizar HTTP sin cifrado

Si la comunicación se realiza mediante HTTP sin cifrado, la información podría ser interceptada por personas que tengan acceso al tráfico de red.

Entre los principales riesgos se encuentran:

- Exposición de información enviada entre el cliente y el servidor.
- Intercepción de los encabezados HTTP.
- Robo de la credencial `X-Red-Equipo`.
- Modificación de los datos durante la transmisión.
- Suplantación de las partes que se comunican.

Por esta razón, en un entorno real se recomienda utilizar HTTPS.

---

## 3. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| Node.js | Ejecutar JavaScript en el servidor. |
| Express | Crear el servidor HTTP y administrar los endpoints. |
| CORS | Configurar los orígenes autorizados. |
| Postman | Realizar pruebas de las solicitudes HTTP. |
| JSON | Intercambiar información entre cliente y servidor. |
| Visual Studio Code | Escribir y organizar el código. |
| GitHub | Almacenar y compartir el proyecto. |

---

## 4. Estructura del proyecto

```text
Trabajo miercoles/
│
├── src/
│   └── server.js
│
├── evidencias/
│   ├── 01-get-exitoso.png
│   ├── 02-post-exitoso.png
│   └── 03-error-401.png
│
├── postman/
│   └── CIAF-Equipo-7-API-Inventario.postman_collection.json
│
├── node_modules/
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

La carpeta `node_modules` contiene las dependencias instaladas y no debe publicarse en GitHub.

---

## 5. Configuración del servidor HTTP

El servidor fue desarrollado utilizando Node.js y Express.

Se estableció el puerto 3000 para recibir las solicitudes HTTP.

### Endpoints implementados

**GET /api/recurso**

Permite consultar los productos disponibles en el inventario.

Respuesta esperada: HTTP 200 OK.

**POST /api/recurso**

Permite registrar nuevos productos enviando información JSON.

Ejemplo del cuerpo de la solicitud:

```json
{
    "nombre": "Monitor",
    "cantidad": 8
}
```

Respuesta esperada: HTTP 201 Created.

### Encabezados de seguridad

Todas las solicitudes a los endpoints `/api` deben incluir:

```text
X-Red-Equipo: CIAF-7
```

El servidor verifica este valor mediante un middleware.

Si el encabezado no existe o su valor es incorrecto, la solicitud es rechazada con el código HTTP 401 Unauthorized.

En las respuestas exitosas se incluye:

```text
X-Servidor-Procesado: Equipo-7
```

---

## 6. Configuración de CORS

CORS (Cross-Origin Resource Sharing) es un mecanismo que permite establecer qué orígenes pueden realizar solicitudes a un servidor desde un navegador.

En nuestro proyecto se utiliza el middleware `cors` de Express.

El origen autorizado es:

```text
http://localhost:5500
```

También se configuran los métodos HTTP permitidos:

- GET
- POST

Y los encabezados autorizados:

- Content-Type
- X-Red-Equipo

Se expone el encabezado personalizado de respuesta:

```text
X-Servidor-Procesado
```

### Encabezado HTTP de respuesta

Cuando una solicitud válida incluye el encabezado Origin autorizado, el servidor devuelve:

```text
Access-Control-Allow-Origin: http://localhost:5500
```

Este encabezado permite que un navegador identifique el origen autorizado para acceder a la respuesta.

CORS no reemplaza la autenticación ni cifra la comunicación. Su función es controlar el acceso de los navegadores a recursos de otros orígenes.

En nuestras pruebas utilizamos Postman y enviamos manualmente el encabezado Origin para comprobar la respuesta del servidor. Postman no aplica las restricciones CORS de los navegadores.

---

## 7. Análisis del modelo TCP/IP

Cuando Postman realiza una solicitud al servidor Express, los datos atraviesan las cuatro capas del modelo TCP/IP.

### 7.1. Capa de aplicación

En esta capa se encuentra el protocolo HTTP.

Postman construye la solicitud con:

- Método HTTP: GET o POST.
- Dirección del recurso: `/api/recurso`.
- Encabezados HTTP.
- Cuerpo JSON, cuando corresponde.

Express recibe la solicitud y procesa la información.

### 7.2. Capa de transporte

Se utiliza el protocolo TCP, que permite establecer una conexión confiable entre el cliente y el servidor.

En nuestro proyecto, el servidor escucha en el puerto 3000.

TCP permite entregar los datos en orden y detectar problemas durante la transmisión.

### 7.3. Capa de Internet

En esta capa se utiliza el protocolo IP para identificar el origen y el destino de la comunicación.

Como estamos utilizando `localhost`, las solicitudes se dirigen al propio computador, normalmente mediante la dirección de loopback `127.0.0.1`.

### 7.4. Capa de acceso a red

Esta capa se encarga del envío de datos sobre el medio de comunicación y del acceso a la red.

En una comunicación entre equipos puede involucrar tecnologías como Ethernet o Wi-Fi.

En nuestro caso, al utilizar `localhost`, la comunicación permanece dentro del mismo computador y utiliza su interfaz de loopback, sin necesidad de atravesar una red física externa.

---

## 8. Seguridad mediante HTTPS (SSL/TLS)

HTTPS es la versión segura de HTTP. Utiliza TLS para proteger la comunicación entre un cliente y un servidor.

TLS proporciona principalmente:

- **Confidencialidad:** cifra los datos para evitar que personas no autorizadas puedan leerlos.
- **Integridad:** permite detectar modificaciones de los datos durante la transmisión.
- **Autenticación del servidor:** mediante certificados digitales, ayuda a verificar la identidad del servidor.

En nuestro proyecto utilizamos HTTP local para realizar las pruebas de los endpoints.

No implementamos un certificado TLS ni configuramos HTTPS en el servidor. Sin embargo, en un entorno de producción se recomienda implementar HTTPS para proteger los datos y las credenciales transmitidas.

---

## 9. Pruebas realizadas en Postman

Se creó una colección llamada:

`CIAF - Equipo 7 - API Inventario`

La colección contiene tres solicitudes principales.

### Prueba 1. Consulta de inventario (GET)

**URL:**

```text
http://localhost:3000/api/recurso
```

**Método:** GET

**Headers:**

```text
X-Red-Equipo: CIAF-7
Origin: http://localhost:5500
```

**Resultado obtenido:** HTTP 200 OK.

El servidor devolvió los productos registrados en formato JSON y los encabezados de respuesta correspondientes.

### Prueba 2. Registro de producto (POST)

**URL:**

```text
http://localhost:3000/api/recurso
```

**Método:** POST

**Headers:**

```text
X-Red-Equipo: CIAF-7
Origin: http://localhost:5500
Content-Type: application/json
```

**Body:**

```json
{
    "nombre": "Monitor",
    "cantidad": 8
}
```

**Resultado obtenido:** HTTP 201 Created.

El servidor confirmó que el producto fue registrado correctamente.

### Prueba 3. Acceso denegado (401)

**URL:**

```text
http://localhost:3000/api/recurso
```

**Método:** GET

Se realizó una solicitud sin incluir el encabezado `X-Red-Equipo`.

**Resultado obtenido:** HTTP 401 Unauthorized.

El servidor bloqueó la solicitud y devolvió un mensaje JSON explicando que la credencial estaba ausente o era incorrecta.

### Códigos HTTP utilizados

| Código | Significado | Aplicación en el proyecto |
|---|---|---|
| 200 | OK | Consulta exitosa. |
| 201 | Created | Registro exitoso. |
| 400 | Bad Request | Datos JSON inválidos al registrar un producto. |
| 401 | Unauthorized | Encabezado de equipo ausente o incorrecto. |

---

## 10. Evidencias de funcionamiento

### Evidencia 1. Consulta GET exitosa

![Prueba GET exitosa](evidencias/01-get-exitoso.png)

### Evidencia 2. Registro POST exitoso

![Prueba POST exitosa](evidencias/02-post-exitoso.png)

### Evidencia 3. Acceso denegado HTTP 401

![Prueba de seguridad 401](evidencias/03-error-401.png)

---

## 11. Ejecución del proyecto

Para ejecutar el proyecto desde un computador que tenga Node.js instalado:

**1. Instalar las dependencias**

```bash
npm install
```

En Windows PowerShell también se puede utilizar:

```powershell
npm.cmd install
```

**2. Iniciar el servidor**

```bash
node src/server.js
```

**3. Dirección del servidor**

```text
http://localhost:3000
```

**4. Ejecutar las solicitudes desde Postman**

Se importa la colección JSON y se ejecutan las pruebas GET, POST y 401.

---

## 12. Conclusiones

Durante el desarrollo del taller se implementó un servicio web REST utilizando Node.js y Express.

Se comprobó el funcionamiento de los métodos GET y POST para consultar y registrar productos de inventario mediante información JSON.

También se implementó un middleware para validar un encabezado HTTP personalizado, rechazando las solicitudes que no presentaban la credencial correcta.

Se configuró CORS para permitir un origen específico y se verificó el envío de encabezados HTTP personalizados en las respuestas exitosas.

Finalmente, mediante Postman se realizaron pruebas que permitieron comprobar el funcionamiento de los endpoints y analizar la comunicación mediante el modelo TCP/IP, así como la importancia de HTTPS y TLS para proteger la información transmitida.
