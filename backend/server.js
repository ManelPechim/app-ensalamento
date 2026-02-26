import app from './app.js';

const PORT = 3000 || process.env;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`)
});


