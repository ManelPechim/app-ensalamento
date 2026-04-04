import expressJS from 'express';

import turmaRoutes from './src/routes/turmas.route.js';
import salasRoutes from './src/routes/salas.route.js';

const app = expressJS();
app.use(expressJS.json());

//endpoints
app.use('/api/turmas', turmaRoutes);
app.use('/api/salas', salasRoutes);

app.get('/', (req, res) => {
  res.send("Hello World!");
});

export default app;