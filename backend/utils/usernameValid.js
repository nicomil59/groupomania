// Création de la fonction de la validité du username

const usernameValid = username => {
    
    if (/^[A-Za-z][A-Za-z0-9]{2,29}$/.test(username)) {
        return true;
    } else {
        return false;
    }
}

// Exports

module.exports = usernameValid;