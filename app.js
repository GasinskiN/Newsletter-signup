const express = require("express");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
const apiKey = process.env.MAILCHIMP_API_KEY;
const listId = process.env.CHIMP_LIST_ID;

app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: true }));

//Setting up MailChimp
mailchimp.setConfig({
    apiKey: apiKey,
    server: "us21"
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", function (req, res) {
    const name = req.body.fName
    const surname = req.body.lName;
    const email = req.body.eMail;

    //Uploading the data to the server
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: name,
                LNAME: surname
            }
        });

        //If all goes well logging the contact's id
        res.sendFile(__dirname + "/success.html")
        console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id
            }.`
        );
    }

    //Running the function and catching the errors (if any)
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

// Redirect from failure to main page
app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running at port 3000");
});