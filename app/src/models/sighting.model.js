'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Sighting = new Schema({
    spp: {type: String, required: true},
    name: {type: String, required: false, trim: true},
    numAnimals: {type: Number, required: true, trim: true},
    status: {type: String, required: true, trim: true},
    latitude: {type: Number, requiered: true, trim: true},
    longitude: {type:Number, required: true, trim: true},
    picture: {type: String, required: false, trim: true},
    createdAt:{type: Date, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    type: {type: String, required: false, default: 'individuals'}
});

module.exports = mongoose.model('Sighting', Sighting);