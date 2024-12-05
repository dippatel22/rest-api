const express = require('express');
const router = express.Router();
const Student = require('../model/student');
const mongoose = require('mongoose');
const checkAuth=require('../middleware/cheack-auth');
const cloudinary=require('cloudinary').v2;

cloudinary.config({
    cloud_name:'djhadt2qd',
    api_key:'971975164472544',
    api_secret:'eiy_9tKzC2gJo5YhDWJRSDeu-KU'
});
// GET DATA
router.get('/',checkAuth, (req, res, next) => {
    Student.find().then(result => {

        res.status(200).json({
            StudentData: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});

// POST DATA

router.post('/',checkAuth, (req, res, next) => {
    const file = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        const student = new Student({
            _id: new mongoose.Types.ObjectId,
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            imagePath:result.url
        })
        student.save().then(result => {
            console.log(result);
            res.status(200).json({
                newStudent: result
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
    });

});

// SEARCH DATA

router.get('/:id', checkAuth,(req, res, next) => {

    Student.findById(req.params.id).then(result => {

        res.status(200).json({
            studentData: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});

// DELETE DATA

router.delete('/:id', checkAuth,(req, res, next) => {
    const imageUrl=req.query.imageUrl;
    const urlArray=imageUrl.split('/');
    const image=urlArray[urlArray.length-1];
    const imageName=image.split('.');
    Student.deleteOne({ _id: req.query.id })
        .then(result => {
cloudinary.uploader.destroy(imageName,(error,result)=>{
    console.log(error,result);
})
            res.status(200).json({
                message: "data deleted",
                result: result
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

// PUT DATA

router.put('/:id',checkAuth,(req,res,next)=>{
    Student.findByIdAndUpdate({ _id: req.params.id },{
        $set:{
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
        }
    }) .then(result => {

        res.status(200).json({
            updated_result: result
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router; 