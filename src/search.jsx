class SearchApp extends React.Component {
	
	constructor(props) {
		super(props);
		this.requestJSONData();
		this.state = {
			sentencesLoaded : false,
			matchingIDs : [],
			matchingSentenceList : [],
			userInput : "",
		}
		
		this.handleChange = this.handleChange.bind(this);
	}

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
			this.sentences = sentences;
			this.trie = this.populateTrie(sentences)
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
		}, 
		this.updateSentenceIDs
		)
	}

	updateSentenceIDs() {
		this.setState({
			matchingIDs : this.trie.getSentenceIDs(this.state.userInput),
		},
		this.updateSentenceList
		)
	}

	updateSentenceList() {
		console.log('matchingIDs', this.state.matchingIDs)

		if (! this.state.userInput) {
			this.setState({matchingSentenceList : this.sentences})
		}
		else if (this.state.matchingIDs) {
			this.setState({matchingSentenceList : this.sentences.filter(sentence => this.state.matchingIDs.has(sentence.id))})
		}
		else {
			this.setState({matchingSentenceList : []})
		}
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
		return trie;
	}

	render() {
		const {matchingSentenceList, userInput} = this.state;

		return (
			<div>
				<div className="search-app">
					<form>
						<input
							className="search-bar"
							type="text"
							value={this.state.userInput}
							placeholder="Type your search word here..."
							onChange={this.handleChange}
						/>
					</form>
					{matchingSentenceList.map(sentence => 
						<div key={sentence.id} className="sentence-block">{sentence.data}</div>
					)}
					{userInput && matchingSentenceList.length === 0 ? <div className="no-matches">no matches</div> : null}
					
				</div>
				<div className="comments">
					Comments Regarding My Implementation
					<ul>
						<li>If the search bar is blank (i.e. the user has not typed in any input), all sentences are displayed in the app.</li>
						<li>Once the user types in input, only sentences that contain words that match the input are displayed.</li>
						<li>If the input contains letter combinations that are not found in the sentences, the text "no matches" will display on the app.</li>
						<li>Special characters such as punctuation and "/" are ignored.</li>
						<li>The input is case insensitive.</li>
					</ul>
					<div style={{textAlign: "right"}}>Thanks,<br/>
					Elaine Wang
					</div>
				</div>
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