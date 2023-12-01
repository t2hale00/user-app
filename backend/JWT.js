const jwt = require('jsonwebtoken');
const { sign, verify } = require('jsonwebtoken');

const createTokens = (user) => {
    const accessToken = sign(
        { userId: user.userid, userEmail: user.email },
         "jwtsecretplschange", 
         );

    return accessToken;
    };

    const validateToken = (req, res, next) => {
        const accessToken = req.cookies["access-token"];
      
        if (!accessToken)
          return res.status(400).json({ error: "User not Authenticated!" });
      
        try {
          const validToken = verify(accessToken, "jwtsecretplschangethis");
          if (validToken) {
            //req.authenticated = true;
            req.user = validToken;
            return next();
          }
        } catch (err) {
          return res.status(400).json({ error: err });
        }
      };
      
      module.exports = { createTokens, validateToken };