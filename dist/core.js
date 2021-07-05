function rollDice() {
  var result = [];
  for (var i = 0; i < 5; i++) {
    result.push(Math.floor(Math.random() * 6) + 1);
  }
  return result;
}

function bidCanBeHigher(bid) {
  var result = false;
  var numberOfDice = bid.numberOfDice;
  var faceValue = bid.faceValue;
  if (numberOfDice < 10 || faceValue < 6) {
    result = true;
  }
  return result;
}

function bidIsValid(bid, currentBid) {
  var result = false;
  if (bid.numberOfDice > currentBid.numberOfDice || bid.faceValue > currentBid.faceValue) {
    result = true;
  }
  return result;
}

function playerWins(currentBid, currentBidIsByPlayer, playerDice, botDice) {
  var result = false;
  var numberOfDice = currentBid.numberOfDice;
  var faceValue = currentBid.faceValue;

  var totalNumberOfDice = 0;
  for (var i in playerDice) {
    var die = playerDice[i];
    if (die == faceValue) {
      totalNumberOfDice = totalNumberOfDice + 1;
    }
  }
  for (var _i in botDice) {
    var _die = botDice[_i];
    if (_die == faceValue) {
      totalNumberOfDice = totalNumberOfDice + 1;
    }
  }

  if (currentBidIsByPlayer && totalNumberOfDice >= numberOfDice || !currentBidIsByPlayer && totalNumberOfDice < numberOfDice) {
    result = true;
  }

  return result;
}

function computeProbability(numberOfDice) {
  if (numberOfDice > 0) {
    var result = 0;
    for (var i = numberOfDice; i <= 5; i++) {
      result = result + computeCombination(5, i) * Math.pow(1 / 6, i) * Math.pow(5 / 6, 5 - i);
    }
    return result;
  }
}

function computeCombination(collectionSize, numberOfSelections) {
  if (collectionSize >= 0 && numberOfSelections >= 0 && numberOfSelections <= collectionSize) {
    return factorial(collectionSize) / factorial(numberOfSelections) / factorial(collectionSize - numberOfSelections);
  }
}

function factorial(n) {
  if (n >= 0) {
    if (n == 0) {
      return 1;
    } else {
      return n * factorial(n - 1);
    }
  }
}