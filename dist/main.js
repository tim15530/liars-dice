var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.initial = true;
    _this.playerDice = rollDice();
    _this.botDice = rollDice();
    _this.state = {};
    _this.handlePlayerBid = _this.handlePlayerBid.bind(_this);
    _this.handleBidClick = _this.handleBidClick.bind(_this);
    _this.handleCallClick = _this.handleCallClick.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.initial = false;
      botSetPropensityToCall();
      botPopulateTrueMaxBids(this.botDice);
      botPopulateIdealBluffs(this.botDice);
    }
  }, {
    key: "handleBidClick",
    value: function handleBidClick() {
      this.setState({ displayBidScreen: true });
    }
  }, {
    key: "handlePlayerBid",
    value: function handlePlayerBid(bid) {
      var stateFields = {};
      stateFields.currentBid = bid;
      stateFields.currentBidIsByPlayer = true;
      this.setState(stateFields);
    }
  }, {
    key: "handleCallClick",
    value: function handleCallClick() {
      this.setState({ call: true });
    }
  }, {
    key: "handleReset",
    value: function handleReset() {
      ReactDOM.render(React.createElement(App, { key: new Date().getTime() }), document.getElementById("root"));
    }
  }, {
    key: "render",
    value: function render() {
      var rulesElement = React.createElement(Message, { msg: "This game is called Liar's Dice. Players make bids on the total number of dice of a certain face. For example, a player may bid 'three fives'; this means that the player is claiming there are at least 3 dice of face value 5 across both their own dice and their opponent's dice. Players take turns bidding, and after each bid, their opponent has to either up the bid or call. To 'up the bid' means to make a bid that claims a greater number of dice, a greater face value, or both. For example, after a player bids 'three fives', their opponent may bid 'four twos', 'one six', or 'five sixes'. They would not be allowed to bid, say, 'two threes'. In this game, there are 10 six-sided dice across two players, so the number of dice within every bid must be greater than 0 and less than or equal to 10, and the face value within every bid must be between 1 and 6 (inclusive). A player may also 'call' their opponent's most recent bid (the current bid). Doing so reveals all the dice, and if the total number of dice with the face value specified in the current bid is less than what the current bid specifies, then the author of the bid loses the game. However, if it is greater than or equal to what the current bid specifies, the person who calls loses the game. In this implementation of the game, there are no wilds. Have fun!" });
      var currentBidElement = React.createElement(CurrentBid, { currentBid: this.state.currentBid, currentBidIsByPlayer: this.state.currentBidIsByPlayer });
      var playerDiceElement = React.createElement(DiceRevealed, { diceLabel: "Your Dice", dice: this.playerDice });
      var botDiceHiddenElement = React.createElement(DiceHidden, { diceLabel: "Bot's Dice" });
      var botDiceRevealedElement = React.createElement(DiceRevealed, { diceLabel: "Bot's Dice", dice: this.botDice });
      var playerMaxBidMsg = React.createElement(Message, { msg: "You have made the maximum bid and so a call has been issued. " });
      var botMaxBidMsg = React.createElement(Message, { msg: "The bot has made the maximum bid and so a call has been issued. " });
      var botCallMsg = React.createElement(Message, { msg: "The bot has called your bid. " });
      var resetButton = React.createElement(
        "button",
        { onClick: this.handleReset },
        "Restart"
      );
      if (this.initial) {
        return React.createElement(
          "div",
          null,
          rulesElement,
          React.createElement("br", null),
          currentBidElement,
          playerDiceElement,
          botDiceHiddenElement,
          React.createElement(PlayerBid, { handlePlayerBid: this.handlePlayerBid, currentBid: this.state.currentBid }),
          React.createElement(Message, { msg: "Please enter a bid to begin the game." }),
          resetButton
        );
      } else {
        if (this.state.call) {
          return React.createElement(
            "div",
            null,
            rulesElement,
            React.createElement("br", null),
            currentBidElement,
            playerDiceElement,
            botDiceRevealedElement,
            this.state.displayBotCallMsg && botCallMsg,
            this.state.displayPlayerMaxBidMsg && playerMaxBidMsg,
            this.state.displayBotMaxBidMsg && botMaxBidMsg,
            React.createElement(Message, { msg: this.state.msg }),
            resetButton
          );
        } else {
          if (this.state.displayBidScreen) {
            return React.createElement(
              "div",
              null,
              rulesElement,
              React.createElement("br", null),
              currentBidElement,
              playerDiceElement,
              botDiceHiddenElement,
              React.createElement(PlayerBid, { handlePlayerBid: this.handlePlayerBid, currentBid: this.state.currentBid }),
              resetButton
            );
          } else {
            return React.createElement(
              "div",
              null,
              rulesElement,
              React.createElement("br", null),
              currentBidElement,
              playerDiceElement,
              botDiceHiddenElement,
              React.createElement(PlayerOptions, { handleBidClick: this.handleBidClick, handleCallClick: this.handleCallClick }),
              React.createElement(Message, { msg: "The bot has upped the bid. Now it is your turn to up the bid or call." }),
              resetButton
            );
          }
        }
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.state.call) {
        if (this.state.call !== prevState.call) {
          if (playerWins(this.state.currentBid, this.state.currentBidIsByPlayer, this.playerDice, this.botDice)) {
            this.setState({ msg: "Congratulations, you have won!" });
          } else {
            this.setState({ msg: "Sorry, you have lost." });
          }
        }
      } else if (this.state.currentBidIsByPlayer) {
        if (bidCanBeHigher(this.state.currentBid)) {
          var botResponse = getBotResponse(this.state.currentBid, this.botDice);
          if (botResponse.call) {
            this.setState({ call: true, displayBotCallMsg: true });
          } else {
            if (bidCanBeHigher(botResponse.bid)) {
              this.setState({ currentBid: botResponse.bid, currentBidIsByPlayer: false, displayBidScreen: false });
            } else {
              this.setState({ currentBid: botResponse.bid, currentBidIsByPlayer: false, call: true, displayBotMaxBidMsg: true });
            }
          }
        } else {
          this.setState({ call: true, displayPlayerMaxBidMsg: true });
        }
      }
    }
  }]);

  return App;
}(React.Component);

var PlayerOptions = function (_React$Component2) {
  _inherits(PlayerOptions, _React$Component2);

  function PlayerOptions() {
    _classCallCheck(this, PlayerOptions);

    return _possibleConstructorReturn(this, (PlayerOptions.__proto__ || Object.getPrototypeOf(PlayerOptions)).apply(this, arguments));
  }

  _createClass(PlayerOptions, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { onClick: this.props.handleBidClick },
          "Bid"
        ),
        React.createElement(
          "span",
          null,
          " "
        ),
        React.createElement(
          "button",
          { onClick: this.props.handleCallClick },
          "Call"
        )
      );
    }
  }]);

  return PlayerOptions;
}(React.Component);

var PlayerBid = function (_React$Component3) {
  _inherits(PlayerBid, _React$Component3);

  function PlayerBid(props) {
    _classCallCheck(this, PlayerBid);

    var _this3 = _possibleConstructorReturn(this, (PlayerBid.__proto__ || Object.getPrototypeOf(PlayerBid)).call(this, props));

    _this3.state = { numberOfDice: '', faceValue: '' };
    _this3.handleNumberOfDiceChange = _this3.handleNumberOfDiceChange.bind(_this3);
    _this3.handleFaceValueChange = _this3.handleFaceValueChange.bind(_this3);
    _this3.handleSubmit = _this3.handleSubmit.bind(_this3);
    return _this3;
  }

  _createClass(PlayerBid, [{
    key: "handleNumberOfDiceChange",
    value: function handleNumberOfDiceChange(event) {
      event.preventDefault();
      this.setState({ numberOfDice: event.target.value });
    }
  }, {
    key: "handleFaceValueChange",
    value: function handleFaceValueChange(event) {
      event.preventDefault();
      this.setState({ faceValue: event.target.value });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(event) {
      event.preventDefault();
      var numberOfDice = this.state.numberOfDice;
      var faceValue = this.state.faceValue;
      var reg = /^\d+$/;

      if (reg.test(numberOfDice) && reg.test(faceValue)) {
        numberOfDice = parseInt(numberOfDice);
        faceValue = parseInt(faceValue);
        if (numberOfDice >= 1 && numberOfDice <= 10 && faceValue >= 1 && faceValue <= 6) {
          var bid = { numberOfDice: numberOfDice, faceValue: faceValue };
          if (this.props.currentBid) {
            if (bidIsValid(bid, this.props.currentBid)) {
              this.props.handlePlayerBid({ numberOfDice: numberOfDice, faceValue: faceValue });
            } else {
              this.setState({ error: true });
            }
          } else {
            this.props.handlePlayerBid({ numberOfDice: numberOfDice, faceValue: faceValue });
          }
        } else {
          this.setState({ error: true });
        }
      } else {
        this.setState({ error: true });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "form",
          { onSubmit: this.handleSubmit },
          React.createElement(
            "label",
            null,
            "Number of Dice:",
            React.createElement(
              "span",
              null,
              " "
            ),
            React.createElement("input", { type: "number", value: this.state.numberOfDice, onChange: this.handleNumberOfDiceChange })
          ),
          React.createElement(
            "span",
            null,
            " "
          ),
          React.createElement(
            "label",
            null,
            "Face Value:",
            React.createElement(
              "span",
              null,
              " "
            ),
            React.createElement("input", { type: "number", value: this.state.faceValue, onChange: this.handleFaceValueChange })
          ),
          React.createElement(
            "span",
            null,
            " "
          ),
          React.createElement("input", { type: "submit", value: "Submit" })
        ),
        this.state.error && React.createElement(Message, { msg: "Invalid bid. Please consult the rules above." })
      );
    }
  }]);

  return PlayerBid;
}(React.Component);

function Message(props) {
  if (props.msg) {
    return React.createElement(
      "div",
      null,
      props.msg
    );
  } else {
    return null;
  }
}

function CurrentBid(props) {
  if (props.currentBid) {
    return React.createElement(
      "div",
      null,
      "Current Bid: [",
      React.createElement(
        "span",
        null,
        "Number of Dice: ",
        props.currentBid.numberOfDice,
        " | "
      ),
      React.createElement(
        "span",
        null,
        "Face Value: ",
        props.currentBid.faceValue,
        " | "
      ),
      React.createElement(
        "span",
        null,
        "By: ",
        props.currentBidIsByPlayer ? 'You' : 'Bot'
      ),
      "]"
    );
  } else {
    return null;
  }
}

function DiceRevealed(props) {
  var dice = props.dice;
  var arrayOfDiceElements = [];
  for (var i = 0; i < dice.length; i++) {
    arrayOfDiceElements.push(React.createElement(SingleDie, { dieValue: dice[i] }));
  }
  return React.createElement(
    "div",
    null,
    props.diceLabel,
    ": ",
    arrayOfDiceElements
  );
}

function DiceHidden(props) {
  var arrayOfDiceElements = [];
  for (var i = 0; i < 5; i++) {
    arrayOfDiceElements.push(React.createElement(SingleDie, { hidden: true }));
  }
  return React.createElement(
    "div",
    null,
    props.diceLabel,
    ": ",
    arrayOfDiceElements
  );
}

function SingleDie(props) {
  if (props.hidden) {
    return React.createElement(
      "span",
      { className: "singleDie" },
      "[?]"
    );
  } else {
    return React.createElement(
      "span",
      { className: "singleDie" },
      "[",
      props.dieValue,
      "]"
    );
  }
}

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));