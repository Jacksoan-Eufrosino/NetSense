document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('signinEmailInput').value;
  const password = document.getElementById('formSignUpPassword').value;

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      alert('Login bem-sucedido!');
      window.location.href = './dashboard.html';
    } else {
      const errorData = await response.json();
      alert(`Erro ao fazer login: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Erro ao tentar fazer login:', error);
    alert('Erro ao fazer login. Tente novamente.');
  }
});