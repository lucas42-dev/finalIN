document.addEventListener('DOMContentLoaded', function () {
    const equipamentoForm = document.getElementById('equipamentoForm');
    const equipamentoTableBody = document.getElementById('equipamentoTable');

    // Função para adicionar um novo equipamento
    equipamentoForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nomeEquipamento').value;
        const categoria = document.getElementById('categoria').value;
        const status = parseInt(document.getElementById('status').value);

        fetch('http://127.0.0.1:5000/equipamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, categoria, status })
        })
        .then(response => response.json())
        .then(data => {
            alert("Equipamento adicionado com sucesso!");
            listarEquipamentos();
            equipamentoForm.reset();
        })
        .catch(error => console.error('Erro ao adicionar equipamento:', error));
    });

    // Função para listar os equipamentos
    function listarEquipamentos() {
        fetch('http://127.0.0.1:5000/equipamentos')
        .then(response => response.json())
        .then(equipamentos => {
            equipamentoTableBody.innerHTML = '';
            equipamentos.forEach(equipamento => {
                const newRow = equipamentoTableBody.insertRow();
                newRow.innerHTML = `
                    <td>${equipamento.id}</td>
                    <td>${equipamento.nome}</td>
                    <td>${equipamento.categoria}</td>
                    <td>${equipamento.status == 1 ? 'Disponível' : 'Indisponível'}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editEquipamento(${equipamento.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deleteEquipamento(${equipamento.id})">Excluir</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Erro ao listar equipamentos:', error));
    }

    // Função para editar um equipamento
    window.editEquipamento = function(id) {
        fetch(`http://127.0.0.1:5000/equipamentos/${id}`)
        .then(response => response.json())
        .then(equipamento => {
            document.getElementById('editNome').value = equipamento.nome;
            document.getElementById('editCategoria').value = equipamento.categoria;
            document.getElementById('editStatus').value = equipamento.status.toString();

            const modalElement = document.getElementById('editModal');
            const myModal = new bootstrap.Modal(modalElement);
            myModal.show();

            // Removendo eventos antigos para evitar múltiplas chamadas
            const saveButton = document.getElementById('saveEdit');
            saveButton.replaceWith(saveButton.cloneNode(true));
            document.getElementById('saveEdit').addEventListener('click', function () {
                salvarEdicao(id, myModal);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar equipamento para edição:', error);
            alert('Erro ao carregar dados do equipamento');
        });
    };

    // Função para salvar edição
    function salvarEdicao(id, modalInstance) {
        const nome = document.getElementById('editNome').value;
        const categoria = document.getElementById('editCategoria').value;
        const status = parseInt(document.getElementById('editStatus').value);

        fetch(`http://127.0.0.1:5000/equipamentos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, categoria, status })
        })
        .then(response => response.json())
        .then(data => {
            alert('Equipamento atualizado com sucesso!');
            listarEquipamentos();
            const modalElement = document.getElementById('editModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide(); // Fechar modal corretamente
        })
        .catch(error => {
            console.error('Erro ao atualizar equipamento:', error);
            alert('Erro ao atualizar equipamento');
        });
    }

    // Função para excluir um equipamento
    window.deleteEquipamento = function(id) {
        if (confirm('Tem certeza que deseja excluir este equipamento?')) {
            fetch(`http://127.0.0.1:5000/equipamentos/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert('Equipamento excluído com sucesso!');
                listarEquipamentos();
            })
            .catch(error => console.error('Erro ao excluir equipamento:', error));
        }
    };

    listarEquipamentos();
});
