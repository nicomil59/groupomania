const fs = require('fs');
const db = require('../models');

// ********** Création d'un POST **********
// ****************************************

exports.createPost = (req, res, next) => {

    // Vérification présence image dans la requête

    let postObj;

    if (req.file) {

        const content = JSON.parse(req.body.post).content.trim();

        // Validation du contenu du message quand il y a une image

        if (content !== '' && content.length < 2) {
            return res.status(400).json({
                message: "Le message doit contenir au moins deux caractères"
            });
        }

        postObj = {
            content: content,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        };

    } else {
        
        const content = req.body.content.trim();

        // Validation du contenu du message quand il n'y a pas d'image
        
        if (content.length < 2) {
            return res.status(400).json({
                message: "Le message doit contenir au moins deux caractères"
            });
        }

        postObj = { content: content, imageUrl: null };
    }
  
    // Enregistrement du post dans la BD
  
    db.Post.create({
        userId: req.auth.userId,
        content: postObj.content,
        imageUrl: postObj.imageUrl
    })
    .then(() => res.status(201).json({
        message: 'Post créé avec succès !'
    }))
    .catch(error => {
        res.status(400).json({
            message: error.message
        })
    });
  };

// ********** Récupération de tous les POSTS **********
// ****************************************************

exports.getAllPosts = (req, res, next) => {
    
    db.Post.findAll({
        order: [['createdAt', 'DESC'],],
        attributes: ['id', 'content', 'imageUrl', 'createdAt', 'updatedAt'],
        include: [
            {
                model: db.User,
                attributes: ['id', 'username', 'avatar']
            },
            {
                model: db.Comment,
                attributes: ['id', 'content', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username', 'avatar']
                    }
                ]
            },
            {
                model: db.Like,
                attributes: ['id', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username']
                    }
                ]
            }
        ]
    })
    .then(posts => {
        if(posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ message: 'Aucun post publié !' });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: error.message
        });
    });

};

// ********** Récupération d'un POST  **********
// *********************************************

exports.getOnePost = (req, res, next) => {
    
    db.Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'content', 'imageUrl', 'createdAt', 'updatedAt'],
        include: [
            {
                model: db.User,
                attributes: ['id', 'username', 'avatar']
            },
            {
                model: db.Comment,
                attributes: ['id', 'content'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username', 'avatar']
                    }
                ]
            },
            {
                model: db.Like,
                attributes: ['id', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username']
                    }
                ]
            }
        ]
    })
    .then(post => {
        // Vérification de l'existence du post

        if (post === null) {
            return res.status(404).json({
                message: 'Post non trouvé !'
            });
        }
        res.status(200).json(post);
    })
    .catch(error => {
        res.status(500).json({
            message: error.message
        });
    });

};

// ********** Récupération des POSTS de l'utilisateur  **********
// **************************************************************

exports.getMyPosts = (req, res, next) => {
    
    db.Post.findAll({
        where: {
            userId: req.auth.userId
        },
        order: [['createdAt', 'DESC'],],
        attributes: ['id', 'content', 'imageUrl', 'createdAt', 'updatedAt'],
        include: [
            {
                model: db.User,
                attributes: ['id', 'username', 'avatar']
            },
            {
                model: db.Comment,
                attributes: ['id', 'content', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username', 'avatar']
                    }
                ]
            },
            {
                model: db.Like,
                attributes: ['id', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username']
                    }
                ]
            }
        ]
    })
    .then(posts => {
        if(posts.length > 0) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ message: 'Aucun post publié !', posts });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: error.message
        });
    });

};

// ********** Suppression d'un POST  ***********
// *********************************************

exports.deletePost = (req, res, next) => {
    
    db.Post.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(post => {

        // Vérification de l'existence du post

        if (post === null) {
            return res.status(404).json({
                message: 'Post non trouvé !'
            });
        }

        // Vérification si utilisateur = créateur du post ou admin

        db.User.findOne({
            where: {
                id: req.auth.userId
            }
        })
        .then(user => { 
            
            if (req.auth.userId === post.userId || user.isAdmin ) {

                // Suppression de l'image du dossier images (si image présente)

                if(post.imageUrl !== null) {
                    const filename = post.imageUrl.split('/images/')[1];
            
                    fs.unlink(`images/${filename}`, error => {
                        if (error) throw error;
                        console.log('Image du post effacée !');
                    });
                }

                // Suppression du post de la BD

                db.Post.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(() => res.status(200).json({
                    message: `Post supprimé !`
                }))
                .catch(error => res.status(400).json({
                    error,
                    message: error.message
                }));

            } else {
                return res.status(403).json({
                    message: 'Requête non autorisée !'
                });
            }

        })
        .catch(error => {
            res.status(400).json({
                message: error.message
            });
        });
        
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

 };

 // ********** Modification d'un POST  ***********
// ***********************************************

exports.updatePost = (req, res, next) => {
    
    // Validation du contenu du message

    const content = req.file === undefined ? req.body.content.trim() : JSON.parse(req.body.post).content.trim();

    // 2 cas de figure
    // cas 1 : image dans le post ET longueur message = 1 caractère (0 est autorisé)
    // cas 2 : pas d'image dans le post ET longueur message inférieure à 2 caractères

    if (((req.file || req.body.keepPreviousImg) && content.length === 1) || (!req.file && !req.body.keepPreviousImg && content.length < 2)) {
        return res.status(400).json({
            message: "Le message doit contenir au moins deux caractères"
        });
    }
    
    db.Post.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(post => {

        // Vérification de l'existence du post

        if (post === null) {
            return res.status(404).json({
                message: 'Post non trouvé !'
            });
        }

        // Vérification si utilisateur = créateur du post

        if (req.auth.userId !== post.userId) {
            return res.status(403).json({
                message: 'Requête non autorisée !'
            });
        }

        // Suppression de l'ancienne image du dossier images si elle existe
        
        // Condition = il y avait déjà une image ET (on a une nouvelle image uploadée ou on souhaite supprimer l'image)
        
        const deleteImg = req.body.deleteImg;
        
        if((post.imageUrl !== null) && (req.file ||  deleteImg)) {
                
            const filename = post.imageUrl.split('/images/')[1];

            fs.unlink(`images/${filename}`, error => {
                if (error) throw error;
                console.log('Ancienne image du post effacée !');
            });
        }
        
        // Vérification présence image dans la requête

        let postObj;

        if (req.file) {

            // Traitement de l'objet avec nouvelle image

            const content = JSON.parse(req.body.post).content.trim();
            
            postObj = {
                content: content,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            };

        } else {
            
            // Traitement de l'objet sans image uploadée
            
            const content = req.body.content.trim();

            const imageUrl = deleteImg ? null : post.imageUrl;

            postObj = { 
                content: content,
                imageUrl: imageUrl
            };

        }

        // Mise à jour du post dans la BD

        db.Post.update({
            ...postObj
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(() => res.status(200).json({
            message: 'Post mis à jour !',
            updatedData: postObj
        }))
        .catch(error => {
            res.status(400).json({
                message: error.message,
                error: error
        }
        )});
        
        
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

 };
