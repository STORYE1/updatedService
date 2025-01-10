const express = require('express');
const { uploadMiddleware, handleUploadErrors } = require('../middleware/uploadMiddleware');
const AuthenticationMiddleware = require('../middleware/authenticationMiddleware');
const TourController = require("../controllers/tourController")

const router = express.Router();

router.post(
    '/create',
    AuthenticationMiddleware.authenticate,
    uploadMiddleware,
    handleUploadErrors,
    TourController.createTourWithMedia
);

router.put(
    '/update/:tourId',
    AuthenticationMiddleware.authenticate,

    uploadMiddleware,
    handleUploadErrors,
    TourController.updateTourWithMedia
);

router.delete(
    '/delete/:tourId',
    AuthenticationMiddleware.authenticate,
    TourController.deleteTour
);

router.get(
    '/tours',
    AuthenticationMiddleware.authenticate,
    TourController.getAllTours
);

router.get(
    '/tours/category/:categoryId',

    TourController.getToursByCategory
);

router.get(
    '/user/tourTitles',
    AuthenticationMiddleware.authenticate,
    TourController.getUserTourTitles
);


router.get('/consumerTours', TourController.getAllToursConsumer);

router.get('/tours/:tourId', TourController.getTourById)

module.exports = router;
