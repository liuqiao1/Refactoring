function createStatementData(invoice){
    let statementData = {}
    statementData.customer = invoice.customer
    statementData.performances = invoice.performances.map(enrichPerformance)

    statementData.totalAmount = totalAmount(statementData.performances)
    statementData.totalVolumeCredit = totalVolumeCredits(statementData.performances)
    return statementData
}

function createPerformanceCaculator(aPerformance){
    let caculator;
    switch (playFor(aPerformance).type) {
        case "tragedy":
          caculator = new TragedyCaculator(aPerformance)
          break;
        case "comedy":
          caculator = new ComedyCaculator(aPerformance)
          break;
        default:
            throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return caculator
}

function enrichPerformance(aPerformance){
    const result = Object.assign({}, aPerformance);
    const calculator = createPerformanceCaculator(aPerformance)
    
    result.name = calculator.play.name
    result.amount = calculator.amount
    result.volumeCredits = calculator.volumeCredits
    return result;
}

function playFor(aPerformance){
    return plays[aPerformance.playID]
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