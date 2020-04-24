require('./dependencies.js');
require('./middlewares/auth.js');

var propertyApi = require('./api/routes/property.js');

require('dotenv').config();

const cryptr = new Cryptr(process.env.dbpassword);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//CREATING EXPRESS-SESSION
app.use(require("express-session")({
    secret: "Hi there",
    resave: false,
    saveUninitialized: false
}));

app.use(function(req,res,next){
	res.locals.currentUser=req.session.userid;
	res.locals.url=req.url;
	next();
});

const connection = require('./mysqlConfig.js');

var local = axios.create({baseURL: 'http://localhost:3000'});
app.use('/api/property', propertyApi); 

app.get('/', (req, res) => {
	res.redirect('/auth');
})

app.get('/auth', (req, res) => {
	res.render('./login.ejs');
});

app.post('/signin', (req, res) => {
	const userid = req.body.userid;
	const password = req.body.password;

	connection.query("select * from userauth where userid = ?", [userid], (err, result, fields) => {
		if(err) {
			res.send("Internal Error...");
		} else {
			if(result.length > 0) {
				var decryptedString = cryptr.decrypt(result[0].password);
				if(password == decryptedString) {
					req.session.userid = userid;
					res.redirect('/properties');
				}else {
					res.send("Error Authentication...");
				}
			} else {
				res.send("User ID does not exist");
			}
		}
	});
});

app.get('/properties', isLoggedIn, async (req, res) => {
	//data variable for storing JSON response from the /api/property endpoint
	var jsonData;
	
	//axios is used for fetching JSON response
	await local({
		method: "get",
		url: "/api/property/",
	}).then(responseData => jsonData = responseData.data);

	//Rendering properties.ejs with response JSON
	res.render('./agent/properties.ejs', {response:jsonData});
});

app.get('/logout', (req, res) => {
	req.session.userid = null;
	req.logout();
	res.redirect('/auth')
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
