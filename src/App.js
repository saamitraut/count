import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Table from './components/Table';
import './index.css';
import logo from './planetcast.png';

function getMaxCountWithDate(obj1) {
  obj1.sort((a, b) => b.ActiveSubscriberCount - a.ActiveSubscriberCount);
  const maxCountObj = obj1[0];
  return {
    Date: maxCountObj.Date,
    ActiveSubscriberCount: maxCountObj.ActiveSubscriberCount,
  };
}

const CLIENT_OPTIONS = [
  { value: "103.168.94.18:9000", label: "AURANGABAD SATELLITE CABLE SERVICE CENTRE" },
  { value: "103.219.0.103:9000", label: "Sangli Media Communication" },
  { value: "49.128.162.154:8080", label: "Reachnet Media" },
  { value: "103.189.56.47:82", label: "Balaji cable Network" },
  { value: "bill.seatvnetwork.com:8081", label: "Sea TV Network Ltd" },
  { value: "103.152.40.82:8081", label: "Cable Operator Association of Yamuna Nagar N Jagadhri" },
  { value: "103.163.202.8:8081", label: "Quick Vision" },
  { value: "103.224.48.116:8081", label: "JGD Infotainment Pvt Ltd" },
  { value: "117.247.88.180:8080", label: "shri sai cable Network" },
  { value: "103.24.135.242:8081", label: "Sona Cable Network" },
  { value: "103.48.44.120:8081", label: "Narnaul Cable services  Pvt Ltd" },
  { value: "sms.maxdigitaltv.com:8083", label: "Mega Max Tv Pvt Ltd" },
  { value: "sms.pioneerdigitaltv.in:8080", label: "Pioneer Elabs Limited" },
  { value: "", label: "Rajmoti" },
  { value: "", label: "Shanti Cable Network" },
  { value: "", label: "Deep Cable Network" },
  { value: "", label: "Raj Cable" },
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

function getLabelFromValue(clientOptions, value) {
  for (const clientOption of clientOptions) {
    if (clientOption.value === value) {
      return clientOption.label;
    }
  }
  return null;
}

const App = () => {
  const [selectedClient, setSelectedClient] = useState(CLIENT_OPTIONS[0].value);
  const [selectedYear, setSelectedYear] = useState(YEAR_OPTIONS[0].value);
  const [selectedMonth, setSelectedMonth] = useState(MONTH_OPTIONS[6].value);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const columns = ['Serial No', 'MSO Name', 'Date', 'Highest Active Count'];

  useEffect(() => {
    const fetchActiveSubscriberCount = async () => {
      setError(null);
      setLoading(true);

      const promises = CLIENT_OPTIONS.map(async (client, index) => {
        try {
          if (client.value) {
            const url = `http://${client.value}/api/activesubscribercount?year=${selectedYear}&month=${selectedMonth}`;
            const axiosInstance = axios.create({
              timeout: 20000,
            });
            const response = await axiosInstance.get(url);
            const [protocol, host_and_port] = response.config.url.split("://");
            const [host, rest] = host_and_port.split("/");
            const label = getLabelFromValue(CLIENT_OPTIONS, host);
            const maxCountData = getMaxCountWithDate(response.data.data);
            return { 'Serial No': index + 1, 'MSO Name': label, Date: maxCountData.Date, 'Highest Active Count': maxCountData.ActiveSubscriberCount };
          } else {
            const label = client.label;
            return { 'Serial No': index + 1, 'MSO Name': label, Date: "-", 'Highest Active Count': 0 };
          }
        } catch (error) {
          console.log(`Error fetching data for ${client.label}:`, error);
          return null;
        }
      });

      try {
        const res = await Promise.all(promises);
        const filteredRes = res.filter((item) => item !== null);
        setData(filteredRes);
      } catch (error) {
        console.log('Error in Promise.all:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSubscriberCount();
  }, [selectedClient, selectedYear, selectedMonth]);

  const exportDataToExcel = () => {
    if (data.length > 0) {
      const selectedMonthOption = MONTH_OPTIONS.find(option => option.value === parseInt(selectedMonth, 10));

      if (selectedMonthOption) {
        const monthLabel = selectedMonthOption.label;
        const fileName = `highest_count_${monthLabel}_${selectedYear}.xlsx`;

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, fileName);
      } else {
        console.warn('Selected month not found in MONTH_OPTIONS.');
      }
    } else {
      console.warn('No data to export.');
    }
  };

  return (
    <div>
      <img src={logo} alt="Planetcast Logo" style={{ maxWidth: '100%', height: 'auto' }} />
      <h1 style={{ margin: 'auto', width: '50%', padding: '10px' }}>Active Subscriber Count SMS</h1>

      <div style={{ margin: 'auto', width: '50%', padding: '10px', display: 'none' }}>
        <label style={{ color: 'black', fontWeight: 'bold', fontSize: '20px' }}>Client:</label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          style={{
            WebkitAppearance: 'none',
            width: '60%',
            fontSize: '1.15rem',
            padding: '0.675em 6em 0.675em 1em',
            backgroundColor: '#fff',
            border: '1px solid #caced1',
            borderRadius: '0.25rem',
            color: '#000',
            cursor: 'pointer'
          }}>
          {CLIENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ margin: 'auto', width: '50%', padding: '10px' }}>
        <label style={{ color: 'black', fontWeight: 'bold', fontSize: '20px' }}>Year:</label>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{
          WebkitAppearance: 'none',
          width: '62%',
          fontSize: '1.15rem',
          padding: '0.675em 6em 0.675em 1em',
          backgroundColor: '#fff',
          border: '1px solid #caced1',
          borderRadius: '0.25rem',
          color: '#000',
          cursor: 'pointer'
        }}>
          {YEAR_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ margin: 'auto', width: '50%', padding: '10px' }}>
        <label style={{ color: 'black', fontWeight: 'bold', fontSize: '20px' }}>Month:</label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{
          WebkitAppearance: 'none',
          width: '59%',
          fontSize: '1.15rem',
          padding: '0.675em 6em 0.675em 1em',
          backgroundColor: '#fff',
          border: '1px solid #caced1',
          borderRadius: '0.25rem',
          color: '#000',
          cursor: 'pointer'
        }}>
          {MONTH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ margin: 'auto', width: '50%', padding: '10px' }}>
        <button onClick={exportDataToExcel} style={{ fontSize: '1rem', padding: '0.5em 1em', cursor: 'pointer' }}>
          Export Data to Excel
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Searching data. Please wait...</p>
      ) : error ? (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      ) : (
        <Table data={data} columns={columns} />
      )}
    </div>
  );
};

export default App;
