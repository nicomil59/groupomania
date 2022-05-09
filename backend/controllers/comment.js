const db = require('../models');

// ********** Création d'un COMMENTAIRE **********
// ***********************************************

exports.createComment = (req, res, next) => {

    console.log('req auth', req.auth.userId);
    console.log('req body', req.body);
    console.log('req.params.id', req.params.id);

    if (req.body.content.length < 2) {
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
            return res.status(401).json({
                message: 'Post non trouvé !'
            });
        }

        // Enregistrement du post dans la BD

        db.Comment.create({
            userId: req.auth.userId,
            postId: post.id,
            content: req.body.content
        })
        .then(() => res.status(201).json({
            message: 'Commentaire bien ajouté !'
        }))
        .catch(error => {

            console.log(error)

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





// ********** Suppression d'un COMMENTAIRE **********
// **************************************************