const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const bannerController = require('../controllers/bannerController');
const servicesController   = require('../controllers/servicesController');
const balanceController = require('../controllers/balanceController');
const topupController = require('../controllers/topupController');
const transactionController = require('../controllers/transactionController');

// Auth
router.post('/registration', authController.register);
router.post('/login', authController.login);

// Banner
router.get('/banner', bannerController.banner);

// services
router.get('/services',auth, servicesController.index);

// balance
router.get('/balance', auth, balanceController.index);

// Topup
router.post('/topup', auth, topupController.store);

// transaction
router.get('/transaction/history', auth, transactionController.index);
router.post('/transaction', auth, transactionController.store);

// Profile
router.get('/profile', auth, authController.getProfile);
router.put('/profile/update', auth, authController.updateProfile);
router.put(
  '/profile/image',
  auth,
  authController.upload.single('profile_image'),
  authController.updateProfileImage
);


module.exports = router;
