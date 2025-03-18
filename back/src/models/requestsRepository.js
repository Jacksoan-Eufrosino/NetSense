import prisma from '../database/database.js';

export default {
  async create(requestData) {
    return await prisma.request.create({
      data: {
        method: requestData.method,
        url: requestData.url,
        statusCode: requestData.statusCode,
        response: requestData.response,                   // string (JSON do body)
        responseHeaders: requestData.responseHeaders,     // objeto JSON
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
      // Se 'response' for string, parse se precisar
      response: request.response ? JSON.parse(request.response) : null
      // Se 'responseHeaders' for Json, já vem como objeto nativamente pelo Prisma 4+.
    }));
  },

  async clearHistory(userId) {
    return await prisma.request.deleteMany({
      where: { userId }
    });
  }
};
