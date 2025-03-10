import prisma from '../database/database.js';

async function create({ source_ip, destination_ip, protocol, user_id }) {
  const createdTraffic = await prisma.traffic.create({
    data: { source_ip, destination_ip, protocol, user_id },
  });

  return createdTraffic;
}

async function read(where) {
  if (where?.source_ip) {
    where.source_ip = {
      contains: where.source_ip,
    };
  }

  const traffic = await prisma.traffic.findMany({ where });

  if (traffic.length === 1 && where) {
    return traffic[0];
  }

  return traffic;
}

async function readById(id) {
  const traffic = await prisma.traffic.findUnique({
    where: {
      id,
    },
  });

  return traffic;
}

async function update({ id, source_ip, destination_ip, protocol, user_id }) {
  const updatedTraffic = await prisma.traffic.update({
    where: {
      id,
    },
    data: { source_ip, destination_ip, protocol, user_id },
  });

  return updatedTraffic;
}

async function remove(id) {
  await prisma.traffic.delete({
    where: {
      id,
    },
  });
}

export default { create, read, readById, update, remove };