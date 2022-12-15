const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
const config = require("./config.js");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){

  const mail = req.body.yourEmail;
  const name = req.body.yourName;


  var data = {
    members: [
      {
        email_address: mail,
        status: "subscribed",
        merge_fields: {
          FNAME: name
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  var audKey = config.MY_KEY;
  var apiKey = config.SECRET_KEY;

  const url = "https://us14.api.mailchimp.com/3.0/lists/" + audKey;

  const options = {
    method: "POST",
    auth: "billyborn:" + apiKey + "-us14"
  };

   const reque = https.request(url, options, function (response){

     if(response.statusCode === 200){
       res.sendFile(__dirname + "/success.html");
     } else {
       res.sendFile(__dirname + "/error.html");
     }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  reque.write(jsonData);
  reque.end();
});


app.listen(process.env.PORT || 3000 , function(){
  console.log("Server running");
})
