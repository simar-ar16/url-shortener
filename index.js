const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const staticRouter = require('./routes/staticRouter');
const userRoute = require('./routes/user');
const { checkForAuthentication } = require('./middlewares/auth');
const adminRoute = require('./routes/admin');
const app = express();
const PORT = 8001;

// MongoDB
connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("MongoDB Connected"));
app.use(express.static(path.join(__dirname, 'public')));
// Middlewares
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

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

app.use('/url', urlRoute);
app.use('/', staticRouter);

// Start server
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));

