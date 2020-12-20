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

  function playFor(perf){
      return plays[perf.playID]
  }

  function amountFor(perf){
    let result = 0;

    switch (playFor(perf).type) {
        case "tragedy":
          result = 40000;
          if (perf.audience > 30) {
            result += 1000 * (perf.audience - 30);
          }
          break;
        case "comedy":
          result = 30000;
          if (perf.audience > 20) {
            result += 10000 + 500 * (perf.audience - 20);
          }
          result += 300 * perf.audience;
          break;
        default:
            throw new Error(`unknown type: ${playFor(perf).type}`);
    }

    return result
  }

  function usd(val){
    return new Intl.NumberFormat("en-US",
        { 
            style: "currency", 
            currency: "USD",
            minimumFractionDigits: 2 
        }).format(val/100);
  }

  function volumeCreditFor(perf){
    let result = Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === playFor(perf).type) result = Math.floor(perf.audience / 5);
    return result
  }

  function totalAmountFor(performances){
      return performances
      .reduce((result, perf) => {
          result += amountFor(perf);
          return result
      }, 0)
      ;
  }

  function volumeCreditsFor(performances){
    return performances
    .reduce((result, perf) => {
        result += volumeCreditFor(perf);
        return result
    }, 0)
    ;
  }

  function statement (invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
  
    for (let perf of invoice.performances) {
      // print line for this order
      result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmountFor(invoice.performances))}\n`;
    result += `You earned ${volumeCreditsFor(invoice.performances)} credits\n`;

    return result;
  }

window.onload = function(){
    const result = statement(invoices[0], plays)
    console.log(result)
}