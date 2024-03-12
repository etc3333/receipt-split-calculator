import { useState } from "react";

import itemsCalculations from '../helperFunctions/itemsCalculations.js';

const ReceiptVisual = () => {
  const [textareaValue, setTextareaValue] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [receipt, setReceipt] = useState({
    date: null,
    location: null,
    items: null
  });

  function handleTextareaChange(e) {
    setTextareaValue(e.target.value);
  };

  function handleSubmit() {
    const newValuesArray = textareaValue.split(/\t|\n/);
    let numberOfColumns = 5;

    let itemsArray = [];
    let date = null;
    let location = null;

    for (let i = 0; i < newValuesArray.length; i = i + numberOfColumns) {
      if (i === 0) {
        //row1
        date = newValuesArray[i];
        location = newValuesArray[i + 1];
      }
      else if (i === numberOfColumns) {
        //row2
        continue;
      }
      else {
        let price =  parseFloat(newValuesArray[i+1].replace('$', ''));
        let tax = newValuesArray[i+3] ? parseFloat(newValuesArray[i+3].replace('%', ''))/100 : 0;
        let tip = newValuesArray[i+4] ? parseFloat(newValuesArray[i+4].replace('$', '')) : 0;

        itemsArray.push({
          item: newValuesArray[i],
          price: price,
          purchasers: newValuesArray[i+2],
          tax: tax,
          tip: tip
        })
      }
    }
    setReceipt({
      date,
      location,
      items: itemsArray,
    });
    setShowReport(true);
  };

  function calculations(receipt) {
    let statsObject = itemsCalculations(receipt.items);

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Stat</th>
              <th>Value</th>
              <th>Math</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Total No Tax
              </td>
              <td>
                {statsObject.totalSummationNoTax}
              </td>
              <td>
                {statsObject.totalSummationNoTaxString}
              </td>
            </tr>
            <tr>
              <td>
                Total With Tax 
              </td>
              <td>
                {statsObject.totalSummationWithTax}
              </td>
              <td>
                {statsObject.totalSummationWithTaxString}
              </td>
            </tr>
            <tr>
              <td>
                Total With Tax & Tip
              </td>
              <td>
                {statsObject.totalSummationWithTaxandTip}
              </td>
              <td>
                {statsObject.totalSummationWithTaxandTipString}
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>Person</th>
              <th>Price+Tax+Tip</th>
              <th>Math</th>
            </tr>
          </thead>
          <tbody>
            {statsObject.arrayPeopleData.map((person, index) => {
              return (
                <tr key={`${index}-people-key`}>
                  <td>
                    {person.name}
                  </td>
                  <td>
                    {person.priceTaxTip}
                  </td>
                  <td>
                    {person.priceTaxTipString}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  if (!showReport) {
    return (
      <>
        <h2>Receipt Excel</h2>
        <h3>Instructions</h3>
        <p>
          From the Receipt Format in Excel File, copy & paste the full receipt into the input portion.
        </p>
        <h3>Specification of Receipt Format</h3>
        <ul>
          <li>A row with date and location.</li>
          <li>A row of headers with <b>only</b> given headers</li>
          <li>x amount of rows to indcate item purchases</li>
          <li><b>Order of Given Columns Matters</b></li>
          <li>Include % for tax and $ price&tip</li>
          <li>Empty cells for <b>only</b> tax&tip columns (assumed to be 0)</li>
          <li>Purchasers is a comma seperated list for who shares cost for item</li>
        </ul>
        <h3>Example of Steps</h3>
        <textarea
          value={textareaValue}
          onChange={(e) => handleTextareaChange(e)}
          placeholder="Copy & Paste from Excel file"
          style={{width: '100%', height: '200px'}}
        />
        <button onClick={handleSubmit}>Submit</button>
      </>
    );
  }
  else {
    return (
      <>
        <div>
          <h2>{receipt.date} {receipt.location}</h2>
          <div>
            <h3>Receipt Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Purchasers</th>
                  <th>Tax</th>
                  <th>Tip</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item, indexItem) => {
                  return (
                    <tr key={`${indexItem}-item-key`}>
                      <td>{item.item}</td>
                      <td>{item.price}</td>
                      <td>{item.purchasers}</td>
                      <td>{item.tax}</td>
                      <td>{item.tip}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <h3>Calculations</h3>
            {calculations(receipt)}
          </div>
        </div>
      </>
    )
  }
}

export default ReceiptVisual;