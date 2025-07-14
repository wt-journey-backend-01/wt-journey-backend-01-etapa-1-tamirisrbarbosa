// Importa os módulos necessários
const express = require('express');
const path = require('path');

// Inicializa a aplicação Express
const app = express();
const PORT = 4000;

// Middleware para permitir o uso de arquivos estáticos (ex: CSS, imagens, JSON, etc.)
app.use(express.static(path.join(__dirname, 'public')));


// Middleware para interpretar dados de formulários enviados via POST
app.use(express.urlencoded({ extended: true}));

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
    if (ultimoContato === null) {
        return res.redirect('/not-found');
    }

    const { nome, email, motivo }  = ultimoContato;
    
    res.send(`
        <h1>Contato recebido! Obrigado, ${nome}</h1>
        <p><strong>E-mail:</strong> ${email}</p>
        `);
    });

/* Rota GET /
Exibe o cardápio (index.html) com formulário de sugestão */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

/**
 * Rota GET /contato
 * Exibe formulário de contato (contato.html) */
app.get('/contato', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contato.html'));
});


/* Rota GET /sugestao-recebida
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

  res.send(`
    <h1>Sugestão recebida com sucesso!</h1>
    <p>Obrigado por contribuir com o DevBurger! 🔥🍔</p>
    <a href="/">Voltar ao cardápio</a>
  `);
});

// Captura todas as rotas não definidas e exibe a página 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});


/* Middleware final (catch-all)
   Captura qualquer rota que não exista e exibe a página 404 */
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
