'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReproductionPlaces = new Schema({
    spp: {type: String, required: true},
    name: {type: String, required: false, trim: true},
    numAnimals: {type: Number, required: false, trim: true},
    status: {type: String, required: false, trim: true},
    latitude: {type: Number, requiered: true, trim: true},
    longitude: {type:Number, required: true, trim: true},
    picture: {type: String, required: false, trim: true},
    country: {type: String, required: false, trim: true},
    avg: {type: Number, requiered: true, trim: true},
    createdAt:{type: Date, required: false},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: false},
    type: {type: String, required: false, default: 'love'}
});

module.exports = mongoose.model('ReproductionPlaces', ReproductionPlaces);