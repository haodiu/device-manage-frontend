import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProductChart = () => {
  const hostOrderStatus = process.env.REACT_APP_HOST_STATUS;
  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  const [orders, setOrders] = React.useState([]);
  React.useEffect(() => {
    fetch(hostOrderStatus, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setOrders(data);
      })
  }, [hostOrderStatus, userDetail.token]);
  const categoriesData = {
    labels: orders.map(
      (order) => order.orderStatus.toUpperCase() + ": " + order.amountOrderStatus
    ),
    datasets: [
      {
        label: "# of Votes",
        data: orders.map((order) => order.amountOrderStatus),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(176, 68, 196, 0.2)",
          "rgba(34, 209, 87, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(176, 68, 196, 1)",
          "rgba(34, 209, 87, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  let totalAmountOrderStatus = 0;
  for (let i = 0; i < orders.length; i++) {
    totalAmountOrderStatus = totalAmountOrderStatus + orders[i].amountOrderStatus;
  }
  return (
    <>
      <Doughnut data={categoriesData} />
      <span className="chart-note">
        Tổng đơn hàng: {totalAmountOrderStatus}
      </span>
    </>
  );
};

export default ProductChart;
