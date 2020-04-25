isLoggedIn = (req,res,next) => {
    if(req.session.user){
        return next();
    }
    res.render("pageNotFound.ejs");
};

module.exports = {};