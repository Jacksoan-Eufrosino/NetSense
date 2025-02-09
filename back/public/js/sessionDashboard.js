// Função para verificar a sessão do usuário
export function checkSession() {
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [name, value] = cookie.split("=");
    acc[name] = value;
    return acc;
  }, {});

  const token = cookies["authToken"];

  if (!token) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "error.html";
  } else {
    const [email, password] = atob(token).split(":");

    fetch("http://localhost:3000/users")
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao acessar a API");
        return response.json();
      })
      .then((users) => {
        const user = users.find((user) => user.email === email && user.password === password);

        if (!user) {
          alert("Sessão inválida. Faça login novamente.");
          document.cookie = "authToken=; path=/; max-age=0;";
          window.location.href = "error.html";
        }
      })
      .catch((error) => {
        console.error("Erro ao verificar autenticação:", error);
        alert("Erro ao validar sessão. Tente novamente.");
        document.cookie = "authToken=; path=/; max-age=0;";
        window.location.href = "error.html";
      });
  }
}

export function initializeRegexHandlers() {
  const regexInput = document.getElementById("regexInput");
  const addRegexButton = document.getElementById("addRegex");
  const regexList = document.getElementById("regexList");

  // Adicionar regex à lista
  addRegexButton.addEventListener("click", () => {
    const regexValue = regexInput.value.trim();
    if (regexValue) {
      const li = document.createElement("li");
      li.textContent = regexValue;
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML += '<button class="btn btn-sm btn-danger ms-3 removeRegex">Remover</button>';
      regexList.appendChild(li);
      regexInput.value = "";
    }
  });

  // Remover regex da lista
  regexList.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("removeRegex")) {
      e.target.parentElement.remove();
    }
  });
}

// Função para inicializar o botão de logout
export function initializeLogout() {
  const logoutButton = document.getElementById("buttonLeft");

  logoutButton.addEventListener("click", () => {
    // Apaga o cookie de autenticação
    document.cookie = "authToken=; path=/; max-age=0;";
    alert("Você foi desconectado.");
    window.location.href = "login.html";
  });
}
