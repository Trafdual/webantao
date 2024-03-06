const router = require("express").Router();
const ChitietSP=require("../model/chitietSpModel")
router.get('/',async(req,res)=>{
    const listSP=await ChitietSP.find().lean();
    res.render("web",{listSP});
});
module.exports=router