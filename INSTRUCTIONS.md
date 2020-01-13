# Technical Exercise (Please Treat As Confidential)

## Task: Transform tab-delimited data into a JSON output.

Attached please find a 50 row, tab-delimited data file. The first line contains the column names. Each line item is product sale. (Quantity can be greater than 1, but you can ignore the quantity field.) Write a script which will read the file, and produce JSON output in the following format:

```json
{

    "Customer Name": {

        "orders": [

            {

                "order_id": "CA-1234-567890",

                "order_date": "YYYY-MM-DDTHH:MM:SS",

                "line_items": [

                    {

                        "product_url": "https://www.foo.com/cat/subcat/123",

                        "revenue": 123.45

                    },

                    {

                        "product_url": "https://www.foo.com/cat/subcat/456",

                        "revenue": 67.89

                    },

                    ...

                ]

            },

            ...

        ]

    },

    "Customer Name 2": { ... },

    ...

}
```



## Requirements:

1. The customer name comes directly from the “Customer Name” field; use the stored value.
2. The order date comes from the “Order Date” field. In the source data, it is in month/day/year format, for example, April 20th, 2015 would be represented as 4/20/15. You must encode the date as ISO 8601.
3. The “order_id” output field comes from the “Order ID” input field.
4. The “line_items” list is constructed from the line items in the input data.
5. The product url is constructed from a base url, and the “Category”, “Sub-Category”, and “Product ID” fields. 
6. Use “https://www.foo.com/” as a base url (or use one that you choose and tell us what it is.)
7. Join the components using a “/” character, for example, given “cat”, “subcat”, “123” as the respective category, subcategory, and product ID fields, the URL would be: “https://www.foo.com/cat/subcat/123”
8. The “revenue” output field comes from the “Sales” input field, and should be stored as number in the JSON output.
9. Your program should output records only for transactions where the order date is after July 31st, 2016.
10. The data may not be completely clean - use your best judgement to handle any data issues you find, and let us know the decisions you made.

## Other Requirements & General Instructions:

1. State any assumptions you make.
2. A single script that takes the data file as input and produces JSON output is sufficient.
3. Use any language you wish. If you don’t have a preference, try Javascript and use node to run it, or use Python.
4. Include any required instructions on how to run your script. We must be able to run the script from the command line, and it must produce JSON to stdout or to a file. We will use a Linux environment to run your submission. If you use Windows, that’s fine, just note it.
