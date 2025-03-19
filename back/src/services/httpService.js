
import axios from 'axios';
import requestsRepository from '../models/requestsRepository.js';

export default {
  async sendRequest(config, userId) {
    const startTime = Date.now();
    
    try {
      const axiosConfig = {
        method: config.method,
        url: config.url,
        headers: config.headers,
        timeout: 10000
      };

      
      if (!['GET', 'HEAD'].includes(config.method.toUpperCase()) && config.body) {
        axiosConfig.data = config.body;
      }

      const response = await axios(axiosConfig);

      
      await requestsRepository.create({
        method: config.method,
        url: config.url,
        statusCode: response.status,
        response: JSON.stringify(response.data),
        responseHeaders: response.headers,
        requestHeaders: config.headers,  // Acho que com essa linha já dá para armazenar os headers da requisição
        duration: Date.now() - startTime,
        userId
      });

      return {
        success: true,
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      console.error('Erro na requisição:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
