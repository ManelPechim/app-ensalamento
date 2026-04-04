import * as turmasService from '../services/turmas.service.js';

export const getTurmas = async (req, res) => {
  try {
    const data = await turmasService.getAllTurmas();
    return res.status(200).json( data );
    
  } catch (err) {
    return res.status(404).json( err );
  } 
};

export const createTurmas = async (req, res) => {
  try {
    const data = await turmasService.registerTurmas(req.body);
    return res.status(200).json({message: 'Turma inserida com sucesso', data});

  } catch (err) {
    return res.status(404).json({ err: err.message });
  };
};