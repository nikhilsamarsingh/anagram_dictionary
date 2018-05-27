const express = require('express')
const app = express()

var async = require('async');

var bodyParser = require('body-parser')
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))


async function sort_dict(words_dict) {
    sorted_dict = {};
    new_sorted_dict = {};
    for (var i = 0, len = words_dict.length; i < len; i++) {
        var word = words_dict[i];
        var sorted_word = words_dict[i].split("").sort().toString().replace(/,/g, '');
        if (sorted_word in sorted_dict) {
            sorted_dict[sorted_word].push(word);

        } else {
            sorted_dict[sorted_word] = [];
            sorted_dict[sorted_word].push(word);
        }
    }
    keys = Object.keys(sorted_dict);
    keys.sort();
    console.log('keys', keys);
    len = keys.length;
    for (i = 0; i < len; i++) {
        k = keys[i];
        console.log('k', k);
        new_sorted_dict[k] = {}
        new_sorted_dict[k] = sorted_dict[k]

    }
    console.log('sorted_dict', new_sorted_dict);
    return new_sorted_dict;

}

function add_child(branch, key, value) {
    key = key.slice(1, );
    var new_key = key[0]
    if (branch[new_key]) {
        // already present
    } else {
        branch[new_key] = {}
    }
    if (key.length > 1)
        add_child(branch[new_key], key, value);
    else {
        branch[new_key] = [];
        branch[new_key] = value;
    }
}

function find_place_in_tree_dict(branch, key, value) {
    if (typeof branch !== 'undefined' && branch !== null) {
        add_child(branch, key, value);

    } else {
        while (typeof branch !== 'undefined' && branch !== null) {
            key = key.slice(1, );
            new_key = key[0];
            branch = branch[new_key];
        }
        add_child(branch, key, value);
    }
}

async function convert_to_tree(sorted_dict) {
    tree_dict = {}
    for (var key in sorted_dict) {
        var new_key = key[0];
        if (new_key in tree_dict) {
            find_place_in_tree_dict(tree_dict[new_key], key, sorted_dict[key]);

            // recursive call to check for next alphabet, and next and so and on
        } else {
            tree_dict[new_key] = {}
            add_child(tree_dict[new_key], key, sorted_dict[key]);

            // recursive call to enter this way {'a':{'c' :{'p':[cap], 't': [cat, act]}, ...}}
        }

    }
    return JSON.stringify(tree_dict);
}




app.post('/find_anagram', async function(req, res) {
    var word = req.body.word;
    var length = req.body.length;
    var type = req.body.type;
    var sorted_word = word.toLowerCase().split("").sort().toString().replace(/,/g, '');
    var words_dict = require('fs').readFileSync('public/demo_test.html').toString().match(/<li>.+<\/li>/gm);
    words_dict = words_dict.map(function(word) {
        if (type) {
            if (type == "e") {
                var temp = word.replace('<li>', '').replace('<\/li>', '').toLowerCase();
                if (temp.length == length) {
                    return temp;
                }
            } else if (type == "lte") {
                var temp = word.replace('<li>', '').replace('<\/li>', '').toLowerCase();
                if (temp.length <= length) {
                    return temp;
                }

            } else if (type == "lt") {
                var temp = word.replace('<li>', '').replace('<\/li>', '').toLowerCase();
                if (temp.length < length) {
                    return temp;
                }

            }
        } else {
            return word.replace('<li>', '').replace('<\/li>', '').toLowerCase();
        }
    });
    words_dict = words_dict.filter(function(element) {
        return element !== undefined;
    });
    words_dict = words_dict.sort()
    sorted_dict = await sort_dict(words_dict);
    tree_dict = await convert_to_tree(sorted_dict);
    console.log('tree_dict', tree_dict);
    res.send(tree_dict);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))