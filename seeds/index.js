const mongoose = require("mongoose");
const Campground = require("../models/campgrounds");
const cities = require('./cities')
const{descriptors,places}=require('./seedHelpers')

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) 
    {
      const rand1000 = Math.floor(Math.random() * 1000);
      const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
          location: `${cities[rand1000].city},${cities[rand1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          image: "https://source.unsplash.com/collection/483251",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel lectus vel libero cursus bibendum. Integer quis justo vel ex bibendum efficitur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Maecenas et efficitur sapien. In hac habitasse platea dictumst. ",
          price
        });
        await camp.save();
    }
};
seedDB().then(()=> {
    mongoose.connection.close();
})
