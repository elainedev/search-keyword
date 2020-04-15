class SearchApp extends React.Component {
	
	constructor(props) {
		super(props);
		this.requestJSONData();
		this.state = {
			sentencesLoaded : false,
			matchingSentenceList : [],
			userInput : "",
		}
		
		this.handleChange = this.handleChange.bind(this);
	}


	testCase = [
		{id: "2", data: "app"},
		{id: "3", data: "ape.﻿"},
		{
	        "id": "7",
	        "data": "Subscribe to my channel \ufeff"
	    },
	    {
	        "id": "9",
	        "data": "Check app \ufeff"
	    },
	]


	requestJSONData() {
		new Promise((resolve, reject) => {
			const sentencesRequest = new XMLHttpRequest();

			sentencesRequest.open('GET', 'https://raw.githubusercontent.com/elainedev/search-keyword/master/src/sentences.json');

			sentencesRequest.onload = () => {
				const sentences = JSON.parse(sentencesRequest.responseText);

				if (sentences) {
					resolve(sentences);
				}
				else {
					reject("failed to load sentences");
				}
			}
			sentencesRequest.send();
		})
		.then(sentences => {
			console.log("Successfully obtained sentences: ", sentences);
			// this.sentences = sentences;
			// this.populateTrie(sentences)
			this.trie = this.populateTrie(this.testCase)
			this.setState({ 
				sentencesLoaded : true,
				matchingSentenceList : sentences,
			});
		})
		.catch(error => {
			console.log(error);
		})
	}

	handleChange(event) {
		this.setState({
			userInput : event.target.value
		})
		this.matchingSentenceIDs = this.trie.getSentenceIDs(this.state.userInput);
		console.log(this.matchingSentenceIDs);
	}

	populateTrie(sentences) {
		const trie = new Trie();

		for (let i = 0; i < sentences.length; i++) {
			const sentence = sentences[i];

			const words = sentence.data.split(" ");
			for (let j = 0; j < words.length; j++) {
				trie.insertLetter(words[j], sentence.id);
			}
		}
		console.log('gah', trie);
		return trie;
	}

	render() {
		// console.log('render sentences', this.sentences)
		// console.log('render display', this.state.matchingSentenceList)
		return (
			<div className="search-app">
				<form>
					<input
						className="search-bar"
						type="text"
						value={this.state.userInput}
						placeholder={"Type your keyword here..."}
						onChange={this.handleChange}
					/>
				</form>
				{this.state.matchingSentenceList.map(sentence => 
					<div key={sentence.id} className="sentence-block">{sentence.data}</div>
				)}
			</div>
		)
	}
}

class TrieNode {
	constructor(char) {
		this.char = char;
		this.parent = null;
		this.children = {};
		this.sentenceIDs = new Set();
	}
}

class Trie {
	constructor() {
		this.root = new TrieNode(null);
	}

	insertLetter(word, sentenceID) {
		let node = this.root

		for (let i = 0; i < word.length; i++) {
			const char = word[i].toLowerCase();

			if (char === '\\') break;
			if (! this.isLetter(char)) continue;

			if (!node.children[char]) {
				node.children[char] = new TrieNode(char);
				node.children[char].parent = node;
			}
			
			node = node.children[char];
			node.sentenceIDs.add(sentenceID);
		}
	}

	getSentenceIDs(prefix) {
		let node = this.root;

		for (let i = 0; i < prefix.length; i++) {
			if (node.children[prefix[i]]) {
				node = node.children[prefix[i]];
			}
			else {
				return null;
			}
		}
		return node.sentenceIDs;
	}


	isLetter(character) {
		return 'abcdefghijklmnopqrstuvwxyz'.indexOf(character) > -1;
	}
}

const domContainer = document.querySelector("#search-app");
ReactDOM.render(<SearchApp />, domContainer);