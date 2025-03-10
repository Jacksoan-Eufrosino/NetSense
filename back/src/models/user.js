import prisma from '../database/database.js';

async function create({ name, email, password }) {
  const createdUser = await prisma.user.create({
    data: { name, email, password },
  });

  return createdUser;
}

async function read(where) {
  if (where?.name) {
    where.name = {
      contains: where.name,
    };
  }

  const users = await prisma.user.findMany({ where });

  if (users.length === 1 && where) {
    return users[0];
  }

  return users;
}

async function readById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
}

async function update({ id, name, email, password }) {
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: { name, email, password },
  });

  return updatedUser;
}

async function remove(id) {
  await prisma.user.delete({
    where: {
      id,
    },
  });
}

export default { create, read, readById, update, remove };