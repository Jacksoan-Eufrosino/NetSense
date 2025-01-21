document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('signinNameInput').value;
  const email = document.getElementById('signinEmailInput').value;
  const password = document.getElementById('formSignUpPassword').value;

  try {
    
      const getUsersResponse = await fetch('http://localhost:3000/users');
      const users = await getUsersResponse.json();

      const userExists = users.some((user) => user.email === email);

      if (userExists) {
          alert('Email já registrado. Por favor, use outro email.');
          return;
      }

      const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
          alert('Registro bem-sucedido!');
          window.location.href = './login.html';
      } else {
          alert('Erro ao registrar. Tente novamente.');
      }
  } catch (error) {
      console.error('Erro ao tentar registrar:', error);
      alert('Erro ao registrar. Tente novamente.');
  }
});
