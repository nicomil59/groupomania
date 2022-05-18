const db = require('../models');

// ********** Gestion du LIKE d'un post **********
// ***********************************************

exports.like = (req, res, next) => {

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

        // Vérification si l'utilisateur like ou pas le post

        db.Like.findOne({
            where: {
                userId: req.auth.userId,
                postId: post.id
            }
        })
        .then(likeFound => {

            if (likeFound === null) {

                // Ajout d'un like

                db.Like.create({
                    userId: req.auth.userId,
                    postId: post.id
                })
                .then(() => res.status(201).json({
                    message: 'Like bien ajouté !'
                }))
                .catch(error => {
                    res.status(400).json({
                        message: error.message
                    })
                });

            } else {

                // Suppression d'un like
    
                db.Like.destroy({
                    where: {
                        userId: req.auth.userId,
                        postId: post.id
                    }
                })
                .then(() => res.status(200).json({
                    message: `Like supprimé !`
                }))
                .catch(error => res.status(400).json({
                    message: error.message
                }));
            }

        })
        .catch(error => {
            res.status(404).json({
                message: error.message,
                error
            })
        });
        
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

};



