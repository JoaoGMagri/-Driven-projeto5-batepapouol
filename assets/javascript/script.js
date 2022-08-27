//Variaveis Globais
let todasAsMensagens = [];
let nome = '';
let ativar = 0;



//Funções
function pegarNome() {

    let nomeRecebido = document.querySelector('.login input');
    nome = nomeRecebido.value;
    carregandoChat();
    nomeRecebido.value = '';
    
}

function carregandoChat() {

    const digita = document.querySelector('.login .mensagem');
    const botao = document.querySelector('.login button');
    const carrega = document.querySelector('.login .carregando');
    const texto = document.querySelector('.login span');

    digita.classList.add('esconder');
    botao.classList.add('esconder');
    carrega.classList.remove('esconder');
    texto.classList.remove('esconder');

    setTimeout(loginComNome, 2000);
}


function loginComNome() {

    const novoUsuario = {
        name: nome
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', novoUsuario);
    promessa.then(deuCertoNome);
    promessa.catch(deuErroNome);

}

function deuCertoNome() {

    recebendoAutorização();
    
    ativar = 1;

    const retirarTelaDeLogin = document.querySelector('.chat');
    retirarTelaDeLogin.classList.remove("esconder")

}

function deuErroNome() {
    
    alert("Nome já está sendo utilizado! Tente outro");
    window.location.reload();

}


function recebendoAutorização() {
    
    const resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    resposta.then(carregarMensagem);
    resposta.catch(deuErroAutorizacao);

}

function deuErroAutorizacao(erro) {
    
    alert("Não consegui contato com o Servidor");
    window.location.reload();

}

function carregarMensagem(promessa) {
    let todasAsMensagens = promessa.data;

    const mensagens = document.querySelector('.campo-de-mensagem')

    mensagens.innerHTML = '';

    for ( let i = 0; i < todasAsMensagens.length; i++ ) {
        
        if (todasAsMensagens[i].type === 'status') {

            mensagens.innerHTML += `
                <li class="uma-mensagem ${'mensagem-do-sistema'}">
                    <time class="horario">(${todasAsMensagens[i].time})</time>
                    <span class="usuario">${todasAsMensagens[i].from}</span>
                    <span class="mensagem">${todasAsMensagens[i].text}</sp>
                </li>
            `

        } else if (todasAsMensagens[i].type === 'message'){
            
            mensagens.innerHTML += `
                <li class="uma-mensagem ${'mensagem-do-usuario'}">
                    <time class="horario">(${todasAsMensagens[i].time})</time>
                    <span class="usuario">${todasAsMensagens[i].from}</span>
                    <span class="meio-da-frase"> para </span>
                    <span class="usuario"> ${todasAsMensagens[i].to}</span>
                    <span class="mensagem">${todasAsMensagens[i].text}</sp>
                </li>
            `

        } else if (todasAsMensagens[i].type === 'private_message') {

            mensagens.innerHTML += `
                <li class="uma-mensagem ${'mensagem-privada'}">
                    <time class="horario">(${todasAsMensagens[i].time})</time>
                    <span class="usuario">${todasAsMensagens[i].from}</span>
                    <span class="meio-da-frase"> reservadamente para </span>
                    <span class="usuario"> ${todasAsMensagens[i].to}</span>
                    <span class="mensagem">${todasAsMensagens[i].text}</sp>
                </li>
            `

        }

    
    }
    rolarTela();
}


function novaMensagem() {

    const mensagem = document.querySelector('.digitar-mensagem .mensagem');

    const novaMensagem = {
     
        from: nome,
        to: "Todos",
        text: mensagem.value,
        type: "message"

    }

    const resposta = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', novaMensagem);
    resposta.then(deuCertoNaMensagem);
    resposta.catch(deuErroNaMensagem);
    mensagem.value = '';
    
}

function deuCertoNaMensagem() {

    recebendoAutorização();
    console.log('mandou mensagem');

}

function deuErroNaMensagem() {

    alert('Você saiu do chat');
    window.location.reload();

}

function rolarTela() {
    
    const mensagem = document.querySelector('.campo-de-mensagem li:last-child');
    mensagem.scrollIntoView();

}


function manterConexao() {

    const nomestatus = {
        name: nome
    }

    if (nome !== "") {
        const resposta = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomestatus);
        resposta.then(deuCertoAReconexao);
        resposta.catch(deuErroAReconexao);
    }

}

function deuCertoAReconexao() {

    recebendoAutorização();
    console.log('mandou reconexao');

}

function deuErroAReconexao() {

    alert('Deu erro ao conectar no servidor');
    window.location.reload();

}


function envioComEnter(e) {

    if(e.key === "Enter") {

        novaMensagem();

    }

}


// Chamada das funções
setInterval(recebendoAutorização, 3000);
setInterval(manterConexao, 5000);



//Ações
document.addEventListener("keypress", envioComEnter);