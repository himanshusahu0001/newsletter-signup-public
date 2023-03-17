const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("static"));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var email = req.body.email;

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    var jsonData = JSON.stringify(data);

    var apiKey = ""; //Here your API key from Mailchimp
    var listID = ""; //Here your list id
    var serverNum = 00; //Here server number from API key
    const url = `https://us${serverNum}.api.mailchimp.com/3.0/lists/${listID}`;

    const options = {
        method: "POST",
        auth: "anyUserName:" + apiKey
    };

    const request = https.request(url, options, (response) => {

        //console.log(response.statusCode);
        if (response.statusCode === 200) {
            // res.send("Successfully subscribed");
            res.sendFile(__dirname + "/success.html");
        } else {
            // res.send("Error with signing up, please try again!");
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            //console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();

})

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is listening on port 3000");
})