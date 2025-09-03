const Luz = require('../models/SensorModels').Luz;

class LuzController {
  // Crear un nuevo sensor de luz
  static async create(req, res) {
    try {
      const sensorData = {
        fecha: req.body.fecha,
        valor_crudo: req.body.valor_crudo,
        porcentaje: req.body.porcentaje
      };
      
      const sensor = new Luz(sensorData);
      const savedSensor = await sensor.save();
      
      res.status(201).json({
        success: true,
        message: 'Sensor de luz creado exitosamente',
        data: savedSensor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear sensor de luz',
        error: error.message
      });
    }
  }

  // Obtener todos los sensores de luz
  static async getAll(req, res) {
    try {
      const sensors = await Luz.find().sort({ fecha: -1 });
      
      res.status(200).json({
        success: true,
        message: 'Sensores de luz obtenidos exitosamente',
        count: sensors.length,
        data: sensors
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener sensores de luz',
        error: error.message
      });
    }
  }

  // Obtener un sensor de luz por ID
  static async getById(req, res) {
    try {
      const sensor = await Luz.findById(req.params.id);
      
      if (!sensor) {
        return res.status(404).json({
          success: false,
          message: 'Sensor de luz no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Sensor de luz obtenido exitosamente',
        data: sensor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener sensor de luz',
        error: error.message
      });
    }
  }

  // Actualizar un sensor de luz
  static async update(req, res) {
    try {
      const sensor = await Luz.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!sensor) {
        return res.status(404).json({
          success: false,
          message: 'Sensor de luz no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Sensor de luz actualizado exitosamente',
        data: sensor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar sensor de luz',
        error: error.message
      });
    }
  }

  // Eliminar un sensor de luz
  static async delete(req, res) {
    try {
      const sensor = await Luz.findByIdAndDelete(req.params.id);
      
      if (!sensor) {
        return res.status(404).json({
          success: false,
          message: 'Sensor de luz no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Sensor de luz eliminado exitosamente',
        data: sensor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar sensor de luz',
        error: error.message
      });
    }
  }

  // Obtener estadísticas de sensores de luz
  static async getStats(req, res) {
    try {
      const stats = await Luz.aggregate([
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
        message: 'Estadísticas de sensores de luz obtenidas exitosamente',
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
        message: 'Error al obtener estadísticas de sensores de luz',
        error: error.message
      });
    }
  }
}

module.exports = LuzController;
