import * as http from 'http';
import app from './app.ts';

const server = http.createServer(app);
const PORT: number = parseInt(`${process.env.PORT}`) || 3000;

server.listen(PORT, () => {
  console.log(`
    ==================================================
    Servidor local rodando na porta http://localhost:${PORT}
    ==================================================
    `
  );
});


