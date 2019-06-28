const User   = require('../models/User')
const bcrypt = require('bcryptjs')
const gravatar = require('../utils/gravatar')

module.exports = {
    signup: function (params) {
        return new Promise( (resolve, reject) => {
            User.findOne({ email: params.email })
                .then( user => {
                    if (user) {
                        let errors     = {}
                        errors.message = 'Email exists'
                        errors.status  = 400

                        reject(errors)
                    } else {
                        const newUser = new User

                        newUser.profile.name = params.name
                        newUser.password = params.password
                        newUser.email = params.email
                        newUser.profile.picture = gravatar(params.email)

                        bcrypt.genSalt(10, (error, salt) => {
                            if (salt) {
                                bcrypt.hash(newUser.password, salt, (error, hash) => {
                                    if (error) {
                                        reject(error)
                                    } else {
                                        newUser.password = hash

                                        newUser.save()
                                                .then(user => resolve(user))
                                                .catch( error => reject(error))
                                    }
                                })
                            } else {
                                reject(error)
                            }
                        })
                    }
                })
        } )
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