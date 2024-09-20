require('dotenv').config();
const axios = require('axios');

const apiKey = 'b9c59897b5f5c2823b1d31939edd6e5d'; // Chave API embutida
const baseUrl = 'http://api.openweathermap.org';

// Função para obter as coordenadas da cidade
async function getCoordinates(city) {
  try {
    const url = `${baseUrl}/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const response = await axios.get(url);
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat, lon };
    } else {
      console.log('Cidade não encontrada.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter as coordenadas:', error);
  }
}

// Função para obter as condições atuais com base nas coordenadas
async function getWeather(lat, lon) {
  try {
    const url = `${baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    const { feels_like } = response.data.main;
    const description = response.data.weather[0].description;
    return { feels_like, description };
  } catch (error) {
    console.error('Erro ao obter as condições climáticas:', error);
  }
}

// Função principal para orquestrar a obtenção de coordenadas e previsão
async function main() {
  const city = process.argv[2]; // Cidade passada como argumento de linha de comando
  if (!city) {
    console.log('Por favor, informe o nome de uma cidade.');
    return;
  }

  const coordinates = await getCoordinates(city);
  if (coordinates) {
    const { lat, lon } = coordinates;
    const weather = await getWeather(lat, lon);
    if (weather) {
      console.log(`Cidade: ${city}`);
      console.log(`Latitude: ${lat}`);
      console.log(`Longitude: ${lon}`);
      console.log(`Sensação térmica: ${weather.feels_like}°C`);
      console.log(`Descrição: ${weather.description}`);
    }
  }
}

main();
