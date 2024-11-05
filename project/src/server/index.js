require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls

// example API call
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.get("/rovers", async (req, res) => {
  try {
    let rovers = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    const roverNames = rovers.rovers.map((rover) => rover.name);
    res.send(roverNames);
  } catch (err) {
    console.log("error:", err);
  }
});

app.get("/rover/:rover", async (req, res) => {
  try {
    let rover = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.rover}?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ rover });
  } catch (err) {
    console.log("error:", err);
  }
});

app.get("/rover/photos/:rover/:earthdate", async (req, res) => {
  try {
    let rover = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.rover}/photos?earth_date=${req.params.earthdate}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    const photos = rover.photos
      .filter((photo) => !photo.img_src.includes("gallery"))
      .map((photo) => photo.img_src);
    res.send({ photos });
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
