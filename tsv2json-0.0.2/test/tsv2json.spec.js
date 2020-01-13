const fs = require('async-file');
const chai = require('chai');
const _ = require('lodash');
const tsv2json = require('../lib/tsv2json');
const fixture = './fixtures/sampledata.tsv';
const fixture2 = './fixtures/sampledata2.tsv';
const expect = chai.expect;

chai.use(require('chai-iso8601')());
process.on('unhandledRejection', e => { throw e; });

describe('tsv2json', () => {
  let sampleData;

  before((done) => {
    sampledata = fs.readFile(fixture, { encoding: 'utf-8' })
      .then(data => { sampleData = data.split('\n'); })
      .then(done);
  });

  describe('The customer name comes directly from the “Customer Name” field; use the stored value.', () => {
    it('should use the stored value of the customer name field', (done) => {
      tsv2json
        .parse(fixture)
        .then(json => {
          expect(json['Erin Smith']).to.exist;
          done();
      });
    });
    it('should not have a value that doesnt exist', (done) => {
      tsv2json
        .parse(fixture)
        .then(json => {
          expect(json['Bobby Smith']).to.not.exist;
          done();
        });
    });
  });

  describe('The order date comes from the “Order Date” field.', () => {
    it('should exist from a valid order', (done) => {
      tsv2json
        .parse(fixture)
        .then(json => {
          const orderDate = json['Erin Smith']['orders'][0]['order_date'];
          expect(orderDate).to.exist;
          done();
        });
    });

    it('should be a valid ISO 8601 date', (done) => {
      tsv2json
        .parse(fixture)
        .then(json => {
          const actual = json['Erin Smith']['orders'][0]['order_date'];
          const expected = '2017-09-19T04:00:00.000Z';
          expect(actual).to.be.iso8601(expected);
          done();
        });
    });

    it('should convert to a correct ISO date string', (done) => {
      tsv2json
        .parse(fixture)
        .then(json => {
          const expected = '2017-09-19T04:00:00.000Z';
          const dateString = sampleData[44].split('\t')[2]; // Erin Smith, Order Date 9/19/2017
          const actual = tsv2json.orderDateToISODate(dateString);
          expect(actual).to.be.iso8601(expected);
          done();
        });
    });

    it('should filter all orders after 7/31/2016', (done) => {
      const header = sampleData[0].split('\t');
      const items = _.tail(sampleData);
      const results = _.filter(items, (item) => {
        const fields = item.split('\t');
        const shipDate = fields[3]; // Order Date
        const isoOrderDateIfAfter = tsv2json.getISOOrderDateIfAfter(fields, header, '7/31/2016');
        if (isoOrderDateIfAfter) {
          return true;
        } else {
          return false;
        }
      });
      expect(results.length).to.equal(12);
      done();
    });
  });

  describe('The “order_id” output field comes from the “Order ID” input field.', () => {
    it('should have an order_id property for a given order', (done) => {
      tsv2json
        .parse(fixture)
        .then(json => {
          const expected = 'CA-2016-152156';
          const actual = json['Claire Gute'].orders[0].order_id;
          expect(actual).to.equal(expected);
          done();
        });
    });
  });

  describe('The “line_items” list is constructed from the line items in the input data.', () => {
    it('should have line items', (done) => {
      tsv2json
        .parse(fixture)
        .then(json => {
          const expected = {
            "product_url": "https://www.foo.com/Office%20Supplies/Paper/OFF-PA-10002365",
            "revenue": 15.552
          };
          const actual = json['Andrew Allen'].orders[0].line_items[0];
          expect(actual).to.eql(expected);
          done();
        });
    });

    it('should have multiple line items when combined from same order rows', (done) => {
      tsv2json
        .parse(fixture)
        .then(json => {
          const expected = [{
              "product_url": "https://www.foo.com/Furniture/Bookcases/FUR-BO-10001798",
              "revenue": 261.96
            }, {
              "product_url": "https://www.foo.com/Furniture/Chairs/FUR-CH-10000454",
              "revenue": 731.94
            }];
          const actual = json['Claire Gute'].orders[0].line_items;
          expect(actual.length).to.equal(2);
          expect(actual).to.eql(expected);
          done();
        });
    });
  });

  describe('The product url is constructed from a base url, and the “Category”, “Sub-Category”, and “Product ID” fields.', () => {
    it('should construct a url encoded url string from cat, subcat, and product id', (done) => {
      tsv2json
        .parse(fixture)
        .then(json => {
          const expected = 'https://www.foo.com/Office%20Supplies/Storage/OFF-ST-10003282';
          const actual = json['Erin Smith'].orders[0].line_items[0].product_url;
          expect(actual).to.equal(expected);
          done();
        });
    });
  });

  describe('The “revenue” output field comes from the “Sales” input field, and should be stored as number in the JSON output.', () => {
    it('should show revenue as a decimal value to two digits', (done) => {
      tsv2json
        .parse(fixture)
        .then(json => {
          const expected = 19.46;
          const actual = json['Ken Black'].orders[0].line_items[0].revenue;
          expect(actual).to.equal(expected);
          done();
        });
    });
    it('should render falsy for a non-expected or empty or parse failure', (done) => {
      tsv2json
        .parse(fixture)
        .then(json => {
          const actual = json['Ken Black'].orders[0].line_items[1].revenue;
          expect(actual).to.be.NaN;
          done();
        })
    });
  });

  describe('Same person who has multiple orders should show distict orders records', () => {
    it('should show multiple orders for same person, differing orders', (done) => {
      tsv2json
      .parse(fixture2)
      .then(json => {
        const actual = json['Claire Gute'].orders.length;
        expect(actual).to.equal(2);
        done();
      });
    });
  });

});