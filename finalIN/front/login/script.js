document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('loginBtn');
    const loginField = document.getElementById('login');
    const senhaField = document.getElementById('senha');
    
    // Função para lidar com o login
    loginBtn.addEventListener('click', function () {
        const login = loginField.value;
        const senha = senhaField.value;
  
        // Validação simples
        if (!login || !senha) {
            alert("Por favor, preencha o login e a senha.");
            return;
        }
  
        // Enviar a solicitação de login para o backend
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: login,
                senha: senha
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Caso o login seja bem-sucedido, redireciona para a página de administração ou dashboard
                window.location.href = 'http://127.0.0.1:5000/dashboard';  // Altere para o endpoint de destino após login
            } else {
                // Caso o login falhe
                alert('Login ou senha inválidos!');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao tentar fazer o login. Tente novamente mais tarde.');
        });
    });
  });