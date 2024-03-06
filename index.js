const express= require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handelbars = require('handlebars');
const hbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const web=require('./router/web');
const sanphamroute=require('./router/SanPhamRouter');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
const uri = "mongodb+srv://ducbinhnguyennd:ducbinhnguyennd@cluster0.geuahvt.mongodb.net/AntaoShop?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(console.log("kết nối thành công"));

const mongoStoreOptions = {
  mongooseConnection: mongoose.connection,
  mongoUrl: uri,
  collection: 'sessions', // Tên collection lưu trữ session trong MongoDB
};

app.use(cookieParser());

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create(mongoStoreOptions),
  cookie: {
    secure: false,
  }
}));
app.use(cors());
app.use('/',web);
app.use('/', sanphamroute);

app.listen(8080, () => {
    try {
      console.log('kết nối thành công 8080')
    } catch (error) {
      console.log('kết nối thất bại 8080', error)
    }
  }
  );