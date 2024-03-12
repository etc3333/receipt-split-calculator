import './App.css';
import './css/common.css';

import ReceiptsExcel from './components/ReceiptsExcel';
import Layout from './components/Layout';
import ReceiptVisual from './components/ReceiptVisual';
import Home from './components/Home';

import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App"> 
      <HashRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='receiptExcel' element={<ReceiptsExcel />} />
            <Route path='receiptVisual' element={<ReceiptVisual />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
