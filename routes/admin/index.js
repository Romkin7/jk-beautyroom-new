const express = require('express');
const router = express.Router();
const authObj = require('../../middleware/authObj');

router.get('/', authObj.isLoggedIn, authObj.isAdmin, (req, res) => {
    return res.render('admin/index', { layout: 'adminLayout' });
});

module.exports = router;
