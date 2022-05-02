const res = require('express/lib/response');

publics = [
    {
        name: "primero"
    },
    {
        name: "segundo"
    }
]

module.exports = {
    getAllPublics : getAllPublics

}


function getAllPublics(req, res){

    return res.json(this.publics)

}

