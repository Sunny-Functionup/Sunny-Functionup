

const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const middleware = require("../controllers/middleware");



router.post("/createAuthors", authorController.createAuthor)
router.post("/loginAuthor", authorController.loginAuthor)


// router.post("/createBlog", blogController.createBlogs)
// router.get("/getBlogs", blogController.getBlogsData)
// router.put("/updateBlogs/:blogId", blogController.updateBlogs)
// router.delete("/deleteBlogs/:blogId", blogController.deleteBlogs)
// router.post("/createAuthor", authorController.createAuthor)

//router.delete("/deleteBlogs", blogController.deleteBlogByQuery)

router.post("/createBlog", middleware.authenticate, blogController.createBlogs);

router.get("/getBlogs", middleware.authenticate, blogController.getBlogsData)

//router.put("/updateBlogs/:blogId", middleware.authenticate,middleware.authorize, blogController.updateBlogs)
router.put("/updateBlogs/:blogId", middleware.authenticate,middleware.authorisation, blogController.updateBlogs)

router.delete("/deleteBlogs/:blogId", middleware.authenticate, blogController.deleteBlogs)
router.delete("/deleteBlogs/:blogId", middleware.authenticate,middleware.authorisation, blogController.deleteBlogs)

router.delete("/deleteBlogs", middleware.authenticate, blogController.deleteBlogByQuery)
router.delete("/deleteBlogs", middleware.authenticate,middleware.authorisation, blogController.deleteBlogByQuery)

//router.post("/loginAuthor", middleware.authenticate, authorController.loginAuthor)

module.exports = router;

