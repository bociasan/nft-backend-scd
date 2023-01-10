const mongoose = require('mongoose')
const {Schema} = mongoose

const collectionSchema = new Schema({
    name: String,
    slug: String,
    image_url: String,
    large_image_url: String,
    one_hour_difference: Number,
    average_price: Number,
    floor_price: Number,
    total_volume: Number,
    num_owners: Number,
    date: {type: Date, default: Date.now},
})

const Collection = mongoose.model('Collection', collectionSchema)

module.exports = Collection