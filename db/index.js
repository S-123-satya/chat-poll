const mongoose = require('mongoose');

const mongodb=async ()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/test");
    } catch (error) {
        console.log(`something went wrong in database connection`,error);
    }
}
module.exports=mongodb;