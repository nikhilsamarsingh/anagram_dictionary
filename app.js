const express = require('express')
const app = express()

var async = require('async');

var bodyParser = require('body-parser')
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))


// This function simply converts arrany like [bat, cat, act] => [{act:[act, cat], abt: [bat]   }]
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
    len = keys.length;
    for (i = 0; i < len; i++) {
        k = keys[i];
        new_sorted_dict[k] = {}
        new_sorted_dict[k] = sorted_dict[k]

    }
    return new_sorted_dict;

}

// This function adds a child to tree_dict, if the key is not a single aphabet then we need to call recurslively
// till we get an object like, {'a':{'c' :{'p':[cap], 't': [cat, act]}, ...}}
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


// This function will find whenre to put the next child in the tree_dict, and then we call add_child
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


async function traverse_tree_json(tree_dict, sorted_word) {
    if (!sorted_word || sorted_word.length == 0) {
        return "0";
    }
    
    // starting from user's input, in sorted order, we match each element with the tree' nodes,
    // if the nodes do exist in the same order, and lead to an array, then we return the array
    // else we simply return "0"
    for (var i = 0, len = sorted_word.length ; i < len; i++) {
        var char = sorted_word[i];
        for (var key in tree_dict) {
            if (key <= char) {
                if (key == char) {
                    sorted_word = sorted_word.slice(1, );
                    if (Array.isArray(tree_dict[key])) {
                        return tree_dict[key];
                    } else {
                        return traverse_tree_json(tree_dict[key], sorted_word);

                    }
                } else {
                    //console.log('do nothing');


                }
            } else {
                return "0";
            }
        }

    }

}

// simple algo to calculate all combinations of a given string
function combinations(chars) {
    var result = [];
    var f = function(prefix, chars) {
        for (var i = 0; i < chars.length; i++) {
            result.push(prefix + chars[i]);
            f(prefix + chars[i], chars.slice(i + 1));
        }
    }
    f('', chars);
    return result;
}

// trimming the array that contains combinations of user given string, and will return a function
// The returned function will be used as a filter function to filter the array acording to users' given 
// length and type
function size_check(type, length) {
    if (type == "e")
        return function(element) {
            return element.length == length;
        }
    else if (type == "lt")
        return function(element) {
            return element.length < length;
        }
    else if (type == "lte")
        return function(element) {
            return element.length <= length;
        }
}

app.post('/find_anagram', async function(req, res) {
    var word = req.body.word;
    var length = req.body.length;
    var type = req.body.type;

    //Fist we sort the inpur string alphabetically, so if input is act or cat, sorted_word will be act
    var sorted_word = word.toLowerCase().split("").sort().toString().replace(/,/g, '');
    var words_dict = require('fs').readFileSync('public/demo_test.html').toString().match(/<li>.+<\/li>/gm);
    //words_dict contains list of words from our test dictionary, based on the length and type input by the user
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
    // suppose if words_dict was [act, cat ], then sorted_dict will be {act : [act, cat], ....}

    // so soted_dict has sorted_word : word_dict as key pair values
    tree_dict = await convert_to_tree(sorted_dict);

    // finally tree_dict will convert the sorted_dict into a dfs tree, which we will traverse
    //eg, {"a":{"b":{"t":["bat"]},"c":{"d":{"n":{"y":["candy"]}},"p":["cap"],"t":["act","cat"]},"d":{"h":{"n":["hand"]}},"e":{"l":{"p":{"p":["apple"]}},"p":{"p":{"r":["paper"]}}}},"d":{"g":{"o":["dog","god"]}},"f":{"g":{"o":["fog"]}},"h":{"i":{"s":{"t":["hits","this"]}}}}
    var tree_dict = JSON.parse(tree_dict);

    // gettting all combinations of the input string base on length and type
    sorted_word_combinations = await combinations(sorted_word);
    if (type && length)
        sorted_word_combinations = sorted_word_combinations.filter(size_check(type, length));
    var search = [];


    // once we have the tree of the dictionary as well as combination of inputs, we can traverse the tree_dict for each string combination possible
    // and send the result

    for (var i = 0, len = sorted_word_combinations.length ; i < len; i++) {
        var search_element = await traverse_tree_json(tree_dict, sorted_word_combinations[i]);
        console.log('search_element', search_element, sorted_word_combinations[i]);
        if (search_element == "0") {
            //console.log('do nothing');
        } else {

            Array.prototype.push.apply(search, search_element);
        }

    }
    //search = await traverse_tree_json(tree_dict, sorted_word);
    search = search.filter((v, i, a) => a.indexOf(v) === i); 
    console.log('search', search);
    res.send(search);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))