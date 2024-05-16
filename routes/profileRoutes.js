// routes/profileRoutes.js
const express = require('express');
const Profile = require('../models/Profile');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error retrieving profiles:', error);
    next(error);
  }
});

module.exports = router;