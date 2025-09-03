const mongoose = require('mongoose');

// Esquema base para todos los sensores
const baseSensorSchema = {
  fecha: {
    type: Date,
    required: [true, 'La fecha es requerida'],
    default: Date.now
  },
  valor_crudo: {
    type: Number,
    required: [true, 'El valor crudo es requerido'],
    min: [0, 'El valor crudo no puede ser negativo']
  },
  porcentaje: {
    type: Number,
    required: [true, 'El porcentaje es requerido'],
    min: [0, 'El porcentaje no puede ser menor a 0'],
    max: [100, 'El porcentaje no puede ser mayor a 100']
  }
};

// Configuración común para todos los esquemas
const schemaOptions = {
  versionKey: false
};

// Función para crear métodos comunes
const createCommonMethods = (schema) => {
  schema.index({ fecha: -1 });
  
  schema.methods.toJSON = function() {
    const sensor = this.toObject();
    delete sensor.__v;
    return sensor;
  };
};

// Modelo para Sensor de Sonido
const sonidoSchema = new mongoose.Schema(baseSensorSchema, schemaOptions);
createCommonMethods(sonidoSchema);
const Sonido = mongoose.model('Sonido', sonidoSchema, 'sonidos');

// Modelo para Sensor de Luz
const luzSchema = new mongoose.Schema(baseSensorSchema, schemaOptions);
createCommonMethods(luzSchema);
const Luz = mongoose.model('Luz', luzSchema, 'luzs');

// Modelo para Sensor de Temperatura
const temperaturaSchema = new mongoose.Schema(baseSensorSchema, schemaOptions);
createCommonMethods(temperaturaSchema);
const Temperatura = mongoose.model('Temperatura', temperaturaSchema, 'temperaturas');

// Modelo para Sensor de Humedad
const humedadSchema = new mongoose.Schema(baseSensorSchema, schemaOptions);
createCommonMethods(humedadSchema);
const Humedad = mongoose.model('Humedad', humedadSchema, 'humedads');

// Modelo para Sensor de Presión
const presionSchema = new mongoose.Schema(baseSensorSchema, schemaOptions);
createCommonMethods(presionSchema);
const Presion = mongoose.model('Presion', presionSchema, 'presions');

module.exports = {
  Sonido,
  Luz,
  Temperatura,
  Humedad,
  Presion
};

