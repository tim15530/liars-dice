class App extends React.Component{
  constructor(props) {
    super(props);
    this.initial = true;
    this.playerDice = rollDice();
    this.botDice = rollDice();
    this.state = {};
    this.handlePlayerBid = this.handlePlayerBid.bind(this);
    this.handleBidClick = this.handleBidClick.bind(this);
    this.handleCallClick = this.handleCallClick.bind(this);
  }

  componentDidMount() {
    this.initial = false;
    botSetPropensityToCall();
    botPopulateTrueMaxBids(this.botDice);
    botPopulateIdealBluffs(this.botDice);
  }

  handleBidClick() {
    this.setState({displayBidScreen: true});
  }

  handlePlayerBid(bid) {
    const stateFields = {};
    stateFields.currentBid = bid;
    stateFields.currentBidIsByPlayer = true;
    this.setState(stateFields);
  }

  handleCallClick() {
    this.setState({call: true});
  }

  handleReset() {
    ReactDOM.render(<App key={(new Date()).getTime()}/>, document.getElementById("root"));
  }

  render() {
    const rulesElement = <Message msg="This game is called Liar's Dice. Players make bids on the total number of dice of a certain face. For example, a player may bid 'three fives'; this means that the player is claiming there are at least 3 dice of face value 5 across both their own dice and their opponent's dice. Players take turns bidding, and after each bid, their opponent has to either up the bid or call. To 'up the bid' means to make a bid that claims a greater number of dice, a greater face value, or both. For example, after a player bids 'three fives', their opponent may bid 'four twos', 'one six', or 'five sixes'. They would not be allowed to bid, say, 'two threes'. In this game, there are 10 six-sided dice across two players, so the number of dice within every bid must be greater than 0 and less than or equal to 10, and the face value within every bid must be between 1 and 6 (inclusive). A player may also 'call' their opponent's most recent bid (the current bid). Doing so reveals all the dice, and if the total number of dice with the face value specified in the current bid is less than what the current bid specifies, then the author of the bid loses the game. However, if it is greater than or equal to what the current bid specifies, the person who calls loses the game. In this implementation of the game, there are no wilds. Have fun!"/>;
    const currentBidElement = <CurrentBid currentBid={this.state.currentBid} currentBidIsByPlayer={this.state.currentBidIsByPlayer}/>;
    const playerDiceElement = <DiceRevealed diceLabel="Your Dice" dice={this.playerDice}/>;
    const botDiceHiddenElement = <DiceHidden diceLabel="Bot's Dice"/>;
    const botDiceRevealedElement = <DiceRevealed diceLabel="Bot's Dice" dice={this.botDice}/>;
    const playerMaxBidMsg = <Message msg="You have made the maximum bid and so a call has been issued. "/>;
    const botMaxBidMsg = <Message msg="The bot has made the maximum bid and so a call has been issued. "/>;
    const botCallMsg = <Message msg="The bot has called your bid. "/>;
    const resetButton = <button onClick={this.handleReset}>Restart</button>
    if(this.initial) {
      return (
        <div>
          {rulesElement}
          <br/>
          {currentBidElement}
          {playerDiceElement}
          {botDiceHiddenElement}
          <PlayerBid handlePlayerBid={this.handlePlayerBid} currentBid={this.state.currentBid}/>
          <Message msg="Please enter a bid to begin the game."/>
          {resetButton}
        </div>
      )
    } else {
      if(this.state.call) {
        return (
          <div>
            {rulesElement}
            <br/>
            {currentBidElement}
            {playerDiceElement}
            {botDiceRevealedElement}
            {this.state.displayBotCallMsg && botCallMsg}
            {this.state.displayPlayerMaxBidMsg && playerMaxBidMsg}
            {this.state.displayBotMaxBidMsg && botMaxBidMsg}
            <Message msg={this.state.msg}/>
            {resetButton}
          </div>
        )
      } else {
        if(this.state.displayBidScreen) {
          return (
            <div>
              {rulesElement}
              <br/>
              {currentBidElement}
              {playerDiceElement}
              {botDiceHiddenElement}
              <PlayerBid handlePlayerBid={this.handlePlayerBid} currentBid={this.state.currentBid}/>
              {resetButton}
            </div>
          )
        } else {
          return (
            <div>
              {rulesElement}
              <br/>
              {currentBidElement}
              {playerDiceElement}
              {botDiceHiddenElement}
              <PlayerOptions handleBidClick={this.handleBidClick} handleCallClick={this.handleCallClick}/>
              <Message msg="The bot has upped the bid. Now it is your turn to up the bid or call."/>
              {resetButton}
            </div>
          )
        }
      }
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.call) {
      if(this.state.call !== prevState.call) {
        if(playerWins(this.state.currentBid, this.state.currentBidIsByPlayer, this.playerDice, this.botDice)) {
          this.setState({msg: "Congratulations, you have won!"});
        } else {
          this.setState({msg: "Sorry, you have lost."});
        }
      }
    } else if(this.state.currentBidIsByPlayer){
      if(bidCanBeHigher(this.state.currentBid)) {
        const botResponse = getBotResponse(this.state.currentBid, this.botDice);
        if(botResponse.call) {
          this.setState({call: true, displayBotCallMsg: true});
        } else {
          if(bidCanBeHigher(botResponse.bid)) {
            this.setState({currentBid: botResponse.bid, currentBidIsByPlayer: false, displayBidScreen: false});
          } else {
            this.setState({currentBid: botResponse.bid, currentBidIsByPlayer: false, call: true, displayBotMaxBidMsg: true});
          }
        }
      } else {
        this.setState({call: true, displayPlayerMaxBidMsg: true});
      }
    }
  }

}

class PlayerOptions extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.handleBidClick}>Bid</button>
        <span> </span>
        <button onClick={this.props.handleCallClick}>Call</button>
      </div>
    )
  }
}

class PlayerBid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {numberOfDice : '', faceValue : ''};
    this.handleNumberOfDiceChange = this.handleNumberOfDiceChange.bind(this);
    this.handleFaceValueChange = this.handleFaceValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNumberOfDiceChange(event) {
    event.preventDefault();
    this.setState({numberOfDice : event.target.value});
  }

  handleFaceValueChange(event) {
    event.preventDefault();
    this.setState({faceValue : event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let numberOfDice = this.state.numberOfDice;
    let faceValue = this.state.faceValue;
    let reg = /^\d+$/;

    if(reg.test(numberOfDice) && reg.test(faceValue)) {
      numberOfDice = parseInt(numberOfDice);
      faceValue = parseInt(faceValue);
      if(numberOfDice >= 1 && numberOfDice <= 10 && faceValue >= 1 && faceValue <= 6) {
        const bid = {numberOfDice: numberOfDice, faceValue: faceValue};
        if(this.props.currentBid) {
          if(bidIsValid(bid, this.props.currentBid)) {
            this.props.handlePlayerBid({numberOfDice: numberOfDice, faceValue: faceValue});
          } else {
            this.setState({error : true});
          }
        } else {
          this.props.handlePlayerBid({numberOfDice: numberOfDice, faceValue: faceValue});
        }
      } else {
        this.setState({error : true});
      }
    } else {
      this.setState({error : true});
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Number of Dice:
            <span> </span>
            <input type="number" value={this.state.numberOfDice} onChange={this.handleNumberOfDiceChange}/>
          </label>
          <span> </span>
          <label>
            Face Value:
            <span> </span>
            <input type="number" value={this.state.faceValue} onChange={this.handleFaceValueChange}/>
          </label>
          <span> </span>
          <input type="submit" value="Submit"/>
        </form>
        {this.state.error && <Message msg="Invalid bid. Please consult the rules above."/>}
      </div>
    )
  }

}

function Message(props) {
  if(props.msg) {
    return (
      <div>
        {props.msg}
      </div>
    )
  } else {
    return (null)
  }
}

function CurrentBid(props) {
  if(props.currentBid) {
    return (
      <div>
        Current Bid: [
        <span>Number of Dice: {props.currentBid.numberOfDice} | </span>
        <span>Face Value: {props.currentBid.faceValue} | </span>
        <span>By: {props.currentBidIsByPlayer ? 'You' : 'Bot'}</span>
        ]
      </div>
    )
  } else {
    return (null)
  }
}

function DiceRevealed(props) {
  const dice = props.dice;
  const arrayOfDiceElements = [];
  for(let i = 0; i < dice.length; i++) {
    arrayOfDiceElements.push(<SingleDie dieValue={dice[i]}/>);
  }
  return (
    <div>
      {props.diceLabel}: {arrayOfDiceElements}
    </div>
  )
}

function DiceHidden(props) {
  const arrayOfDiceElements = [];
  for(let i = 0; i < 5; i++) {
    arrayOfDiceElements.push(<SingleDie hidden={true}/>);
  }
  return (
    <div>
      {props.diceLabel}: {arrayOfDiceElements}
    </div>
  )
}

function SingleDie(props) {
  if(props.hidden) {
    return (
      <span className="singleDie">[?]</span>
    )
  } else {
    return (
      <span className="singleDie">[{props.dieValue}]</span>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("root"));
