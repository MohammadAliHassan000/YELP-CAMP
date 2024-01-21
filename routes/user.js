const express = require('express');
const router = express.Router();
const catchAsync=require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport')
const { isLoggedIn } = require("../middleware");


router.get('/register', (req, res) => {
    res.render('users/register');
}) 
router.post('/register', catchAsync(async (req, res,next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);
        req.login(regUser, err => {
            if (err) return next();
            req.flash("success", "welcome to Yelp Camp");
            res.redirect("/campgrounds");
        })
    }
    catch (e)
    {
        req.flash('error', e.message);
        res.redirect('register');
    }
}))

router.get('/login', (req, res) => {
    console.log(req.session, 4);
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const returnto = req.session.returnTo || '/campgrounds';
    console.log(req.session.returnTo,3);
    res.redirect(returnto);
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).send("Error during logout");
        }
        req.flash("success", "Logged out ");
      res.redirect("/campgrounds");
    });
})
module.exports = router;