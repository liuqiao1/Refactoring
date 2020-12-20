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