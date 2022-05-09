const res = require('express/lib/response');
const publics = require('./publics.model')

const ImageRepository = require('../../services/imageRepository');
const imageRepository = new ImageRepository();


module.exports = {
    getAllPublics : getAllPublics,
    getPublicById : getPublicById,
    deletePublic : deletePublic,
    addPublic : addPublic
}


function getAllPublics(req, res){

    return publics.find({},'title description userId image')
        .then(response => {
            return res.json(response)
        })
        .catch(err => console.error("Error al encontrar la publicacion"));
}

function getPublicById (req, res){
    return publics.findById(req.params.id)
        .then(response => {
            return res.json(response);
        })
        .catch(err => console.error("Error al encontrar la publicacion"));
}


async function deletePublic(req, res){
    const id = req.params.id
    return publics.deleteOne({_id : id})
    .then(response => {
        if(response.deletedCount == 0){
            return res.status(400).send({ 
                error: 400, 
                msg: 'No puedes borrar la publicacion porque no existe' })
        }else{
            //eliminar tambien la imagen de AWS bucket s3
            return res.json({})
        }
    })
}


async function addPublic(req, res){
    if (!req.body.title && typeof req.body.title != 'string') {
        return res.status(400).send({ error: 400, msg: 'titulo incorrecto o inexistente' })
    };
    if (!req.body.description && typeof req.body.description != 'string') {
        return res.status(400).send({ error: 400, msg: 'descripcion incorrecto o inexistente' })
    };
    if (!req.body.userId && typeof req.body.userId != 'string') {
        return res.status(400).send({ error: 400, msg: 'usuario incorrecto o inexistente' })
    };
    if (!req.file && typeof req.file != 'file') {
        return res.status(400).send({ error: 400, msg: 'url imagen incorrecto o inexistente' })
    };

    const imageURL = await imageRepository.uploadImage(req.body.title,req.file.buffer,req.file.mimetype);
    const newPublic = {
        title: req.body.title,
        description: req.body.description,
        userId: req.body.userId,
        image: imageURL
    }

    return publics.create(newPublic)
        .then(response => {
            return res.json(response)
        })
        .catch(err => {
            return res.status(400).send({ error: 400, msg: 'publicacion ya existente' })
        })
}
