const URL_API_PIADA = 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=religious,political,racist,sexist';
const URL_API_TRADUCAO = 'https://api.mymemory.translated.net/get';

const mapaCategorias = {
  'Programming': 'Programação',
  'Knock-Knock': 'Piada de Bater',
  'General': 'Geral',
  'Dark': 'Sombrio',
  'Spooky': 'Assustador',
  'Mist': "Variados"
};

async function traduzirTexto(texto) {
  try {
    const resposta = await fetch(
      `${URL_API_TRADUCAO}?q=${encodeURIComponent(texto)}&langpair=en|pt`
    );
    const dados = await resposta.json();
    
    if (dados.responseStatus === 200) {
      return dados.responseData.translatedText;
    }
    return texto;
  } catch (erro) {
    console.error('Erro na tradução:', erro);
    return texto;
  }
}

function escaparHtml(texto) {
  const mapa = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return texto.replace(/[&<>"']/g, caractere => mapa[caractere]);
}

function resetarTela() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('jokeDisplay').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'none';
  document.getElementById('initialState').style.display = 'none';
}

function mostrarLoading() {
  document.getElementById('loading').style.display = 'flex';
}

function mostrarErro(mensagem) {
  document.getElementById('errorMessage').textContent = mensagem;
  document.getElementById('errorMessage').style.display = 'block';
}

function mostrarPiada(piada) {
  let htmlPiada = '';

  if (piada.type === 'twopart') {
    htmlPiada = `
      <div class="joke-setup">${escaparHtml(piada.setup)}</div>
      <div class="joke-delivery">${escaparHtml(piada.delivery)}</div>
    `;
  } else {
    htmlPiada = `<div class="joke-single">${escaparHtml(piada.joke)}</div>`;
  }

  document.getElementById('jokeContent').innerHTML = htmlPiada;

  let htmlCategoria = `<span class="badge">${escaparHtml(piada.categoriaPt)}</span>`;

  if (!piada.safe) {
    htmlCategoria += '<span class="badge" style="background: rgba(220, 53, 69, 0.2); color: #ff6b6b; border-color: rgba(220, 53, 69, 0.3);">⚠️ NSFW</span>';
  }

  document.getElementById('jokeCategory').innerHTML = htmlCategoria;
  document.getElementById('loading').style.display = 'none';
  document.getElementById('jokeDisplay').style.display = 'block';
}

async function buscarPiada() {
  const botao = document.getElementById('btnGetJoke');
  botao.disabled = true;
  
  resetarTela();
  mostrarLoading();

  try {
    const resposta = await fetch(URL_API_PIADA);
    
    if (!resposta.ok) {
      throw new Error(`Erro na API: ${resposta.status}`);
    }

    const dados = await resposta.json();

    if (dados.error) {
      mostrarErro('Não deu pra carregar a piada, tenta de novo aí 😅');
      botao.disabled = false;
      return;
    }

    if (dados.type === 'twopart') {
      dados.setup = await traduzirTexto(dados.setup);
      dados.delivery = await traduzirTexto(dados.delivery);
    } else {
      dados.joke = await traduzirTexto(dados.joke);
    }

    dados.categoriaPt = mapaCategorias[dados.category] || (await traduzirTexto(dados.category));

    mostrarPiada(dados);
  } catch (erro) {
    console.error('Erro ao buscar piada:', erro);
    mostrarErro('Erro ao carregar piada. Confere tua internet aí 😬');
  } finally {
    botao.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnGetJoke').addEventListener('click', buscarPiada);
  document.getElementById('initialState').style.display = 'block';
});