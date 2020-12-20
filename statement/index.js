
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

  function usd(aNumber){
    return new Intl.NumberFormat("en-US",
        { 
            style: "currency", 
            currency: "USD",
            minimumFractionDigits: 2 
        }).format(aNumber/100);
  }

  function renderPlainText(data){
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
      const data = createStatementData(invoice)
      return renderPlainText(data)
  }

window.onload = function(){
    const result = statement(invoices[0], plays)
    console.log(result)
}