import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProductChart = () => {
  const hostLogbookTypeCount = process.env.REACT_APP_HOST_LOGBOOK_TYPE_COUNT;
  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  const [logbookTypeCount, setLogbookTypeCount] = React.useState([]);
  React.useEffect(() => {
    fetch(hostLogbookTypeCount, {
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(res => {
        console.log(res.result.data);
        setLogbookTypeCount(res.result.data);
      })
  }, [hostLogbookTypeCount, userDetail.accessToken]);

  function getRandomColor(alpha) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const label = logbookTypeCount?.map(item => item.typeName);
  const data = logbookTypeCount?.map(item => item.amount);
  const chartData = {
    labels: label,
    datasets: [
      {
        label: "Số lượng",
        data: data,
        backgroundColor: logbookTypeCount?.map(() => getRandomColor(0.2)),
        borderColor: logbookTypeCount?.map(() => getRandomColor(1)),
        borderWidth: 1,
      },
    ],
  };

  let total = 0;
  for (let i = 0; i < logbookTypeCount?.length; i++) {
    total = total + logbookTypeCount[i].amount;
  }
  return (
    <>
      <Doughnut data={chartData} />
      <span className="chart-note">
        Tổng số yêu cầu: {total}
      </span>
    </>
  );
};

export default ProductChart;
