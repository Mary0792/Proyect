// Configuración de la aplicación
const config = {
  // Configuración del servidor
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Configuración de MongoDB Atlas
  mongodb: {
    uri: 'mongodb+srv://maria:maria@iot.36mrrg3.mongodb.net/iot?retryWrites=true&w=majority&appName=iot',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  // Configuración de seguridad
  jwt: {
    secret: process.env.JWT_SECRET || 'tu_jwt_secret_aqui'
  },
  
  // Configuración de CORS
  cors: {
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
};

module.exports = config;