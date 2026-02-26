import supabase from '../config/supabase.js'

export const getTurmas = async (req, res) => {
    const { data, error } = await supabase
    .from('turmas')
    .select('*');

    if(error){
        return res.status(500).json({ error: error.message });
    }; 
        
    return res.status(200).json({ turmas: data }); 
};

export const createTurmas = async (req, res) => {
    const { nome, qtd_alunos, curso } = req.body;

    const { data, error } = await supabase
    .from('turmas')
    .insert([{ nome, qtd_alunos, curso }]);
        
    if(error){
        return res.status(500).json({ error: error.message });
    }; 
        
    return res.status(201).json({ message: 'Turma inserida com sucesso', data}); 
}