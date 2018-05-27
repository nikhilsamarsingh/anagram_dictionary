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
		if(sorted_word in sorted_dict){
			sorted_dict[sorted_word].push(word);

		}
		else{
			sorted_dict[sorted_word] = [];
			sorted_dict[sorted_word].push(word);
		}
	}
	return sorted_dict;

}

app.post('/find_anagram', async function (req, res){
	var word = req.body.word;
	var length = req.body.length;
	var type = req.body.type;
	console.log(req.body);
	var sorted_word = word.toLowerCase().split("").sort().toString().replace(/,/g , '');

	var words_dict = require('fs').readFileSync('public/demo_test.html').toString().match(/<li>.+<\/li>/gm);
	var words_dict = words_dict.map(function(word) {
  return word.replace('<li>' , '').replace('<\/li>' , '').toLowerCase();
	});
	sorted_dict = await sort_dict(words_dict);

  console.log("sorted_dict", sorted_dict, "word to search", word, "sorted word", sorted_word);
  if(length){
  	console.log('length is', length);
  }
  else {
  	console.log('dont have length');
  }
  res.send("YO");
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
