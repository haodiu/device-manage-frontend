import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";

const ProductsManagement = () => {
  const hostDevices = process.env.REACT_APP_HOST_DEVICES;
  const hostUsers = process.env.REACT_APP_HOST_USERS;
  const hostLogbooks = process.env.REACT_APP_HOST_LOGBOOKS;
  const hostLogbookTypes = process.env.REACT_APP_HOST_LOGBOOK_TYPE;
  const hostDeviceTypes = process.env.REACT_APP_HOST_DEVICE_TYPES;

  const [showAdd, setShowAdd] = React.useState(false);
  const closeAdd = () => setShowAdd(false);
  const openAdd = () => setShowAdd(true);

  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdate = () => setUpdate(false);
  const openUpdate = () => setUpdate(true);

  const [showDeviceLogbook, setStateDeviceLogbook] = React.useState(false);
  const closeDeviceLogbook = () => setStateDeviceLogbook(false);
  const openDeviceLogbook = () => setStateDeviceLogbook(true);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [devicesByType, setDevicesByType] = React.useState([]);

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }
  const [devices, setDevices] = React.useState([]);
  const [deviceUsers, setDeviceUsers] = React.useState([]);
  const [deviceTypes, setDeviceTypes] = React.useState([]);
  const [deviceLogbook, setDeviceLogbook] = React.useState({});

  const [logbookTypes, setLogbookTypes] = React.useState([]);

  const [devicePost, setDevicePost] = React.useState({});

  const [logbookCreate, setLogbookCreate] = React.useState({});

  const [confirmedDescription, setConfirmedDescription] = React.useState("");

  const [deviceId, setDeviceId] = React.useState(Number);

  React.useEffect(() => {
    fetch(hostUsers + userDetail.id + "/devices", {
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setDevices(res.result.data);
        setDevicesByType(res.result.data);
      })
      .catch((err) => console.log(err));

    fetch(hostLogbookTypes, {
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setLogbookTypes(res.result.data);
      })
      .catch((err) => console.log(err));

    fetch(hostDeviceTypes, {
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setDeviceTypes(res.result.data);
        console.log(res.result.data);
      })
      .catch((err) => console.log(err));
  }, [
    hostUsers,
    hostLogbookTypes,
    hostDeviceTypes,
    userDetail.id,
    userDetail.accessToken,
  ]);

  const createLogbook = async () => {
    console.log(logbookCreate);
    const response = await fetch(hostLogbooks, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userDetail.id,
        deviceId: deviceId,
        typeId: logbookCreate.typeId,
        description: logbookCreate.description,
      }),
    });

    if (!response.ok) {
      alert("Tạo yêu cầu thất bại!");
      closeAdd();
      throw new Error("Tạo yêu cầu thất bại");
    }
    const res = await response.json();
    console.log(res.result.data);

    closeAdd();
    alert("Tạo yêu cầu thành công!");
    window.location = "/user-devices";
  };

  const getDeviceLogbook = async (id) => {
    const response = await fetch(hostDevices + id + "/logbook", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.log("logbook not found");
      setDeviceLogbook({});
    }
    const res = await response.json();
    setDeviceLogbook(res.result.data);
  };

  const confirmLogbook = async () => {
    const response = await fetch(
      hostLogbooks + deviceLogbook.logbookId + "/confirm",
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + userDetail.accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmedDescription: confirmedDescription,
        }),
      }
    );
    if (!response.ok) {
      alert("Xác nhận tình trạng thiết bị thất bại");
      throw new Error("Xác nhận tình trạng thiết bị thất bại");
    }
    alert("Xác nhận tình trạng thiết bị thành công");
    window.location = "/user-devices";
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

  const SetDevicesByType = (deviceType) => {
    if (deviceType !== all) {
      let result = devices.filter((device) => device.type?.type === deviceType);
      setDevicesByType(result);
    } else {
      setDevicesByType(devices);
    }
  };

  const handleSearch = () => {
    searchDevice(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setDevices(devices);
      handleSearch();
    }
  };

  const searchDevice = (searchTerm) => {
    const searchedDevice =
      searchTerm === ""
        ? devices // Return all devices if search term is empty
        : devicesByType.filter((device) =>
            device.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
    if (searchTerm === "") {
      window.location = "/user-devices";
    }
    setDevicesByType(searchedDevice);
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
                  SetDevicesByType(e.target.value);
                }}
              >
                <option value={all}>{all}</option>
                {deviceTypes.map((deviceType) => (
                  <option key={deviceType.id} value={deviceType.type}>
                    {deviceType.type}
                  </option>
                ))}
              </select>
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
                    setDevices(devices);
                    searchDevice(searchTerm);
                  }}
                >
                  Tìm kiếm
                </Button>
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <Table className="table-products table-hover">
              <thead>
                <tr>
                  <th style={{}}></th>
                  <th style={{}}>Tên</th>
                  <th style={{}}>Loại</th>
                  <th style={{}}>Giá tiền (Đồng)</th>
                  <th style={{}}>Nơi đặt</th>
                  <th style={{}}>Ngày đặt</th>
                  <th style={{}}>Trạng thái</th>
                  <th>Yêu cầu bảo trì</th>
                  <th>Tạo yêu cầu</th>
                </tr>
              </thead>
              <tbody>
                {devicesByType?.map((device, index) => (
                  <tr key={index} style={{ verticalAlign: "middle" }}>
                    <td>
                      {
                        <img
                          src={device.image}
                          alt="img"
                          style={{ height: "120px", width: "120px" }}
                        />
                      }
                    </td>
                    <td>{device.name}</td>
                    <td>{device.type?.type}</td>
                    <td>{device.price}</td>
                    <td>{device.purchaseLocation}</td>
                    <td>{device.purchaseDate}</td>
                    <td>{device.status}</td>
                    <td>
                      <button
                        style={{ width: "60px", marginLeft: "25px" }}
                        className="btn-update"
                        onClick={() => {
                          getDeviceLogbook(device.id);
                          console.log(deviceLogbook);
                          setDeviceId(device.id);
                          openDeviceLogbook();
                        }}
                      >
                        xem
                      </button>
                    </td>
                    <td>
                      <button
                        style={{ width: "60px" }}
                        className="btn-update"
                        onClick={() => {
                          setDeviceId(device.id);
                          openAdd();
                        }}
                      >
                        tạo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        {/* view logbook */}
        <Modal
          className="modal"
          show={showDeviceLogbook}
          onHide={closeDeviceLogbook}
        >
          <Modal.Header closeButton>
            <Modal.Title>Yêu cầu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="mp-3">
                <Form.Label>Loại yêu cầu</Form.Label>
                <Form.Control
                  type="text"
                  value={deviceLogbook?.type}
                  readOnly={true}
                />
              </Form.Group>

              <Form.Group as={Row} className="mp-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Control
                  type="text"
                  value={deviceLogbook?.status}
                  readOnly={true}
                />
              </Form.Group>

              <Form.Group as={Row} className="mp-3">
                <Form.Label>Mô tả yêu cầu</Form.Label>
                <Form.Control
                  type="text"
                  readOnly={true}
                  value={deviceLogbook?.description}
                />
              </Form.Group>

              <Form.Group as={Row} className="mp-3">
                <Form.Label>Ngày tạo</Form.Label>
                <Form.Control
                  type="text"
                  readOnly={true}
                  value={
                    deviceLogbook?.createdAt && getDate(deviceLogbook.createdAt)
                  }
                />
              </Form.Group>

              <Form.Group as={Row} className="mp-3">
                <Form.Label>Xác nhận của người dùng</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={
                    deviceLogbook?.confirmedDescription
                      ? deviceLogbook.confirmedDescription
                      : "Chưa được xác nhận khi nhận thiết bị"
                  }
                  readOnly={deviceLogbook.confirmed ? true : false}
                  onChange={(e) => setConfirmedDescription(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeDeviceLogbook}>
              Đóng
            </Button>
            {deviceLogbook?.status === "Đã hoàn thành" &&
              deviceLogbook.type === "Sửa chữa" && (
                <Button variant="primary" onClick={() => confirmLogbook()}>
                  Xác nhận
                </Button>
              )}
          </Modal.Footer>
        </Modal>

        {/* create logbooks */}
        <Modal show={showAdd} onHide={closeAdd}>
          <Modal.Header closeButton>
            <Modal.Title>Tạo yêu cầu bảo trì</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="mp-3">
                <Form.Label>Loại yêu cầu</Form.Label>
                <Form.Select
                  type="number"
                  onChange={(e) =>
                    setLogbookCreate({
                      ...logbookCreate,
                      typeId: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={null}>---</option>
                  {logbookTypes?.map((logbookType) => (
                    <option key={logbookType.id} value={logbookType.id}>
                      {logbookType.type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Row} className="mp-3">
                <Form.Label>Mô tả yêu cầu</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) =>
                    setLogbookCreate({
                      ...logbookCreate,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeAdd}>
              Đóng
            </Button>
            <Button variant="primary" onClick={createLogbook}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ProductsManagement;
