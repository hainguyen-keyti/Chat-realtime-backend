const config = require('../../../../config');
const lib_password = require(config.library_dir + '/password');
const response_express = require(config.library_dir + '/response').response_express;
const User = require(config.models_dir + '/mongo/user');
const lib_common = require(config.library_dir+'/common');

module.exports = (req, res) => {
    let miss = lib_common.checkMissParams(res, req.body, ["user"])
    if (miss){
        console.log("Miss param at Create");
        return;
    }
    let missField = lib_common.checkMissParams(res, req.body.user, ["username", "password", "phone", "full_name", "genre"])
    if (missField){
        console.log("Miss param at Create Field");
        return;
    } 

    lib_password.cryptPassword(req.body.user.password)
    .then(passwordHash => {

        req.body.user.password_hash = passwordHash;
        delete req.body.user.password;
        return User.create(req.body.user);
    })
    .then(() => {
        console.log("create successful")
        response_express.success(res);
    })
    .catch(err => {
        console.log("create fail" + err)
        response_express.exception(res, err);
    })
} 