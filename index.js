require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const staticRouter = require('./routes/staticRouter');
const userRoute = require('./routes/user');
const { checkForAuthentication } = require('./middlewares/auth');
const adminRoute = require('./routes/admin');
const contactRoutes = require("./routes/contact");
const qrRoutes = require('./routes/qr');
const app = express();

const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
  secret: 'shortify-secret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());


app.use((req, res, next) => {
  res.locals.BASE_URL = process.env.BASE_URL;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


const PORT = process.env.PORT;
const mongoURI = process.env.MONGO_URL || process.env.MONGO_LOCAL;
// MongoDB
connectToMongoDB(mongoURI)
  .then(() => console.log("MongoDB Connected"));
app.use(express.static(path.join(__dirname, 'public')));
// Middlewares
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

const methodOverride = require('method-override');
app.use(methodOverride('_method')); //used to enable HTTP methods like PUT and DELETE in places where HTML forms only support GET and POST.




app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthentication);
app.use('/admin', adminRoute);
// Routes
app.use('/user', userRoute);

// 👉 Route for public URL shortening form (before /url)
app.get("/url/public", (req, res) => {
  return res.render("public", { id: null, error: null });
});

app.use('/public', require('./routes/public'));

app.use('/url', urlRoute);
app.use('/', staticRouter);
app.use(qrRoutes);
app.use(contactRoutes);


app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const user = getUser(token); // your function to decode token
      res.locals.user = user;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});


// Start server
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));

