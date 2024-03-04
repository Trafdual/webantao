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

var app = express();

app.engine(".hbs", hbs.engine({
  extname: "hbs",
  defaultLayout: false,
  layoutsDir: "views/layouts/",
  handlebars: allowInsecurePrototypeAccess(Handelbars)
}));

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'));

const uri = "mongodb+srv://totnghiepduan2023:qs49jTtYwyQcsZ6i@cluster0.tzx1qqh.mongodb.net/DuanTotNghiep?retryWrites=true&w=majority";

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

app.listen(8080, () => {
    try {
      console.log('kết nối thành công 8080')
    } catch (error) {
      console.log('kết nối thất bại 8080', error)
    }
  }
  );