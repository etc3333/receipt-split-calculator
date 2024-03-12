const itemsCalculations = (items) => {
  let itemsArray = items;

  //arraypeople and arraypeopledata are related by index. Seperated just for searching easier
  let arrayPeople = [];
  let arrayPeopleData = [];

  let totalSummationNoTax = 0;
  let totalSummationWithTax = 0;
  let totalSummationWithTaxandTip = 0;
  let totalSummationNoTaxString = '';
  let totalSummationWithTaxString = '';
  let totalSummationWithTaxandTipString = '';

  for (let i = 0; i < itemsArray.length; i++) {
    let price = itemsArray[i].price;
    let tax = itemsArray[i].tax;
    let tip = itemsArray[i].tip;

    totalSummationNoTax += price;
    totalSummationWithTax += price + (price * tax);
    totalSummationWithTaxandTip += price + (price * tax) + tip;
    totalSummationNoTaxString += totalSummationNoTaxString.length === 0 ? `(${price})` : ` + (${price})`;
    totalSummationWithTaxString += totalSummationWithTaxString.length === 0 ? `(${price} + ${price}*${tax})` : ` + (${price} + ${price}*${tax})`;
    totalSummationWithTaxandTipString += totalSummationWithTaxandTipString.length === 0 ? `(${price} + ${price}*${tax} + ${tip})` : ` + (${price} + ${price}*${tax} + ${tip})`;

    //calculate individual splitting receipt
    let itemsArrayPurchasersSplit = itemsArray[i].purchasers.split(',').map(name => name.trim());
    let totalPurchasers = itemsArrayPurchasersSplit.length;
    itemsArrayPurchasersSplit.forEach((name) => {
      let index = arrayPeople.indexOf(name);
      if (index === -1) {
        arrayPeople.push(name);
        arrayPeopleData.push({
          name,
          priceTaxTip: (price + (price * tax) + tip)/totalPurchasers,
          priceTaxTipString: `((${price} + ${price}*${tax} + ${tip})/${totalPurchasers})`
        });
      }
      else {
        arrayPeopleData[index].priceTaxTip += (price + (price * tax) + tip)/totalPurchasers;
        arrayPeopleData[index].priceTaxTipString += ` + ((${price} + ${price}*${tax} + ${tip})/${totalPurchasers})`;
      }
    })
  }
  return {
    totalSummationNoTax,
    totalSummationWithTax,
    totalSummationWithTaxandTip,
    totalSummationNoTaxString,
    totalSummationWithTaxString,
    totalSummationWithTaxandTipString,
    arrayPeopleData
  }
}

export default itemsCalculations;