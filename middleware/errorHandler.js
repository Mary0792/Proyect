/**
 * Middleware para manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }

  // Error de cast de MongoDB (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido'
    });
  }

  // Error de duplicación de MongoDB
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Datos duplicados'
    });
  }

  // Error por defecto
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
};

/**
 * Middleware para manejar rutas no encontradas
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
