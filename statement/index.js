
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