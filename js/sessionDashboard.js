document.addEventListener("DOMContentLoaded", function () {
    
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});

    const token = cookies["authToken"];

    if (!token) {
      alert("Você precisa estar logado para acessar esta página.");
      window.location.href = "login.html";
    } else {
      
      const [email, password] = atob(token).split(":");

      fetch("http://localhost:3000/users")
        .then((response) => response.json())
        .then((users) => {
          const user = users.find((user) => user.email === email && user.password === password);

          if (!user) {
            alert("Sessão inválida. Faça login novamente.");
            document.cookie = "authToken=; path=/; max-age=0;"; 
            window.location.href = "login.html";
          }
        })
        .catch((error) => {
          console.error("Erro ao verificar autenticação:", error);
          alert("Erro ao validar sessão. Tente novamente.");
          document.cookie = "authToken=; path=/; max-age=0;";
          window.location.href = "login.html";
        });
    }
  });