const router = require('express').Router();
const controller = require('./publics.controller');
const multer = require('multer');
const upload = multer();
const middleware = require('./../../midlewares/auth')

router.get('/', middleware.authFirebase ,controller.getAllPublics);
router.get('/:id', middleware.authFirebase ,controller.getPublicById);
router.delete('/:id', middleware.authFirebase ,controller.deletePublic);
router.post('/', middleware.authFirebase ,upload.single('image'), controller.addPublic);
router.patch('/:id', middleware.authFirebase ,upload.single('image'), controller.updatePublic);


module.exports = router;