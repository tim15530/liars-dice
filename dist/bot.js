var BOT_PROPENSITY_TO_CALL = void 0;
var BOT_PROPENSITY_TO_BLUFF = 0.5;
var BOT_TRUE_MAX_BIDS = [];
var BOT_IDEAL_BLUFFS = [];

function botSetPropensityToCall() {
  var x = Math.random();
  if (x <= 0.5) {
    BOT_PROPENSITY_TO_CALL = 0.5;
  } else {
    BOT_PROPENSITY_TO_CALL = 0.18;
  }
}

function botPopulateTrueMaxBids(botDice) {
  var counter = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  };

  for (var i in botDice) {
    var die = botDice[i];
    counter[die] = counter[die] + 1;
  }

  for (var _i = 1; _i <= 6; _i++) {
    if (counter[_i] > 0) {
      BOT_TRUE_MAX_BIDS.push({ numberOfDice: counter[_i], faceValue: _i });
    }
  }
}

function botPopulateIdealBluffs(botDice) {

  function computeConditionalExpectation(faceValue, botDice) {
    var numberOfDiceWithTheFaceValue = 0;
    for (var i in botDice) {
      var die = botDice[i];
      if (die == faceValue) {
        numberOfDiceWithTheFaceValue = numberOfDiceWithTheFaceValue + 1;
      }
    }
    var sumOfProducts = 0;
    for (var _i2 = 0; _i2 < 6; _i2++) {
      sumOfProducts = sumOfProducts + (_i2 + numberOfDiceWithTheFaceValue) * computeCombination(5, _i2) * Math.pow(1 / 6, _i2) * Math.pow(5 / 6, 5 - _i2);
    }
    return Math.ceil(sumOfProducts);
  }

  for (var i = 1; i <= 6; i++) {
    var numberOfDice = computeConditionalExpectation(i, botDice);
    BOT_IDEAL_BLUFFS.push({ numberOfDice: numberOfDice, faceValue: i });
  }
}

function getBotResponse(currentBid, botDice) {
  var result = {};
  if (botWillCall(currentBid, botDice)) {
    result.call = true;
  } else {
    if (botCanTruthfullyBidHigher(currentBid)) {
      if (botWillBluff()) {
        result.bid = botBluff(currentBid);
      } else {
        result.bid = botBid(currentBid);
      }
    } else {
      result.bid = botBluff(currentBid);
    }
  }
  return result;
}

function botWillCall(currentBid, botsDice) {

  function botMustNotCall(numberOfDice, numberOfDiceBotHasWithTheFaceValue) {
    var result = false;
    if (numberOfDiceBotHasWithTheFaceValue >= numberOfDice) {
      result = true;
    }
    return result;
  }

  function botMustCall(numberOfDice, numberOfDiceBotHasWithTheFaceValue) {
    var result = false;
    if (numberOfDice - numberOfDiceBotHasWithTheFaceValue > 5) {
      result = true;
    }
    return result;
  }

  var result = void 0;
  var numberOfDice = currentBid.numberOfDice;
  var faceValue = currentBid.faceValue;

  var numberOfDiceBotHasWithTheFaceValue = 0;
  for (var i in botsDice) {
    var die = botsDice[i];
    if (die == faceValue) {
      numberOfDiceBotHasWithTheFaceValue = numberOfDiceBotHasWithTheFaceValue + 1;
    }
  }

  if (botMustNotCall(numberOfDice, numberOfDiceBotHasWithTheFaceValue)) {
    result = false;
  } else if (botMustCall(numberOfDice, numberOfDiceBotHasWithTheFaceValue)) {
    result = true;
  } else {
    //playerTarget is > 0, <= 5
    var playerTarget = numberOfDice - numberOfDiceBotHasWithTheFaceValue;
    var probability = computeProbability(playerTarget);
    if (probability <= BOT_PROPENSITY_TO_CALL) {
      result = true;
    }
  }

  return result;
}

function botCanTruthfullyBidHigher(currentBid) {
  var result = false;
  var numberOfDice = currentBid.numberOfDice;
  var faceValue = currentBid.faceValue;

  for (var i in BOT_TRUE_MAX_BIDS) {
    var trueMaxBid = BOT_TRUE_MAX_BIDS[i];
    var tmbNumberOfDice = trueMaxBid.numberOfDice;
    var tmbFaceValue = trueMaxBid.faceValue;
    if (tmbNumberOfDice > numberOfDice || tmbFaceValue > faceValue) {
      result = true;
      break;
    }
  }

  return result;
}

function botWillBluff() {
  var result = void 0;
  var x = Math.random();
  if (x <= BOT_PROPENSITY_TO_BLUFF) {
    result = true;
  } else {
    result = false;
  }
  return result;
}

function botBid(currentBid) {
  var numberOfDice = currentBid.numberOfDice;
  var faceValue = currentBid.faceValue;

  var trueBids = [];
  for (var i in BOT_TRUE_MAX_BIDS) {
    var trueMaxBid = BOT_TRUE_MAX_BIDS[i];
    var tmbNumberOfDice = trueMaxBid.numberOfDice;
    var tmbFaceValue = trueMaxBid.faceValue;

    if (tmbFaceValue > faceValue) {
      for (var j = tmbNumberOfDice; j > 0; j--) {
        trueBids.push({ numberOfDice: j, faceValue: tmbFaceValue });
      }
    } else if (tmbNumberOfDice > numberOfDice) {
      for (var _j = tmbNumberOfDice; _j > numberOfDice; _j--) {
        trueBids.push({ numberOfDice: _j, faceValue: tmbFaceValue });
      }
    }
  }

  var lowestProbabilityTrueBid = trueBids[0];
  var lowestProbability = 1;
  for (var _i3 in trueBids) {
    var trueBid = trueBids[_i3];
    var probability = computeProbability(trueBid.numberOfDice);
    if (probability < lowestProbabilityTrueBid) {
      lowestProbability = probability;
      lowestProbabilityTrueBid = trueBid;
    }
  }

  return lowestProbabilityTrueBid;
}

function botBluff(currentBid) {
  var validBluffs = [];
  var increment = 0;

  do {
    for (var i in BOT_IDEAL_BLUFFS) {
      var idealBluff = BOT_IDEAL_BLUFFS[i];
      var bluff = { numberOfDice: idealBluff.numberOfDice + increment, faceValue: idealBluff.faceValue };
      if (bidIsValid(bluff, currentBid)) {
        validBluffs.push(bluff);
      }
    }
    increment = increment + 1;
  } while (validBluffs.length == 0);

  var numberOfValidBluffs = validBluffs.length;
  var index = Math.floor(Math.random() * numberOfValidBluffs);
  return validBluffs[index];
}