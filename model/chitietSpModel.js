const mongoose = require('mongoose');

const chitietspSchema = new mongoose.Schema({
content:{type:String},
price: {type:String},
idsp:{type: mongoose.Schema.Types.ObjectId, ref: 'tensp'}
});

const ChitietSp = mongoose.model('chitietsp', chitietspSchema);
module.exports = ChitietSp;
