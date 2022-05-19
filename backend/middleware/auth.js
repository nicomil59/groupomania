// Imports

const jwt = require('jsonwebtoken');

// Vérification de l'authentification avant envoi de la requête

module.exports = (req, res, next) => {
    try {

        // Récupération de l'userId depuis le token décodé

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const userId = decodedToken.userId;
        console.log('delta BACK', decodedToken.exp*1000 - Date.now());

        // Enregistrement de l'userId dans l'objet de requête

        req.auth = { userId };

        // Vérification de la correspondance du userId du token avec l'userId de la requête

        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valide !';
        } else {
            next();
        }
    } catch (error) {

        console.log('error auth', error.message);
        let isTokenExpired = error.message === 'jwt expired';
        // if(error.message === 'jwt expired') {
        //     messageToSend = "Echec d'authentification : token expiré";
        // } else {
        //     messageToSend = "Echec d'authentification";
        // }

        res.status(401).json({
            message: "Echec d'authentification",
            isTokenExpired: isTokenExpired,
            error: error
        });
    }
};