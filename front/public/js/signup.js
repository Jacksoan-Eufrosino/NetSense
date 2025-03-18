import { $ } from './lib/dom.js';
import API from './services/storage.js';

const form = $('#signupForm');

form.onsubmit = async (event) => {
  event.preventDefault();

  if (form.checkValidity()) {
    const user = Object.fromEntries(new FormData(form));
    console.log('Form data:', user); 

    try {
      const { email, message } = await API.create('createUser', user, false);
      console.log('Server response:', { email, message }); 

      if (email) {
        location.href = '/login.html';
      } else if (message === 'Email already in use') {
        setInputValidity('signupEmailInput', 'Email já cadastrado.');

        form.classList.add('was-validated');
      } else {
        alert('Erro no cadastro');
      }
    } catch (error) {
      console.error('Error:', error); 
      alert('Erro no cadastro');
    }
  } else {
    form.classList.add('was-validated');
  }
};

[form.signupNameInput, form.signupEmailInput, form.signupPasswordInput].map((input) => {
  input.addEventListener('input', () => {
    input.setCustomValidity('');

    form.classList.remove('was-validated');
  });
});

function setInputValidity(input, message) {
  $(`#${input} + .invalid-feedback`).textContent = message;

  form[input].setCustomValidity(message);
}