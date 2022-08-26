let todasAsMensagens = [];
let nome = '';


setInterval(recebendoAutorização, 1000);


function rolarTela() {
    
    const mensagem = document.querySelector('.campo-de-mensagem li:last-child');
    mensagem.scrollIntoView();

}

function recebendoAutorização() {
    
    const resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    resposta.then(carregarMensagem);
    resposta.catch(deuErro);

}
recebendoAutorização();


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


function deuErro(erro) {
    
    alert("Não consegui contato com o Servidor");
    console.log(erro.request);

}


function perguntarNome() {

    nome = prompt('Seu nome');

    const novoUsuario = {
        name: nome
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', novoUsuario);
    promessa.then(deuCerto);
    promessa.catch(deuErroNome);

}
perguntarNome();


function deuCerto() {

    recebendoAutorização();

}


function deuErroNome() {
    
    alert("Nome já está sendo utilizado! Tente outro");
    perguntarNome();

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

}


function deuCertoNaMensagem() {

    recebendoAutorização();

}


function deuErroNaMensagem() {

    alert('Você saiu do chat');
    perguntarNome();

}


function manterConexao() {

    const nomestatus = {
        name: nome
    }

    const resposta = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomestatus);
    resposta.then(deuCertoAReconexao);
    resposta.catch(deuErroAReconexao);

}
setInterval(manterConexao, 5000);


function deuCertoAReconexao() {

    recebendoAutorização();

}


function deuErroAReconexao() {

    alert('deuErroAReconexao');
    manterConexao();

}


document.addEventListener("keypress", function(e) {

    if(e.key === "Enter") {

        novaMensagem();

    }

});