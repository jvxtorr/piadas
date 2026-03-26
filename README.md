# Tela de Piadas

Este projeto possui uma tela de piadas acessivel pela rota `/piadas`.

## Como funciona

- A rota `/piadas` abre uma pagina separada dentro do projeto React + Vite.
- A interface da tela de piadas nao usa componentes React internamente.
- A pagina foi feita com arquivos separados de HTML, CSS e JavaScript puro.

## Arquivos da tela

- `public/piadas/index.html`: estrutura da pagina
- `public/piadas/style.css`: estilos da tela
- `public/piadas/script.js`: logica para buscar e mostrar as piadas

## API usada

As piadas sao buscadas da API:

`https://v2.jokeapi.dev/`

## O que a tela faz

- Busca uma piada ao clicar no botao
- Mostra loading durante a requisicao
- Exibe piadas do tipo `single` e `twopart`
- Traduz a piada para pt-BR

## Observacao

A tela foi pensada para funcionar dentro do projeto atual, mas de forma isolada, usando apenas HTML, CSS e JavaScript.
