class SearchPage extends React.Component {
	
	constructor(props) {
		super(props);
		this.requestJSONData();
		this.state = {
			sentencesHaveLoaded : false,
		}
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
			console.log('success');
			this.sentences = data;
			this.setState({ sentencesHaveLoaded : true });
		})
		.catch(error => {
			console.log(error);
		})
	}

	render() {
		return (
			<div className="page">
				{this.sentences}
			</div>
		)
	}

}

const domContainer = document.querySelector("#search-page");
ReactDOM.render(<SearchPage />, domContainer);