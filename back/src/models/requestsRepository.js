
import prisma from '../database/database.js';

export default {
  async create(requestData) {
    return await prisma.request.create({
      data: {
        method: requestData.method,
        url: requestData.url,
        statusCode: requestData.statusCode,
        response: requestData.response,
        responseHeaders: requestData.responseHeaders,
        requestHeaders: requestData.requestHeaders, // Novo campo
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

    
    return requests;
  },

  async clearHistory(userId) {
    return await prisma.request.deleteMany({
      where: { userId }
    });
  }
};
