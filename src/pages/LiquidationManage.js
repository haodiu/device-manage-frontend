import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";

const LiquidationsManagement = () => {
  const hostLiquidations = process.env.REACT_APP_HOST_LIQUIDATIONS;

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const [liquidations, setLiquidations] = React.useState([]);

  React.useEffect(() => {
    fetch(hostLiquidations, {
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setLiquidations(res.result.data);
      })
      .catch((err) => console.log(err));
  }, [hostLiquidations, userDetail.accessToken]);

  const getDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate(); // Get the day (1-31)
    const month = dateObj.getMonth() + 1; // Get the month (0-11), so we add 1 to get the correct month (1-12)
    const year = dateObj.getFullYear(); // Get the full year

    const result = day + "/" + month + "/" + year;

    return result;
  };

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top"></div>

          <div className="card">
            <div className="card-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th style={{}}></th>
                    <th style={{}}>Tên thiết bị</th>
                    <th style={{}}>Lí do</th>
                    <th style={{width: "160px", textAlign: "center"}}>Người đề xuất</th>
                    <th style={{ textAlign: "center" }}>Ngày đề xuất</th>
                    <th style={{}}>Xác nhận</th>
                  </tr>
                </thead>
                <tbody>
                  {liquidations?.map((liquidation, index) => (
                    <tr key={index} style={{ verticalAlign: "middle", marginLeft: "20px", marginRight: "20px"}}>
                      <td>
                        {
                          <img
                            src={liquidation.deviceImage}
                            alt="img"
                            style={{ height: "120px", width: "120px" }}
                          />
                        }
                      </td>
                      <td style={{maxWidth: "220px"}}>{liquidation.deviceName}</td>
                      <td style={{maxWidth: "220px"}}>{liquidation.reason}</td>
                      <td style={{paddingLeft: '26px'}} title={liquidation.authEmail}>
                        {liquidation.authName}
                      </td>
                      <td style={{paddingLeft: '20px'}}>{getDate(liquidation.createdAt)}</td>
                      <td>{liquidation.approved? "Đã xác nhận" : "Chờ xác nhận"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiquidationsManagement;
