var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchApp = function (_React$Component) {
	_inherits(SearchApp, _React$Component);

	function SearchApp(props) {
		_classCallCheck(this, SearchApp);

		var _this = _possibleConstructorReturn(this, (SearchApp.__proto__ || Object.getPrototypeOf(SearchApp)).call(this, props));

		_this.requestJSONData();
		_this.state = {
			sentencesLoaded: false,
			matchingIDs: [],
			matchingSentenceList: [],
			userInput: ""
		};

		_this.handleChange = _this.handleChange.bind(_this);
		return _this;
	}

	_createClass(SearchApp, [{
		key: 'requestJSONData',
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
				_this2.sentences = sentences;
				_this2.trie = _this2.populateTrie(sentences);
				_this2.setState({
					sentencesLoaded: true,
					matchingSentenceList: sentences
				});
			}).catch(function (error) {
				console.log(error);
			});
		}
	}, {
		key: 'handleChange',
		value: function handleChange(event) {
			this.setState({
				userInput: event.target.value
			}, this.updateSentenceIDs);
		}
	}, {
		key: 'updateSentenceIDs',
		value: function updateSentenceIDs() {
			this.setState({
				matchingIDs: this.trie.getSentenceIDs(this.state.userInput)
			}, this.updateSentenceList);
		}
	}, {
		key: 'updateSentenceList',
		value: function updateSentenceList() {
			var _this3 = this;

			console.log('matchingIDs', this.state.matchingIDs);

			if (!this.state.userInput) {
				this.setState({ matchingSentenceList: this.sentences });
			} else if (this.state.matchingIDs) {
				this.setState({ matchingSentenceList: this.sentences.filter(function (sentence) {
						return _this3.state.matchingIDs.has(sentence.id);
					}) });
			} else {
				this.setState({ matchingSentenceList: [] });
			}
		}
	}, {
		key: 'populateTrie',
		value: function populateTrie(sentences) {
			var trie = new Trie();

			for (var i = 0; i < sentences.length; i++) {
				var sentence = sentences[i];

				var words = sentence.data.split(" ");
				for (var j = 0; j < words.length; j++) {
					trie.insertLetter(words[j], sentence.id);
				}
			}
			return trie;
		}
	}, {
		key: 'render',
		value: function render() {
			var _state = this.state,
			    matchingSentenceList = _state.matchingSentenceList,
			    userInput = _state.userInput;


			return React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					{ className: 'search-app' },
					React.createElement(
						'form',
						null,
						React.createElement('input', {
							className: 'search-bar',
							type: 'text',
							value: this.state.userInput,
							placeholder: 'Type your search word here...',
							onChange: this.handleChange
						})
					),
					matchingSentenceList.map(function (sentence) {
						return React.createElement(
							'div',
							{ key: sentence.id, className: 'sentence-block' },
							sentence.data
						);
					}),
					userInput && matchingSentenceList.length === 0 ? React.createElement(
						'div',
						{ className: 'no-matches' },
						'no matches'
					) : null
				),
				React.createElement(
					'div',
					{ className: 'comments' },
					'Comments Regarding My Implementation',
					React.createElement(
						'ul',
						null,
						React.createElement(
							'li',
							null,
							'If the search bar is blank (i.e. the user has not typed in any input), all sentences are displayed in the app.'
						),
						React.createElement(
							'li',
							null,
							'Once the user types in input, only sentences that contain words that match the input are displayed.'
						),
						React.createElement(
							'li',
							null,
							'If the input contains letter combinations that are not found in the sentences, the text "no matches" will display on the app.'
						),
						React.createElement(
							'li',
							null,
							'Special characters such as punctuation and "/" are ignored.'
						),
						React.createElement(
							'li',
							null,
							'The input is case insensitive.'
						)
					),
					React.createElement(
						'div',
						{ style: { textAlign: "right" } },
						'Thanks,',
						React.createElement('br', null),
						'Elaine Wang'
					)
				)
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
		key: 'insertLetter',
		value: function insertLetter(word, sentenceID) {
			var node = this.root;

			for (var i = 0; i < word.length; i++) {
				var char = word[i].toLowerCase();

				if (char === '\\') break;
				if (!this.isLetter(char)) continue;

				if (!node.children[char]) {
					node.children[char] = new TrieNode(char);
					node.children[char].parent = node;
				}

				node = node.children[char];
				node.sentenceIDs.add(sentenceID);
			}
		}
	}, {
		key: 'getSentenceIDs',
		value: function getSentenceIDs(prefix) {
			var node = this.root;

			for (var i = 0; i < prefix.length; i++) {
				if (node.children[prefix[i]]) {
					node = node.children[prefix[i]];
				} else {
					return null;
				}
			}
			return node.sentenceIDs;
		}
	}, {
		key: 'isLetter',
		value: function isLetter(character) {
			return 'abcdefghijklmnopqrstuvwxyz'.indexOf(character) > -1;
		}
	}]);

	return Trie;
}();

var domContainer = document.querySelector("#search-app");
ReactDOM.render(React.createElement(SearchApp, null), domContainer);