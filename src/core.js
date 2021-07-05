function rollDice() {
  const result = [];
  for(let i = 0; i < 5; i++) {
    result.push(Math.floor(Math.random()*6) + 1);
  }
  return result;
}

function bidCanBeHigher(bid) {
  let result = false;
  const numberOfDice = bid.numberOfDice;
  const faceValue = bid.faceValue;
  if(numberOfDice < 10 || faceValue < 6) {
    result = true;
  }
  return result;
}

function bidIsValid(bid, currentBid) {
  let result = false;
  if(bid.numberOfDice > currentBid.numberOfDice || bid.faceValue > currentBid.faceValue) {
    result = true;
  }
  return result;
}

function playerWins(currentBid, currentBidIsByPlayer, playerDice, botDice) {
  let result = false;
  const numberOfDice = currentBid.numberOfDice;
  const faceValue = currentBid.faceValue;

  let totalNumberOfDice = 0;
  for(let i in playerDice) {
    let die = playerDice[i];
    if(die == faceValue) {
      totalNumberOfDice = totalNumberOfDice + 1;
    }
  }
  for(let i in botDice) {
    let die = botDice[i];
    if(die == faceValue) {
      totalNumberOfDice = totalNumberOfDice + 1;
    }
  }

  if((currentBidIsByPlayer && totalNumberOfDice >= numberOfDice) || (!currentBidIsByPlayer && totalNumberOfDice < numberOfDice))  {
    result = true;
  }

  return result;
}

function computeProbability(numberOfDice) {
  if(numberOfDice > 0) {
    let result = 0;
    for(let i = numberOfDice; i <= 5; i++) {
      result = result + (computeCombination(5,i) * Math.pow(1/6,i) * Math.pow(5/6,5-i));
    }
    return result;
  }
}

function computeCombination(collectionSize, numberOfSelections) {
  if(collectionSize >= 0 && numberOfSelections >= 0 && numberOfSelections <= collectionSize) {
    return factorial(collectionSize)/factorial(numberOfSelections)/factorial(collectionSize-numberOfSelections);
  }
}

function factorial(n) {
  if(n >= 0) {
    if(n == 0) {
      return 1;
    } else {
      return n * factorial(n-1);
    }
  }
}
