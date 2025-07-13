// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona o contêiner onde as seções de lanches serão inseridas
  const container = document.getElementById('lanches-container');

  // Faz uma requisição para o arquivo lanches.json
  fetch('/data/lanches.json')
    .then(response => response.json()) // Converte a resposta em JSON
    .then(dados => {
      // Itera sobre cada categoria de lanches
      dados.forEach(categoria => {
        // Cria uma seção para a categoria
        const secao = document.createElement('section');
        secao.classList.add('categoria');

        // Cria o título da categoria
        const titulo = document.createElement('h2');
        titulo.textContent = categoria.categoria;

        // Cria um contêiner para os lanches
        const lista = document.createElement('div');
        lista.classList.add('cardapio-lista');

        // Itera sobre cada lanche da categoria
        categoria.lanches.forEach(lanche => {
          const item = document.createElement('div');
          item.classList.add('lanche');

          // Se houver imagem, adiciona ao item
          if (lanche.imagem) {
            const imagem = document.createElement('img');
            imagem.src = lanche.imagem;
            imagem.alt = `Imagem do lanche ${lanche.nome}`;
            item.appendChild(imagem);
          }

          // Adiciona nome do lanche
          const nome = document.createElement('h3');
          nome.textContent = lanche.nome;
          item.appendChild(nome);

          // Adiciona descrição do lanche
          const descricao = document.createElement('p');
          descricao.textContent = lanche.descricao;
          item.appendChild(descricao);

          // Adiciona o lanche à lista
          lista.appendChild(item);
        });

        // Adiciona título e lista à seção
        secao.appendChild(titulo);
        secao.appendChild(lista);

        // Adiciona a seção ao container principal
        container.appendChild(secao);
      });
    })
    .catch(error => {
      // Em caso de erro, exibe mensagem ao usuário
      container.innerHTML = '<p>Erro ao carregar o cardápio. Tente novamente mais tarde.</p>';
      console.error('Erro ao carregar JSON:', error);
    });
});
