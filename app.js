var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session')
var expressValidator = require('express-validator');

// Connect to db
mongoose.connect(config.database, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to DB..');
});


// init app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set public folder
app.use(express.static(path.join(__dirname,'public')));

// Set global errors variable
app.locals.errors = null;

// Body parser-middleware 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));

// Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    return {
      param: param,
      msg: msg,
      value: value
    }
  }
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Set router
var pages = require('./routes/pages.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');

app.use('/',pages);
app.use('/admin/pages',adminPages); 
app.use('/admin/categories',adminCategories); 

// Start server
var port = 3000;
app.listen(port, function(){
	console.log('Server started on port '+port);
}) ;