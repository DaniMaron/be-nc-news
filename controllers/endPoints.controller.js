const fetchEndpoints = require("../models/endPoints.model");


 function getEndpoints(req,res,next) {
     return fetchEndpoints()
         .then((endpoints) => {
             res.status(200).send(endpoints)
         })
     .catch(next)
}

module.exports = getEndpoints