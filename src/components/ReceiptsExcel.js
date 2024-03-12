import { useState } from "react";
import * as XLSX from 'xlsx';

import itemsCalculations from '../helperFunctions/itemsCalculations.js';
import '../css/ReceiptsExcel.css';

const ReceiptsExcel = () => {
  const [file, setFile] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [allReceipts, setAllReceipts] = useState([]);

  const fileDownloadButton = () => {
    const filePath = '/static/Receipt-Example.xlsx';
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'Receipt-Example.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function fileChange(event) {
    let file = event.target.files[0];
    setFile(file)
  }

  function submit() {
    const fileRef = file;
    if (fileRef) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const range = XLSX.utils.decode_range(sheet['!ref']);

        let structObject = {
          date: null,
          location: null,
          items: []
        };

        let allReceiptsTemp = [];
        let previousRowEmpty = false;

        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
          const row = [];
          let emptyRow = true;

          for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            let cellValue;

            if (sheet[cellAddress]) {
              let formattedCell = sheet[cellAddress].w;
              if (formattedCell.includes('$')) {
                let price = formattedCell.replace('$', '');
                cellValue = parseFloat(price);
              }
              else if (formattedCell.includes('%')) {
                let percentage = parseFloat(formattedCell.replace('%', ''));
                cellValue = percentage / 100;
              }
              else {
                cellValue = formattedCell;
              }
              emptyRow = false;
            }
            else {
              cellValue = null;
            }
            row.push(cellValue);
          }
          
          if (emptyRow) {
            previousRowEmpty = true;
            allReceiptsTemp.push(structObject);
            structObject = {
              date: null,
              location: null,
              items: []
            };  //reset object
            continue;
          }
          else {
            if (previousRowEmpty || rowNum === 0) {
              previousRowEmpty = false;
              structObject.date = row[0];
              structObject.location = row[1];
              structObject.items = [];
              ++rowNum; //skip next row as they are headers
            }
            else {
              //items in receipt
              structObject.items.push({
                item: row[0],
                price: row[1],
                purchasers: row[2],
                tax: row[3] ? row[3] : 0,
                tip: row[4] ? row[4] : 0 
              });
            }
          }
        }
        allReceiptsTemp.push(structObject); //push last object
        setAllReceipts(allReceiptsTemp);
        setShowReport(true);
      };

      reader.readAsBinaryString(file);
    }
    else {
      alert('Please enter .xlsx file');
    }
  }

  function showDropDown(id) {
    let ref = document.getElementById(id);
    ref.classList.toggle('dropdown-content-show');
  }

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
          Make .xlsx file of specifications below and upload it. Upon submission statistics of the receipt and math will be given.
        </p>
        <h3>Example File</h3>
        <p>
          Upload .xlsx file of this form. <button onClick={fileDownloadButton}>Example .xlsx File</button>
        </p>
        <h3>Overall Specification of .xlsx file:</h3>
        <ul>
          <li>A row with date and location.</li>
          <li>A row of headers with <b>only</b> given headers</li>
          <li>x amount of rows to indcate item purchases</li>
          <li><b>Order of Given Columns Matters</b></li>
          <li>x amount of empty rows to indicate seperate receipt</li>
          <li>Include % for tax and $ price&tip</li>
          <li>Empty cells for <b>only</b> tax&tip columns (assumed to be 0)</li>
          <li>Purchasers is a comma seperated list for who shares cost for item</li>
        </ul>
        <h3>Upload File</h3>
        <input type="file" id="xlsx-file" accept=".xlsx" onChange={e => fileChange(e)}/>
        <button onClick={submit}>Submit</button>
      </>
    )
  }
  else {
    return (
      <>
        <ul className="receipt-list">
          {allReceipts.map((receipt,indexReceipt) => {
            return (
              <div key={`${indexReceipt}-receipt-key`}>
                <li>
                  <h2 onClick={() => showDropDown(indexReceipt)} className="receipt-dropdown-button">{receipt.date} {receipt.location}</h2>
                  <div id={indexReceipt} className="dropdown-content-default">
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
                </li>
              </div>
            )
          })}
        </ul>
      </>
    )
  }


}

export default ReceiptsExcel;