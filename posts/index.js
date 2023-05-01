const { randomBytes } = require("node:crypto");
const path = require("node:path");
const fs = require("node:fs/promises");
const express = require("express");
const app = express();

const POSTS_PATH = path.join(__dirname, "posts.json");
app.use(express.json());
app.get("/posts", async (req, res) => {
  try {
    const result = await fs.readFile(POSTS_PATH);
    const posts = JSON.parse(result.toString());
    res.json(posts);
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
    res.json(storedPosts[id]);
  } catch (error) {
    console.log(error);
  }
});
app.listen(4000, () => {
  console.log("postes-service is up and running on port 4000");
});
