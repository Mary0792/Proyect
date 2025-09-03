const Sensor = require('../models/Sensor');
const { Sonido, Luz, Temperatura, Humedad, Presion } = require('../models/SensorModels');

class SensorProvider {
  /**
   * Obtener el modelo correspondiente al tipo de sensor
   */
  getModelByType(sensorType) {
    const models = {
      'sonido': Sonido,
      'luz': Luz,
      'temperatura': Temperatura,
      'humedad': Humedad,
      'presion': Presion
    };
    return models[sensorType] || Sensor;
  }

  /**
   * Crear un nuevo registro de sensor
   * @param {Object} sensorData - Datos del sensor
   * @returns {Promise<Object>} - Sensor creado
   */
  async create(sensorData) {
    try {
      const { sensor: sensorType, ...data } = sensorData;
      const Model = this.getModelByType(sensorType);
      
      const sensor = new Model(data);
      return await sensor.save();
    } catch (error) {
      throw new Error(`Error al crear sensor: ${error.message}`);
    }
  }

  /**
   * Obtener todos los sensores con paginación
   * @param {Object} options - Opciones de paginación y filtros
   * @returns {Promise<Object>} - Lista de sensores y metadatos
   */
  async findAll(options = {}) {
    try {
      const { page = 1, limit = 10, sensor, startDate, endDate, sortBy = 'fecha', sortOrder = 'desc' } = options;
      
      if (sensor) {
        // Si se especifica un tipo de sensor, usar el modelo específico
        const Model = this.getModelByType(sensor);
        
        // Construir filtros
        const filter = {};
        if (startDate && endDate) {
          filter.fecha = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          };
        }

        // Construir ordenamiento
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calcular skip para paginación
        const skip = (page - 1) * limit;

        // Ejecutar consulta
        const [sensors, total] = await Promise.all([
          Model.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit)),
          Model.countDocuments(filter)
        ]);

        return {
          sensors,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        };
      } else {
        // Si no se especifica tipo, buscar en todos los modelos
        const models = [Sonido, Luz, Temperatura, Humedad, Presion];
        const allSensors = [];
        
        for (const Model of models) {
          const filter = {};
          if (startDate && endDate) {
            filter.fecha = {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            };
          }
          
          const sensors = await Model.find(filter).sort({ fecha: -1 });
          allSensors.push(...sensors);
        }
        
        // Ordenar todos los sensores por fecha
        allSensors.sort((a, b) => {
          if (sortOrder === 'desc') {
            return new Date(b.fecha) - new Date(a.fecha);
          } else {
            return new Date(a.fecha) - new Date(b.fecha);
          }
        });
        
        // Aplicar paginación
        const skip = (page - 1) * limit;
        const paginatedSensors = allSensors.slice(skip, skip + parseInt(limit));
        
        return {
          sensors: paginatedSensors,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: allSensors.length,
            pages: Math.ceil(allSensors.length / limit)
          }
        };
      }
    } catch (error) {
      throw new Error(`Error al obtener sensores: ${error.message}`);
    }
  }

  /**
   * Obtener un sensor por ID
   * @param {string} id - ID del sensor
   * @param {string} sensorType - Tipo de sensor (opcional)
   * @returns {Promise<Object>} - Sensor encontrado
   */
  async findById(id, sensorType = null) {
    try {
      if (sensorType) {
        const Model = this.getModelByType(sensorType);
        const sensor = await Model.findById(id);
        if (!sensor) {
          throw new Error('Sensor no encontrado');
        }
        return sensor;
      } else {
        // Buscar en todos los modelos
        const models = [Sonido, Luz, Temperatura, Humedad, Presion];
        
        for (const Model of models) {
          const sensor = await Model.findById(id);
          if (sensor) {
            return sensor;
          }
        }
        
        throw new Error('Sensor no encontrado');
      }
    } catch (error) {
      throw new Error(`Error al obtener sensor: ${error.message}`);
    }
  }

  /**
   * Actualizar un sensor
   * @param {string} id - ID del sensor
   * @param {Object} updateData - Datos a actualizar
   * @param {string} sensorType - Tipo de sensor
   * @returns {Promise<Object>} - Sensor actualizado
   */
  async update(id, updateData, sensorType) {
    try {
      const Model = this.getModelByType(sensorType);
      
      const sensor = await Model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!sensor) {
        throw new Error('Sensor no encontrado');
      }
      
      return sensor;
    } catch (error) {
      throw new Error(`Error al actualizar sensor: ${error.message}`);
    }
  }

  /**
   * Eliminar un sensor
   * @param {string} id - ID del sensor
   * @param {string} sensorType - Tipo de sensor
   * @returns {Promise<Object>} - Sensor eliminado
   */
  async delete(id, sensorType) {
    try {
      const Model = this.getModelByType(sensorType);
      
      const sensor = await Model.findByIdAndDelete(id);
      
      if (!sensor) {
        throw new Error('Sensor no encontrado');
      }
      
      return sensor;
    } catch (error) {
      throw new Error(`Error al eliminar sensor: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de sensores
   * @param {string} sensor - Tipo de sensor (opcional)
   * @returns {Promise<Object>} - Estadísticas
   */
  async getStats(sensor = null) {
    try {
      if (sensor) {
        const Model = this.getModelByType(sensor);
        
        const stats = await Model.aggregate([
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

        return stats[0] || {
          total: 0,
          avgValorCrudo: 0,
          avgPorcentaje: 0,
          minValorCrudo: 0,
          maxValorCrudo: 0,
          minPorcentaje: 0,
          maxPorcentaje: 0
        };
      } else {
        // Estadísticas generales de todos los sensores
        const models = [Sonido, Luz, Temperatura, Humedad, Presion];
        let totalStats = {
          total: 0,
          avgValorCrudo: 0,
          avgPorcentaje: 0,
          minValorCrudo: Infinity,
          maxValorCrudo: -Infinity,
          minPorcentaje: Infinity,
          maxPorcentaje: -Infinity
        };
        
        for (const Model of models) {
          const stats = await Model.aggregate([
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
          
          if (stats[0]) {
            totalStats.total += stats[0].total;
            totalStats.avgValorCrudo += stats[0].avgValorCrudo * stats[0].total;
            totalStats.avgPorcentaje += stats[0].avgPorcentaje * stats[0].total;
            totalStats.minValorCrudo = Math.min(totalStats.minValorCrudo, stats[0].minValorCrudo);
            totalStats.maxValorCrudo = Math.max(totalStats.maxValorCrudo, stats[0].maxValorCrudo);
            totalStats.minPorcentaje = Math.min(totalStats.minPorcentaje, stats[0].minPorcentaje);
            totalStats.maxPorcentaje = Math.max(totalStats.maxPorcentaje, stats[0].maxPorcentaje);
          }
        }
        
        if (totalStats.total > 0) {
          totalStats.avgValorCrudo = totalStats.avgValorCrudo / totalStats.total;
          totalStats.avgPorcentaje = totalStats.avgPorcentaje / totalStats.total;
        } else {
          totalStats.minValorCrudo = 0;
          totalStats.maxValorCrudo = 0;
          totalStats.minPorcentaje = 0;
          totalStats.maxPorcentaje = 0;
        }
        
        return totalStats;
      }
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Obtener datos por tipo de sensor
   * @param {string} sensor - Tipo de sensor
   * @returns {Promise<Array>} - Lista de sensores del tipo especificado
   */
  async findBySensor(sensor) {
    try {
      const Model = this.getModelByType(sensor);
      return await Model.find().sort({ fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener sensores por tipo: ${error.message}`);
    }
  }
}

module.exports = new SensorProvider();
