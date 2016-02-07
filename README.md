Fidelity 401k transactions downloader + exporter to CSV (which can be opened in Excel)

I use Fidelity as my 401k broker and I like keeping records of my 401k contributions and being able to see the sources of the contributons - my own contributions vs employer matches vs dividends vs after tax contributions etc.

Unfortunately, you can't download this level of transaction information from their website, and you can only get the pure dollar (or share) value per transaction. So a single contribution of $100 employee pretax + $50 employer match + $100 employee after tax can only be downloaded as $250 total contribution.

I was maintaining a spreadsheet of my own all this while by looking at their website and manually noting down things - but it got tiring so I wrote a script to automate the process.

To use this, you need a browser that has developer tools built in (Press F12 to see if it shows up).

There are two files - Fidelity.js and ExportToCSV.js
<ol>
    <li>1. Fidelity.js - scrapes the transaction history page on the website and downloads a file (transactions.js) containing the JSON data.</li>
    <li>2. ExportToCSV - converts the JSON contents into a CSV file which can then be opened in Microsoft Excel.</li>
</ol>

To use:
<ol>
    <li>1. Log in to your Fidelity a/c. Click on the 401k account page and then on transaction history. Select the range of dates you want - I typically choose the 1/1/year - 12/31/year and press the 'Get details' button.</li>
    <li>2. Select the contents of Fidelity.js and press Ctrl+C or copy to your clipboard.</li>
    <li>3. Press F12 to open developer tools and click on the console tab. Paste the contents of your clipboard there and press enter. This will trigger a download of a file named transactions.js which contains all the transactions in JSON format. You can uncomment the last line in the script to paste the contents in the console window itself. The contents will look something like the following, or you can also look at SampleData.js in the repository.

<pre>
{
    "range": "12/08/2015 to 02/05/2016",
    "sources": [
        "01 - EMPLOYEE PRE-TAX",
        "02 - EMPLOYER MATCH",
        "05 - REGULAR AFTER-TAX"
    ],
    "contributions": [
        {
            "source": "01 - EMPLOYEE PRE-TAX",
            "amount": "776.51"
        },
        {
            "source": "05 - REGULAR AFTER-TAX",
            "amount": "869.42"
        },
        {
            "source": "02 - EMPLOYER MATCH",
            "amount": "708.41"
        }
    ],
    "data": [
        {
            "date": "02/03/2016",
            "inv": "FIMM MONEY MKT INST",
            "type": "Dividends",
            "amount": "0.43",
            "shares": "0.430",
            "tx": [
                {
                    "source": "01 - EMPLOYEE PRE-TAX",
                    "amount": "0.25",
                    "shares": "0.250"
                },
                {
                    "source": "02 - EMPLOYER MATCH",
                    "amount": "0.18",
                    "shares": "0.180"
                }
            ]
        },
        {
            "date": "02/02/2016",
            "inv": "VANG S&P 500 IDX TR",
            "type": "Exchange In",
            "amount": "1000.00",
            "shares": "9.82",
            "tx": [
                {
                    "source": "01 - EMPLOYEE PRE-TAX",
                    "amount": "764",
                    "shares": "5.78"
                },
                {
                    "source": "02 - EMPLOYER MATCH",
                    "amount": "236",
                    "shares": "4.04"
                }
            ]
        },
        {
            "date": "12/31/2015",
            "inv": "FIMM MONEY MKT INST",
            "type": "CONTRIBUTION",
            "amount": "1094.79",
            "shares": "1094.790",
            "tx": [
                {
                    "source": "02 - EMPLOYER MATCH",
                    "amount": "60.08",
                    "shares": "60.080"
                },
                {
                    "source": "05 - REGULAR AFTER-TAX",
                    "amount": "1034.71",
                    "shares": "1034.710"
                }
            ]
        }
    ]
}
</pre></li>

    <li>Drag this new file (transactions.js) and drop it on the ExportToCSV.js file. Note - this uses Windows Scripting Host so if you have an code editing IDE installed (Visual Studio etc., SublimeText etc.), it may have set the default file associations to open the .js file in the editor and this may not work. Instead open the Windows command prompt and navigate to this folder and run either of the following commands:

Assuming your files are in d:\fidelity.

<pre>
    wscript ExportToCSV.js d:\fidelity\transactions.js
    cscript ExportToCSV.js d:\fidelity\transactions.js
</pre>

This will create a new file transactions.csv which you can then open in Microsoft Excel.

Sample contents (or see sampledata.csv).

<pre>
Date,Investment,TransactionType,Amount,Shares,Blank,01 - EMPLOYEE PRE-TAX,02 - EMPLOYER MATCH,05 - REGULAR AFTER-TAX,
12/31/2015,FIMM MONEY MKT INST,Contribution,1094.79,1094.790,,,60.08,1034.71
02/02/2016,VANG S&P 500 IDX TR,Exchange In,1000.00,9.82,,764,236
02/03/2016,FIMM MONEY MKT INST,Dividends,0.43,0.430,,0.25,0.18
</pre>
    </li>
</ol>