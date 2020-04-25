const agentRoutes = require('./profile_routes');
module.exports = function (app,db){
    agentRoutes(app,db);
}