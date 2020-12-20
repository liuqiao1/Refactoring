const plays = {
    "hamlet": {"name": "Hamlet", "type": "tragedy"},
    "as-like": {"name": "As You Like It", "type": "comedy"},
    "othello": {"name": "Othello", "type": "tragedy"}
}

const invoices = [
    {
      "customer": "BigCo",
      "performances": [
        {
          "playID": "hamlet",
          "audience": 55
        },
        {
          "playID": "as-like",
          "audience": 35
        },
        {
          "playID": "othello",
          "audience": 40
        }
      ]
    }
  ]

  function playFor(aPerformance){
      return plays[aPerformance.playID]
  }

  function amountFor(aPerformance){
    let result = 0;

    switch (playFor(aPerformance).type) {
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
            throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }

    return result
  }

  function usd(aNumber){
    return new Intl.NumberFormat("en-US",
        { 
            style: "currency", 
            currency: "USD",
            minimumFractionDigits: 2 
        }).format(aNumber/100);
  }

  function volumeCreditsFor(aPerformance){
    let result = Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === playFor(aPerformance).type) result = Math.floor(aPerformance.audience / 5);
    return result
  }

  function totalAmount(performances){
      return performances
      .reduce((result, perf) => {
          result += amountFor(perf);
          return result
      }, 0)
      ;
  }

  function totalVolumeCredits(performances){
    return performances
    .reduce((result, perf) => {
        result += volumeCreditsFor(perf);
        return result
    }, 0)
    ;
  }

  function enrichPerformance(aPerformance){
    const result = Object.assign({}, aPerformance);
    result.name = playFor(aPerformance).name
    result.amount = amountFor(aPerformance)
    return result;
  }

  function getStatementData(invoice){
    let result = {}
    result.customer = invoice.customer
    result.totalAmount = totalAmount(invoice.performances)
    result.performances = invoice.performances.map(enrichPerformance)
    result.totalVolumeCredit = totalVolumeCredits(invoice.performances)
    return result
  }

  function renderPlainText(data, invoice){
    let result = `Statement for ${data.customer}\n`;
  
    for (let perf of data.performances) {
      // print line for this order
      result += `  ${perf.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredit} credits\n`;

    return result;
  }

  function statement (invoice) {
      const data = getStatementData(invoice)
      return renderPlainText(data, invoice)
  }

window.onload = function(){
    const result = statement(invoices[0], plays)
    console.log(result)
}