const mongoose = require('mongoose');

const mongoDb = async ()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/Insta');
        console.log('Db is Connected');
    } catch (error) {
        console.log(`error: ${error}`);
    }
}
module.exports = mongoDb;
