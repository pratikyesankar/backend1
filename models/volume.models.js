const mongoose = require("mongoose")

const volumeSchema = new mongoose.Schema({
  title: String,
  author: String,
  publishedYear: Number,
  genre: [String],
  language: String,
  country: String,
  rating: Number,
  summary: String,
  coverImageUrl: String,
})

const Volume = mongoose.model("Volume", volumeSchema)

module.exports = Volume
