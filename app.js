var express = require('express'), multer  = require('multer')
var fs = require("fs");
var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
  res.render('home');
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Absolute path. Folder must exist, will not be created for you.
  },
  filename: function (req, file, cb) {
    cb(null, 'tempfile');
  }
})

var upload =multer({ storage: storage });

app.post('/', [ upload.single("upfile") , function(req, res){

    var rtObj = { "size-in-bytes" : req.file.size };
    
    // immediately delete the file
    // fs.unlink('./uploads/tempfile',function(err){
    //      if(err) return console.log("fs unlink" + err);
    //      console.log('file deleted successfully');
    // });  
    
    res.end(JSON.stringify(rtObj));
    res.status(204).end()
}]);

app.use(function(req, res){
  res.type('text/html');
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error("error stack" + err.stack);
  res.status(500);
  res.render('500');
});


app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + ' press Ctrl-C to terminate');
});
