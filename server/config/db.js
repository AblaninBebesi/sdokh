const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://ablaninbebesi:EZekFrhxvhTfqYwl@schoolproject.ika94.mongodb.net/chatapp',{
        });
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit();
    }
}

module.exports = connectDB;