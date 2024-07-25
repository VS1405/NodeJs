const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    industry : String,
    orders: [
        {
            description: String,
            amountInRupees: Number
        }
    ]
});

module.exports = mongoose.model("customer",  customerSchema)
