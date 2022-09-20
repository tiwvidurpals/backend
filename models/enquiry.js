var mongoose = require('mongoose');
var Schema = mongoose.Schema;


enquirySchema = new Schema({
    fullName: String,
    phone: String,
    email: String,
    address: String,
    message: String,
    id: Schema.ObjectId
}),

    enquiry = mongoose.model('enquiry', enquirySchema);
module.exports = enquiry;