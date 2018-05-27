const express = require('express')
const app = express()

var async = require('async');

var bodyParser = require('body-parser')
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))


async function sort_dict(words_dict){
	sorted_dict = {};
	for(var i =0, len = words_dict.length; i< len; i++){
		var word = words_dict[i];
		var sorted_word = words_dict[i].split("").sort().toString().replace(/,/g , '');
		console.log('word at', i , 'place is', word, sorted_word);
		if(sorted_word in sorted_dict){
			sorted_dict[sorted_word].push(word);
			console.log('temp is', sorted_dict);

		}
		else{
			sorted_dict[sorted_word] = [];
			sorted_dict[sorted_word].push(word);
			console.log(sorted_word, "sorted_word");
			console.log('sorted_dict', sorted_dict);
		}
	}

}

app.post('/find_anagram', async function (req, res){
	var word = req.body.word;
	var length = req.body.length;

	var words_dict = require('fs').readFileSync('public/demo_test.html').toString().match(/<li>.+<\/li>/gm);
	var words_dict = words_dict.map(function(word) {
  return word.replace('<li>' , '').replace('<\/li>' , '').toLowerCase();
	});
	sorted_dict = await sort_dict(words_dict);

  console.log(word , length, "my", words_dict);
  if(length){
  	console.log('length is', length);
  }
  else {
  	console.log('dont have length');
  }
  res.send("YO");
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
