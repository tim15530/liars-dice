let BOT_PROPENSITY_TO_CALL;
const BOT_PROPENSITY_TO_BLUFF = 0.5;
const BOT_TRUE_MAX_BIDS = [];
const BOT_IDEAL_BLUFFS = [];

function botSetPropensityToCall() {
  const x = Math.random();
  if(x <= 0.5) {
    BOT_PROPENSITY_TO_CALL = 0.5;
  } else {
    BOT_PROPENSITY_TO_CALL = 0.18;
  }
}

function botPopulateTrueMaxBids(botDice) {
  let counter = {
    1:0,
    2:0,
    3:0,
    4:0,
    5:0,
    6:0
  };

  for(let i in botDice) {
    let die = botDice[i];
    counter[die] = counter[die] + 1;
  }

  for(let i = 1; i <= 6; i++) {
    if(counter[i] > 0) {
      BOT_TRUE_MAX_BIDS.push({numberOfDice: counter[i], faceValue: i});
    }
  }
}

function botPopulateIdealBluffs(botDice) {

  function computeConditionalExpectation(faceValue, botDice) {
    let numberOfDiceWithTheFaceValue = 0;
    for(let i in botDice) {
      let die = botDice[i];
      if(die == faceValue) {
        numberOfDiceWithTheFaceValue = numberOfDiceWithTheFaceValue + 1;
      }
    }
    let sumOfProducts = 0;
    for(let i = 0; i < 6; i++) {
      sumOfProducts = sumOfProducts + ((i + numberOfDiceWithTheFaceValue) * computeCombination(5,i) * Math.pow(1/6,i) * Math.pow(5/6,5-i));
    }
    return Math.ceil(sumOfProducts);
  }

  for(let i = 1; i <= 6; i++) {
    const numberOfDice = computeConditionalExpectation(i, botDice);
    BOT_IDEAL_BLUFFS.push({numberOfDice: numberOfDice, faceValue: i});
  }
}

function getBotResponse(currentBid, botDice) {
  let result = {};
  if(botWillCall(currentBid, botDice)) {
    result.call = true;
  } else {
    if(botCanTruthfullyBidHigher(currentBid)) {
      if(botWillBluff()) {
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
    let result = false;
    if(numberOfDiceBotHasWithTheFaceValue >= numberOfDice) {
      result = true;
    }
    return result;
  }

  function botMustCall(numberOfDice, numberOfDiceBotHasWithTheFaceValue) {
    let result = false;
    if(numberOfDice - numberOfDiceBotHasWithTheFaceValue > 5) {
      result = true;
    }
    return result;
  }

  let result;
  const numberOfDice = currentBid.numberOfDice;
  const faceValue = currentBid.faceValue;

  let numberOfDiceBotHasWithTheFaceValue = 0;
  for(let i in botsDice) {
    let die = botsDice[i];
    if(die == faceValue) {
      numberOfDiceBotHasWithTheFaceValue = numberOfDiceBotHasWithTheFaceValue + 1;
    }
  }

  if(botMustNotCall(numberOfDice, numberOfDiceBotHasWithTheFaceValue)) {
    result = false;
  } else if(botMustCall(numberOfDice, numberOfDiceBotHasWithTheFaceValue)) {
    result = true;
  } else {
    //playerTarget is > 0, <= 5
    const playerTarget = numberOfDice - numberOfDiceBotHasWithTheFaceValue;
    const probability = computeProbability(playerTarget);
    if(probability <= BOT_PROPENSITY_TO_CALL) {
      result = true;
    }
  }

  return result;
}

function botCanTruthfullyBidHigher(currentBid) {
  let result = false;
  const numberOfDice = currentBid.numberOfDice;
  const faceValue = currentBid.faceValue;

  for(let i in BOT_TRUE_MAX_BIDS) {
    let trueMaxBid = BOT_TRUE_MAX_BIDS[i];
    let tmbNumberOfDice = trueMaxBid.numberOfDice;
    let tmbFaceValue = trueMaxBid.faceValue;
    if(tmbNumberOfDice > numberOfDice || tmbFaceValue > faceValue) {
      result = true;
      break;
    }
  }

  return result;
}

function botWillBluff() {
  let result;
  const x = Math.random();
  if(x <= BOT_PROPENSITY_TO_BLUFF) {
    result = true;
  } else {
    result = false;
  }
  return result;
}

function botBid(currentBid) {
  const numberOfDice = currentBid.numberOfDice;
  const faceValue = currentBid.faceValue;

  const trueBids = [];
  for(let i in BOT_TRUE_MAX_BIDS) {
    let trueMaxBid = BOT_TRUE_MAX_BIDS[i];
    let tmbNumberOfDice = trueMaxBid.numberOfDice;
    let tmbFaceValue = trueMaxBid.faceValue;

    if(tmbFaceValue > faceValue) {
      for(let j = tmbNumberOfDice; j > 0; j--) {
        trueBids.push({numberOfDice: j, faceValue: tmbFaceValue});
      }
    } else if(tmbNumberOfDice > numberOfDice) {
      for(let j = tmbNumberOfDice; j > numberOfDice; j--) {
        trueBids.push({numberOfDice: j, faceValue: tmbFaceValue});
      }
    }
  }

  let lowestProbabilityTrueBid = trueBids[0];
  let lowestProbability = 1;
  for(let i in trueBids) {
    let trueBid = trueBids[i];
    let probability = computeProbability(trueBid.numberOfDice);
    if(probability < lowestProbabilityTrueBid) {
      lowestProbability = probability;
      lowestProbabilityTrueBid = trueBid;
    }
  }

  return lowestProbabilityTrueBid;
}

function botBluff(currentBid) {
  const validBluffs = [];
  let increment = 0;

  do {
    for(let i in BOT_IDEAL_BLUFFS) {
      let idealBluff = BOT_IDEAL_BLUFFS[i];
      let bluff = {numberOfDice: idealBluff.numberOfDice + increment, faceValue: idealBluff.faceValue};
      if(bidIsValid(bluff, currentBid)) {
        validBluffs.push(bluff);
      }
    }
    increment = increment + 1;
  }
  while(validBluffs.length == 0);

  const numberOfValidBluffs = validBluffs.length;
  const index = Math.floor(Math.random()*numberOfValidBluffs);
  return validBluffs[index];
}
