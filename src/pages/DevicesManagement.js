import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";

const ProductsManagement = () => {
  const hostDevices = process.env.REACT_APP_HOST_DEVICES;
  const hostDeviceUsers = process.env.REACT_APP_HOST_DEVICE_USERS;
  const hostDeviceTypes = process.env.REACT_APP_HOST_DEVICE_TYPES;
  const hostLiquidations = process.env.REACT_APP_HOST_LIQUIDATIONS;

  const [showAdd, setShowAdd] = React.useState(false);
  const closeAdd = () => setShowAdd(false);
  const openAdd = () => setShowAdd(true);

  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdate = () => setUpdate(false);
  const openUpdate = () => setUpdate(true);

  const [showLiquidation, setShowLiquidation] = React.useState(false);
  const closeLiquidation = () => setShowLiquidation(false);
  const openLiquidation = () => setShowLiquidation(true);

  const [showDeviceLogbooks, setStateDeviceLogbooks] = React.useState(false);
  const closeDeviceLogbooks = () => setStateDeviceLogbooks(false);
  const openDeviceLogbooks = () => setStateDeviceLogbooks(true);

  const [searchTerm, setSearchTerm] = React.useState("");

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }
  const [devices, setDevices] = React.useState([]);
  const [deviceUsers, setDeviceUsers] = React.useState([]);
  const [deviceTypes, setDeviceTypes] = React.useState([]);
  const [deviceLogbooks, setDeviceLogbooks] = React.useState([]);

  const [devicePost, setDevicePost] = React.useState({});

  const [deviceIdForLiquidation, setDeviceIdForLiquidation] =
    React.useState(Number);
  const [reason, setReason] = React.useState("");

  const [devicesByType, setDevicesByType] = React.useState([]);

  //for update products
  const [deviceUpdate, setDeviceUpdate] = React.useState({});

  React.useEffect(() => {
    fetch(hostDevices, {
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

    fetch(hostDeviceUsers, {
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setDeviceUsers(res.result.data);
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
  }, [hostDevices, hostDeviceUsers, hostDeviceTypes, userDetail.accessToken]);

  const createDevice = async () => {
    if (!devicePost.typeId) {
      devicePost.typeId = deviceTypes[0].id;
    }
    if (!devicePost.userId) {
      devicePost.userId = null;
    }

    const response = await fetch(hostDevices, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: devicePost.name,
        typeId: devicePost.typeId,
        userId: devicePost.userId,
        deviceStatus: devicePost.deviceStatus,
        purchaseLocation: devicePost.purchaseLocation,
        purchaseDate: devicePost.purchaseDate,
        price: devicePost.price,
        image: devicePost.image,
      }),
    });

    if (!response.ok) {
      alert("Thêm thiết bị không thành công!");
      closeAdd();
      throw new Error("Thêm thiết bị không thành công");
    }
    const res = await response.json();
    console.log(res.result.data);

    closeAdd();
    window.location = "/devices";
    alert("Đã thêm thiết bị thành công!");
  };

  const deleteDevice = async (id) => {
    console.log("delete device has id: " + id);
    const response = await fetch(hostDevices + id + "/soft-delete", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alert("Xoá thông tin thiết bị thất bại");
      throw new Error("Xoá thiết bị thất bại");
    }
    window.location = "/devices";
  };

  const updateDevice = async (id) => {
    console.log(deviceUpdate);
    const response = await fetch(hostDevices + id + "/update", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: deviceUpdate.name,
        typeId: deviceUpdate.type?.id,
        userId: deviceUpdate.user?.id,
        deviceStatus: deviceUpdate.deviceStatus,
        purchaseLocation: deviceUpdate.purchaseLocation,
        purchaseDate: deviceUpdate.purchaseDate,
        price: deviceUpdate.price,
        image: deviceUpdate.image,
      }),
    });

    if (!response.ok) {
      throw new Error("Cập nhật thiết bị không thành công");
    }
    alert("Cập nhật thành công");
    window.location = "/devices";
  };

  const getDeviceLogbooks = async (id) => {
    const response = await fetch(hostDevices + id + "/logbooks", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    const res = await response.json();
    setDeviceLogbooks(res.result.data);
  };

  const liquidateDevice = async (deviceId) => {
    console.log(deviceId + "  " + reason);
    const response = await fetch(hostLiquidations, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceId: deviceId,
        reason: reason,
      }),
    });
    if (!response.ok) {
      alert("Đề xuất thanh lý không thành công");
      throw new Error("Failed to update product");
    }
    alert("Đề xuất thanh lý thành công");
    window.location = "/devices";
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
      window.location = "/devices";
    }
    setDevicesByType(searchedDevice);
  };

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <div className="add-item" style={{ display: "flex", alignItems: "center" }}>
              <Button variant="info" onClick={openAdd} className="btn-add">
                Thêm thiết bị
              </Button>
              
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
                    setDevices(devices);
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
                    <th style={{ textAlign: "center" }}></th>
                    <th style={{ width: "100px" }}>Tên</th>
                    <th style={{ width: "60px" }}>Loại</th>
                    <th style={{ textAlign: "center" }}>Giá (đồng)</th>
                    <th style={{ width: "100px" }}>Nơi đặt</th>
                    <th style={{ width: "80px" }}>Ngày đặt</th>
                    <th style={{ width: "120px" }}>Trạng thái</th>
                    <th style={{ textAlign: "center" }}>Người quản lý</th>
                    <th style={{ textAlign: "center" }}>Yêu cầu</th>
                    <th style={{ textAlign: "center" }}>Cập nhật</th>
                    <th style={{ paddingLeft: "22px" }}>Xoá</th>

                    <th style={{ width: "100px" }}>Thanh lý</th>
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
                      <td>{device.type.type}</td>
                      <td>{device.price}</td>
                      <td>{device.purchaseLocation}</td>
                      <td>{device.purchaseDate}</td>
                      <td>{device.status}</td>
                      <td title={device.user ? device.user.email : ""}>
                        {device.user ? device.user.name : ""}
                      </td>
                      <td>
                        <button
                          style={{ width: "60px" }}
                          className="btn-update"
                          onClick={() => {
                            getDeviceLogbooks(device.id);
                            console.log(deviceLogbooks);
                            openDeviceLogbooks();
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
                            setDeviceUpdate(device);
                            openUpdate();
                          }}
                        >
                          sửa
                        </button>
                      </td>
                      <td>
                        {
                          <button
                            style={{ width: "60px" }}
                            className="btn-delete"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Bạn thật sự muốn xoá thiết bị này? Hãy đảm bảo thiết bị không có người đang sử dụng!"
                                )
                              )
                                deleteDevice(device.id);
                            }}
                          >
                            xoá
                          </button>
                        }
                      </td>
                      <td>
                        {
                          <button
                            style={{ width: "60px" }}
                            className="btn-delete"
                            onClick={() => {
                              setDeviceIdForLiquidation(device.id);
                              openLiquidation();
                            }}
                          >
                            đề xuất
                          </button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          {/* create device */}
          <Modal className="modal" show={showAdd} onHide={closeAdd}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm thiết bị</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Tên</Form.Label>
                  <Form.Control
                    id="inputTen"
                    type="text"
                    placeholder="Tên thiết bị"
                    onChange={(e) =>
                      setDevicePost({
                        ...devicePost,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Loại</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setDevicePost({
                        ...devicePost,
                        typeId: parseInt(e.target.value),
                      })
                    }
                  >
                    {deviceTypes?.map((deviceType) => (
                      <option key={deviceType.id} value={deviceType.id}>
                        {deviceType.type}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Giá (Đồng)</Form.Label>
                  <Form.Control
                    id="inputGia"
                    type="number"
                    pattern="/^[0-9]\d*$/"
                    placeholder="Giá tiền"
                    onChange={(e) =>
                      setDevicePost({
                        ...devicePost,
                        price: parseInt(e.target.value),
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Nơi đặt</Form.Label>
                  <Form.Control
                    id="inputNoiDat"
                    type="text"
                    placeholder="Nơi đặt"
                    onChange={(e) =>
                      setDevicePost({
                        ...devicePost,
                        purchaseLocation: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Ngày đặt</Form.Label>
                  <Form.Control
                    id="inputNgayDat"
                    type="text"
                    placeholder="Ngày đặt"
                    onChange={(e) =>
                      setDevicePost({
                        ...devicePost,
                        purchaseDate: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Hình ảnh</Form.Label>
                  <Form.Control
                    id="inputNgayDat"
                    type="text"
                    placeholder="Hình ảnh"
                    onChange={(e) =>
                      setDevicePost({
                        ...devicePost,
                        image: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Người quản lý</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setDevicePost({
                        ...devicePost,
                        userId: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={null}>{""}</option>
                    {deviceUsers?.map((deviceUser) => (
                      <option key={deviceUser.id} value={deviceUser.id}>
                        {deviceUser.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeAdd}>
                Đóng
              </Button>
              <Button variant="primary" onClick={createDevice}>
                Xác nhận
              </Button>
            </Modal.Footer>
          </Modal>

          {/* update device  */}
          <Modal show={showUpdate} onHide={closeUpdate}>
            <Modal.Header closeButton>
              <Modal.Title>Cập nhật thiết bị</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Tên thiết bị</Form.Label>
                  <Form.Control
                    id="inputTen"
                    type="text"
                    value={deviceUpdate.name}
                    placeholder="Tên thức uống"
                    onChange={(e) => {
                      setDeviceUpdate({
                        ...deviceUpdate,
                        name: e.target.value,
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Giá (Đồng)</Form.Label>
                  <Form.Control
                    id="inputGia"
                    type="number"
                    pattern="[0-9]*"
                    placeholder="Giá tiền"
                    value={deviceUpdate.price}
                    onChange={(e) =>
                      setDeviceUpdate({
                        ...deviceUpdate,
                        price: parseInt(e.target.value),
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Nơi đặt</Form.Label>
                  <Form.Control
                    id="inputNoiDat"
                    type="text"
                    value={deviceUpdate.purchaseLocation}
                    placeholder="Nơi đặt"
                    onChange={(e) => {
                      setDeviceUpdate({
                        ...deviceUpdate,
                        purchaseLocation: e.target.value,
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Ngày đặt</Form.Label>
                  <Form.Control
                    id="inputNgayDat"
                    type="text"
                    value={deviceUpdate.purchaseDate}
                    placeholder="Ngày đặt"
                    onChange={(e) => {
                      setDeviceUpdate({
                        ...deviceUpdate,
                        purchaseDate: e.target.value,
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Loại</Form.Label>
                  <Form.Select
                    value={deviceUpdate.type?.type}
                    onChange={(e) =>
                      setDeviceUpdate((deviceUpdate) => ({
                        ...deviceUpdate,
                        type: { id: parseInt(e.target.value) },
                      }))
                    }
                  >
                    <option
                      key={deviceUpdate.type?.id}
                      value={deviceUpdate.type?.id}
                    >
                      {deviceUpdate.type?.type}
                    </option>
                    {deviceTypes?.map(
                      (deviceType) =>
                        deviceType.type !== deviceUpdate.type?.type && (
                          <option key={deviceType.id} value={deviceType.id}>
                            {deviceType.type}
                          </option>
                        )
                    )}
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Người quản lý</Form.Label>
                  <Form.Select
                    value={deviceUpdate.user?.name}
                    onChange={(e) =>
                      setDeviceUpdate({
                        ...deviceUpdate,
                        user: { id: parseInt(e.target.value) },
                      })
                    }
                  >
                    <option
                      key={deviceUpdate.user?.id}
                      value={deviceUpdate.user?.id}
                    >
                      {deviceUpdate.user?.name}
                    </option>
                    {deviceUsers?.map(
                      (deviceUser) =>
                        deviceUser.name !== deviceUpdate.user?.name && (
                          <option key={deviceUser.id} value={deviceUser.id}>
                            {deviceUser.name}
                          </option>
                        )
                    )}
                    <option value={0}>---</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Hình ảnh (url)</Form.Label>
                  <Form.Control
                    id="inputHinhAnh"
                    type="text"
                    placeholder="url"
                    value={deviceUpdate.image}
                    onChange={(e) =>
                      setDeviceUpdate({
                        ...deviceUpdate,
                        image: e.target.value,
                      })
                    }
                  />
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
                  updateDevice(deviceUpdate.id);
                  closeUpdate();
                }}
              >
                Xác nhận
              </Button>
            </Modal.Footer>
          </Modal>

          {/* show logbook of device */}
          <Modal
            style={{ width: "100w !important" }}
            show={showDeviceLogbooks}
            onHide={closeDeviceLogbooks}
          >
            <Modal.Header closeButton>
              <Modal.Title>Lịch sử yêu cầu bảo trì</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}>ID</th>
                    <th style={{ width: "120px" }}>Trạng thái</th>
                    <th style={{ width: "80px" }}>Loại</th>
                    <th style={{ width: "120px" }}>Mô tả</th>
                    <th style={{ width: "120px" }}>Người dùng xác nhận</th>
                    <th style={{ width: "74px" }}>Ngày tạo</th>
                    <th style={{ width: "74px" }}>Ngày cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {deviceLogbooks?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.logbookId}</td>
                      <td>{item.status}</td>
                      <td>{item.type}</td>
                      <td>{item.description}</td>
                      <td>
                        {item.confirmed === true && (
                          <p>{item.confirmedDescription}</p>
                        )}
                      </td>
                      <td>{getDate(item.createdAt)}</td>
                      <td>{getDate(item.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeDeviceLogbooks}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>

          {/* show form create liquidation */}
          <Modal show={showLiquidation} onHide={closeLiquidation}>
            <Modal.Header closeButton>
              <Modal.Title>Đề xuất thanh lý</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Lý do</Form.Label>
                  <Form.Control
                    id="inputLyDo"
                    type="text"
                    placeholder="Lý do"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeLiquidation}>
                Đóng
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  liquidateDevice(deviceIdForLiquidation);
                  closeLiquidation();
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
