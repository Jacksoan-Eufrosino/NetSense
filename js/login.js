document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signinEmailInput').value;
    const password = document.getElementById('formSignUpPassword').value;

    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      alert('Login bem-sucedido!');
      // Redirecionar para a página inicial
      window.location.href = './dashboard.html';
    } else {
      alert('Credenciais inválidas.');
    }
  });