class SearchApp extends React.Component {
	
	constructor(props) {
		super(props);
		this.requestJSONData();
		this.state = {
			sentencesLoaded : false,
			sentenceList : [],
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
		.then(data => {
			console.log("Successfully obtained sentences: ", data);
			this.sentences = data;
			this.setState({ 
				sentencesLoaded : true,
				sentenceList : this.sentences,

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
	}

	render() {
		console.log('render sentences', this.sentences)
		console.log('render display', this.state.sentenceList)
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
				{this.state.sentenceList.map(sentence => 
					<div key={sentence.id} className="sentence-block">{sentence.data}</div>
				)}
			</div>
		)
	}

}

const domContainer = document.querySelector("#search-app");
ReactDOM.render(<SearchApp />, domContainer);