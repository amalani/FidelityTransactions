// WScript common code
var console = {
    log : function(s) { WScript.Echo(s); },
    debug : function(s) { if (this.isDebugging) this.log(s); },
    isDebugging : true
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
    this.input = '';
    this.output = '';
}

CSVExporter.prototype = {
    constructor: CSVExporter,
    
    run : function() {
        if (this.verifyInput()) {

        }    
    },

    verifyInput : function() {
        // Verify that a single file path with json data was passed as an argument.
        if (context.arguments.length != 1) {
            console.log('Invalid input - either drag and drop a file on this script, or pass using command line arguments.\n\tcscript ExportToCSV.js C:\\SampleData.js\n\twscript ExportToCSV.js C:\\SampleData.js');
            return false;
        }

        try {
            this.input = this.fso.getFile(context.arguments[0]);
        }
        catch (ex) {
            console.log('Could not open file: ' + context.arguments[0]);
            return false;
        }
        return true;
    }
}

var exporter = new CSVExporter();
exporter.run();
