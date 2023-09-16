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

function adicionarTransacao() {
    const descricao = descricaoInput.value.trim();
    const valor = parseFloat(valorInput.value);
    const data = dataInput.value;

    if (descricao === '' || isNaN(valor) || data === '') {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const transacao = {
        descricao,
        valor,
        data,
    };

    transacoes.push(transacao);
    atualizarHistorico(transacao);
    atualizarBalanco();

    fecharModal();
    limparCampos();
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
        <button class="excluir" onclick="removerTransacao(${transacoes.indexOf(transacao)})">Excluir</button>
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