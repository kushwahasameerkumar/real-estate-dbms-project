require('./dependencies.js');
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

const connection = require('./mysqlConfig.js');

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
					res.send("Logged In");
				}else {
					res.send("Error Authentication...");
				}
			} else {
				res.send("User ID does not exist");
			}
		}
	});
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
