var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchApp = function (_React$Component) {
	_inherits(SearchApp, _React$Component);

	function SearchApp(props) {
		_classCallCheck(this, SearchApp);

		var _this = _possibleConstructorReturn(this, (SearchApp.__proto__ || Object.getPrototypeOf(SearchApp)).call(this, props));

		_this.testCase = [{ id: "2", data: "app" }, { id: "3", data: "ape.﻿" }];

		_this.requestJSONData();
		_this.state = {
			sentencesLoaded: false,
			matchingSentenceList: [],
			userInput: ""
		};

		_this.handleChange = _this.handleChange.bind(_this);
		return _this;
	}

	_createClass(SearchApp, [{
		key: "requestJSONData",
		value: function requestJSONData() {
			var _this2 = this;

			new Promise(function (resolve, reject) {
				var sentencesRequest = new XMLHttpRequest();

				sentencesRequest.open('GET', 'https://raw.githubusercontent.com/elainedev/search-keyword/master/src/sentences.json');

				sentencesRequest.onload = function () {
					var sentences = JSON.parse(sentencesRequest.responseText);

					if (sentences) {
						resolve(sentences);
					} else {
						reject("failed to load sentences");
					}
				};
				sentencesRequest.send();
			}).then(function (sentences) {
				console.log("Successfully obtained sentences: ", sentences);
				// this.sentences = sentences;
				// this.populateTrie(sentences)
				_this2.populateTrie(_this2.testCase);

				_this2.setState({
					sentencesLoaded: true,
					matchingSentenceList: sentences

				});
			}).catch(function (error) {
				console.log(error);
			});
		}
	}, {
		key: "handleChange",
		value: function handleChange(event) {
			this.setState({
				userInput: event.target.value
			});
		}
	}, {
		key: "populateTrie",
		value: function populateTrie(sentences) {
			var trie = new Trie();

			for (var i = 0; i < sentences.length; i++) {
				var sentence = sentences[i];

				var words = sentence.data.split(" ");
				console.log('show', sentence.id);
				for (var j = 0; j < words.length; j++) {
					trie.insertLetter(words[j], sentence.id);
				}
			}
			console.log('gah', trie);
		}
	}, {
		key: "render",
		value: function render() {
			// console.log('render sentences', this.sentences)
			console.log('render display', this.state.matchingSentenceList);
			return React.createElement(
				"div",
				{ className: "search-app" },
				React.createElement(
					"form",
					null,
					React.createElement("input", {
						className: "search-bar",
						type: "text",
						value: this.state.userInput,
						placeholder: "Type your keyword here...",
						onChange: this.handleChange
					})
				),
				this.state.matchingSentenceList.map(function (sentence) {
					return React.createElement(
						"div",
						{ key: sentence.id, className: "sentence-block" },
						sentence.data
					);
				})
			);
		}
	}]);

	return SearchApp;
}(React.Component);

var TrieNode = function TrieNode(char) {
	_classCallCheck(this, TrieNode);

	this.char = char;
	this.parent = null;
	this.children = {};
	this.sentenceIDs = new Set();
};

var Trie = function () {
	function Trie() {
		_classCallCheck(this, Trie);

		this.root = new TrieNode(null);
	}

	_createClass(Trie, [{
		key: "insertLetter",
		value: function insertLetter(word, sentenceID) {
			var node = this.root;

			for (var i = 0; i < word.length; i++) {
				var char = word[i].toLowerCase();

				if (char === '\\') break;
				if (!this.isLetter(char)) continue;

				if (!node.children[char]) {
					node.children[char] = new TrieNode(char);
					node.children[char].parent = node;
					node.children[char].sentenceIDs.add(sentenceID);
				}

				node = node.children[char];
			}
		}
	}, {
		key: "getSentenceIDs",
		value: function getSentenceIDs(prefix) {
			var node = this.root;

			for (var i = 0; i < prefix.length; i++) {
				if (node.children[prefix[i]]) {
					node = node.children[prefix[i]];
				} else {
					return node.sentenceIDs;
				}
			}

			return null;
		}
	}, {
		key: "isLetter",
		value: function isLetter(character) {
			return 'abcdefghijklmnopqrstuvwxyz'.indexOf(character) > -1;
		}
	}]);

	return Trie;
}();

var domContainer = document.querySelector("#search-app");
ReactDOM.render(React.createElement(SearchApp, null), domContainer);