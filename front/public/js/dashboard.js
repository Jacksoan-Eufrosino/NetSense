// front/public/js/dashboard.js
// import axios from 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
import Auth from './services/auth.js';

const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  
  document.getElementById('sendRequest').addEventListener('click', async () => {
    const method = document.getElementById('method').value;
    const url = document.getElementById('url').value;
    const headersValue = document.getElementById('headers').value;
    const bodyValue = document.getElementById('body').value;

    
    let headers = {};
    let body = {};
    try {
      headers = headersValue ? JSON.parse(headersValue) : {};
    } catch (e) {
      console.error('Headers inválidos');
    }
    try {
      body = bodyValue ? JSON.parse(bodyValue) : {};
    } catch (e) {
      console.error('Body inválido');
    }

    try {
      const token = Auth.getToken();
      const response = await axios.post(`${API_BASE}/requests`, {
        method,
        url,
        headers,
        body
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response.data);
      await updateHistory();
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Erro ao enviar requisição');
    }
  });

  
  //document.getElementById('updateHistory').addEventListener('click', updateHistory);

 
  document.getElementById('clearHistory').addEventListener('click', async () => {
    try {
      const token = Auth.getToken();
      await axios.delete(`${API_BASE}/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      document.getElementById('requests').innerHTML = '';
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Erro ao limpar histórico');
    }
  });

  
  async function updateHistory() {
    try {
      const token = Auth.getToken();
      const response = await axios.get(`${API_BASE}/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      renderHistory(response.data);
    } catch (error) {
      console.error('Error updating history:', error);
      alert('Erro ao atualizar histórico');
    }
  }

  function renderHistory(history) {
    const container = document.getElementById('requests');
    container.innerHTML = history.map(req => `
      <div class="card mb-2" data-id="${req.id}">
        <div class="card-header d-flex justify-content-between">
          <span class="badge bg-${getMethodBadgeColor(req.method)}">${req.method}</span>
          <span>${req.url}</span>
          <span>Status: ${req.statusCode}</span>
          <span>Tempo: ${req.duration}ms</span>
        </div>
        <div class="card-body">
          <p><strong>Response Body:</strong></p>
          <pre>${typeof req.response === 'object' ? JSON.stringify(req.response, null, 2) : req.response}</pre>
          <p><strong>Response Headers:</strong></p>
          <pre>${JSON.stringify(req.responseHeaders || {}, null, 2)}</pre>
          <p><strong>Request Headers:</strong></p>
          <pre>${JSON.stringify(req.requestHeaders || {}, null, 2)}</pre>
        </div>
      </div>
    `).join('');
  }

  function getMethodBadgeColor(method) {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'success';
      case 'POST':
        return 'primary';
      case 'PUT':
        return 'warning';
      case 'DELETE':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  updateHistory();
});
