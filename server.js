// Importa os módulos necessários
const express = require('express');
const path = require('path');
const fs = require('fs'); // Adicionado para ler arquivos locais

// Inicializa a aplicação Express
const app = express();
const PORT = 3000;

// Middleware para permitir o uso de arquivos estáticos (ex: CSS, imagens, JSON, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para interpretar dados de formulários enviados via POST
app.use(express.urlencoded({ extended: true }));

// Variáveis temporárias para armazenar os dados dos formulários
let ultimoContato = null;
let ultimaSugestao = null;

/* Rota GET /not-found
  Página simples de erro, para casos em que não há dados para serem mostrados. */
app.get('/not-found', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

/* Rota POST /contato
  Recebe dados do formulário enviado pela página de contato e redireciona para página de confirmação */
app.post('/contato', (req, res) => {
  ultimoContato = req.body;
  res.redirect('/contato-recebido');
});

/* Rota GET /contato-recebido
    Exibe uma mensagem de agradecimento dos dados enviados ou redireciona para página de erro */
app.get('/contato-recebido', (req, res) => {
  if (
    !ultimoContato ||
    !ultimoContato.nome ||
    !ultimoContato.email ||
    !ultimoContato.assunto ||
    !ultimoContato.mensagem
  ) {
    return res.redirect('/not-found');
  }

  const { nome, email, assunto, mensagem } = ultimoContato;

  res.status(200).type('html').send(`
    <h1>Contato recebido com sucesso!</h1>
    <p><strong>Nome:</strong> ${nome}</p>
    <p><strong>E-mail:</strong> ${email}</p>
    <p><strong>Assunto:</strong> ${assunto}</p>
    <p><strong>Mensagem:</strong> ${mensagem}</p>
    <a href="/">Voltar ao cardápio</a>
  `);
});

/* Rota GET /
  Exibe o cardápio (index.html) com formulário de sugestão */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

/* Rota GET /contato
  Exibe formulário de contato (contato.html) */
app.get('/contato', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contato.html'));
});

/* Rota GET /sugestao
   Recebe dados do formulário de sugestão (via GET) e redireciona para confirmação */
app.get('/sugestao', (req, res) => {
  ultimaSugestao = req.query;
  res.redirect('/sugestao-recebida');
});

/* Rota GET /sugestao-recebida
   Exibe mensagem de confirmação da sugestão ou redireciona para erro */
app.get('/sugestao-recebida', (req, res) => {
  if (
    !ultimaSugestao ||
    !ultimaSugestao.nome ||
    !ultimaSugestao.email ||
    !ultimaSugestao.nomeLanche ||
    !ultimaSugestao.ingredientes
  ) {
    return res.redirect('/not-found');
  }

  const { nome, nomeLanche, ingredientes } = ultimaSugestao;
  
  res.status(200).type('html').send(`
    <h1>Sugestão recebida com sucesso!</h1>
    <p>Obrigado por contribuir com o DevBurger! 🔥🍔</p>
    <p><strong>Nome:</strong> ${nome}</p>
    <p><strong>Lanche:</strong> ${nomeLanche}</p>
    <p><strong>Ingredientes:</strong> ${ingredientes}</p>
    <a href="/">Voltar ao cardápio</a>
  `);
});

/* Rota GET /api/lanches 
  Retorna lista de lanches em JSON */
app.get('/api/lanches', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'data', 'lanches.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler lanches.json:', err);
      return res.status(500).json({ erro: 'Erro ao carregar os lanches' });
    }

    try {
      const categorias = JSON.parse(data);

      // Junta todos os lanches de todas as categorias em um único array
      const todosLanches = categorias.flatMap(categoria => categoria.lanches);

      // Validação dos dados
      const lanchesValidos = todosLanches.filter(lanche =>
        lanche.id &&
        typeof lanche.id === 'number' &&
        lanche.nome &&
        typeof lanche.nome === 'string' &&
        lanche.nome.trim() !== '' &&
        Array.isArray(lanche.ingredientes) &&
        lanche.ingredientes.length > 0
      );

      res.status(200).json(lanchesValidos);
    } catch (parseError) {
      console.error('Erro ao interpretar o JSON:', parseError);
      res.status(500).json({ erro: 'Erro ao interpretar os dados dos lanches' });
    }
  });
});

/* Middleware final (catch-all)
   Captura qualquer rota que não exista e exibe a página 404 */
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Inicializa o servidor na porta 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
