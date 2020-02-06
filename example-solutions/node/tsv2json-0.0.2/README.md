# tsv2json

## Description

tsv2json converts a specifically formatted tsv file to json output via stdout.  An example file is included in the project's *fixtures* directory.

## Installation
Installation requires version **"node": ">=7.6.0"** due to the usage of the es6 async/await shorthand, see the *package.json* file for more information.

```
npm install
```

## Usage

```
tsv2json -f <filename>
```

## Tests
```
npm run tests
```

## Requirements
1. The customer name comes directly from the “Customer Name” field; use the stored value.
2. The order date comes from the “Order Date” field. In the source data, it is in month/day/year format, for example, April 20th, 2015 would be represented as 4/20/15. You must encode the date as ISO 8601.
3. The “order_id” output field comes from the “Order ID” input field.
4. The “line_items” list is constructed from the line items in the input data.
  * The product url is constructed from a base url, and the “Category”, “Sub-Category”, and “Product ID” fields. 
  * Use “https://www.foo.com/” as a base url (or use one that you choose and tell us what it is.)
  * Join the components using a “/” character, for example, given “cat”, “subcat”, “123” as the respective category, subcategory, and product ID fields, the URL would be: “https://www.foo.com/cat/subcat/123”
5. The “revenue” output field comes from the “Sales” input field, and should be stored as number in the JSON output.
6. Your program should output records only for transactions where the order date is after July 31st, 2016.
7. The data may not be completely clean - use your best judgement to handle any data issues you find, and let us know the decisions you made.

## Assumptions
1. ISO 8601 formatting includes the time, but the date in the spreadsheet is formatted as "MM/DD/YYYY".  This will cause the system time zone (my laptop) to be defaulted.  Since this data is more specific and the requirements only care about the date, I deemed this ok as it's likely irrelevant to the consumer.
2. The revenue field is a float with several digits.  There's some precision lost with doing math and float, but the numbers in the results are exactly represented as they were taken from the spreadsheet (no rounding)
3. I believe in data integrity in so far as *present all the data, and let the consumer decide*. As there are a few areas (as stated in the requirements) where data is not sanitized, the code throws an exception and returns a falsy value where it makes sense, either empty or potentially NaN for numbers.  In this way, the property is presented in the json output but is a falsy value, the end user can check the integrity of the source data, or just filter these occurrences out if they wish.
4. There wasn't a circumstance in the sample data of "same person, multiple orders", so there is a sampleData2.tsv file in the *fixtures* directory, and a test case that tests this circumstance. In this regard, there is also a footnote where I drew the assumption that an order with multiple entries, same order Id, has the same date so it's ok to overwrite the value (well, the last value is taken).
5. If the file isn't properly tsv formatted, the end user might get an empty response.  In the real world as this would probably be a library utilized with a REST API or something, I'd return a client error 4XX bad request or unprocessable entity or something like that.
6. If the end user doesn't use the utility correctly, there should be some usage information displayed.
7. I didn't do anything to package this up into a library, but it'd be pretty easy to distribute as an npm.
8. In that vein, I used minimal libraries (lodash I feel is fair, async-fs to make cleaner code when dealing with the file system and new async/await, and some packages for testing) so you'd get a working code sample; whereas in the real world I probably would have used a library to do most of the heavy lifting here, as there are several for quick tsv parsing.

## Why Semicolons
<https://github.com/tc39/ecma262/pull/1062>
