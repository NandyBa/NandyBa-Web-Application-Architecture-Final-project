const express = require('express')
// Import
const app = express()

var bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;

const http = require('http').createServer(app)
const io = require('socket.io')(http)
const fs = require('fs')

// Configuration
const port = process.env.PORT || 3000

const DATABASE_NAME = 'assignement2';
const MONGO_URL = `mongodb://mongows:27017/${DATABASE_NAME}`;
const client = new MongoClient(MONGO_URL);

var jsonParser = bodyParser.json()

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        // just a test to see if it's working
        let adminDb = client.db("admin")
        await adminDb.command({ ping: 1 });
        console.log("Connected successfully to server");
        // print list of databases available to console.
        let listdb = await  adminDb.command( { listDatabases: 1 } );
        console.log(listdb)

    } catch (e) {
        console.error(e);
    }
}
main().catch(console.error);

// Rooting

app.use(express.static('public'))

app.post('/post/images', jsonParser, function (req, res) {
  let image_url = req.body.image;
  let username = req.body.username;
  image_base64 = image_url.split(';base64,').pop();
  image_stream = image_base64.replace("image/png", "image/octet-stream");

  save_dir = 'public/images/';


  let db = client.db("admin");
  collection = db.collection("images");

  console.log(image_stream);
  let query = { 'username':'username', 'date':new Date()};
  let newEntry = { 'username': username, 'date':new Date(), 'image': image_stream };
  let params = { 'upsert': true };
  let response = collection.update(query, newEntry, params);

  response.then(function(){
    const file = "file.png";
    fs.writeFile(save_dir+file, image_stream, {encoding: 'base64'}, function(response) {
      res.send({"state":"Saved"})
    });

    query = { 'username': username };
    let result = collection.findOne(query);

    result.then(function(data){
      console.log(data);
    })

    
  }) 

});

app.get('/see_images', function(res, res){

  let db = client.db("admin");
  collection = db.collection("images");

  var cursor = collection.find( { tags: { $all: [ [ "username", "date",'image' ] ] } } );
  cursor.each(function(data){
    console.log(data)
  });
})

//I listen for socket connection
io.on('connect', (socket) => {
  //Once a user is connected I wait for him to send me figure on the event 'send_figure' or line with the event 'send_line'
  console.log('New connection')
  socket.on('send_figure', (figure_specs) => {
    //Here I received the figure specs, all I do is send back the specs to all other client with the event share figure
    socket.broadcast.emit('share_figure', figure_specs)
  })

  socket.on('send_line', (line_specs) => {
    //Here I received the line specs, all I do is send back the specs to all other client with the event share line
    socket.broadcast.emit('share_line', line_specs)
  })
})

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

