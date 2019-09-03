let express = require("express");
let mongojs = require("mongojs");
// let logger= require("morgan");
// let mongoose= require("mongoose");
let request = require("request");
let cheerio = require("cheerio");

let app = express();

let databaseUrl = "scraper";
let collections = ["scrapedData"];

let db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});

app.get("/", function(req, res) {
    res.send("Hello World");
});

app.get("/all", function(req, res) {
    db.scrapedData.find({}, function (err, found) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(found);
        }
    });
});

// routes
app.get("/scrape", function(req, res){
    request("https://news.ycombinator.com", function(error, response, html){
        let $ = cheerio.load(html);
        $(".title").each(function(i, element){
            let title = $(this).children("a").text();
            let link = $(this).children("a").attr("href");

            if (title && link) {
                db.scrapedData.saved({
                    title: title,
                    link: link
                },
                function(error, saved) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log(saved);
                    }
                });
            }
        });
    });
            res.send("Scrape Complete");
});

        
  
  // Start the server
  app.listen(3000, function() {
    console.log("App running on port 3000!");
});
