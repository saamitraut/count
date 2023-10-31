import React, { useState, useEffect } from "react";
import axios from "axios";
import './index.css'

const CLIENT_OPTIONS = [
  { value: "103.168.94.18", label: "ASCSC" },
  { value: "103.219.0.103", label: "SANGLI" },
];

const YEAR_OPTIONS = [
  { value: 2023, label: 2023 },
  { value: 2024, label: 2024 },
];

const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const App = () => {
  const [selectedClient, setSelectedClient] = useState(CLIENT_OPTIONS[0].value);
  const [selectedYear, setSelectedYear] = useState(YEAR_OPTIONS[0].value);
  const [selectedMonth, setSelectedMonth] = useState(MONTH_OPTIONS[9].value);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchActiveSubscriberCount = async () => {
      let url=`http://${selectedClient}:9000/api/activesubscribercount?year=${selectedYear}&month=${selectedMonth}`
      console.log(url);
      const response = await axios.get(
        url
      );
      setData(response.data.data);
    };

    fetchActiveSubscriberCount();
  }, [selectedClient, selectedYear, selectedMonth]);

  return (
    <div>
      <h1>Active Subscriber Count</h1>

      <div>
        <label>Client:</label>
        <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
          {CLIENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Year:</label>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {YEAR_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Month:</label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {MONTH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Active Subscriber Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.Date}>
              <td>{item.Date}</td>
              <td>{item.ActiveSubscriberCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
