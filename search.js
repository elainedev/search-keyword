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
			sentenceList: [],
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
			}).then(function (data) {
				console.log("Successfully obtained sentences: ", data);
				_this2.sentences = data;
				_this2.setState({
					sentencesLoaded: true,
					sentenceList: _this2.sentences

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
			});
		}
	}, {
		key: 'render',
		value: function render() {
			console.log('render sentences', this.sentences);
			console.log('render display', this.state.sentenceList);
			return React.createElement(
				'div',
				{ className: 'search-app' },
				React.createElement(
					'form',
					null,
					React.createElement('input', {
						className: 'search-bar',
						type: 'text',
						value: this.state.userInput,
						placeholder: "Type your keyword here...",
						onChange: this.handleChange
					})
				),
				this.state.sentenceList.map(function (sentence) {
					return React.createElement(
						'div',
						{ key: sentence.id, className: 'sentence-block' },
						sentence.data
					);
				})
			);
		}
	}]);

	return SearchApp;
}(React.Component);

var domContainer = document.querySelector("#search-app");
ReactDOM.render(React.createElement(SearchApp, null), domContainer);