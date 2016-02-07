// WScript common code
var console = {
    log : function(s) { WScript.Echo(s); },
    debug : function(s) { if (this.isDebugging) this.log(s); },
    isDebugging : false
};
function alert(s) { console.log(s); }

var context = {
    scriptFileName : String(WScript.ScriptName).toLowerCase(),
    scriptFolder : WScript.ScriptFullName.replace(WScript.ScriptName, ''), // has trailing slash
    arguments : [],
    loadArguments : function() {
        for (var i = 0; count = WScript.Arguments.Count(), i < count; i++) {
            context.arguments.push(WScript.Arguments.item(i))
        }
    }
};
context.loadArguments();

// Common helpers
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

// Start script
function CSVExporter() {
    this.transactions = { 
            range: '',          // transactions from date start to date end 
            sources: [],        // types of sources
            contributions : [], // [ {source, amount }], 
            data : []           // [ { date, inv, type, amount, shares, tx : [source, amount, shares] } ] 
    };

    this.fso = new ActiveXObject("Scripting.FileSystemObject");
    this.folder = this.fso.getFolder(".");
    this.inputFile = null;
    this.outputFile = null;
}

CSVExporter.prototype = {
    constructor: CSVExporter,
    
    run : function() {
        if (this.verifyInput()) {

            // Read file contents
            var reader = this.fso.OpenTextFile(this.inputFile, 1 /*read*/);
            var fileContents = reader.ReadAll();
            reader.close();

            // Handle contents as JSON
            var obj = eval('(' + fileContents + ')');

            // Convert to CSV.
            var output = this.convertToCSV(obj);
            console.debug(output);

            // Write csv data to disk.
            var writer = this.fso.OpenTextFile(this.outputFile, 2 /*write*/, true /*create*/);
            writer.Write(output);
            writer.close();

            console.log('Exported to ' + this.outputFile);
        }    
    },

    convertToCSV : function(obj) {
        var data = [];

        // Column headers
        var row = "Date,Investment,TransactionType,Amount,Shares,Blank,";
        for (var i = 0; i < obj.sources.length; i++) {
            row += obj.sources[i] + ',';
        }
        data.push(row);

        // Transactions (the website will provide in reverse chronological order)
        for (var i = obj.data.length - 1; i >= 0; i--) {
            var tx = obj.data[i];
            var row = [];

            row.push(tx.date);
            row.push(tx.inv);
            row.push(this.getSanitizedTransactionType(tx.type));
            row.push(tx.amount);
            row.push(tx.shares);
            row.push('');

            // Transaction source types.
            var offset = 0;
            for (var j = 0; j < tx.tx.length; j++,offset++) {
                var cur = tx.tx[j];

                var max = 0;
                var count = 0;
                console.debug(cur.source + ' ' + obj.sources[offset] + ' ' + (cur.source == obj.sources[offset]));
                while (cur.source != obj.sources[offset])
                {
                    row.push('');
                    offset++;
                    max++;
                    if (max > 10)
                    {
                        break;
                    }
                }

                if (cur.source == obj.sources[offset]) {
                    row.push(cur.amount);
                }
            }

            data.push(row.join(','));
        }


        return data.join('\n');
    },

    getSanitizedTransactionType : function(s) {
        var arr = [
            ['LOAN MAINT. FEE', 'Loan Maintenance Fee'],
            ['CONTRIBUTION', 'Contribution'],
            ['REAL TIME TRADE COMMISSION', 'Real time trade commission']
        ];

        for (var i = 0; i < arr.length; i++) {
            if (s == arr[i][0]) {
                return arr[i][1];
            }
        }

        return s;
    },

    verifyInput : function() {
        // Verify that a single file path with json data was passed as an argument.
        if (context.arguments.length != 1) {
            console.log('Invalid input - either drag and drop a file on this script, or pass using command line arguments.\n\tcscript ExportToCSV.js C:\\SampleData.js\n\twscript ExportToCSV.js C:\\SampleData.js');
            return false;
        }

        // File access.
        try {
            this.inputFile = context.arguments[0];
            var checkFile = this.fso.getFile(this.inputFile);
        }
        catch (ex) {
            console.log('Could not open file: ' + this.inputFile);
            return false;
        }

        // Create output file name as original filename with a csv extension (or add extension if missing)
        var inputPath = this.inputFile.substr(0, this.inputFile.lastIndexOf('\\'));
        var inputFileName = this.inputFile.substr(this.inputFile.lastIndexOf('\\') + 1)
        console.debug(inputPath + ' ' + inputFileName);

        var outputFileName = '';
        if (inputFileName.indexOf('.') > -1) {
            outputFileName = inputFileName.substr(0, inputFileName.lastIndexOf('.')) + '.csv';
        }
        else {
            outputFileName = inputFileName + '.csv';
        }
        this.outputFile = inputPath + '\\' + outputFileName;
        console.debug(this.outputFile);
        return true;
    }
}

var exporter = new CSVExporter();
exporter.run();
