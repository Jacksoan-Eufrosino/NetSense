import { $ } from './lib/dom.js';
import API from './services/storage.js';
import Auth from './services/auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = $('#loginForm');

  form.onsubmit = async (event) => {
    event.preventDefault();

    const user = Object.fromEntries(new FormData(form));
    console.log('Form data:', user); 

    try {
      const { auth, token } = await API.create('signin', user, false);
      console.log('Server response:', { auth, token });

      if (auth) {
        Auth.signin(token);
        location.href = '/dashboard.html'; 
      } else {
        alert('Usuário ou senha inválidos');
      }
    } catch (error) {
      console.error('Error:', error); 
      alert('Erro no login');
    }
  };
});