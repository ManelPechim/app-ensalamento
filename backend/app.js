import express from 'express';
import turmaRoutes from './src/routes/turmas.route.js'

const app = express();
app.use(express.json());

app.use('/', turmaRoutes);

app.get('/', (req, res) => {
  res.send("Hello World!");
});

{/*//endpoint de SALAS
    app.get('/salas', async(req, res) => {

        const { data, error } = await supabase
        .from('salas')
        .select('*');

        if(error){
            return res.status(500).json({ error: error.message })
        };

        return res.status(200).json( {salas: data} )
    });

    app.post('/salas', async(req, res) => {

        const { nome, capacidade, turma_id } = req.body;

        // Buscar os dados da turma para validar
        const { data: turma, error: turmaError } = await supabase
        .from('turmas')
        .select('qtd_alunos')
        .eq('id_turma', turma_id)
        .single();

        if(turmaError) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        };

        // Validar se a quantidade de alunos é maior que a capacidade da sala
        if(turma.qtd_alunos > capacidade){
            return res.status(400).json({ error: 'Quantidade de alunos MAIOR que a capacidade da sala' })
        };

        const { data, error } = await supabase
        .from('salas')
        .insert([{ nome, capacidade, turma_id }])

        if(error) {
            return res.status(500).json({ error: error.message });
        };

        return res.status(201).json({ message: 'Sala inserida com sucesso', data });
    });
*/}

export default app;