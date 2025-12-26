import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        lowercase: true
    },
    message:{
        type: String
    },
})

const conctactusModel = mongoose.model('contactus', contactSchema);

export default conctactusModel;