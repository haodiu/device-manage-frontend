import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";

const LiquidationsManagement = () => {
  const hostLiquidations = process.env.REACT_APP_HOST_LIQUIDATIONS;

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const [liquidations, setLiquidations] = React.useState([]);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [liquidationByDeviceType, setLiquidationByDeviceType] = React.useState(
    []
  );

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
        setLiquidationByDeviceType(res.result.data);
      })
      .catch((err) => console.log(err));
  }, [hostLiquidations, userDetail.accessToken]);

  const downloadLiquidations = async (deviceId) => {
    console.log(deviceId);
    const response = await fetch(hostLiquidations + "download-info", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      alert("Tải file thất bại");
      throw new Error("Failed to download product");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "liquidations.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const getDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate(); // Get the day (1-31)
    const month = dateObj.getMonth() + 1; // Get the month (0-11), so we add 1 to get the correct month (1-12)
    const year = dateObj.getFullYear(); // Get the full year

    const result = day + "/" + month + "/" + year;

    return result;
  };

  const handleSearch = () => {
    searchDevice(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setLiquidations(liquidations);
      handleSearch();
    }
  };

  const searchDevice = (searchTerm) => {
    console.log(searchTerm);
    const searchedDevice =
      searchTerm === ""
        ? liquidations // Return all devices if search term is empty
        : liquidations.filter((liquidation) =>
            liquidation.deviceName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
    if (searchTerm === "") {
      window.location = "/liquidations";
    }
    setLiquidations(searchedDevice);
  };

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
          <div
            className="add-item"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Button
              variant="info"
              onClick={downloadLiquidations}
              className="btn-add"
            >
              Xuất file Excel
            </Button>
          </div>

          <div
            className="form-search"
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              style={{ paddingLeft: "10px" }}
              className="form-search-input"
              type="text"
              placeholder="Nhập tên thiết bị..."
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <span>
              <Button
                className="btn-add"
                variant="info"
                onClick={() => {
                  setLiquidations(liquidations);
                  searchDevice(searchTerm);
                }}
              >
                Tìm kiếm
              </Button>
            </span>
          </div>
          </div>

          <div className="card">
            <div className="card-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th style={{}}></th>
                    <th style={{}}>Tên thiết bị</th>
                    <th style={{}}>Lí do</th>
                    <th style={{ width: "160px", textAlign: "center" }}>
                      Người đề xuất
                    </th>
                    <th style={{ textAlign: "center" }}>Ngày đề xuất</th>
                    <th style={{}}>Xác nhận</th>
                  </tr>
                </thead>
                <tbody>
                  {liquidations?.map((liquidation, index) => (
                    <tr
                      key={index}
                      style={{
                        verticalAlign: "middle",
                        marginLeft: "20px",
                        marginRight: "20px",
                      }}
                    >
                      <td>
                        {
                          <img
                            src={liquidation.deviceImage}
                            alt="img"
                            style={{ height: "120px", width: "120px" }}
                          />
                        }
                      </td>
                      <td style={{ maxWidth: "220px" }}>
                        {liquidation.deviceName}
                      </td>
                      <td style={{ maxWidth: "220px" }}>
                        {liquidation.reason}
                      </td>
                      <td
                        style={{ paddingLeft: "26px" }}
                        title={liquidation.authEmail}
                      >
                        {liquidation.authName}
                      </td>
                      <td style={{ paddingLeft: "20px" }}>
                        {getDate(liquidation.createdAt)}
                      </td>
                      <td>
                        {liquidation.approved ? "Đã xác nhận" : "Chờ xác nhận"}
                      </td>
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
