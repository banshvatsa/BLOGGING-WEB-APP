import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

let blogList = [];

// Root Page
app.get("/", (req, res) => {
  res.render("home", {
    blogs: blogList,
  });
});

// Create Page
app.get("/create", (req, res) => {
  res.render("create");
});

// Saving the blog in blogList
app.post("/submit/blog", (req, res) => {
  const blogTitle = req.body.title;
  const blogDescription = req.body.description;
  blogList.push({
    title: blogTitle,
    description: blogDescription,
  });
  res.render("home", {
    blogs: blogList,
  });
});

// Displaying each blog
app.get("/blog/:blogTitle", (req, res) => {
  const { blogTitle } = req.params;
  const searchedBlog = blogList.find((blog) => blog.title === blogTitle);
  res.render("blog", { blog: searchedBlog });
});

//deleting blog
app.get("/blog/delete/:blogTitle", (req, res) => {
  const blogTitle = req.params.blogTitle;
  blogList = blogList.filter((blog) => blog.title !== blogTitle);
  res.render("home", { blogs: blogList });
});

//editing blog
// Edit Page
app.get("/blog/edit/:blogTitle", (req, res) => {
  const { blogTitle } = req.params;
  const blogToEdit = blogList.find((blog) => blog.title === blogTitle);
  if (blogToEdit) {
    res.render("edit", { blog: blogToEdit });
  } else {
    res.status(404).send("Blog not found");
  }
});

// Editing the blog
app.post("/blog/edit/:blogTitle", (req, res) => {
  const { blogTitle } = req.params;
  const { title, description } = req.body;

  const blogIndex = blogList.findIndex((blog) => blog.title === blogTitle);
  if (blogIndex !== -1) {
    blogList[blogIndex] = {
      title,
      description,
    };
    res.redirect("/");
  } else {
    res.status(404).send("Blog not found");
  }
});