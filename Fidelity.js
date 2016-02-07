// Finds an item in an array.
if (!Array.prototype.indexOf) {
   Array.prototype.indexOf = function(s) {
      for (var i = 0; i < this.length; i++) {
         if (this[i].indexOf(s) > -1) return i;
      }
      return -1;
   }
}

if (!String.prototype.trim) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

// Removes $, comma and trims the value.
if (!String.prototype.cleanAmount) {
   String.prototype.cleanAmount = function(s) { return this.trim().replace(/[,$]+/g, ''); }
}

function TransactionLoader() {
    this.transactions = { 
            range: null,          // transactions from date start to date end 
            sources: [],        // types of sources
            contributions : [], // [ {source, amount} ], 
            data : []           // [ {date, inv, type, amount, shares, tx : [source, amount, shares]} ] 
    };
}

TransactionLoader.prototype = {
    constructor: TransactionLoader,

    loadData : function() {
        this.loadRange();
        this.loadContributions();
        this.loadTransactions();
    },

    getData : function() {
        return this.transactions;
    },
    
    loadRange : function() {
        var range = document.getElementsByTagName('h3');
        for (var i = 0; i < range.length; i++) {
            if (range[i].innerText.indexOf('Transaction History Period:') > -1) {
                this.transactions.range = range[i].innerText.substring(range[i].innerText.indexOf(':') + 1).trim();
                break;
            }
        }
    },
    
    loadContributions : function() {
        for (var c = 0; c < 10; c++) { // we expect max 10 contribution groups.. generally, this is 1-3. 
            var id = 'contribGroup_' + (0 + c);
            var tbody = document.getElementById(id);
            if (tbody != null) {
                var trs = tbody.rows;
                for (var row = 0; row < trs.length; row++) {
                    if (trs[row].className.indexOf('group_details') > -1) {
                        var tds = trs[row].getElementsByTagName("td");
                        var entry = { 
                            source : tds[1].innerText.trim(), 
                            amount : tds[2].innerText.cleanAmount()
                        };
                        this.transactions.contributions.push(entry);
                    }
                }
            }
        }
        this.transactions.contributions.sort();
    },
     
    loadTransactions : function() {
        for (var inv = 0; inv < 1000; inv++) {
            var id = 'investGroup_' + (0 + inv);
            var tbody = document.getElementById(id);
            if (tbody != null) {
                expand(id); // maps to fidelity expand function that shows the collapsed transaction information.
                var trs = tbody.rows;
                var entry = { date : '', inv : '', type : '', amount : '', shares : '', tx : [] };

                for (var row = 0, len = trs.length; row < len; row++) {
                    // Info row
                    if (trs[row].className.indexOf('group_info') > -1) {
                        var tds = trs[row].getElementsByTagName("td");

                        var datecell = tds[0].cloneNode(true);

                        // remove p element
                        datecell.getElementsByTagName("p")[0].remove();

                        entry.date = datecell.innerText.trim();
                        entry.inv = tds[1].innerText.trim();
                        entry.type = tds[2].innerText.trim();
                        entry.amount = tds[3].innerText.trim().cleanAmount();
                        entry.shares = tds[4].innerText.trim().cleanAmount();
                    }

                    // Details rows
                    if (trs[row].className == "group_details") {
                        var tds = trs[row].getElementsByTagName("td");
                        if (tds[1].innerText != 'Sources') {
                            var details = {
                                source : tds[1].innerText.trim(), 
                                amount : tds[2].innerText.trim().cleanAmount(),
                                shares : tds[3].innerText.trim().cleanAmount()
                            };
                            entry.tx.push(details);
                        }
                    }

                    entry.tx.sort(function(a,b) { return a.source < b.source ? -1 : 1; });
                }
            
                this.transactions.data.push(entry);
            }
        }

        this.loadSources();
    },
     
    loadSources : function() {
        for (var i = 0; i < this.transactions.data.length; i++) {
            var transactions = this.transactions.data[i].tx;
            for (var t = 0; t < transactions.length; t++) {
                var s = transactions[t].source;
                if (this.transactions.sources.indexOf(s) == -1) { 
                    this.transactions.sources.push(s);
                }
            }
        }
        this.transactions.sources.sort();
    },

    download : function() {
        var dummy = document.createElement('a');
        dummy.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.getData())));
        dummy.setAttribute('download', 'transactions.js');
        document.body.appendChild(dummy);
        dummy.click();
        document.body.removeChild(dummy);
    }
}

var loader = new TransactionLoader();
loader.loadData();
loader.download();
// console.log(JSON.stringify(loader.getData())); // Uncomment if you want to see contents in the console tab.
