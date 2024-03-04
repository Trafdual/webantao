const router = require("express").Router();
router.get('/',async(req,res)=>{
    res.render("web");
});
module.exports=router