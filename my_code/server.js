const express = require ('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app= express();
const port =8000;
const axios = require("axios");
var local = axios.create({baseURL: 'http://localhost:8000'});
app.use(bodyParser.urlencoded({extended:false}));

const connection = mysql.createConnection({
    host:'remotemysql.com',
    port: 3306,
    user: 'XCXpWdfVf7',
    password: 'tMDdtvLA0E',
    database: 'XCXpWdfVf7'
});
connection.connect(function(err){
    if(!err){
        console.log('Database is connection');
        app.listen(port,() => {
        console.log("We are  Live on "+port);
        });
    }
    else{
        console.log('Error while connecting with database');
    }
});
var agentApi= require('./app/routes/profile_routes.js');
app.use('/api/profile', agentApi(connection));
app.get('/agent/:id', async (req, res) => {
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
    var jsonSaleData;
    var jsonMobile;
	//axios is used for fetching JSON response
	await local({
		method: "get",
		url: "/api/profile/agent/"+req.params.id,
	}).then(responseData => jsonData = responseData.data);
    
    
    await local({
		method: "get",
		url: "/api/profile/agentsale/"+req.params.id,
    }).then(responseData => jsonSaleData = responseData.data);

    await local({
		method: "get",
		url: "/api/profile/agentmobile/"+req.params.id,
    }).then(responseData => jsonMobile = responseData.data);
    
    
    jsonData[0].dob=formatDate(jsonData[0].dob);
    jsonData[0].joining_date=formatDate(jsonData[0].joining_date);
    jsonSaleData.forEach(function(element){
        element.date_of_sale=formatDate(element.date_of_sale);
    });
	//Rendering properties.ejs with response JSON
	res.render('./agentprofile.ejs', {response0:jsonMobile,response:jsonData,response2:jsonSaleData});
});

app.get('/client/:id', async (req, res) => {
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
	await local({
		method: "get",
		url: "/api/profile/client/"+req.params.id,
    }).then(responseData => jsonData = responseData.data);
    
    await local({
		method: "get",
		url: "/api/profile/clientsold/"+req.params.id,
    }).then(responseData => jsonSoldData = responseData.data);

    await local({
		method: "get",
		url: "/api/profile/clientbought/"+req.params.id,
    }).then(responseData => jsonBoughtData = responseData.data);

    await local({
		method: "get",
		url: "/api/profile/clientonrent/"+req.params.id,
    }).then(responseData => jsonOnRentData = responseData.data);
    
    await local({
		method: "get",
		url: "/api/profile/clienttenant/"+req.params.id,
    }).then(responseData => jsonTenantData = responseData.data);

    await local({
		method: "get",
		url: "/api/profile/clientonsale/"+req.params.id,
    }).then(responseData => jsonOnSaleData = responseData.data);

    await local({
		method: "get",
		url: "/api/profile/clientmobile/"+req.params.id,
    }).then(responseData => jsonMobile = responseData.data);



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
    
	//Rendering properties.ejs with response JSON
	res.render('./clientprofile.ejs', {response0:jsonMobile,response:jsonData,response2:jsonSoldData,response3:jsonBoughtData,response4:jsonOnRentData,response5:jsonTenantData,response6:jsonOnSaleData});
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(bodyParser.json());
