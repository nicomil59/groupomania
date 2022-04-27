const fs = require('fs');
const db = require('../models');

// ********** Création d'un POST **********
// ****************************************

exports.createPost = (req, res, next) => {

    console.log('req file', req.file);
    console.log('req auth', req.auth.userId);

    // Vérification si le contenu du message est vide

    const content = req.file === undefined ? req.body.content : JSON.parse(req.body.post).content;

    if (content === '' || content === null) {
        return res.status(400).json({
            message: "Le contenu du message ne peut être vide"
        });
    }
    
    // Vérification présence image dans la requête

    let postObj;

    if (req.file) {

        postObj = {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        };

        console.log("postObj", postObj);
        
    } else {
        postObj = { ...req.body, imageUrl: null };
        console.log("postObj", postObj);
    }
  
    // Enregistrement du post dans la BD
  
    db.Post.create({
        UserId: req.auth.userId,
        content: postObj.content,
        link: postObj.link,
        imageUrl: postObj.imageUrl
     })
     .then(() => res.status(201).json({
         message: 'Post créé avec succès !'
     }))
     .catch(error => {
        
        console.log(error)

         res.status(400).json({
            message: error.message
     }
     )});
  };

// ********** Récupération de tous les POSTS **********
// ****************************************************

exports.getAllPosts = (req, res, next) => {
    
    db.Post.findAll({
        order: [['createdAt', 'DESC'],],
        attributes: ['id', 'content', 'imageUrl', 'link', 'createdAt'],
        include: [
            {
                model: db.User,
                attributes: ['id', 'username', 'avatar']
            }
        ]
    })
    .then(posts => {
        if(posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ error: 'Aucun post publié !' });
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
        attributes: ['id', 'content', 'imageUrl', 'link', 'createdAt'],
        include: [
            {
                model: db.User,
                attributes: ['id', 'username', 'avatar']
            }
        ]
    })
    .then(post => {
        // Vérification de l'existence du post

        if (post === null) {
            return res.status(401).json({
                message: 'Post non trouvé !'
            });
        }
        res.status(200).json(post);
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
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
        attributes: ['id', 'userId', 'content', 'imageUrl', 'link', 'createdAt']
    })
    .then(posts => {
        
        // Vérification de l'existence de posts
        if (posts === null) {
            return res.status(401).json({
                message: 'Aucun post publié !'
            });
        }
        res.status(200).json(posts);
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
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
            return res.status(401).json({
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
                    console.log('filename image à supprimer', filename);
            
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
    
    console.log("req file", req.file);
    console.log("req.body", req.body);

    // Vérification si le contenu du message est vide

    const content = req.file === undefined ? req.body.content : JSON.parse(req.body.post).content;

    if (content === '' || content === null) {
        return res.status(400).json({
            message: "Le contenu du message ne peut être vide"
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
            return res.status(401).json({
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

        if(post.imageUrl !== null) {
                
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
            
            postObj = {
                ...JSON.parse(req.body.post),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            };

        } else {

            // Traitement de l'objet sans image

            postObj = { 
                content: req.body.content,
                link: req.body.link,
                imageUrl: null
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
