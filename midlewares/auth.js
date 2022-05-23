const res = require('express/lib/response');
const TOKEN = '2E%[/QAfv-]u7uUttuC]d@MWnh]{rgVm?v}vcaZa%GA_uePj(pZ+-2&?Tpg_/gQEMRF4(?jt=pR_Fz&2T%@W[U{f4J6T32,h77#vtAq=cu;A8K_@t!dNhU&%j_uZSTEWy:DyTgq4f{$6=dRr+9F3%fK-gBaYyxt,H*ng,3Y$Q8*fHp{[*SZjk*a9*.(8##jy:4hqTehH}wvfpMptwv{XgE7L[{Q[g=CHpVX7k3hi#VcvKaia&+?f?6KVR;/(Sy:{:!aq6%$nv2N*)+&+566TNE(N)Z;bSM#:3Rq5rxQdwytB'
module.exports = {
    authFirebase : authFirebase,
}

function authFirebase(req, res, next){

    if(req.headers.token === TOKEN ){
        return next()
    }else{
        return res.status(400).send({ 
            error: 400, 
            msg: 'Token invalido' })
    }    
}
