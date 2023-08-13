import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";

const ProductsManagement = () => {
  const hostLogbooks = process.env.REACT_APP_HOST_LOGBOOKS;

  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdate = () => setUpdate(false);
  const openUpdate = () => setUpdate(true);

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const [logbooks, setLogbooks] = React.useState([]);

  const [logbookStatus, setLogbookStatus] = React.useState("");
  const [logbookId, setLogbookId] = React.useState(Number);

  const listStatus = [
    "Đang chờ",
    "Đã xác nhận",
    "Đã từ chối",
    "Đang thực hiện",
    "Đã hoàn thành",
    "Đã huỷ",
  ];

  const [searchTerm, setSearchTerm] = React.useState("");
  const [logbooksByType, setLogbooksByType] = React.useState([]);

  React.useEffect(() => {
    fetch(hostLogbooks, {
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setLogbooks(res.result.data);
        setLogbooksByType(res.result.data);
      })
      .catch((err) => console.log(err));
  }, [hostLogbooks, userDetail.accessToken]);

  const updateStatusLogbook = async (id) => {
    console.log(logbookStatus + "  " + logbookId);
    const response = await fetch(hostLogbooks + id + "/update-status", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: logbookStatus,
      }),
    });

    if (!response.ok) {
      alert("Cập nhật trạng thái thất bại");
      throw new Error("Cập nhật trạng thái thất bại");
    }
    alert("Cập nhật thành trạng thái công");
    window.location = "/logbooks";
  };

  const getDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate(); // Get the day (1-31)
    const month = dateObj.getMonth() + 1; // Get the month (0-11), so we add 1 to get the correct month (1-12)
    const year = dateObj.getFullYear(); // Get the full year

    const result = day + "/" + month + "/" + year;

    return result;
  };

  const all = "Tất cả";
  const recall = "Thu hồi";
  const replace = "Thay thế";
  const repair = "Sửa chữa";
  // const types = [{all: "Tất cả", recall}]

  const SetLogbooksByType = (logbookType) => {
    if (logbookType !== all) {
      let result = logbooks.filter((logbook) => logbook.type === logbookType);
      setLogbooksByType(result);
    } else {
      setLogbooksByType(logbooks);
    }
  };

  const handleSearch = () => {
    searchDevice(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setLogbooks(logbooks);
      handleSearch();
    }
  };

  const searchDevice = (searchTerm) => {
    const searchedDevice =
      searchTerm === ""
        ? logbooks // Return all devices if search term is empty
        : logbooksByType.filter((logbook) =>
            logbook.deviceName.toLowerCase().includes(searchTerm.toLowerCase())
          );
    if (searchTerm === "") {
      window.location = "/logbooks";
    }
    setLogbooksByType(searchedDevice);
  };

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <div className="select">
              <select
                className="form-select"
                id="select-option"
                onChange={(e) => {
                  SetLogbooksByType(e.target.value);
                }}
              >
                <option value={all}>{all}</option>
                <option value={recall}>{recall}</option>
                <option value={replace}>{replace}</option>
                <option value={repair}>{repair}</option>
              </select>
            </div>

            <div className="form-search" style={{ display: "flex", alignItems: "center" }}>
              <input style={{paddingLeft: "10px"}}
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
                    setLogbooks(logbooks);
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
                    <th style={{}}>ID</th>
                    <th style={{ width: "120px" }}>Tên thiết bị</th>
                    <th style={{ width: "140px" }}>Người tạo yêu cầu</th>
                    <th style={{ width: "100px" }}>Loại yêu cầu</th>
                    <th style={{ width: "140px" }}>Mô tả</th>
                    <th style={{ width: "90px" }}>Trạng thái</th>
                    <th style={{ width: "180px" }}>Xác nhận của người dùng</th>
                    <th style={{ width: "70px" }}>Ngày tạo</th>
                    <th style={{ width: "120px" }}>Ngày cập nhật</th>
                    <th style={{}}>Cập nhật trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {logbooksByType?.map((logbook, index) => (
                    <tr key={index} style={{ verticalAlign: "middle" }}>
                      <td>
                        {
                          <img
                            src={logbook.deviceImage}
                            alt="img"
                            style={{ height: "120px", width: "120px" }}
                          />
                        }
                      </td>
                      <td>{logbook.logbookId}</td>
                      <td>{logbook.deviceName}</td>
                      <td title={logbook.userEmail}>{logbook.userName}</td>
                      <td>{logbook.type}</td>
                      <td>{logbook.description}</td>
                      <td>{logbook.status}</td>
                      <td>{logbook.confirmedDescription}</td>
                      <td>{getDate(logbook.createdAt)}</td>
                      <td style={{ paddingLeft: "25px" }}>
                        {getDate(logbook.updatedAt)}
                      </td>
                      <td style={{ paddingLeft: "34px" }}>
                        <button
                          style={{ width: "80px" }}
                          className="btn-update"
                          onClick={() => {
                            setLogbookStatus(logbook.status);
                            setLogbookId(logbook.logbookId);
                            openUpdate();
                          }}
                        >
                          cập nhật
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
          <Modal show={showUpdate} onHide={closeUpdate}>
            <Modal.Header closeButton>
              <Modal.Title>Cập nhật trạng thái yêu cầu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    value={logbookStatus}
                    onChange={(e) => setLogbookStatus(e.target.value)}
                  >
                    <option value="">Chọn trạng thái</option>
                    {listStatus.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeUpdate}>
                Đóng
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  updateStatusLogbook(logbookId);
                  closeUpdate();
                }}
              >
                Xác nhận
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ProductsManagement;
