const mongoose = require('mongoose');
const config = require('./config');

class Database {
  constructor() {
    this.connection = null;
  }

  /**
   * Conectar a MongoDB
   */
  async connect() {
    try {
      const mongoUri = config.mongodb.uri;
      
      this.connection = await mongoose.connect(mongoUri, config.mongodb.options);

      console.log('✅ Conexión a MongoDB Atlas establecida exitosamente');
      
      // Manejar eventos de conexión
      mongoose.connection.on('error', (error) => {
        console.error('❌ Error en la conexión de MongoDB:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ Conexión a MongoDB desconectada');
      });

      // Manejar cierre de la aplicación
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ Error al conectar a MongoDB Atlas:', error);
      process.exit(1);
    }
  }

  /**
   * Desconectar de MongoDB
   */
  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.connection.close();
        console.log('✅ Conexión a MongoDB cerrada');
      }
    } catch (error) {
      console.error('❌ Error al cerrar la conexión de MongoDB:', error);
    }
  }

  /**
   * Verificar el estado de la conexión
   */
  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

module.exports = new Database();
