var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchPage = function (_React$Component) {
	_inherits(SearchPage, _React$Component);

	function SearchPage(props) {
		_classCallCheck(this, SearchPage);

		var _this = _possibleConstructorReturn(this, (SearchPage.__proto__ || Object.getPrototypeOf(SearchPage)).call(this, props));

		_this.requestJSONData();
		_this.state = {
			sentencesHaveLoaded: false
		};
		return _this;
	}

	_createClass(SearchPage, [{
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
				console.log('success');
				_this2.sentences = data;
				_this2.setState({ sentencesHaveLoaded: true });
			}).catch(function (error) {
				console.log(error);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: 'page' },
				this.sentences
			);
		}
	}]);

	return SearchPage;
}(React.Component);

var domContainer = document.querySelector("#search-page");
ReactDOM.render(React.createElement(SearchPage, null), domContainer);