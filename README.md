Readme file - Fidelity transactions to json script

Helps export Fidelity 401k transaction data to JSON. 

Open the Fidelity 401k account page. Go to transaction history, select date range.

Press F12 to open developer tools and paste the script in the console.

This will export transactions in a format like so:

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
