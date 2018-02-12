'use strict';

const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const secret = '0RGxxAOfOW'; // Randomly generated;
var User = require('../user/user.model');

let router = new Router({
	prefix: '/auth'
});

router
    .post('/login', async(ctx, next) => {
        try {
            let email = ctx.request.body.email,
                password = ctx.request.body.password;
            let user = await User.findOne({email: email.toLowerCase()});

            if(!user) {
                ctx.throw(404, 'This email is not registered.')
            }

            let authenticated = await user.comparePassword(password)
            if(!authenticated) {
                ctx.throw(401, 'This password is not correct.');
            } else {
                // Sign token
                let token = await jwt.sign({id: user._id, role: user.role}, secret, {
                   expiresIn: '1d'
                });
                ctx.cookies.set('access_token', token, {
                    httpOnly: false
                });
                ctx.body = 'authentication done';
            }
        } catch(err) {
            throw err;
        }
    });

module.exports = router;