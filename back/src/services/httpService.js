// src/services/httpService.js
import axios from 'axios';
import requestsRepository from '../models/requestsRepository.js';

export default {
  async sendRequest(config, userId) {
    const startTime = Date.now();
    
    try {
      const response = await axios({
        method: config.method,
        url: config.url,
        data: config.body,
        headers: config.headers,
        timeout: 10000
      });

      await requestsRepository.create({
        method: config.method,
        url: config.url,
        statusCode: response.status,
        response: response.data,
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