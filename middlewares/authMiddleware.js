const jwt = require("jsonwebtoken");
const secret= 'PFE';

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    console.log(token);
    jwt.verify(token, secret , (err, decoded) => {
      console.log(jwt,'jjjj');
      console.log(err,'err');
      if (err) {
        return res.status(401).send({
          message: "Token invalide",
          success: false,
        });
       
      }
     
        console.log(decoded,"decoded");
        req.body.id= decoded.id;
        next();

    });
  } catch (error) {
    return res.status(401).send({
      message: "Échec de l'authentification",
      success: false,
    });
  }
};
