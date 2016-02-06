// Finds an item in an array.
if (!Array.prototype.indexOf) {
   Array.prototype.indexOf = function(s) {
      for (var i = 0; i < this.length; i++)
      {
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

// Format
var tx = { 
    range: '',          // transactions from date start to date end 
    sources: [],        // types of sources
    contributions : [], // [ {source, amount }], 
    data : []           // [ { date, inv, type, amount, shares, tx : [source, amount, shares] } ] 
};

function TransactionLoader() {
    this.transactions = { 
            range: '',          // transactions from date start to date end 
            sources: [],        // types of sources
            contributions : [], // [ {source, amount }], 
            data : []           // [ { date, inv, type, amount, shares, tx : [source, amount, shares] } ] 
    };
}

TransactionLoader.prototype = 
{
    constructor: TransactionLoader,
    loadData : function() {
        console.log('load data');
    },
    getData : function() {
        return this.transactions;
    }
}

var loader = new TransactionLoader();
loader.loadData();
console.log(JSON.stringify(loader.getData()));

function loadTransactions()
{
    var range = document.getElementsByTagName('h3');
    for (var i = 0; i < range.length; i++)
    {
    if (range[i].innerText.indexOf('Transaction History Period:') > -1)
    {
        tx.range = range[i].innerText.substring(range[i].innerText.indexOf(':') + 1).trim();
        break;
    }
    }

    // contributions
    for (var c = 0; c < 10; c++)
    {
    var id = 'contribGroup_' + (0 + c);
    var tbody = document.getElementById(id);
    if (tbody != null)
    {
        var trs = tbody.rows;
        for (var row = 0; row < trs.length; row++)
        {
            if (trs[row].className.indexOf('group_details') > -1)
            {
                var tds = trs[row].getElementsByTagName("td");
                var entry = { 
                        source : tds[1].innerText.trim(), 
                    amount : tds[2].innerText.cleanAmount()
                };
                tx.contributions.push(entry);
            }
        }
    }
    }
    tx.contributions.sort();

    // transactions
    for (var inv = 0; inv < 100; inv++)
    {
    var id = 'investGroup_' + (0 + inv);
    var tbody = document.getElementById(id);
    if (tbody != null)
    {
        expand(id);
        var trs = tbody.rows;
        var entry = { date : '', inv : '', type : '', amount : '', shares : '', tx : [] };
        
        for (var i = 0, len = trs.length; i < len; i++)
        {
            // Info row
            if (trs[i].className.indexOf('group_info') > -1)
            {
                var tds = trs[i].getElementsByTagName("td");
            
            var datecell = tds[0].cloneNode(true);

            // remove p element
                datecell.getElementsByTagName("p")[0].remove();
                
                entry.date = datecell.innerText.trim();
                entry.inv = tds[1].innerText.trim();
                entry.type = tds[2].innerText.trim();
                entry.amount = tds[3].innerText.trim().cleanAmount();
                entry.shares = tds[4].innerText.trim();
            }
        
            // Details rows
            if (trs[i].className == "group_details")
            {
                var tds = trs[i].getElementsByTagName("td");
                if (tds[1].innerText != 'Sources')
                {
                    var details = {
                        source : tds[1].innerText.trim(), 
                        amount : tds[2].innerText.trim().cleanAmount(),
                        shares : tds[3].innerText.trim()
                    };
                    entry.tx.push(details);
                }
            }

            entry.tx.sort(function(a,b) { return a.source < b.source ? -1 : 1; });

        }
        tx.data.push(entry);
    }
    }

    var max = 0;
    for (var i = 0; i < tx.data.length; i++)
    {
    var transactions = tx.data[i].tx;
    for (var t = 0; t < transactions.length; t++)
    {
        var s = transactions[t].source;
        if (tx.sources.indexOf(s) == -1) 
            tx.sources.push(s);
    }
    }
    tx.sources.sort();
}

loadTransactions();
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
console.log(JSON.stringify(tx));

