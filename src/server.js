
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Datos del equipo
const N = 7;
const HEADER_ESPERADO = `CIAF-${N}`;
const HEADER_RESPUESTA = `Equipo-${N}`;

// Configuración del origen autorizado para CORS
const corsOptions = {
    origin: 'http://localhost:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-Red-Equipo'],
    exposedHeaders: ['X-Servidor-Procesado']
};

// Middleware de CORS
app.use(cors(corsOptions));

// Permite recibir información JSON
app.use(express.json());

// Middleware de autenticación del equipo
app.use('/api', (req, res, next) => {
    const credencial = req.get('X-Red-Equipo');

    if (credencial !== HEADER_ESPERADO) {
        return res.status(401).json({
            error: 'Unauthorized',
            mensaje: 'Acceso denegado. El encabezado X-Red-Equipo falta o es incorrecto.',
            encabezadoEsperado: HEADER_ESPERADO
        });
    }

    // Encabezado personalizado en las respuestas autorizadas
    res.setHeader('X-Servidor-Procesado', HEADER_RESPUESTA);

    next();
});

// Inventario de ejemplo
let productos = [
    { id: 1, nombre: 'Teclado', cantidad: 10 },
    { id: 2, nombre: 'Mouse', cantidad: 15 }
];

// Endpoint GET: consultar productos
app.get('/api/recurso', (req, res) => {
    res.status(200).json({
        mensaje: 'Consulta de inventario exitosa',
        equipo: HEADER_RESPUESTA,
        total: productos.length,
        productos: productos
    });
});

// Endpoint POST: registrar un producto
app.post('/api/recurso', (req, res) => {
    const { nombre, cantidad } = req.body;

    if (
        typeof nombre !== 'string' ||
        nombre.trim() === '' ||
        !Number.isInteger(cantidad) ||
        cantidad < 0
    ) {
        return res.status(400).json({
            error: 'Bad Request',
            mensaje: 'Debes enviar un nombre válido y una cantidad entera mayor o igual a cero.'
        });
    }

    const nuevoProducto = {
        id: productos.length > 0
            ? Math.max(...productos.map(p => p.id)) + 1
            : 1,
        nombre: nombre.trim(),
        cantidad: cantidad
    };

    productos.push(nuevoProducto);

    res.status(201).json({
        mensaje: 'Producto registrado correctamente',
        producto: nuevoProducto
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log('====================================');
    console.log(' SERVIDOR CIAF - EQUIPO 7');
    console.log('====================================');
    console.log(`Servidor activo: http://localhost:${PORT}`);
    console.log(`Endpoint GET: http://localhost:${PORT}/api/recurso`);
    console.log(`Endpoint POST: http://localhost:${PORT}/api/recurso`);
    console.log(`Header obligatorio: X-Red-Equipo: ${HEADER_ESPERADO}`);
});
