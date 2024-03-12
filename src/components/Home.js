import '../css/Home.css';

const Home = () => {
  return (
    <>
      <h2>Application Information</h2>
      <p>
        Small application for tallying up receipt information.
      </p>
      <h3>Receipt Format (Excel File)</h3>
      <table>
        <tbody>
          <tr>
            <td>Date</td>
            <td>Location</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Item</td>
            <td>Price</td>
            <td>Purchasers</td>
            <td>Tax</td>
            <td>Tip</td>
          </tr>
          <tr>
            <td>ItemName1</td>
            <td>ItemPrice1</td>
            <td>ItemPurchasers1</td>
            <td>ItemTax1</td>
            <td>ItemTip1</td>
          </tr>
          <tr>
            <td>ItemName2</td>
            <td>ItemPrice2</td>
            <td>ItemPurchasers2</td>
            <td>ItemTax2</td>
            <td>ItemTip2</td>
          </tr>
        </tbody>
      </table>
      <br />
      Row 1: General Receipt Info
      <ul>
        <li>08/22/2019</li>
        <li>Costco</li>
      </ul>
      Row 2: Headers (keep headers as is <b>DO NOT CHANGE</b>)
      <ul>
        <li>Item</li>
        <li>Price</li>
        <li>Purchasers</li>
        <li>Tax</li>
        <li>Tip</li>
      </ul>
      Row 3+: List of Items
      <ul>
        <li>Beef</li>
        <li>$12.04</li>
        <li>henry,leslie,kyle</li>
        <li>7.75%</li>
        <li>$10.00</li>
      </ul>
      <h3>Format Notes</h3>
      <ul>
        <li>Keep row/column orders as in the example</li>
        <li>Keep Units in Price($), Tax(%), Tip($)</li>
        <li>Purchasers is a comma sepeated list</li>
        <li>Row 1 has 3 empty cells</li>
        <li><b>Only tax and tip</b> in each item can be left blank (will be interpreted as 0 (no tax/tip))</li>
      </ul>
    </>
  )
}

export default Home;