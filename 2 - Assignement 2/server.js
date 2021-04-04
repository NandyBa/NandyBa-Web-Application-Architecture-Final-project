const express = require('express')
const app = express()

var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

const port = process.env.PORT || 8080
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const fs = require('fs')

app.use(express.static('public'))

app.post('/post/images', jsonParser, function (req, res) {
  let image_url = req.body.image;
  image_base64 = image_url.split(';base64,').pop();
  image_stream = image_base64.replace("image/png", "image/octet-stream");

  save_dir = 'public/images/';

  if (! fs.existsSync(save_dir)) {
    fs.mkdirSync(save_dir, {
      recursive: true
    });
  }

  const file = "file.png";
  fs.writeFile(save_dir+file, image_stream, {encoding: 'base64'}, function(response) {
    res.send({"state":"Saved"})
  });
});

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

