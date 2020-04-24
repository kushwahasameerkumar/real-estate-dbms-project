isLoggedIn = (req,res,next) => {
    if(req.session.userid){
        return next();
    }
    res.render("pageNotFound.ejs");
};

module.exports = {};