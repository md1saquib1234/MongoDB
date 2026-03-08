const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main()
.then(() => {
  console.log("connection successful")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


//Index Route
app.get("/chats", async (req, res, next) => {
  try {
  let chats = await Chat.find();
  // console.log(chats);
  res.render("index.ejs", {chats});
  } catch (err) {
    next(err);
  }
});

//New Route
app.get("/chats/new", (req, res, next) => {
  try {
  // throw new ExpressError(404, "Page not found ");
  res.render("new.ejs");
  } catch (err) {
    next(err);
  }
});

//Create Route
app.post("/chats", asyncWrap (async (req, res, next) => {
  let {from, to, msg} = req.body;
  let newChat = new Chat({
    from: from,
    to : to,
    msg : msg,
    created_at : new Date(),
  }); 

  await newChat.save();
  res.redirect("/chats");
} 
));

function asyncWrap(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  }
}

//New - Show Route
app.get("/chats/:id", asyncWrap (async (req, res, next) => {
  let {id} = req.params;
  let chat = await Chat.findById(id);
  if (!chat) {
    next(new ExpressError(404, "chat not found"));
  }
  res.render("edit.ejs", {chat});
} 
));

//edit route
app.get("/chats/:id/edit",asyncWrap (async (req, res, next) => {
 
  let {id} = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", {chat} );
  } ));

//Update route
app.put("/chats/:id",asyncWrap (async (req, res, next) => {
   let {id} = req.params;
   let {msg : newMsg} = req.body;
   console.log(newMsg);
   let updatedChat  = await chat.findByIdAndUpdate(id, {msg: newMsg},
     {runValidators: true, new: true} 
    );

    console.log(updatedChat);
    res.redirect("/chats");
  } ));

//Destroy 
app.delete("/chats/:id",asyncWrap (async (req, res, next) => {
  let {id} =  req.params;
  let deletedChat = await Chat.findByIdAndDelete(id);
  console.log(deletedChat);
  res.redirect("/chats");
  }));

app.get("/" , (req, res, next) => {
  try {
  res.send("root is working");
  } catch (err) {
    next(err);
  }
});


// let chat1 = new Chat({
//   from : "neha",
//   to : "priya",
//   msg : "send me you exam sheets",
//   created_at: new Date()
// });

// chat1.save().then(res => {console.log(res)})  

app.get("/", (req, res) => {
  res.send("root is working");
});

const handleValidationError = (err) => {
  console.log("This was a validation error.Please follow rules");
  console.dir(err.message);
  return err;
}

app.use((err, req, res, next) => {
  console.log(err.name);
  if(err.name === "ValidationError") {
   err = handleValidationError(err);
  };
  next(err);
});

//Error handling middleware
app.use((err, req, res, next) => {
  let {status= 500 , message= "Some error occured"} = err;
  res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});