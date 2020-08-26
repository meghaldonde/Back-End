const router = require('express').Router();
const multer = require('multer');

const crypto = require('crypto');
const path = require('path');

const storage = require('../gridfsConfig')


const {
    mongo,
    connection,
    Types
} = require('mongoose');

let gfs;
// initialize stream
connection.once('open', () => {
    gfs = new mongo.GridFSBucket(connection.db, {
        bucketName: "uploads"
    });
});


const singleUpload = multer({
    storage: storage
}).single('file');

const {
    getAllImages,
    uploadImage,
    getImage,
    updateImage,
    deleteImage,
    getAllFiles,
    getFileByName,
    deleteFile
} = require('../controllers/imageController');
const {
    protect
} = require('../controllers/authController');



router.route('/files').get(getAllFiles);
router.route('/file/:filename').get(getFileByName);
router.route('/file/:id').get(deleteFile);

router.route('/').get(getAllImages).post(singleUpload, uploadImage);

router
    .route('/:id')
    .get(getImage)
    .patch(updateImage)
    .delete(deleteImage);

module.exports = router;