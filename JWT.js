const { sign, verify } = require('jsonwebtoken');

const createTokens = (user) => {
    const accessToken = sign(
        { userId: user.id, userEmail: user.email },
         "jwtsecretplschange", 
         );

    return accessToken;
    };

    module.exports = { createTokens };