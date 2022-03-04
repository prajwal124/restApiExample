const express = require(`express`);
const bodyParser = require(`body-parser`);
const ejs = require(`ejs`);
const mongoose = require(`mongoose`);
const app = express();
const _ = require("lodash");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const wikiDbSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const wikiDbModel = mongoose.model(`articles`, wikiDbSchema);

app
  .route("/articles")
  .get((req, res) => {
    wikiDbModel.find({}, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        //console.log(result);
        res.send(result);
      }
    });
  })
  .post((req, res) => {
    //console.log(req.body.title);
    //console.log(req.body.content);
    wikiDbModel.insertMany(
      { title: req.body.title, content: req.body.content },
      (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(`Added Successfully`);
          res.send(result);
        }
      }
    );
  })
  .delete((req, res) => {
    wikiDbModel.deleteMany({}, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log(`Deleted All Successfully`);
        res.send(result);
      }
    });
  });

//ROUTING FOR SPECICIFIC ARTICLE
app
  .route("/articles/:title")
  .get((req, res) => {
    console.log(req.params);
    wikiDbModel.findOne(
      { title: _.toUpper(req.params.title) },
      (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(`GET:` + result);
          res.send(result);
        }
      }
    );
  })
  .put((req, res) => {
    wikiDbModel.findOneAndUpdate(
      { title: _.toUpper(req.params.title) },
      { $set: { title: req.body.title, content: req.body.content } },
      { returnOriginal: false, upsert: true },
      (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(`PUT:` + result);
          res.send(result);
        }
      }
    );
  })
  .patch((req, res) => {
    wikiDbModel.findOneAndUpdate(
      { title: _.toUpper(req.params.title) },
      { $set: { title: req.body.title, content: req.body.content } },
      { returnOriginal: false, upsert: false },
      (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(`PATCH:` + result);
          res.send(result);
        }
      }
    );
  })
  .delete((req, res) => {
    wikiDbModel.findOneAndDelete(
      { title: _.toUpper(req.params.title) },
      (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(`DELETE: ` + result);
          res.send(result);
        }
      }
    );
  });

// app.post("/articles");

// app.delete("/articles");

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server Listening at Port 3000...`);
});
