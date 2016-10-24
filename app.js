var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoUtil = require( './mongoUtil' );

var formidable = require('formidable');
var fs = require('fs');

// MONGO DB //////////////////////////////////////////////////////////
mongoUtil.connectToServer( function( err ) {

} );


// MIDDLEWARE //////////////////////////////////////////////////////////
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// API ROUTES //////////////////////////////////////////////////////////
app.use('/api/shopping-lists', require('./routes/shopping-lists'));
app.use('/api/shopping-list', require('./routes/shopping-list'));


// MAIN ROUTE //////////////////////////////////////////////////////////
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

//Ethan added
app.post('/upload', function(req, res) {

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/public/usr-img');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name

    var listId = "defaultFilename";

    form.on('field', function(name, value) {
        if (name == 'listId') {
        listId = value;
        console.log('Got list ID ' + listId);
        }
    });

    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, listId + ".jpg")); //file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);

});



// SERVER //////////////////////////////////////////////////////////
app.listen(process.env.PORT || 5000, function () {
  console.log('app is listening in the upside down on port 5000');
});
