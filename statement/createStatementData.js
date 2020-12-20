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


class PerformanceCalculator{
    constructor(aPerformance){
        this.performance = aPerformance
        this.play = playFor(aPerformance)
    }

    get amount(){
      throw new Error('subclass responsibility')
    }

    get volumeCredits(){
        return Math.max(this.performance.audience - 30, 0);
    }
}

class TragedyCaculator extends PerformanceCalculator{
    get amount(){
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result
    }
}
class ComedyCaculator extends PerformanceCalculator{
    get amount(){
        let result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result
    }

    get volumeCredits(){
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
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