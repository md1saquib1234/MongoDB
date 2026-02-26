const mongoose = require('mongoose');





main()
.then((res) => {
  console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,

});

const User = mongoose.model("User", userSchema);

User.findById({_id: "69a018cb92c92b1b22da24a1"}).then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
});

// User.insertMany([
//   { name: "Tony", email: "tony@gmail.com", age: 50},
//   {name: "Peter", email: "peter@gmail.com", age: 30},
//   {name: "Bruce", email: "bruce@gmail.com", age: 47},

// ]).then((res) => {
//   console.log(res);
// });


// const user2 = new User({
//   name: "Eve",
//   email: "eve@yahoo.in",
//   age: 48,
// });

//  user2
//  .save()
//  .then((res) => {
//   console.log(err); 
//  })
//  .catch((err) => {
//   console.log(err);
//  })

 module.exports = User;
