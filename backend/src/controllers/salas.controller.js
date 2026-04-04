import * as salasService from '../services/salas.service.js';

export const getSalas = async (req, res) => {
  try {
    const data = await salasService.getAllSalas();
    return res.status(200).json( data );
    
  } catch (err) {
    return res.status(404).json( err );
  } 
};

export const createSalas = async (req, res) => {
  try {
    const data = await salasService.registerSalas(req.body);
    return res.status(200).json({message: 'Sala inserida com sucesso', data});

  } catch (err) {
    return res.status(404).json({ err: err.message });
  };
};