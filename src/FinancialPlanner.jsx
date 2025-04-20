import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './Login';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function FinancialPlanner() {
  const [user, setUser] = useState(auth.currentUser);
  const [income, setIncome] = useState(5000);
  const [car, setCar] = useState(400);
  const [housing, setHousing] = useState(1000);
  const [tsp, setTsp] = useState(500);
  const [savings, setSavings] = useState(100000);
  const [age, setAge] = useState(58);
  const [target, setTarget] = useState(68);

  // 🔁 Load data after login
  useEffect(() => {
    if (user) {
      loadDataFromFirestore();
    }
  }, [user]);

  const calculateRetirement = () => {
    let futureValue = savings;
    const monthlyRate = 0.10 / 12;
    const months = (target - age) * 12;
    for (let i = 0; i < months; i++) {
      futureValue = futureValue * (1 + monthlyRate) + tsp;
    }
    return futureValue.toFixed(2);
  };

  const discretionary = income - (car + housing + tsp);
  const emergencyFundTarget = (car + housing) * 6;

  const exportToExcel = () => {
    const data = [{
      Income: income,
      Car: car,
      Housing: housing,
      TSP: tsp,
      Savings: savings,
      Age: age,
      TargetRetirementAge: target,
      ProjectedRetirementSavings: calculateRetirement(),
      Discretionary: discretionary,
      EmergencyFund: emergencyFundTarget
    }];
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FinancialSummary");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "Will_Wealth_Commander.xlsx");

    // 💾 Also save to Firestore
    saveDataToFirestore();
  };

  // 💾 Save to Firestore
  const saveDataToFirestore = async () => {
    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, {
        income, car, housing, tsp, savings, age, target
      });
      alert("💾 Saved to cloud!");
    } catch (err) {
      alert("❌ Save failed: " + err.message);
    }
  };

  // 📥 Load from Firestore
  const loadDataFromFirestore = async () => {
    try {
      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIncome(data.income || 0);
        setCar(data.car || 0);
        setHousing(data.housing || 0);
        setTsp(data.tsp || 0);
        setSavings(data.savings || 0);
        setAge(data.age || 0);
        setTarget(data.target || 0);
      } else {
        console.log("No saved data yet.");
      }
    } catch (err) {
      alert("❌ Load failed: " + err.message);
    }
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div>
      <h1>💼 Welcome, {user.email}</h1>
      <button onClick={exportToExcel}>📊 Export to Excel & Save</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FinancialPlanner />
  </React.StrictMode>
);

export default FinancialPlanner;
