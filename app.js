const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//schema setup
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

// Blog.create(
//     {
//         title: "First Blog",
//         image: "https://i0.wp.com/www.writetravelart.com/wp-content/uploads/2018/02/First-Blog-Post.jpg?resize=750%2C400&ssl=1",
//         body: "Hello world!! This is my first blog",
//     },
//     (err, blog) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED BLOG:" + blog);
//         }
//     }
// );

app.get("/", (req, res) => {
    res.redirect("/blogs");
});

//INDEX ROUTE 
app.get("/blogs", (req, res) => {
    //get campground from DB
    Blog.find({}, (err, allBlogs) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index.ejs", { blogs: allBlogs });
        }
    });
});

//NEW ROUTE 
app.get("/blogs/new", (req, res) => {
    res.render("new.ejs");
});

// CREATE ROUTE
app.post("/blogs", (req, res) => {

    //save blog to DB
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render("new.ejs");
        } else {
            //redirect back to the blog page
            res.redirect("/blogs");
        }
    });
});


//SHOW - show blog info 
app.get("/blogs/:id", (req, res) => {
    //find the blog with provided ID
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            //render show template
            res.render("show.ejs", { blog: foundBlog });
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    //find the blog with provided ID
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            //render show template 
            res.render("edit.ejs", { blog: foundBlog });
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updateBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            //redirect show template
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
    //delete blog
    Blog.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            //redirect to blogs
            res.redirect("/blogs");
        }
    });

})

//localhost setting
app.listen(8080, () => {
    console.log("Blogs server has started!!");
    mongoose.connect("mongodb://localhost:27017/blogs_app", { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true })
        .then(() => {
            console.log("Connected to mongoDB at port 27017");
        });
});

//cloud setting
// app.listen(process.env.PORT, process.env.IP, () => {
//   console.log("YelpCamp server has started!!");
//   mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true })
//     .then(() => {
//       console.log("Connected to mongoDB at port 27017");
//     });
// });
