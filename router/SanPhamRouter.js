const express = require('express');
const router = express.Router();
const ChitietSp = require("../model/chitietSpModel");
const LoaiSP = require("../model/tenSpModel");
const multer = require('multer')

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/postloaisp', async (req, res) => {
    try {
        const { name } = req.body
        const tensp = new LoaiSP({ name });
        await tensp.save();
        res.json(tensp);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
});

router.get('/getallsp', async (req, res) => {
    try {
        const allsp = await TenSP.find().populate('chitietsp'); //populate lấy chi tiết
        const tenspjson = await Promise.all(allsp.map(async (tensp) => {
            const chitietspJson = await Promise.all(tensp.chitietsp.map(async (chitietsp) => {
                return {
                    id: chitietsp._id,
                    noidung: chitietsp.content,
                    price: chitietsp.price
                }
            }));
            return {
                id: tensp._id,
                name: tensp.name,
                chitietsp: chitietspJson
            };
        }));
        res.json(tenspjson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})


router.post('/deletesp/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const xam = await TenSP.findById(id);
        if (!xam) {
            res.status(403).json({ message: 'khong tim thay sp' })
        }
        await Promise.all(xam.chitietsp.map(async (chitietsp) => {
            await ChitietSp.findByIdAndDelete(chitietsp._id);
        }));
        await TenSP.deleteOne({_id:id});
        res.json({ message: "Sản phẩm đã được xóa thành công." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})

router.post('/postchitietsp/:id',upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const { name,content, price } = req.body;
        const image = req.file.buffer.toString('base64');
        const chitietsp = new ChitietSp({image,name,content,price });
        const tensp = await LoaiSP.findById(id);
        if (!tensp) {
            res.status(403).json({ message: 'khong tim thay tensp' })
        }
        chitietsp.idloaisp=id;
        chitietsp.loaisp=tensp.name;
        tensp.chitietsp.push(chitietsp._id);
        await chitietsp.save();
        await tensp.save();
        res.json(chitietsp);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})

router.get('/getchitietsp/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const chitietsp = await ChitietSp.findById(id);
        if (!chitietsp) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết sản phẩm' });
        }

        const tensp = await LoaiSP.findOne({ chitietsp: chitietsp._id });
        if (!tensp) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        const chitietspJson = {
            id: chitietsp._id,
            name: tensp.name,
            noidung: chitietsp.content,
            price: chitietsp.price
        };

        res.render('chitietsp',chitietspJson)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})

router.delete('/deletechitietsp/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const chitietsp = await ChitietSp.findById(id);
        if (!chitietsp) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết sản phẩm' });
        }

        await ChitietSp.deleteOne({ _id: id }); 

        res.json({ message: 'Xóa chi tiết sản phẩm thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
});

router.put('/updatechitietsp/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { content, price } = req.body;

        const chitietsp = await ChitietSp.findById(id);
        if (!chitietsp) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết sản phẩm' });
        }

        chitietsp.content = content;
        chitietsp.price = price;

        await chitietsp.save();

        res.json(chitietsp);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
});

module.exports = router;