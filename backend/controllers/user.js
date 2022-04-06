// Imports

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const db = require('../models');
const isEmailValid = require('../utils/emailValid');
const {
    isPasswordValid,
    validationMessages
} = require('../utils/passwordValid');
const isUsernameValid = require('../utils/usernameValid');

require('dotenv').config();

// const usertest = "8jane";
// console.log("test username", isUsernameValid(usertest));

// ********** Gestion de la création d'un nouvel utilisateur **********
// ********************************************************************

exports.signup = (req, res) => {

    console.log("requete :", req.body.username);

    // Vérification de la validité du pseudo

    if (!isUsernameValid(req.body.username)) {
        return res.status(400).json({
            message: "Pseudo non valide : doit commencer par une lettre et contenir entre 8 et 30 caractètres alphanumériques"
        });
    }

    // Vérification de la validité de l'email

    if (!isEmailValid(req.body.email)) {
        return res.status(400).json({
            message: 'adresse email non valide !'
        });
    }

    // Vérification de la validité du mot de passe

    if (!isPasswordValid(req.body.password)) {

        return res.status(400).json({
            message: validationMessages(req.body.password)
        });
    }

    // Chiffrement de l'email

    const emailEncrypted = CryptoJS.HmacSHA256(req.body.email, process.env.CRYPTOJS_KEY).toString();

    // Hachage du mot de passe avant enregistrement du nouvel utilisateur dans la BD

    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            db.User.create({
                    username: req.body.username,
                    email: emailEncrypted,
                    password: hash
                })
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch(error => res.status(400).json({
                    message: error.message
                }));

        })
        .catch(error => res.status(500).json({
            message: error.message
        }));

};

// ********** Gestion de la connexion d'un utilisateur **********
// **************************************************************

exports.signin = (req, res, next) => {

    // Chiffrement de l'email

    const emailEncrypted = CryptoJS.HmacSHA256(req.body.email, process.env.CRYPTOJS_KEY).toString();
    console.log(emailEncrypted);

    // Récupération de l'email chiffré dans la BD

    db.User.findOne({
            where: {
                email: emailEncrypted
            }
        })
        .then(user => {

            // Vérification de l'existence de l'utilisateur

            if (user === null) {
                return res.status(401).json({
                    message: 'Utilisateur non trouvé !'
                });
            }

            // Comparaison du mot de passe entré par utilisateur avec mot de passe hashé dans la BD

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            message: 'Mot de passe incorrect !'
                        });
                    }
                    // Renvoi du token encodé contenant le userId
                    res.status(200).json({
                        user: user,
                        token: jwt.sign({
                                userId: user.id
                            },
                            process.env.TOKEN_SECRET_KEY, {
                                expiresIn: '24h'
                            }
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    message: error.message
                }));

        })
        .catch(error => res.status(500).json({
            message: error.message
        }));
};

// ********** Visualition du profil d'un utilisateur **********
// ********************************************************************

exports.getUser = (req, res, next) => {

    // Récupération dans la BD des infos de l'utilisateur qui correspond à l'id dans la requête

    db.User.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'username', 'email', 'bio', 'avatar']
        })
        .then(user => {

            // Vérification de l'existence de l'utilisateur

            if (user === null) {
                return res.status(401).json({
                    message: 'Utilisateur non trouvé !'
                });
            }

            // Vérification de l'autorisation de l'utilisateur

            console.log("req.auth.userId", req.auth.userId);

            if (req.auth.userId !== user.id) {
                return res.status(403).json({
                    message: 'Requête non autorisée !'
                });
            }

            res.status(200).json(user);
        })
        .catch(error => {
            res.status(404).json({
                message: error.message
            });
        });
};

// ********** Modification du mot de passe **********
// ********************************************************************

exports.updatePwdUser = (req, res, next) => {

    // Récupération dans la BD des infos de l'utilisateur qui correspond à l'id dans la requête

    db.User.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(user => {

            // Vérification de l'existence de l'utilisateur

            if (user === null) {
                return res.status(401).json({
                    message: 'Utilisateur non trouvé !'
                });
            }

            // Vérification de l'autorisation de l'utilisateur

            console.log("req.auth.userId", req.auth.userId);

            if (req.auth.userId !== user.id) {
                return res.status(403).json({
                    message: 'Requête non autorisée !'
                });
            }

            console.log("nouveau password", req.body.password);

            // Hachage du nouveau mot de passe avant enregistrement dans la BD

            bcrypt.hash(req.body.password, 10)
                .then(hash => {

                    db.User.update({
                            password: hash
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                        .then(() => res.status(200).json({
                            message: 'Mise à jour du mot de passe effectuée !'
                        }))
                        .catch(error => res.status(400).json({
                            message: error.message
                        }));

                })
                .catch(error => res.status(500).json({
                    message: error.message
                }));

        })
        .catch(error => {
            res.status(404).json({
                message: error.message
            });
        });
};

// ********** Suppression d'un utilisateur **********
// **************************************************

exports.deleteUser = (req, res, next) => {

    db.User.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(user => {

            // Vérification de l'existence de l'utilisateur

            if (user === null) {
                return res.status(401).json({
                    message: 'Utilisateur non trouvé !'
                });
            }

            // Vérification de l'autorisation de l'utilisateur

            console.log("req.auth.userId", req.auth.userId);

            if (req.auth.userId !== user.id) {
                return res.status(403).json({
                    message: 'Requête non autorisée !'
                });
            }

            db.User.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(() => res.status(200).json({
                    message: `Compte de ${user.username} supprimé !`
                }))
                .catch(error => res.status(400).json({
                    message: error.message
                }));


        })
        .catch(error => {
            res.status(400).json({
                message: error.message
            });
        });

};