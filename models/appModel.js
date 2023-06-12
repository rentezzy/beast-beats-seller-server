const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({
    ticker:{
        type: String,
        maxlenght: 64,
        minlenght: 20,
    }
});

module.exports = new mongoose.model("App", appSchema);