const mongoose = require('mongoose');

// Configuración de MongoDB local
const mongoUri = 'mongodb://localhost:27017/sensor_db';

// Esquema base para sensores
const sensorSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  valor_crudo: {
    type: Number,
    required: true,
    min: 0
  },
  porcentaje: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  versionKey: false
});

// Modelos separados
const Sonido = mongoose.model('Sonido', sensorSchema);
const Luz = mongoose.model('Luz', sensorSchema);

// Datos de luz
const datosLuz = [
  {
    fecha: new Date('2025-09-03T12:00:00'),
    valor_crudo: 1500,
    porcentaje: 35.2
  },
  {
    fecha: new Date('2025-09-03T12:01:00'),
    valor_crudo: 1650,
    porcentaje: 42.1
  },
  {
    fecha: new Date('2025-09-03T12:02:00'),
    valor_crudo: 1800,
    porcentaje: 48.9
  },
  {
    fecha: new Date('2025-09-03T12:03:00'),
    valor_crudo: 1950,
    porcentaje: 55.6
  },
  {
    fecha: new Date('2025-09-03T12:04:00'),
    valor_crudo: 2100,
    porcentaje: 62.3
  }
];

// Datos de sonido
const datosSonido = [
  {
    fecha: new Date('2025-09-03T12:00:00'),
    valor_crudo: 2500,
    porcentaje: 58.7
  },
  {
    fecha: new Date('2025-09-03T12:01:00'),
    valor_crudo: 2650,
    porcentaje: 62.3
  },
  {
    fecha: new Date('2025-09-03T12:02:00'),
    valor_crudo: 2800,
    porcentaje: 66.8
  },
  {
    fecha: new Date('2025-09-03T12:03:00'),
    valor_crudo: 2950,
    porcentaje: 71.2
  },
  {
    fecha: new Date('2025-09-03T12:04:00'),
    valor_crudo: 3100,
    porcentaje: 75.9
  }
];

async function insertarDatos() {
  try {
    // Conectar a MongoDB local
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Conectado a MongoDB local');

    // Limpiar datos existentes
    await Sonido.deleteMany({});
    await Luz.deleteMany({});
    console.log('🗑️ Datos anteriores eliminados');

    // Insertar datos de luz
    const sensoresLuz = await Luz.insertMany(datosLuz);
    console.log(`💡 ${sensoresLuz.length} sensores de luz insertados`);

    // Insertar datos de sonido
    const sensoresSonido = await Sonido.insertMany(datosSonido);
    console.log(`🔊 ${sensoresSonido.length} sensores de sonido insertados`);

    console.log('✅ Todos los datos insertados exitosamente');
    
    // Mostrar resumen
    const totalLuz = await Luz.countDocuments();
    const totalSonido = await Sonido.countDocuments();
    
    console.log('\n📊 Resumen:');
    console.log(`- Sensores de luz: ${totalLuz}`);
    console.log(`- Sensores de sonido: ${totalSonido}`);
    console.log(`- Total: ${totalLuz + totalSonido}`);

    // Mostrar algunos datos de ejemplo
    console.log('\n💡 Ejemplo de datos de luz:');
    const ejemploLuz = await Luz.findOne().sort({ fecha: -1 });
    console.log(ejemploLuz);

    console.log('\n🔊 Ejemplo de datos de sonido:');
    const ejemploSonido = await Sonido.findOne().sort({ fecha: -1 });
    console.log(ejemploSonido);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Para usar MongoDB local:');
    console.log('1. Instala MongoDB: https://docs.mongodb.com/manual/installation/');
    console.log('2. Inicia MongoDB: mongod');
    console.log('3. Ejecuta este script nuevamente');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el script
insertarDatos();
