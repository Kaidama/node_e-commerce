const path          = require("path");
const logger        = require("morgan");
const express       = require("express");
const passport      = require("passport");
const mongoose      = require("mongoose");
const createError   = require("http-errors");
const cookieParser   = require("cookie-parser");
const cartMiddleware = require("./routes/cart/utils/cartMiddleware");

const methodOverride = require("method-override");

const indexRouter = require("./routes/index");
const cartRouter = require('./routes/cart/cart');
const usersRouter = require("./routes/users/users");
const adminRouter = require("./routes/admin/admin");
const productRouter = require("./routes/product/product");

const flash = require("connect-flash");
const session = require("express-session");
const expressValidator = require("express-validator");

const MongoStore = require("connect-mongo")(session);
const Category = require("./routes/product/models/Category");

require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("MONGODB CONNECTED");
  })
  .catch(err => console.log(`ERROR: ${err}`));

let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      autoReconnect: true
    }),
    cookie: {
      secure: false,
      maxAge: 365 * 24 * 60 * 60 * 1000
    }
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

require("./lib/passport/passport")(passport);

app.use((req, res, next) => {
  res.locals.user = req.user;

  res.locals.error = req.flash("error");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.success_msg = req.flash("success_msg");

  next();
});

app.use((req, res, next) => {
  Category.find({})
    .then(categories => {
      res.locals.categories = categories;

      next();
    })
    .catch(error => {
      return next(error);
    });
});
app.use(cartMiddleware);

app.use(
  expressValidator({
    errorFormatter: function(param, message, value) {
      let namespace = param.split(".");
      let root = namespace.shift();
      let formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }

      return {
        param: formParam,
        message: message,
        value: value
      };
    }
  })
);

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
