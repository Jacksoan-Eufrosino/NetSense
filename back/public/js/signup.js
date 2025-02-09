document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('signinNameInput').value;
    const email = document.getElementById('signinEmailInput').value;
    const password = document.getElementById('formSignUpPassword').value;
  
    try {
      const response = await fetch('http://localhost:3000/api/signup', {
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
        const errorData = await response.json();
        alert(`Erro ao registrar: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erro ao tentar registrar:', error);
      alert('Erro ao registrar. Tente novamente.');
    }
  });