function createStatementData(invoice){
    let statementData = {}
    statementData.customer = invoice.customer
    statementData.performances = invoice.performances.map(enrichPerformance)

    statementData.totalAmount = totalAmount(statementData.performances)
    statementData.totalVolumeCredit = totalVolumeCredits(statementData.performances)
    return statementData
}

function enrichPerformance(aPerformance){
    const result = Object.assign({}, aPerformance);
    result.play = playFor(aPerformance)
    result.name = result.play.name
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result);
    return result;
}

function playFor(aPerformance){
    return plays[aPerformance.playID]
}

function amountFor(aPerformance){
    let result = 0;

    switch (aPerformance.play.type) {
        case "tragedy":
          result = 40000;
          if (aPerformance.audience > 30) {
            result += 1000 * (aPerformance.audience - 30);
          }
          break;
        case "comedy":
          result = 30000;
          if (aPerformance.audience > 20) {
            result += 10000 + 500 * (aPerformance.audience - 20);
          }
          result += 300 * aPerformance.audience;
          break;
        default:
            throw new Error(`unknown type: ${perf.play.type}`);
    }

    return result
}

function volumeCreditsFor(aPerformance){
    let result = Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === aPerformance.play.type) result = Math.floor(aPerformance.audience / 5);
    return result
}

function totalAmount(performances){
    return performances
    .reduce((result, perf) => {
        result += perf.amount;
        return result
    }, 0)
    ;
}

function totalVolumeCredits(performances){
    return performances
    .reduce((result, perf) => {
        result += perf.volumeCredits;
        return result
    }, 0)
    ;
}