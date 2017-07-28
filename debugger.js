var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(require('express').static('public'))
// parse application/json
app.use(bodyParser.json())
server.listen(8080);



console.log("Listning on http://debugger.almanapp.nl:8080/")
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var previous = [];

app.post('/test', function (req, res) {
  if (!req.body) return res.sendStatus(400)
  var data = req.body
  console.log(data)
  io.local.emit('news',  data)
  previous.push(data)
  if(previous.length > 100){
    previous.shift()
  }
  res.send("OK");
});

io.on('connection', function (socket) {
  for (var i = 0; i < previous.length; i++) {

    socket.emit('news', previous[i]);
  }

  socket.on('my other event', function (data) {
    console.log(data);
  });
});


// val debug_params = HashMap<String, String>()
// debug_params.put("request_test_type", str_method)
// debug_params.put("request_test_checksystem", query_string)
// debug_params.put("identifier", AppController.unique_tag)
// debug_params.put("uuid", parameters["uuid"] ?: "unknown")
// parameters.toList().forEach { debug_params.put(it.name, it.value) }
// val proxy_query_string = "https://dev.almanapp.nl/checksystem/debug/insert/"


