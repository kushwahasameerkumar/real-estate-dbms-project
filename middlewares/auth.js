isLoggedIn = (req,res,next) => {
    if(req.session.user){
        req.params.user_id = req.session.user.userid;
        return next();
    }
    res.render("pageNotFound.ejs");
};


//to restrict a user to access own contents only
// isLoggedInUser = (req, res, next) => {
//     if(req.session.user.userid == req.params.id){
//         return next();
//     }
//     res.render('pageNotFound.ejs');
// };

module.exports = {};