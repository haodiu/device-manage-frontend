import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DeviceChart = () => {
  const hostDeviceTypeCount = process.env.REACT_APP_HOST_DEVICE_TYPE_COUNT;
  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  const [deviceTypeCount, setDeviceTypeCount] = React.useState([]);
  React.useEffect(() => {
    fetch(hostDeviceTypeCount, {
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(res => {
        console.log(res.result.data);
        setDeviceTypeCount(res.result.data);
      })
  }, [hostDeviceTypeCount, userDetail.accessToken]);

  function getRandomColor(alpha) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const label = deviceTypeCount?.map(item => item.typeName);
  const data = deviceTypeCount?.map(item => item.amount);
  const chartData = {
    labels: label,
    datasets: [
      {
        label: "Số lượng",
        data: data,
        backgroundColor: deviceTypeCount?.map(() => getRandomColor(0.2)),
        borderColor: deviceTypeCount?.map(() => getRandomColor(1)),
        borderWidth: 1,
      },
    ],
  };

  let total = 0;
  for (let i = 0; i < deviceTypeCount?.length; i++) {
    total = total + deviceTypeCount[i].amount;
  }
  return (
    <>
      <Doughnut data={chartData} />
      <span className="chart-note">
        Tổng số thiết bị: {total}
      </span>
    </>
  );
};

export default DeviceChart;
