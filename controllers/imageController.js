const Image = require('../models/imageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
//gridfs storage engine 
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

//retrieve all images from images schema
exports.getAllImages = catchAsync(async(req, res, next) => {
    const images = await Image.find();
    res.status(200).json({
        status: 'success',
        results: images.length,
        data: {
            images,
        },
    });
});

//upload image in gridfs uploads and save image schema both have filename
exports.uploadImage = catchAsync(async(req, res, next) => {

    const newImage = await Image.create({
        caption: req.body.caption,
        filename: req.file.filename,
        fileId: req.file.id,
    });
    res.status(201).json({
        status: 'success',
        data: {
            image: newImage,
        },
    });

});
//get image from images schema
exports.getImage = catchAsync(async(req, res, next) => {
    const image = await Image.findById(req.params.id);
    if (!image) {

        return next(new AppError('No Image found with that ID ', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            image,
        },
    });
});

//edit image caption , may be needs more info update about image?
//update image
exports.updateImage = catchAsync(async(req, res, next) => {
    const image = await Image.findOne({
        _id: req.params.id
    });
    if (!image) {
        return next(
            new AppError(
                "No Image found with that ID , or you can't update this image",
                404
            )
        );
    }

    console.log(req.body);

    const updatedImage = await Image.findByIdAndUpdate({
            _id: image._id
        },
        req.body, {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        message: 'success',
        data: {
            image: updatedImage,
        },
    });
});


//delete image from images 

exports.deleteImage = catchAsync(async(req, res, next) => {

    const image = await Image.findOne({
        _id: req.params.id
    });
    if (!image) {
        return next(
            new AppError(
                "No Image found with that ID , or you can't delete this image",
                404
            )
        );
    }

    //delete from images collection
    await Image.findByIdAndDelete(req.params.id);

    //delete from gridfs files
    await gfs.delete(new Types.ObjectId(image.fileId), (err, data) => {
        res.status(200).json({
            status: 'success',
            data: null,
        });
    });

});

//Fetch all files from bucket gridfs files-images

exports.getAllFiles = catchAsync(async(req, res, next) => {

    await gfs.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return next(new AppError('No Files found with that filename ', 404));
        }

        files.map(file => {
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/gif' || file.contentType === 'image/svg') {
                file.isImage = true;
            } else {
                file.isImage = false;
            }
        });

        res.status(200).json({
            status: 'success',
            results: files.length,
            data: {
                files,
            },
        });
    });
});


//     GET: Fetches a particular file by filename

exports.getFileByName = catchAsync(async(req, res, next) => {

    await gfs.find({
        filename: req.params.filename
    }).toArray((err, files) => {
        if (!files[0] || files.length === 0) {
            return next(new AppError('No Files found with that filename ', 404));
        }
        res.status(200).json({
            status: 'success',
            data: files[0]
        });
    });
});

//delete file from gridfs

exports.deleteFile = catchAsync(async(req, res, next) => {
    await gfs.delete(new Types.ObjectId(req.params.id), (err, data) => {
        res.status(200).json({
            status: 'success',
            data: null,
        });
    });
});