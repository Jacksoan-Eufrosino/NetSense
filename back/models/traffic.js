import Database from '../src/database/database.js';

async function create({ source_ip, destination_ip, protocol, user_id }) {
  const db = await Database.connect();

  const sql = `
      INSERT INTO
        traffic (source_ip, destination_ip, protocol, user_id)
      VALUES
        (?, ?, ?, ?)
    `;

  const { lastID } = await db.run(sql, [source_ip, destination_ip, protocol, user_id]);

  db.close();

  return await readById(lastID);
}

async function read(where) {
  const db = await Database.connect();

  if (where) {
    const field = Object.keys(where)[0];
    const value = where[field];

    const sql = `
      SELECT
          *
        FROM
          traffic
        WHERE
          ${field} LIKE CONCAT( '%',?,'%')
      `;

    const traffic = await db.all(sql, [value]);

    db.close();

    return traffic;
  }

  const sql = `
    SELECT
      *
    FROM
      traffic
  `;

  const traffic = await db.all(sql);

  db.close();

  return traffic;
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `
      SELECT
          *
        FROM
          traffic
        WHERE
          id = ?
      `;

  const traffic = await db.get(sql, [id]);

  db.close();

  return traffic;
}

async function update({ id, source_ip, destination_ip, protocol, user_id }) {
  const db = await Database.connect();

  const sql = `
      UPDATE
        traffic
      SET
        source_ip = ?, destination_ip = ?, protocol = ?, user_id = ?
      WHERE
        id = ?
    `;

  const { changes } = await db.run(sql, [source_ip, destination_ip, protocol, user_id, id]);

  db.close();

  if (changes === 1) {
    return readById(id);
  } else {
    throw new Error('Traffic not found');
  }
}

async function remove(id) {
  const db = await Database.connect();

  const sql = `
    DELETE FROM
      traffic
    WHERE
      id = ?
  `;

  const { changes } = await db.run(sql, [id]);

  db.close();

  if (changes === 1) {
    return true;
  } else {
    throw new Error('Traffic not found');
  }
}

export default { create, read, readById, update, remove };