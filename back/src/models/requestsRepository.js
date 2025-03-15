// src/models/requestsRepository.js
import prisma from '../database/database.js';

export default {
  async create(requestData) {
    return await prisma.request.create({
      data: {
        method: requestData.method,
        url: requestData.url,
        statusCode: requestData.statusCode,
        response: JSON.stringify(requestData.response),
        duration: requestData.duration,
        userId: requestData.userId
      }
    });
  },

  async findByUserId(userId) {
    const requests = await prisma.request.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return requests.map(request => ({
      ...request,
      response: JSON.parse(request.response)
    }));
  },

  async clearHistory(userId) {
    return await prisma.request.deleteMany({
      where: { userId }
    });
  }
};