import { useState, useEffect} from 'react'
import axios from 'axios';
import { GrStatusGood } from "react-icons/gr";
import { GrStatusCritical } from "react-icons/gr";

interface DeviceData {
  name: string,
  date: string,
  serial: string
}

interface ApiResponse {
  switch_sen: SwitchSensor[]; // Define a new interface to match the API response structure
  ping: Ping[],
  sensor: Sensor[]
}

interface Sensor {
  label: string,
  tempc: number,
  highc: number,
  lowc: number,
  enabled: number,
  humid: number,
  highh: number,
  lowh: number,
}

interface SwitchSensor {
  label: string,
  enabled: number
}

interface Ping {
  ip: string,
  status: number,
  enabled: number
}

function App() {
  const [deviceData, setDeviceData] = useState<DeviceData>();
  const [switchSensor, setSwitchSensor] = useState<SwitchSensor[]>([]);
  const [sensor, setSensor] = useState<Sensor[]>([]);
  const [ping, setPing] = useState<Ping[]>([]);

  const URL = 'http://localhost:8080/api/devicedata/ping';
  useEffect(() => {
    axios.get<ApiResponse>(URL)
    .then(res => {
      setSwitchSensor(res.data.switch_sen);
  });
    axios.get<ApiResponse>(URL)
    .then(res => setSensor(res.data.sensor));
    axios.get<ApiResponse>(URL)
    .then(res => setPing(res.data.ping));
    axios.get<DeviceData>(URL)
      .then(res => setDeviceData(res.data));
    // setTimeout(function(){
    //   axios.get(URL)
    //   .then(res => setDeviceData(res.data));
    //   axios.get<Sensor[]>(URL)
    //   .then(res => setSensor(res.data.sensor));
    //   // window.location.reload();
    // }, 5000);
  }, [deviceData])

  return (
    <>
      {deviceData && sensor ? 
      <div className='w-screen overflow-x-hidden'>
        <div>
          <h1 className='text-2xl text-center mt-3'>{deviceData.name} {deviceData.serial} </h1>
          <h2 className='flex text-xl justify-end mr-5'>Latest DateTime retrieved: {deviceData.date}</h2>
        </div>
        <h2 className='text-xl font-bold mt-5 ml-7'>Temperature Sensors</h2>
        <table className="table table-bordered table-striped mx-4">
          <thead>
            <tr>
              <th>Label</th>
              <th>Temperature</th>
              <th>Highest Temperature</th>
              <th>Lowest Temperature</th>
              <th>Humidity</th>
              <th>Highest Humidity</th>
              <th>Lowest Humidty</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sensor.map(sensor => 
              <tr>
                <td className='font-bold'>{sensor.label}</td>
                <td>{sensor.tempc}</td>
                <td>{sensor.highc}</td>
                <td>{sensor.lowc}</td>
                <td>{sensor.humid}</td>
                <td>{sensor.highh}</td>
                <td>{sensor.lowh}</td>
                <td>{sensor.enabled === 1 ? <GrStatusGood color="green"/> : <GrStatusCritical color="red"/>}</td>
              </tr>)}
          </tbody>
          </table>
          <div className={`grid grid-cols-${switchSensor.length + 1} mx-5`}>
              <div className='col'>
                <h2 className='text-xl font-bold mt-5 ml-3'>Switch Sensors</h2>
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                  {switchSensor.map(switchSensor => 
                      <tr>
                        <td className='font-bold'>{switchSensor.label}</td>
                        <td>{switchSensor.enabled === 1 ? <GrStatusGood color="green"/> : <GrStatusCritical color="red"/>}</td>
                    </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {ping && 
              <div className='col'>
                    <h2 className='text-xl font-bold mt-5 ml-3'>Ping</h2>
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>IP</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{ping[0].ip}</td>
                          <td>{ping[0].enabled === 1 ? <GrStatusGood color="green"/> : <GrStatusCritical color="red"/>}</td>
                        </tr>
                      </tbody>
                    </table>
              </div>
          }
          </div>
          {/* <div className='flex-col text-center justify-center'>
          </div> */}
      </div> 
      : 
      <div className='h-screen flex items-center justify-center'>
          <span className="center text-center loading loading-spinner loading-md"></span>
      </div>
      }
    </>
  )
}

export default App
