const Sonido = require('../models/SensorModels').Sonido;

class SoundController {
  // Crear un nuevo sensor de sonido
  static async create(req, res) {
    try {
      const sensorData = {
        fecha: req.body.fecha,
        valor_crudo: req.body.valor_crudo,
        porcentaje: req.body.porcentaje
      };
      
      const sensor = new Sonido(sensorData);
      const savedSensor = await sensor.save();
      
      res.status(201).json({
        success: true,
        message: 'Sensor de sonido creado exitosamente',
        data: savedSensor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear sensor de sonido',
        error: error.message
      });
    }
  }

  // Obtener todos los sensores de sonido
  static async getAll(req, res) {
    try {
      const sensors = await Sonido.find().sort({ fecha: -1 });
      
      res.status(200).json({
        success: true,
        message: 'Sensores de sonido obtenidos exitosamente',
        count: sensors.length,
        data: sensors
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener sensores de sonido',
        error: error.message
      });
    }
  }

  // Obtener un sensor de sonido por ID
  static async getById(req, res) {
    try {
      const sensor = await Sonido.findById(req.params.id);
      
      if (!sensor) {
        return res.status(404).json({
          success: false,
          message: 'Sensor de sonido no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Sensor de sonido obtenido exitosamente',
        data: sensor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener sensor de sonido',
        error: error.message
      });
    }
  }

  // Actualizar un sensor de sonido
  static async update(req, res) {
    try {
      const sensor = await Sonido.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!sensor) {
        return res.status(404).json({
          success: false,
          message: 'Sensor de sonido no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Sensor de sonido actualizado exitosamente',
        data: sensor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar sensor de sonido',
        error: error.message
      });
    }
  }

  // Eliminar un sensor de sonido
  static async delete(req, res) {
    try {
      const sensor = await Sonido.findByIdAndDelete(req.params.id);
      
      if (!sensor) {
        return res.status(404).json({
          success: false,
          message: 'Sensor de sonido no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Sensor de sonido eliminado exitosamente',
        data: sensor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar sensor de sonido',
        error: error.message
      });
    }
  }

  // Obtener estadísticas de sensores de sonido
  static async getStats(req, res) {
    try {
      const stats = await Sonido.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgValorCrudo: { $avg: '$valor_crudo' },
            avgPorcentaje: { $avg: '$porcentaje' },
            minValorCrudo: { $min: '$valor_crudo' },
            maxValorCrudo: { $max: '$valor_crudo' },
            minPorcentaje: { $min: '$porcentaje' },
            maxPorcentaje: { $max: '$porcentaje' }
          }
        }
      ]);
      
      res.status(200).json({
        success: true,
        message: 'Estadísticas de sensores de sonido obtenidas exitosamente',
        data: stats[0] || { 
          total: 0, 
          avgValorCrudo: 0, 
          avgPorcentaje: 0, 
          minValorCrudo: 0, 
          maxValorCrudo: 0, 
          minPorcentaje: 0, 
          maxPorcentaje: 0 
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas de sensores de sonido',
        error: error.message
      });
    }
  }
}

module.exports = SoundController;
