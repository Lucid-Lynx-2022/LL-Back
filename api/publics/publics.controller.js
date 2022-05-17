const res = require('express/lib/response');
const publics = require('./publics.model')

const ImageRepository = require('../../services/AWS-imageRepository');
const imageRepository = new ImageRepository();
const MAX_SIZE_FILE_KB =  40000000 //40MB

module.exports = {
    getAllPublics : getAllPublics,
    getPublicById : getPublicById,
    deletePublic : deletePublic,
    addPublic : addPublic,
    updatePublic : updatePublic
}


function getAllPublics(req, res){
    return publics.find({})
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
    const public = await publics.findOne({_id: id})
    
    return publics.deleteOne({_id : id})
    .then(response => {
        if(response.deletedCount == 0){
            return res.status(400).send({ 
                error: 400, 
                msg: 'No puedes borrar la publicacion porque no existe' })
        }else{
            if(public.image){
                imageRepository.deleteObject(public.image.split('/').pop());
            }
            return res.json({})
        }
    })
    
}


async function addPublic(req, res){
    //console.log(req.file)
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
    if(req.file.size > MAX_SIZE_FILE_KB){
        return res.status(400).send({ error: 400, msg: 'tamaño de fichero excedido, maximo 40MB' })
    }

    
    const imageURL = await imageRepository.uploadImage(req.body.title,req.file.buffer,req.file.mimetype);
    
    const newPublic = {
        title: req.body.title,
        description: req.body.description,
        userId: req.body.userId,
        displayName: req.body.displayName,
        email: req.body.email,
        date: req.body.date,
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


async function updatePublic(req, res){
    
    const id  = req.params.id;
    let imageURL = (await publics.findById(id)).image;
    let title = "";

    if (!thisPublicExists(id)) {
        return res.status(400).send({ error: 400, msg: 'Esta publicacion no existe' })
    };
    if(req.file){
        if(req.file.size > MAX_SIZE_FILE_KB){
            return res.status(400).send({ error: 400, msg: 'tamaño de fichero excedido, maximo 1MB' })
        }
        if(!req.body.title && typeof req.body.title != 'string'){
            title = (await publics.findById(id)).title;
        }else{
            title  = req.body.title;
        }
        if(imageURL){
            // eliminamos imagen anterior
            await imageRepository.deleteObject(imageURL.split('/').pop());
        }
        imageURL = await imageRepository.uploadImage(title,req.file.buffer,req.file.mimetype);

    }


    publics.findByIdAndUpdate(
        { _id: id },
        { 
            title: req.body.title,
            description: req.body.description,
            userId: req.body.userId,
            displayName: req.body.displayName,
            email: req.body.email,
            date: req.body.date,
            image: imageURL
        },
        function(err, result) {
          if (err) {
            return res.status(400).send({ error: 400, msg: 'Esta publicacion no existe' })
          } else {
            res.send("publicacion actualizado con exito");
          }
        }
      );
}

async function thisPublicExists(id){
    return ( await publics.findOne({_id: id}) ) != null
}
