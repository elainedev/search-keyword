class SearchApp extends React.Component {
	
	constructor(props) {
		super(props);
		this.requestJSONData();
		this.state = {
			sentencesHaveLoaded : false,
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
			this.setState({ sentencesHaveLoaded : true });
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
			</div>
		)
	}

}

const domContainer = document.querySelector("#search-app");
ReactDOM.render(<SearchApp />, domContainer);