require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importar configuraciones y rutas
const config = require('./config/config');
const database = require('./config/database');
const luzRoutes = require('./routes/luzRoutes');
const soundRoutes = require('./routes/soundRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

class Server {
  constructor() {
    this.app = express();
    this.port = config.port;
  }

  /**
   * Configurar middleware
   */
  configureMiddleware() {
    // Seguridad
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors(config.cors));

    // Logging
    if (config.nodeEnv !== 'test') {
      this.app.use(morgan('combined'));
    }

    // Parse JSON
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  /**
   * Configurar rutas
   */
  configureRoutes() {
    // Ruta de salud
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'API de Sensores funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
        database: database.isConnected() ? 'Conectado' : 'Desconectado'
      });
    });

    // API routes
    this.app.use('/api/luz', luzRoutes);
    this.app.use('/api/sound', soundRoutes);

    // Ruta raíz
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'API de Sensores - Método MCP',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          luz: '/api/luz',
          sound: '/api/sound'
        }
      });
    });
  }

  /**
   * Configurar manejo de errores
   */
  configureErrorHandling() {
    // Middleware de manejo de errores
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  /**
   * Iniciar el servidor
   */
  async start() {
    try {
      // Conectar a la base de datos
      await database.connect();

      // Configurar middleware
      this.configureMiddleware();

      // Configurar rutas
      this.configureRoutes();

      // Configurar manejo de errores
      this.configureErrorHandling();

      // Iniciar servidor
      this.app.listen(this.port, () => {
        console.log(`🚀 Servidor iniciado en puerto ${this.port}`);
        console.log(`📊 API disponible en: http://localhost:${this.port}`);
        console.log(`🔍 Health check: http://localhost:${this.port}/health`);
        console.log(`🌍 Ambiente: ${config.nodeEnv}`);
        console.log(`🗄️ Base de datos: MongoDB Atlas`);
      });

    } catch (error) {
      console.error('❌ Error al iniciar el servidor:', error);
      process.exit(1);
    }
  }

  /**
   * Detener el servidor
   */
  async stop() {
    try {
      await database.disconnect();
      console.log('🛑 Servidor detenido');
    } catch (error) {
      console.error('❌ Error al detener el servidor:', error);
    }
  }
}

// Crear y exportar instancia del servidor
const server = new Server();

// Manejar señales de terminación
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  await server.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido, cerrando servidor...');
  await server.stop();
  process.exit(0);
});

// Exportar para testing
module.exports = server;

// Iniciar servidor si este archivo se ejecuta directamente
if (require.main === module) {
  server.start();
}
