const db = require('../models');

// ********** Création d'un COMMENTAIRE **********
// ***********************************************

exports.createComment = (req, res, next) => {

    if (req.body.content.trim().length < 2) {
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

        // Enregistrement du commentaire dans la BD

        db.Comment.create({
            userId: req.auth.userId,
            postId: post.id,
            content: req.body.content
        })
        .then(() => res.status(201).json({
            message: 'Commentaire bien ajouté !'
        }))
        .catch(error => {
            res.status(400).json({
                message: error.message
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


// ********** Mise à jour d'un COMMENTAIRE **********
// **************************************************

exports.updateComment = (req, res, next) => {

    if (req.body.content.trim().length < 2) {
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

        db.Comment.findOne({
            where: {
                id: req.params.commentId
            }
        }).then(comment => {

            // Vérification de l'existence du commentaire

            if (comment === null) {
                return res.status(404).json({
                    message: 'Commentaire non trouvé !'
                });
            }

            // Vérification si utilisateur = créateur du commentaire

            if (req.auth.userId !== comment.userId) {
                return res.status(403).json({
                    message: "Requête non autorisée ! Vous n'avez pas le droit de modifier le commentaire !"
                });
            }

            // Mise à jour du commentaire dans la BD

            db.Comment.update({
                content: req.body.content
            }, {
                where: {
                    id: req.params.commentId
                }
            })
            .then(() => res.status(200).json({
                message: 'Commentaire mis à jour !'
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
        
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

};


// ********** Suppression d'un COMMENTAIRE **********
// **************************************************

exports.deleteComment = (req, res, next) => {

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

        db.Comment.findOne({
            where: {
                id: req.params.commentId
            }
        }).then(comment => {

            // Vérification de l'existence du commentaire

            if (comment === null) {
                return res.status(404).json({
                    message: 'Commentaire non trouvé !'
                });
            }

            // Vérification si utilisateur = créateur du commentaire ou admin

            db.User.findOne({
                where: {
                    id: req.auth.userId
                }
            }).then(user => {

                if (req.auth.userId === comment.userId || user.isAdmin ) {

                    // Suppression du commentaire de la BD
    
                    db.Comment.destroy({
                        where: {
                            id: req.params.commentId
                        }
                    })
                    .then(() => res.status(200).json({
                        message: `Commentaire supprimé !`
                    }))
                    .catch(error => res.status(400).json({
                        message: error.message
                    }));
    
                } else {
                    return res.status(403).json({
                        message: "Requête non autorisée ! Vous n'avez pas le droit de supprimer le commentaire"
                    });
                }

            })
            .catch(error => {
                res.status(404).json({
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
        
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

};
