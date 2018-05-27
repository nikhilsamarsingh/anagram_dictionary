const express = require('express')
const app = express()

var bodyParser = require('body-parser')
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))

app.post('/find_anagram', function (req, res){
	var word = req.body.word;
	var length = req.body.length;
  console.log(word , length);
  if(length){
  	console.log('length is', length);
  }
  else {
  	console.log('dont have length');
  }
  res.send("YO");
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
