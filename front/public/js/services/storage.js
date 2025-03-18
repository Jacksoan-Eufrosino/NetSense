import Auth from './auth.js';

const API_URL = '/api';

async function create(resource, data, auth = true) {
  resource = `${API_URL}/${resource}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify(data),
  };

  if (auth) {
    config.headers.Authorization = `Bearer ${Auth.getToken()}`;
  }

  const res = await fetch(resource, config);

  const createdData = await res.json();

  return createdData;
}

async function read(resource) {
  resource = `${API_URL}/${resource}`;

  const config = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Auth.getToken()}`,
    },
  };

  const res = await fetch(resource, config);

  const data = await res.json();

  return data;
}

async function update(resource, data) {
  resource = `${API_URL}/${resource}`;

  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.getToken()}`,
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(resource, config);

  const updatedData = await res.json();

  return updatedData;
}

async function remove(resource) {
  resource = `${API_URL}/${resource}`;

  const config = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Auth.getToken()}`,
    },
  };

  const res = await fetch(resource, config);

  return res.ok;
}

export default { create, read, update, remove };