// Test script to add sample sensor data
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

// Sample data for testing
const sampleData = [
  // Light sensors
  { sensor: 'luz', valor_crudo: 1200, porcentaje: 30 },
  { sensor: 'luz', valor_crudo: 1800, porcentaje: 45 },
  { sensor: 'luz', valor_crudo: 2200, porcentaje: 55 },
  { sensor: 'luz', valor_crudo: 2800, porcentaje: 70 },
  { sensor: 'luz', valor_crudo: 3200, porcentaje: 80 },
  
  // Sound sensors
  { sensor: 'sonido', valor_crudo: 45, porcentaje: 25 },
  { sensor: 'sonido', valor_crudo: 65, porcentaje: 40 },
  { sensor: 'sonido', valor_crudo: 85, porcentaje: 55 },
  { sensor: 'sonido', valor_crudo: 105, porcentaje: 70 },
  { sensor: 'sonido', valor_crudo: 125, porcentaje: 85 },
];

// Function to create a sensor with current timestamp
const createSensor = async (sensorData) => {
  try {
    const data = {
      ...sensorData,
      fecha: new Date().toISOString()
    };
    
    const response = await axios.post(`${API_BASE_URL}/api/v1/sensors`, data);
    console.log(`✅ Sensor ${sensorData.sensor} creado:`, response.data.data.valor_crudo);
    return response.data;
  } catch (error) {
    console.error(`❌ Error creando sensor ${sensorData.sensor}:`, error.response?.data?.message || error.message);
    return null;
  }
};

// Function to add sample data
const addSampleData = async () => {
  console.log('🚀 Iniciando inserción de datos de prueba...');
  
  for (const sensorData of sampleData) {
    await createSensor(sensorData);
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('✅ Datos de prueba insertados correctamente');
};

// Function to check API health
const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ API está funcionando:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ API no está disponible:', error.message);
    return false;
  }
};

// Function to get current sensors
const getCurrentSensors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/sensors`);
    console.log('📊 Sensores actuales:', response.data.data.length);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error obteniendo sensores:', error.message);
    return [];
  }
};

// Main function
const main = async () => {
  console.log('🔍 Verificando estado de la API...');
  
  const isHealthy = await checkHealth();
  if (!isHealthy) {
    console.log('❌ La API no está disponible. Asegúrate de que esté ejecutándose en el puerto 3000');
    return;
  }
  
  console.log('📋 Obteniendo sensores existentes...');
  const existingSensors = await getCurrentSensors();
  
  if (existingSensors.length > 0) {
    console.log(`📊 Ya hay ${existingSensors.length} sensores en la base de datos`);
    console.log('¿Deseas agregar más datos de prueba? (Ctrl+C para cancelar)');
    
    // Wait for user input (in a real scenario, you might want to use readline)
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  await addSampleData();
  
  console.log('📊 Obteniendo sensores finales...');
  const finalSensors = await getCurrentSensors();
  console.log(`✅ Total de sensores: ${finalSensors.length}`);
  
  console.log('🎉 Script completado. Ahora puedes probar el dashboard!');
};

// Run the script
main().catch(console.error);
