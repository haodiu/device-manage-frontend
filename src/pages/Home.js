import React from "react";
import DeviceChart from "../components/charts/DeviceChart";
import LogbookChart from "../components/charts/LogbookChart";

const Home = () => {
  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="card">
            <div className="card-body">
              <div className="chart-container">
                <div className="chart-info">
                  <DeviceChart />
                </div>

                <div className="chart-info">
                  <LogbookChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
