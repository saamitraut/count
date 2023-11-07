import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from './components/Table'
import './index.css'

function getMaxCountWithDate(obj1) {
  // Sort the object by ActiveSubscriberCount in descending order.
  obj1.sort((a, b) => b.ActiveSubscriberCount - a.ActiveSubscriberCount);

  // Get the max count object.
  const maxCountObj = obj1[0];

  // Return the date and ActiveSubscriberCount of the max count object.
  return {
    Date: maxCountObj.Date,
    ActiveSubscriberCount: maxCountObj.ActiveSubscriberCount,
  };
}

const CLIENT_OPTIONS = [
  { value: "103.168.94.18:9000", label: "ASCSC" },
  { value: "103.219.0.103:9000", label: "SANGLI" },
  { value: "49.128.162.154:8080", label: "RSSS" },
  { value: "103.189.56.47:82", label: "HUBBLI" },
  { value: "bill.seatvnetwork.com:8081", label: "SEATV" },
  { value: "103.152.40.82:8081", label: "YAMUNANAGAR" },
  { value: "103.163.202.8:8081", label: "QUICKVISION" },
  { value: "103.224.48.116:8081", label: "JGD(KANPUR)" },
  { value: "117.247.88.180:8080", label: "SCCN SIONI" },
  { value: "103.24.135.242:8081", label: "BARWALA" },
  { value: "103.48.44.120:8081", label: "MAHI CABLE" },
  { value: "sms.maxdigitaltv.com:8083", label: "MEGA MAX" },
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
  const [selectedMonth, setSelectedMonth] = useState(MONTH_OPTIONS[9].value);
  const [data, setData] = useState([]);
  
  useEffect(()=>{console.log(data)},[data])
  
  let columns = ['client','Date', 'ActiveSubscriberCount'];
  
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveSubscriberCount = async () => {
      setError(null); // Reset error before making a new request

      const url = `http://${selectedClient}/api/activesubscribercount?year=${selectedYear}&month=${selectedMonth}`;
      // console.log(url);


      let urls=[]
      CLIENT_OPTIONS.forEach(client=>{
        urls.push(`http://${client.value}/api/activesubscribercount?year=${selectedYear}&month=${selectedMonth}`)
      })

      // console.log(urls);
      try {
        // const response = await axios.get(url);
        // if (response.data && response.data.data && response.data.data.length === 0) {
        //   setError("No data available for the selected year and month.");
        // } else {
          
        //   let res=[]; 
        //   res.push(getMaxCountWithDate(response.data.data));
        //   console.log(response.data.data); console.log(res);

        //    setData(res);

        // }
        const axiosInstance = axios.create({
          // Set the timeout to 10 seconds.
          timeout: 20000,
        });
        const promises = [];

        for (const url of urls) {
          // Hit the URL using Axios.
          const promise = axiosInstance.get(url);

          // Add the promise to the promises array.
          promises.push(promise);
        }
        let res=[]; 
        // Wait for all of the promises to resolve.
        Promise.all(promises).then((responses) => {
          // Handle the responses from each URL.
          for (const response of responses) {
            console.log(response.config.url);

            // Split the URL on the `://` character.
            const [protocol, host_and_port] = response.config.url.split("://");

            // Split the host and port on the `:` character.
            const [host, rest] = host_and_port.split("/");

            // Return the host and port.
            console.log(host);

            const label = getLabelFromValue(CLIENT_OPTIONS, host);

            console.log(label); // "ASCSC"
            let data=getMaxCountWithDate(response.data.data)
            res.push({client:label,...data});
          }
        }).then(()=>{
          setData(res);
        })
        
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 403) {
          setError("Access to the requested data is forbidden.");
        } else {
          setError("An error occurred while fetching data.");
        }
      }
    };

    fetchActiveSubscriberCount();
  }, [selectedClient, selectedYear, selectedMonth]);

  // ... (pagination and UI code remains the same)

  return (
    <div>
      <h1 style={{ margin: 'auto', width: '50%', padding: '10px' }}>Active Subscriber Count SMS</h1>

      <div style={{ margin: 'auto', width: '50%', padding: '10px' }}>
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
      
      {error ? (
        <p style={{ color: 'red' , textAlign: 'center'}}>{error}</p>
      ) : (
        <Table data={data} columns={columns} />
      )}
	  
    </div>
  );
};

export default App;
