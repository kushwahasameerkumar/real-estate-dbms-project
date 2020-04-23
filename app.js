require('./dependencies.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/auth', (req, res) => {
	res.render('./login.ejs');
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
