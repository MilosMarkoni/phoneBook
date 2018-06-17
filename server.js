var express = require('express');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');

var app = express();

var connection = mysql.createConnection({
    host: 'sql7.freemysqlhosting.net',
    user: 'sql7243360',
    password: 'lnBbJ1hky1',
    database: 'sql7243360' 
});

connection.connect();

// Body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', (process.env.PORT || 3000));

app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
        

        while(namespace.length) {
            form.param += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

app.get('/', function(req, res, next){
    connection.query("SELECT * FROM phonebook", function(err, rows, fields){
        console.log('Connected to db!')
        res.render('home', {
            "projects": rows
        });
    });

});

app.get('/add', function(req,res,next){
    res.render('add');
});

app.post('/add', function(req,res,next){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var phonenumber = req.body.phonenumber;
    var errors = req.validationErrors();

    if(errors) {
        res.render('admin/add', {
            errors: errors,
            firstname: firstname,
            lastname: lastname,
            phonenumber: phonenumber
        });
    } else {
        var project = {
            firstname: firstname,
            lastname: lastname,
            phonenumber: phonenumber
        };
    }

    var query = connection.query('INSERT INTO phonebook SET ?', project, function(err, result){
        console.log('Error' + err);
        console.log('Success' + result);
    });

    res.redirect('/');
});


app.get('/remove', function(req,res,next){
    res.render('remove');
});

app.post('/remove', function(req,res,next){
    var id = req.body.id;
    var errors = req.validationErrors();

    if(errors) {
        res.render('/remove', {
            errors: errors,
            id: id
        });
    } else {
        var selectedid = id;
    }
    var query = connection.query('DELETE FROM phonebook WHERE id = ?', selectedid, function(err, result){
        console.log('Error' + err);
        console.log('Success' + result);
    });

    // var query = connection.query('TRUNCATE TABLE phonebook', function(err, result){
    //     console.log('Error' + err);
    //     console.log('Success' + result);
    // });
    res.redirect('/');
});

app.listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port'));
});
 