/* 执行通过：nodemon server.js  可避免重启。*/
var express = require('express');

var app = express();
var cache_version = 1;
app.use(express.static('./'));


app.get('/data/users', function(req, res){
	/*res.set('cache_version', cache_version);
	console.log('got request');
	res.send(
		{a:Math.random()}
	);*/
	console.log('got request' + JSON.stringify(req.query));
	var arrayObj = new Array();
	for(var i=0; i< 10; i++) {
		var user = {};
		user.name = "Schroeder" + Math.random();
		user.gender = "male";
		user.company = "Bisba" + Math.random();
		arrayObj.push(user);
	}
	var result = {};
	result.gridData = arrayObj;
	result.totalItem = '45';
	/*console.log(JSON.stringify(result))*/
	res.send(result);
	/*res.send(
		[{
			"name" : "Schroeder",
			"gender" : "male",
			"company" : "Bisba"
		},{
			"name" : "Jackson Macias",
			"gender" : "female",
			"company" : "Exospace"
		}]
	);*/
});

app.post('/increase', function(req, res) {
	cache_version ++;
	console.log(cache_version);
})

app.listen(3000);