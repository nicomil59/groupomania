// Imports

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../models');
const isEmailValid = require('../utils/emailValid');
const { isPasswordValid, validationMessages } = require('../utils/passwordValid');
const isUsernameValid = require('../utils/usernameValid');
const { encrypt, decrypt } = require('../utils/emailCrypto');

require('dotenv').config();


// ********** Gestion de la création d'un nouvel utilisateur **********
// ********************************************************************

exports.signup = (req, res) => {

    // Vérification de la validité du pseudo

    if (!isUsernameValid(req.body.username)) {
        return res.status(400).json({
            message: "Pseudo non valide : doit commencer par une lettre et contenir entre 3 et 30 caractères alphanumériques"
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

    // Cryptage de l'email

    const emailEncrypted = encrypt(req.body.email);

    // Hachage du mot de passe avant enregistrement du nouvel utilisateur dans la BD

    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            db.User.create({
                    username: req.body.username,
                    email: emailEncrypted,
                    password: hash,
                    avatar: `${req.protocol}://${req.get('host')}/images/default-avatar.png`
                })
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch(error => {
                    
                    const errorMessage = error.errors[0].message;

                    res.status(400).json({
                        message: errorMessage
                }
                )});

        })
        .catch(error => {
            res.status(500).json({
            message: error.message
        })});

};

// ********** Gestion de la connexion d'un utilisateur **********
// **************************************************************

exports.signin = (req, res, next) => {

    // Récupération du pseudo dans la BD

    db.User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(user => {

            // Vérification de l'existence de l'utilisateur

            if (user === null) {
                return res.status(401).json({
                    message: 'Utilisateur non trouvé !'
                });
            }

            // Comparaison du mot de passe entré par l'utilisateur avec mot de passe hashé dans la BD

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            message: 'Mot de passe incorrect !'
                        });
                    }
                    // Renvoi du token encodé contenant le userId
                    res.status(200).json({
                        userId: user.id,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            bio: user.bio,
                            avatar: user.avatar,
                            isAdmin: user.isAdmin
                        },
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
// ************************************************************

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

            if (req.auth.userId !== user.id) {
                return res.status(403).json({
                    message: 'Requête non autorisée !'
                });
            }

            // Décryptage de l'email de la BD
            const emailDecrypted = decrypt(user.email);

            // Objet avec les données à renvoyer

            const userData = {
                id: user.id,
                username: user.username,
                email: emailDecrypted,
                bio: user.bio,
                avatar: user.avatar
            };

            res.status(200).json(userData);
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

    console.log(req.body)
    
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

            if (req.auth.userId !== user.id) {
                return res.status(403).json({
                    message: 'Requête non autorisée !'
                });
            }

            // Vérification de la validité du nouveau mot de passe

            if (!isPasswordValid(req.body.newPassword)) {

                return res.status(400).json({
                    message: validationMessages(req.body.newPassword)
                });
            }

            // Comparaison current password et password de BD

            bcrypt.compare(req.body.currentPassword, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            message: 'Mot de passe actuel incorrect !'
                        });
                    }

                    // Hachage du nouveau mot de passe avant enregistrement dans la BD

                    bcrypt.hash(req.body.newPassword, 10)
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

            if (req.auth.userId !== user.id) {
                return res.status(403).json({
                    message: 'Requête non autorisée !'
                });
            }

            const filename = user.avatar.split('/images/')[1];
            console.log('filename image à supprimer', filename);

            if (filename !== 'default-avatar.png') {

                // Suppression de l'image du dossier images
                
                fs.unlink(`images/${filename}`, error => {
                    if (error) throw error;
                    console.log('Image de profil effacée !');
                });

            }

            db.User.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(() => res.status(200).json({
                    message: `Compte supprimé !`
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

// ********** Mise à jour du profil **********
// *******************************************

exports.updateUser = (req, res, next) => {

    // Vérification longueur bio
    
    const bio = req.file === undefined ? req.body.bio : JSON.parse(req.body.user).bio;

    if(bio.length > 255) {
        return res.status(400).json({
            message: 'Bio trop longue ! 255 caractères maximum !'
        });
    }
    
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

            if (req.auth.userId !== user.id) {
                return res.status(403).json({
                    message: 'Requête non autorisée !'
                });
            }

            // Vérification présence image dans la requête

            let userObj;

            if (req.file) {

                // Vérification de la validité du pseudo

                if (!isUsernameValid(req.body.user.username)) {
                    return res.status(400).json({
                        message: "Pseudo non valide : doit commencer par une lettre et contenir entre 3 et 30 caractères alphanumériques"
                    });
                }

                const filename = user.avatar.split('/images/')[1];

                if (filename !== 'default-avatar.png') {

                    // Suppression de l'ancienne image du dossier images
                    
                    fs.unlink(`images/${filename}`, error => {
                        if (error) throw error;
                        console.log('Ancienne image de profil effacée !');
                    });

                }

                // Traitement de l'objet avec nouvelle image

                userObj = {
                    ...JSON.parse(req.body.user),
                    avatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                };

            } else {

                // Vérification de la validité du pseudo

                if (!isUsernameValid(req.body.username)) {
                    return res.status(400).json({
                        message: "Pseudo non valide : doit commencer par une lettre et contenir entre 3 et 30 caractères alphanumériques"
                    });
                }
                
                // Récupération des données sans chargement d'image

                userObj = { ...req.body };

            }

            // Mise à jour du profil de l'utilisateur

            db.User.update({
                ...userObj
            }, {
                where: {
                    id: req.params.id
                }
            })
            .then(() => res.status(200).json({
                message: 'Profil mis à jour !',
                updatedData: userObj
            }))
            .catch(error => {
                    
                const errorMessage = error.errors[0].message;

                res.status(400).json({
                    message: errorMessage,
                    error: error
            }
            )});

        })
        .catch(error => {
            res.status(404).json({
                message: error.message
            });
        });
};