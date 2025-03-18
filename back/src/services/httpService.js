import axios from 'axios';
import requestsRepository from '../models/requestsRepository.js';

export default {
  async sendRequest(config, userId) {
    const startTime = Date.now();
    try {
      const axiosConfig = {
        method: config.method,
        url: config.url,
        timeout: 10000,
        headers: config.headers,
      };

      // Se não for GET/HEAD, adiciona body
      if (!['GET', 'HEAD'].includes(config.method.toUpperCase()) && config.body) {
        axiosConfig.data = config.body;
      }

      const response = await axios(axiosConfig);

      await requestsRepository.create({
        method: config.method,
        url: config.url,
        statusCode: response.status,
        response: response.data,
        responseHeaders: response.headers,  // <--- Acho que essa parte do código vai conseguir trazer os headers da resposta !!! REMOVER O COMENTÁRIO!!!
        duration: Date.now() - startTime,
        userId
      });

      return {
        success: true,
        status: response.status,
        data: response.data,
        headers: response.headers  // <--- Se quiser retornar direto
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
