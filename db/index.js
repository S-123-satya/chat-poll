const mongoose = require('mongoose');

const mongodb=async ()=>{
    try {
        await mongoose.connect(
            `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
          );
    } catch (error) {
        console.log(`something went wrong in database connection`,error);
    }
}
module.exports=mongodb;

