const User   = require('../models/User')
const bcrypt = require('bcryptjs')
const gravatar = require('../utils/gravatar')

module.exports = {
    signup: function (req, res, next) {
        let errorValidate = req.validationErrors()

        if (errorValidate){
            res.render('auth/signup', { error_msg: true, errorValidate, errors: []})

            return
        }
        
            User.findOne({ email: req.body.email })
                .then( user => {
                    if (user) {
                        req.flash('errors', 'E-mail already exists')
                        return res.redirect(301, '/api/users/signup')

                      
                    } else {
                        const newUser = new User

                        newUser.profile.name = req.body.name
                        newUser.password = req.body.password
                        newUser.email = req.body.email
                        newUser.profile.picture = gravatar(req.body.email)

                        bcrypt.genSalt(10, (error, salt) => {
                            if (salt) {
                                bcrypt.hash(newUser.password, salt, (error, hash) => {
                                    
                                        if(error) throw error
                                
                                        newUser.password = hash

                                        newUser.save()
                                                .then(user => {
                                                    req.logIn(user, (error) =>{ 
                                                    if(error) {
                                                        res.status(400).json({
                                                            confirmation: false, 
                                                            message: error
                                                        })
                                                    }else {
                                                        next()
                                                    }
                                                })
                                                })
                                                .catch( error => {
                                                    req.flash('errors', error)
                                                    return res.redirect(301, '/api/users/signup')
                                                })
                                    
                                })
                            } else {
                               throw error
                            }
                        })
                    }
                }
        )
    },
    updateProfile: function (params, id) {
        return new Promise((resolve, reject) => {
            User.findOne({ _id: id })
                .then(user => {
                    if (params.name) user.profile.name = params.name
                    if (params.address)   user.address = params.address
                    if (params.email)       user.email = params.email

                    if (params.password) {
                        bcrypt.genSalt(10, (error, salt) => {
                            bcrypt.hash(params.password, salt, (error, hash) => {
                                if (error) {
                                    let errors = {}
                                    errors.message = error
                                    error.status   = 400

                                    reject(errors)
                                } else {
                                    user.password = hash

                                    user.save()
                                        .then(user => {
                                            resolve(user)
                                        })
                                        .catch(error =>{
                                            let errors = {}
                                            errors.message = error
                                            errors.status  = 400

                                            reject(errors)
                                        })
                                }
                            })
                        })
                    } else {
                        user.save()
                            .then(user => {
                                resolve(user)
                            })
                            .catch(error =>{
                                let errors = {}
                                errors.message = error
                                errors.status  = 400

                                reject(errors)
                            })
                    }
                })
        })
    }
}