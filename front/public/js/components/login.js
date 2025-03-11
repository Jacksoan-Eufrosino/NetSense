document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const email = document.getElementById("signinEmailInput").value;
    const password = document.getElementById("formSignUpPassword").value;
  
    try {
      const response = await fetch("http://localhost:3000/api/"); 
      const users = await response.json();
  
      const user = users.find((user) => user.email === email && user.password === password);
  
      if (user) {
        
        document.cookie = `authToken=${btoa(`${email}:${password}`)}; path=/; max-age=3600;`;
        window.location.href = "./dashboard.html"; 
        alert("Login bem-sucedido!");
        
      } else {
        alert("Credenciais inválidas.");
      }
    } catch (error) {
      console.error("Erro ao tentar fazer login:", error);
    }
  });