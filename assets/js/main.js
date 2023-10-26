const saldoElement = document.getElementById('saldo');
const entradasElement = document.getElementById('entradas');
const saidasElement = document.getElementById('saidas');
const historicoList = document.getElementById('historico-list');
const descricaoInput = document.getElementById('descricao');
const valorInput = document.getElementById('valor');
const dataInput = document.getElementById('data');
const modalOverlay = document.getElementById('modal');
const toggleModalButton = document.getElementById('toggleModal');
const fecharModalButton = document.getElementById('fecharModal');

const transacoes = [];

function atualizarBalanco() {
    const entradas = transacoes
        .filter(transacao => transacao.valor > 0)
        .reduce((total, transacao) => total + transacao.valor, 0)
        .toFixed(2);

    const saidas = transacoes
        .filter(transacao => transacao.valor < 0)
        .reduce((total, transacao) => total + transacao.valor, 0)
        .toFixed(2);

    const total = transacoes
        .reduce((total, transacao) => total + transacao.valor, 0)
        .toFixed(2);

    saldoElement.textContent = `R$ ${total}`;
    entradasElement.textContent = `R$ ${entradas}`;
    saidasElement.textContent = `R$ ${Math.abs(saidas)}`;
}

let indiceEdicao = -1; // Inicialmente, não estamos editando nenhuma transação

function adicionarTransacao() {
    const descricao = descricaoInput.value.trim();
    const valor = parseFloat(valorInput.value);
    const data = dataInput.value;

    if (descricao === '' || isNaN(valor) || data === '') {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    if (indiceEdicao !== -1) {
        // Se estamos editando, atualize a transação existente
        const transacaoEditada = {
            descricao,
            valor,
            data,
        };
        transacoes[indiceEdicao] = transacaoEditada;
    } else {
        // Caso contrário, estamos adicionando uma nova transação
        const transacao = {
            descricao,
            valor,
            data,
        };
        transacoes.push(transacao);
    }

    atualizarHistorico();
    atualizarBalanco();

    // Limpe o formulário e redefina o índice de edição
    limparCampos();
    indiceEdicao = -1;
    fecharModal();
}


function atualizarHistorico(transacao) {
    const listItem = document.createElement('li');
    const valorPrefixo = transacao.valor < 0 ? '-' : '+';
    listItem.innerHTML = `
        <p>${transacao.descricao}</p>
        <p>${valorPrefixo} R$ ${Math.abs(transacao.valor).toFixed(2)}</p>
        <p class="data">${transacao.data}</p>
    `;

    historicoList.appendChild(listItem);
}

function fecharModal() {
    modalOverlay.style.display = 'none';
}

function abrirModal() {
    modalOverlay.style.display = 'flex';
}

function limparCampos() {
    descricaoInput.value = '';
    valorInput.value = '';
    dataInput.value = '';
}

toggleModalButton.addEventListener('click', abrirModal);
fecharModalButton.addEventListener('click', fecharModal);

function criarItemHistorico(transacao) {
    const listItem = document.createElement('li');
    const valorPrefixo = transacao.valor < 0 ? '-' : '+';
    listItem.innerHTML = `
        <p>${transacao.descricao}</p>
        <p>${valorPrefixo} R$ ${Math.abs(transacao.valor).toFixed(2)}</p>
        <p class="data">${transacao.data}</p>
        <button class="editar" onclick="editarTransacao(${transacoes.indexOf(transacao)})">Editar</button>
        <button class="excluir" onclick="confirmarExclusao(${transacoes.indexOf(transacao)})">Excluir</button>
        `;

    return listItem;
}

function atualizarHistorico() {
    historicoList.innerHTML = '';
    transacoes.forEach(transacao => {
        const listItem = criarItemHistorico(transacao);
        historicoList.appendChild(listItem);
    });
}

function removerTransacao(index) {
    if (index >= 0 && index < transacoes.length) {
        transacoes.splice(index, 1);
        atualizarBalanco();
        atualizarHistorico();
    }
}

atualizarBalanco();

function confirmarExclusao(index) {
    const modalConfirmarExclusao = document.getElementById('modalConfirmarExclusao');
    const confirmarExcluirNotaButton = document.getElementById('confirmarExcluirNota');
    const cancelarExcluirNotaButton = document.getElementById('cancelarExcluirNota');

    // Exibe o modal de confirmação de exclusão
    modalConfirmarExclusao.style.display = 'flex';

    // Configura ação de confirmação
    confirmarExcluirNotaButton.onclick = function () {
        // Remove a transação e fecha o modal de confirmação
        removerTransacao(index);
        modalConfirmarExclusao.style.display = 'none';
    };

    // Configura ação de cancelamento
    cancelarExcluirNotaButton.onclick = function () {
        modalConfirmarExclusao.style.display = 'none';
    };
}

function editarTransacao(index) {
    const transacao = transacoes[index];

    // Preencha os campos do formulário de edição com os valores atuais
    descricaoInput.value = transacao.descricao;
    valorInput.value = transacao.valor;
    dataInput.value = transacao.data;

    // Atualize o índice de edição para que saibamos qual transação estamos editando
    indiceEdicao = index;

    // Abra o modal de edição
    abrirModal();
}
