const router = require('express').Router();
const controller = require('./publics.controller');
const multer = require('multer');
const upload = multer();

router.get('/', controller.getAllPublics);
router.get('/:id', controller.getPublicById);
router.delete('/:id', controller.deletePublic);
router.post('/', upload.single('image'), controller.addPublic);
router.patch('/:id', upload.single('image'), controller.updatePublic);


module.exports = router;