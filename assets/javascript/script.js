//Variaveis Globais
let todasAsMensagens = [];
let todosOsOnlines;
let nome;
let destinatario = "Todos";
let tipoDeMensagem = "message";
let usuarioSelecionado;



//Funções

//Funcionalidades da Página
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

function abrirSidebar() {

    const botaoSidebar = document.querySelector(".side-bar");
    const transparencia = document.querySelector(".transparencia");

    botaoSidebar.classList.remove('esconder');
    transparencia.classList.remove('esconder');


}

function fecharSidebar() {

    const botaoSidebar = document.querySelector(".side-bar");
    const transparencia = document.querySelector(".transparencia");

    botaoSidebar.classList.add('esconder');
    transparencia.classList.add('esconder');

}

function envioComEnter(e) {

    if(e.key === "Enter") {

        novaMensagem();

    }

}

//Atualizações do servidor
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

function deuErroAutorizacao() {
    
    alert("Não consegui contato com o Servidor");
    window.location.reload();

}

function tirarMensagensPrivadas(mensagem) {

    if (mensagem.type === "status") {

        return true;

    } else if (mensagem.type === "message") {

        return true;

    } else if (mensagem.type === "private_message") {

        if (mensagem.from === nome || mensagem.to === nome) {

            return true;

        } else {
            
            return false;

        }

    }

}

function carregarMensagem(promessa) {
    let mensagensParaFiltrar = promessa.data;

    const mensagens = document.querySelector('.campo-de-mensagem')

    mensagens.innerHTML = '';

    let todasAsMensagens = mensagensParaFiltrar.filter(tirarMensagensPrivadas);

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
                    <span class="usuario"> ${todasAsMensagens[i].to}:</span>
                    <span class="mensagem">${todasAsMensagens[i].text}</sp>
                </li>
            `

        } else if (todasAsMensagens[i].type === 'private_message') {

            mensagens.innerHTML += `
                <li class="uma-mensagem ${'mensagem-privada'}">
                    <time class="horario">(${todasAsMensagens[i].time})</time>
                    <span class="usuario">${todasAsMensagens[i].from}</span>
                    <span class="meio-da-frase"> reservadamente para </span>
                    <span class="usuario"> ${todasAsMensagens[i].to}:</span>
                    <span class="mensagem">${todasAsMensagens[i].text}</sp>
                </li>
            `

        }

    
    }
    rolarTela();
}


function atualizarPessoaOnline() {

    const online = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    online.then(carregarOnline);
    online.catch(deuErroAReconexao);

}

function carregarOnline(resposta) {
    console.log(resposta)
    todosOsOnlines = resposta.data;

    const onlines = document.querySelector('.side-bar .listaDeOpcoes');

    onlines.innerHTML = `
        <li data-identifier="participant">
            <ion-icon name="people"></ion-icon>
            <div>Todos</div> 
            <ion-icon  class="check" name="checkmark"></ion-icon>
        </li>
    `;

    for ( let i = 0; i < todosOsOnlines.length; i++ ) {
        
        onlines.innerHTML += `
            <li data-identifier="participant" onclick="selecionarParticiapnte(this)">
                <ion-icon name="person-circle"></ion-icon>
                <div>${todosOsOnlines[i].name}</div> 
                <ion-icon  class="check esconder" name="checkmark"></ion-icon>
            </li>
        `;

    }

}



function novaMensagem() {

    const mensagem = document.querySelector('.digitar-mensagem .mensagem');

    const novaMensagem = {
     
        from: nome,
        to: destinatario,
        text: mensagem.value,
        type: tipoDeMensagem

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
    mensagem.scrollIntoView({behavior:"smooth"});

}


function manterConexao() {

    const nomestatus = {
        name: nome
    }
    console.log(nome)

    if (nome !== undefined) {
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

    //alert('Deu erro ao conectar no servidor');
    manterConexao();
    //window.location.reload();

}





// Chamada das funções
setInterval(recebendoAutorização, 3000);
setInterval(atualizarPessoaOnline, 10000);
setInterval(manterConexao, 5000);



//Ações
document.addEventListener("keypress", envioComEnter);