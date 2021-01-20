var path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const regeneratorRuntime = require("regenerator-runtime");
const app = express();
const projectData = {};
app.use(express.static('dist'));

//middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// designates what port the app will listen to for incoming requests
const server = app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})

app.get('/load',function(req,res){
    res.send(projectData);
});

app.post('/all', function(req,res){
    projectData.latitude = req.body.latitude;
    projectData.longitude = req.body.longitude;
    projectData.country = req.body.country;
    projectData.low_temp = req.body.low_temp;
    projectData.max_temp = req.body.max_temp;
    projectData.description = req.body.description;
    projectData.img_url = req.body.img_url;
    console.log(projectData);
    res.send(projectData);
})

module.exports = server;





