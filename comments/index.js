const { randomBytes } = require("node:crypto");
const path = require("node:path");
const fs = require("node:fs/promises");
const express = require("express");
const app = express();
const cors = require("cors");

const COMMENTS_PATH = path.resolve(__dirname, "../comments.json");

app.use(express.json());
app.use(cors());

app.get("/posts/:id/comments", async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await fs.readFile(COMMENTS_PATH);
    const storedComments = JSON.parse(result.toString());
    return res.json({ comments: storedComments[postId] });
  } catch (error) {
    console.log(error);
  }
});
app.post("/posts/:id/comments", async (req, res) => {
  try {
    const content = req.body.content;
    const id = randomBytes(4).toString("hex");
    const postId = req.params.id;
    const storedCommentsJSON = await fs.readFile(COMMENTS_PATH);
    const storedComments = JSON.parse(storedCommentsJSON);
    let newComment = { id, content };
    if (storedComments[postId]) storedComments[postId].push(newComment);
    else {
      storedComments[postId] = [];
      storedComments[postId].push(newComment);
    }
    fs.writeFile(COMMENTS_PATH, JSON.stringify(storedComments));
    res.json(newComment);
  } catch (error) {
    console.log(error);
  }
});

app.listen(4001, () => {
  console.log("comments-service is up and running on port 4001");
});
