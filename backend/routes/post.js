const express = require("express");
const router = express.Router();
const {
  getPosts,
  createPost,
  postByUser,
  postById,
  isPoster,
  deletePost,
  updatePost,
  photo,
  singlePost,
  like,
  unlike,
  comment,
  uncomment
} = require("../controllers/post");
const { userById } = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");
const { createPostValidator } = require("../validator/index");

router.get("/posts", getPosts);

//like/unlike
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);

//comments
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

router.post(
  "/post/new/:userId",
  requireSignin,
  createPost,
  createPostValidator
);

router.get("/posta", function(req, res) {
  res.send("keano");
});

router.get("/posts/by/:userId", requireSignin, postByUser);
router.get("/post/:postId", singlePost);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
//photo
router.get("/post/photo/:postId", photo);

//any route containing :userId, app will first execute userById()
router.param("userId", userById);
//any route containing :postId, app will first execute postById()
router.param("postId", postById);

module.exports = router;
