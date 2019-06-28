let LocalStrategy = require('passport-local')
let User = require('../../routes/users/models/User')
let bcrypt = require('bcryptjs')

/**
 * Visual flow
 * 
passport.serializeUser(function(user, done) {
    done(null, user.id);
});              │
                 │ 
                 │
                 └─────────────────┬──→ saved to session
                                   │    req.session.passport.user = {id: '..'}
                                   │
                                   ↓           
passport.deserializeUser(function(id, done) {
                   ┌───────────────┘
                   │
                   ↓ 
    User.findById(id, function(err, user) {
        done(err, user);
    });            └──────────────→ user object attaches to the request as req.user   
});
 */

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user._id)
    })

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (error, user) {
            done(error, user)
        })
    })

    passport.use('local-login', 
                new LocalStrategy({
                    usernameField: 'email',
                    passwordField: 'password',
                    passReqToCallback: true,
                }, function (req, email, password, done) {
                    User.findOne({ email: email }, function (error, user) {
                        if (error) return done(error, null)

                        if (!user) {
                            return done(null, false, req.flash('loginMessage', 'User not exists!'))
                        }
                        
                        bcrypt.compare(password, user.password)
                            .then( (result) => {
                                if (!result) {
                                    return done(null, false, req.flash('loginMessage', 'Check email or password'))
                                } else {
                                    return done(null, user)
                                }
                            } )
                            .catch( error => {
                                throw error
                            } )
                    })
                }))
}