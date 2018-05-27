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

function add_child(branch, key, value){
	key = key.slice(1, );
	var new_key = key[0]
	branch[new_key] = {};
	if(key.length > 1)
	add_child(branch[new_key], key, value);
  else{
  branch[new_key] = [];
	branch[new_key] = value;
	}
	console.log(' in add child', 'branch',branch, 'key', key, 'value', value);

}

function find_place_in_tree_dict(branch, key, value){
	if(typeof branch !== 'undefined' && branch !== null){
		add_child(branch, key, value);

	}
	else
	{
		while (typeof branch !== 'undefined' && branch !== null) {
			console.log('herhe', branch, 'branch', key, 'key');
			key = key.slice(1, );
			new_key = key[0];
			branch = branch[new_key];
			console.log('branch is', branch, 'with key', new_key);
			// statement
		}
		add_child(branch, key, value);
	}


	
	console.log(' in finding right place child', 'branch',branch, 'key', key, 'value', value);

}

async function convert_to_tree(sorted_dict){
	tree_dict = {}
	for (var key in sorted_dict) {
		var new_key = key[0];
		console.log('new_key', new_key, tree_dict, key);
		if(new_key in tree_dict)
		{
			console.log('new_key already prese4nt', new_key, key, sorted_dict[key], tree_dict[new_key]);
			find_place_in_tree_dict(tree_dict[new_key], key, sorted_dict[key]);
			
			// recursive call to check for next alphabet, and next and so and on
		}
		else{
			tree_dict[new_key] = {}
			add_child(tree_dict[new_key], key, sorted_dict[key]);

			// recursive call to enter this way {'a':{'c' :{'p':[cap], 't': [cat, act]}, ...}}
		} 

		}
		console.log('treee', tree_dict, tree_dict['a']['c']['t']);
	}




app.post('/find_anagram', async function (req, res){
	var word = req.body.word;
	var length = req.body.length;
	var type = req.body.type;
	var sorted_word = word.toLowerCase().split("").sort().toString().replace(/,/g , '');
	var words_dict = require('fs').readFileSync('public/demo_test.html').toString().match(/<li>.+<\/li>/gm);
	console.log('words_dict', words_dict);
	words_dict = words_dict.map(function(word) {
		if(type){
			if(type == "e"){
				var temp = word.replace('<li>' , '').replace('<\/li>' , '').toLowerCase();
				console.log('temp', word, temp, length);
				if(temp.length == length){
					return temp;
				}
			}
			else if(type == "lte"){
				var temp = word.replace('<li>' , '').replace('<\/li>' , '').toLowerCase();
				console.log('temp', word, temp, length);
				if(temp.length <= length){
					return temp;
				}

			}
			else if(type == "lt"){
				var temp = word.replace('<li>' , '').replace('<\/li>' , '').toLowerCase();
				console.log('temp', word, temp, length);
				if(temp.length < length){
					return temp;
				}

			}
		}
	else{
		return word.replace('<li>' , '').replace('<\/li>' , '').toLowerCase();
	}
	});
	console.log('words_dict', words_dict);
	words_dict = words_dict.filter(function( element ) {
   return element !== undefined;
});
	words_dict = words_dict.sort()
	sorted_dict = await sort_dict(words_dict);
	tree_dict = await convert_to_tree(sorted_dict);

  console.log("sorted_dict", sorted_dict, "word to search", word, "sorted word", sorted_word);
  
  res.send("YO");
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
