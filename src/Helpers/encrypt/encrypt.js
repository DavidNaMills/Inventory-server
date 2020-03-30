const bcrypt = require('bcrypt-nodejs');

const encypt = async (pwd) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pwd, salt, null);

    return hash;
}

module.exports = encypt;