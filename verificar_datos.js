const mongoose = require('mongoose');

// Configuración de MongoDB Atlas con base de datos específica
const mongoUri = 'mongodb+srv://maria:maria@iot.36mrrg3.mongodb.net/iot?retryWrites=true&w=majority&appName=iot';

// Importar modelos
const { Luz, Sonido } = require('./models/SensorModels');

async function verificarDatos() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Conectado a MongoDB Atlas - Base de datos: iot');

    // Verificar datos de luz
    const totalLuz = await Luz.countDocuments();
    console.log(`💡 Total de sensores de luz: ${totalLuz}`);
    
    if (totalLuz > 0) {
      const ejemploLuz = await Luz.findOne().sort({ fecha: -1 });
      console.log('💡 Ejemplo de datos de luz:');
      console.log(JSON.stringify(ejemploLuz, null, 2));
    }

    // Verificar datos de sonido
    const totalSonido = await Sonido.countDocuments();
    console.log(`🔊 Total de sensores de sonido: ${totalSonido}`);
    
    if (totalSonido > 0) {
      const ejemploSonido = await Sonido.findOne().sort({ fecha: -1 });
      console.log('🔊 Ejemplo de datos de sonido:');
      console.log(JSON.stringify(ejemploSonido, null, 2));
    }

    // Listar todas las colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Colecciones en la base de datos:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el script
verificarDatos();
