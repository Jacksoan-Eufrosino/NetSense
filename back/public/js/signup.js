document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('signinNameInput').value;
  const email = document.getElementById('signinEmailInput').value;
  const password = document.getElementById('formSignUpPassword').value;

  try {
      // Buscar usuários e verificar email (tudo dentro do mesmo bloco then)
      const getUsersResponse = await fetch('http://localhost:3000/api/users');

      if (!getUsersResponse.ok) { // Verifica se a resposta da API está ok
          const errorData = await getUsersResponse.json();
          throw new Error(errorData.message || 'Erro ao buscar usuários'); // Lança um erro
      }

      const users = await getUsersResponse.json();
      const userExists = users.some((user) => user.email === email);

      if (userExists) {
          alert('Email já registrado. Por favor, use outro email.');
          return; // Importante: Sai da função aqui para não continuar o registro
      }

      // Registrar o novo usuário (só executa se o email não existir)
      const response = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
          alert('Registro bem-sucedido!');
          window.location.href = '../login.html';
      } else {
          const errorData = await response.json();
          alert(`Erro ao registrar: ${errorData.message}`);
      }

  } catch (error) {
      console.error('Erro ao tentar registrar:', error);
      alert(`Erro ao registrar: ${error.message || 'Tente novamente.'}`); // Exibe a mensagem de erro ou uma mensagem genérica
  }
});