function Competences(FOR, DEX, END, INT, PER, CHA) {
    this.FOR = typeof FOR !== 'undefined' ? FOR : 0;
    this.DEX = typeof DEX !== 'undefined' ? DEX : 0;
    this.END = typeof END !== 'undefined' ? END : 0;
    this.INT = typeof INT !== 'undefined' ? INT : 0;
    this.PER = typeof PER !== 'undefined' ? PER : 0;
    this.CHA = typeof CHA !== 'undefined' ? CHA : 0;


    this.toString = function () {
        return "FOR:"+this.FOR+" DEX:"+this.DEX+" END:"+this.END+" INT:"+this.INT+" PER:"+this.PER+" CHA:"+this.CHA;
    }
};