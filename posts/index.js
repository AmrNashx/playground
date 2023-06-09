const { randomBytes } = require("node:crypto");
const path = require("node:path");
const fs = require("node:fs/promises");
const express = require("express");
const app = express();
const cors = require("cors");

const POSTS_PATH = path.resolve(__dirname, "../posts.json");

app.use(express.json());
app.use(cors());
app.get("/posts", async (req, res) => {
  try {
    const result = await fs.readFile(POSTS_PATH);
    const posts = JSON.parse(result.toString());
    return res.json({ posts });
  } catch (error) {
    console.log(error);
  }
});
app.post("/posts", async (req, res) => {
  try {
    const title = req.body.title;
    const id = randomBytes(4).toString("hex");
    const storedPostsJSON = await fs.readFile(POSTS_PATH);
    const storedPosts = JSON.parse(storedPostsJSON);
    storedPosts[id] = {
      id,
      title,
    };
    fs.writeFile(POSTS_PATH, JSON.stringify(storedPosts));
    return res.json(storedPosts[id]);
  } catch (error) {
    console.log(error);
  }
});
app.listen(4000, () => {
  console.log("poss-service is up and running on port 4000");
});
