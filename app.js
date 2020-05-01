require('./dependencies.js');
require('./middlewares/auth');

var propertyApi = require('./api/routes/property.js');

require('dotenv').config();

const cryptr = new Cryptr(process.env.dbpassword);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//CREATING EXPRESS-SESSION
app.use(require("express-session")({
    secret: "Hi there",
    resave: false,
    saveUninitialized: true
}));

app.use(function(req,res,next){
	res.locals.user=req.session.user;
	res.locals.url=req.url;
	next();
});



/* ---------------------------------------------UNDER PROGRESS------------------------------------------------------------------- */

const agentRoutes = require("./api/routes/agentRoutes");
const officeRoutes = require('./api/routes/officeRoutes');
//for routing request by agents and managers seperately
app.use('/agentUser', agentRoutes);
app.use('/agentUser/assets', express.static('./views/agent/assets'));

app.use('/officeUser', officeRoutes);
app.use('/officeUser/assets', express.static('./views/office/assets'));

/* ---------------------------------------------------------------------------------------------------------------- */

const connection = require('./mysqlConfig.js');

var local = axios.create({baseURL: 'http://localhost:3000'});
app.use('/api/property', propertyApi); 

app.use('/assets', express.static('./views/agent/assets'));
app.use('/uploads', express.static('./uploads'));

app.get('/', (req, res) => {
	res.redirect('/agentUser');
})

app.get('/auth', (req, res) => {
	res.render('./login.ejs');
});

app.post('/signin', (req, res) => {
	const userid = req.body.userid;
	const password = req.body.password;
	
	connection.query("select * from userauth where userid = ?", [userid], async (err, result, fields) => {
		if(err) {
			res.send("Internal Error...");
		} else {
			console.log(result);
			if(result.length > 0) {
				var decryptedString = cryptr.decrypt(result[0].password);
				if(password == decryptedString) {
					if(result[0].type == 'agent') {
						connection.query("select * from Agent where agent_id = ?", [userid], async (err, result2, fields) => {				
							req.session.user = { details: result2[0],
								type : 'agent',
								userid: userid
							}
							res.redirect('/properties');
						});
					} else {
						req.session.user = {
							type: 'manager',
							userid: userid
						}
						res.redirect('/properties');
					}
				}else {
					res.send("Error Authentication...");
				}
			} else {
				res.send("User ID does not exist");
			}
		}
	});
});

app.get('/addProperty', isLoggedIn, async(req, res) => {
	res.render('./agent/add-property.ejs')
})


//Add a Property
app.post('/addProperty', isLoggedIn, async(req, res) => {
	await local({
        method: 'post',
        url: '/api/property/addProperty', 
        data:{
			userid: req.session.userid,
            property: req.body.property
        }
    }).then(response => {
        if(response.status == 201) {
            res.redirect('/property/'+response.data.insertId);
        }
    }).catch(err => {
        res.redirect('/pageNotFound')
    })
})

//All Properties
app.get('/properties', isLoggedIn, async (req, res) => {
	//data variable for storing JSON response from the /api/property endpoint
	var jsonData;
	var locationData;
	
	//axios is used for fetching JSON response
	await local({
		method: "get",
		url: "/api/property/",
	}).then(responseData => jsonData = responseData.data);

	await local({
		method: "get",
		url: "/api/property/utils/getLocation",
	}).then(responseData => locationData = responseData.data);

	//Rendering properties.ejs with response JSON
	res.render('./agent/properties.ejs', {response:jsonData, location:locationData, sold: false});
});

//Property with ID
app.get('/property/:id', isLoggedIn, async (req, res) => {
	//data variable for storing JSON response from the /api/property endpoint
	var jsonData;
	
	//axios is used for fetching JSON response
	await local({
		method: "get",
		url: "/api/property/"+req.params.id,
	}).then(responseData => jsonData = responseData.data);

	//Rendering properties.ejs with response JSON
	res.render('./agent/property.ejs', {response:jsonData});
});

//Sold Properties
app.get('/sold', isLoggedIn, async (req, res) => {
	//data variable for storing JSON response from the /api/property endpoint
	var jsonData;
	
	//axios is used for fetching JSON response
	await local({
		method: "get",
		url: "/api/property/sold",
	}).then(responseData => jsonData = responseData.data);

	await local({
		method: "get",
		url: "/api/property/utils/getLocation",
	}).then(responseData => locationData = responseData.data);

	//Rendering properties.ejs with response JSON
	res.render('./agent/properties.ejs', {response:jsonData, location: locationData, sold:true});
});

//Sold Property with ID
app.get('/sold/:id', isLoggedIn, async (req, res) => {
	//data variable for storing JSON response from the /api/property endpoint
	var jsonData;
	
	//axios is used for fetching JSON response
	await local({
		method: "get",
		url: "/api/property/sold/"+req.params.id,
	}).then(responseData => jsonData = responseData.data);

	//Rendering properties.ejs with response JSON
	res.render('./agent/property.ejs', {response:jsonData});
});

var agentApi= require('./api/routes/profile_routes.js');
app.use('/api/profile', agentApi(connection));

//Add agents
app.get('/addAgents', isLoggedIn, async (req, res) => {
	res.render('./addAgent/addAgent.ejs');
});

app.post('/addAgent', isLoggedIn, async(req, res) => {
	var agent = req.body.agent;
	if(!agent.url) {
		agent.url = "https://www.w3schools.com/howto/img_avatar.png";		
	}

	connection.query("insert into `Agent`(`first_name`, `last_name`, `salary`, `commission`, `street_number`, `street_name`, `city`, `state`, `zip`, `email`, `account_number`, `aadhaar_number`, `joining_date`, `dob`, `agent_img`) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [agent.firstName, agent.lastName, agent.salary, agent.commission, agent.streetNumber, agent.streetName, agent.city, agent.state, agent.zip, agent.email, agent.accountNumber, agent.aadhaarNumber, new Date().toJSON().slice(0, 10), agent.dob, agent.url], async (err, result) => {
		if(err) {
			res.send(err);
		} else {
			await connection.query("insert into `Agent_Phone_Detail`(`agent_id`, `number`) values (?, ?)", [result.insertId, agent.phone], (err, result2) => {
				if(err) {
					console.log(err);
				} else {
					console.log("Phone number added!");
				}
			});
			res.redirect("/agent/"+result.insertId);
		}
	});
});

//Agent With ID
app.get('/agent/:id',isLoggedIn, async (req, res) => {
	//Function to change Date formate
	function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
      
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
      
        return [year, month, day].join('-');
      }
      
	//data variable for storing JSON response from the /api/profile_routes endpoint
	var jsonData;
   	var jsonSaleData;
    	var jsonMobile;
	
	//axios is used for fetching JSON response
	  	//loginID=[{login_ID:req.session.userid}];
		//Fetches Agent Data From Agent Table With ID 
	await local({
		method: "get",
		url: "/api/profile/agent/"+req.params.id,
	}).then(responseData => jsonData = responseData.data).catch(error => console.log(error));

	//Fetches Agent Sale details From Transaction Table With ID
	await local({
		method: "get",
		url: "/api/profile/agentsale/"+req.params.id,
	}).then(responseData => jsonSaleData = responseData.data).catch(error => console.log(error));
		
	//Fetches Agent Phone Numbers
    	await local({
			method: "get",
			url: "/api/profile/agentmobile/"+req.params.id,
    	}).then(responseData => jsonMobile = responseData.data).catch(error => console.log(error));
    
    
	if(jsonData[0].agent_id==0) {
	 	res.render('pageNotFound.ejs');
	}
	else{
		//Changes Date Formate
		jsonData[0].dob=formatDate(jsonData[0].dob);
    		jsonData[0].joining_date=formatDate(jsonData[0].joining_date);
		if(jsonSaleData) {
			jsonSaleData.forEach(function(element){
				element.date_of_sale = formatDate(element.date_of_sale);
			});
		}
	}

	//Rendering agentprofile.ejs with JSON Data
	res.render('./agent/agentprofile.ejs', {response0:jsonMobile,response:jsonData,response2:jsonSaleData});
    	
});
//Gets Present Values Of Agent details
app.get('/editagentprofile/:id',isLoggedIn, async (req,res) =>{
		
		//data variable for storing JSON response from the /api/property endpoint

		var jsonData;
		var jsonMobile;
		//Fetches Agent Details
		await local({
			method: "get",
			url: "/api/profile/agent/"+req.params.id,
		}).then(responseData => jsonData = responseData.data);

		//Fetches Agent Phone Numbers
    	await local({
			method: "get",
			url: "/api/profile/agentmobile/"+req.params.id,
    	}).then(responseData => jsonMobile = responseData.data).catch(error => console.log(error));
		
		res.render('./agent/editagentprofile.ejs',{response:jsonData,response1:jsonMobile});
});
app.get('/clients', isLoggedIn, async (req,res) =>{
	
	function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
      
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
      
        return [year, month, day].join('-');
      }
	var jsonData;

	await local({
		method: 'get',
		url: 'api/profile/clientlist'
	}).then(responseData => jsonData =responseData.data).catch(error => console.log(error));


	jsonData.forEach(function(element){
		element.dob=formatDate(element.dob);
	});

	res.render('./agent/clientlist.ejs',{response: jsonData});
});
app.post('/editagentprofile/:id',isLoggedIn, async (req,res) =>{
	
	
	await local({
		method: 'post',
		url: '/api/profile/editagentprofile/',
		data:{
			userid			: req.session.user.userid,
			first_name		: req.body.firstname,
			middle_name		: req.body.middlename,
			last_name		: req.body.lastname,
			street_number	: req.body.street_number,
			street_name		: req.body.street_name,
			zip				: req.body.zip,
			city			: req.body.cname,
			state			: req.body.statename,
			image			: req.body.imgaddress
		}
		
	}).then(response => {
		
		if(response.status == 201) {
            res.redirect('/agent/'+req.session.user.userid);
        }
	}).catch(err => {
		
        res.redirect('/pageNotFound');
    })
	
	
});

//Gets Client With ID
app.get('/client/:id',isLoggedIn, async (req, res) => {
	//Function to change Date formate
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
      
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
      
        return [year, month, day].join('-');
      }
      
	//data variable for storing JSON response from the /api/property endpoint
	var jsonData;
    var jsonSoldData;
	var jsonBoughtData;
   	var jsonOnRentData;
   	var jsonTenantData;
   	var jsonOnSaleData;
   	var jsonMobile;
	//axios is used for fetching JSON response
		  
		//Fetches Client Details with ID
		await local({
			method: "get",
			url: "/api/profile/client/"+req.params.id,
    	}).then(responseData => jsonData = responseData.data);
		
		//Fetches Properties Sold By Client with ID
    	await local({
			method: "get",
			url: "/api/profile/clientsold/"+req.params.id,
    	}).then(responseData => jsonSoldData = responseData.data);

		//Fetches Properties Bought By Client with ID
    	await local({
			method: "get",
			url: "/api/profile/clientbought/"+req.params.id,
    	}).then(responseData => jsonBoughtData = responseData.data);
		
		//Fetches Properties Given ON RENT By Client with ID
    	await local({
			method: "get",
			url: "/api/profile/clientonrent/"+req.params.id,
    	}).then(responseData => jsonOnRentData = responseData.data);
		
		//Fetches Properties Took On RENT By Client with ID
	    await local({
			method: "get",
			url: "/api/profile/clienttenant/"+req.params.id,
    	}).then(responseData => jsonTenantData = responseData.data);

		//Fetches Properties On Sale By Client with ID
	    await local({
			method: "get",
			url: "/api/profile/clientonsale/"+req.params.id,
    	}).then(responseData => jsonOnSaleData = responseData.data);

		//Fetches  Client Mobile Numbers with ID
	    await local({
			method: "get",
			url: "/api/profile/clientmobile/"+req.params.id,
    	}).then(responseData => jsonMobile = responseData.data);


	//Changes Date Format
    jsonData[0].dob=formatDate(jsonData[0].dob);
    jsonSoldData.forEach(function(element){
        element.date_of_sale=formatDate(element.date_of_sale);
    });
    jsonBoughtData.forEach(function(element){
        element.date_of_sale=formatDate(element.date_of_sale);
    });
    jsonOnRentData.forEach(function(element){
        element.date_of_sale=formatDate(element.date_of_sale);
    });
    jsonTenantData.forEach(function(element){
        element.date_of_sale=formatDate(element.date_of_sale);
    });
    jsonOnSaleData.forEach(function(element){
        element.date=formatDate(element.date);
    });
    
	//Rendering clientprofile.ejs with response JSON
	res.render('./agent/clientprofile.ejs', {response0:jsonMobile,response:jsonData,response2:jsonSoldData,response3:jsonBoughtData,response4:jsonOnRentData,response5:jsonTenantData,response6:jsonOnSaleData});
});

app.get('/logout', (req, res) => {
	req.session.user = null;
	req.logout();
	res.redirect('/auth')
});

app.get('*', (req, res) => {
	res.render('./pageNotFound.ejs')
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
