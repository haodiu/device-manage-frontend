import React from "react";
import { Button, Table, Modal, Form, Row, NavItem } from "react-bootstrap";

const OrdersManagement = () => {
  const hostOrders = process.env.REACT_APP_HOST_ORDERS;
  const hostShippingPartner = process.env.REACT_APP_HOST_SHIPPINGPARTNER;
  const hostOrderDetail = "http://localhost:8081/api/ChiTietDDH?donDatHangId=";
  const hostProduct = process.env.REACT_APP_HOST_PRODUCTS;

  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdateOrder = () => setUpdate(false);
  const openUpdateOrder = () => setUpdate(true);

  const [showDetail, setDetail] = React.useState(false);
  const closeDetail = () => setDetail(false);
  const openDetail = () => setDetail(true);

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const [orders, setOrders] = React.useState([]);
  const [ordersFollowStatus, setOrdersFollowStatus] = React.useState([]);

  //for update
  const [trangThai, setTrangThai] = React.useState("");
  const [thoigianVC, setThoiGianVC] = React.useState(Date);
  const [makh, setMaKH] = React.useState(Number);
  const [doiTacVCId, setDoiTacVCId] = React.useState(Number);
  const [diaChi, setDiaChi] = React.useState("");
  const [sdt, setSDT] = React.useState("");

  const [orderUpdate, setOrderUpdate] = React.useState({});

  const [orderDetail, setOrderDetail] = React.useState([]);

  const [products, setProducts] = React.useState([]);



  const [shippingPartners, setShippingPartners] = React.useState([]);

  //status of order
  const STATUS = [
    "DATHANG",
    "DANGPHACHE",
    "VANCHUYEN",
    "DAGIAO",
    "DAHUY",
  ];
  const [statusSelected, setStatusSelected] = React.useState("ALL");

  React.useEffect(() => {
    fetch(hostOrders, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const goal_data = data.filter((item) => item.trangThai !== "DAXOA")
        setOrders(goal_data);
        setOrdersFollowStatus(goal_data);
      })
      .catch((err) => console.log(err));
    
      fetch(hostShippingPartner, {
        headers: {
          Authorization: "Bearer " + userDetail.token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setShippingPartners(data);
        })
        .catch((err) => console.log(err));

        fetch(hostProduct)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
        })
        .catch((err) => console.log(err));
  }, [hostOrders, hostShippingPartner, hostProduct, userDetail.token]);

  const UpdateOrder = async (id) => {
    console.log(orderUpdate);
    const response = await fetch(hostOrders + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trangThai: orderUpdate.trangThai,
        makh: orderUpdate.makh,
        doiTacVCId: orderUpdate.doiTacVCId,
        diaChi: orderUpdate.diaChi,
        sdt: orderUpdate.sdt,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    const data = await response.json();
    console.log(data);
    let updatedOrders1 = ordersFollowStatus.map((order) => {
      if (order.orderId === data.orderId) {
        return {
          ...order,
          trangThai: data.trangThai,
          doiTacVCId: data.doiTacVCId,
          sdt: data.sdt,
          diaChi: data.diaChi,
        };
      }
      return order;
    });
    let updatedOrders2 = orders.map((order) => {
      if (order.orderId === data.orderId) {
        return {
          ...order,
          trangThai: data.trangThai,
          doiTacVCId: data.doiTacVCId,
          sdt: data.sdt,
          diaChi: data.diaChi,
        };
      }
      return order;
    });
    setOrdersFollowStatus(updatedOrders1);
    if (statusSelected !== "ALL") {
      let updateOrdersStatus1 = updatedOrders1.filter(
        (order) => order.role === statusSelected
      );
      setOrdersFollowStatus(updateOrdersStatus1);
    }
    setOrders(updatedOrders2);
    window.location = "/orders"
  };

  const DeleteOrder = async (order) => {
    console.log(order);
    const response = await fetch(hostOrders + order.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trangThai: "DAXOA",
        thoiGianVC: '2023-06-17',
        makh: order.makh,
        doiTacVCId: order.doiTacVCId,
        diaChi: order.diaChi,
        sdt: order.sdt,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    const data = await response.json();
    console.log(data);
    window.location = "/orders"
  };

  const SetOrdersFollowStatus = (status) => {
    console.log(status);
    if (status !== "ALL") {
      let ordersWithStatus = orders.filter(
        (order) => order.trangThai === status
      );
      setOrdersFollowStatus(ordersWithStatus);
      console.log(ordersWithStatus);
    } else {
      setOrdersFollowStatus(orders);
      console.log(ordersFollowStatus);
    }
  };

  const GetNameShippingPartner = (id) => {
    const partner = shippingPartners.filter((partner) => partner.id === id)
    return partner[0].hoTen
  }

  const GetOrderDetail = async (id) => {
    const response = await fetch(hostOrderDetail + id, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error("Khong the get data chitietddh")
    }

    const data = await response.json();
    console.log(data);
    setOrderDetail(data)
  }

  const GetNameProductById = (idMon) => {
    const result = products.filter((product) => product.id === idMon);
    return result[0].tenMon;
  };

  let tong = 0;
  const getCostProduct = (soLuong, idMon) => {
    const result = products.filter((product) => product.id === idMon);
    const price = result[0].gia * soLuong
    tong += price
    console.log(tong);
    return price
  }

  const getImageProduct = (idMon) => {
    const result = products.filter((product) => product.id === idMon);
    return result[0].hinhAnh
  }
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
                  SetOrdersFollowStatus(e.target.value);
                  setStatusSelected(e.target.value);
                }}
              >
                <option value="ALL">All status</option>
                <option value={STATUS[0]}>{STATUS[0]}</option>
                <option value={STATUS[1]}>{STATUS[1]}</option>
                <option value={STATUS[2]}>{STATUS[2]}</option>
                <option value={STATUS[3]}>{STATUS[3]}</option>
                <option value={STATUS[4]}>{STATUS[4]}</option>
                <option value={STATUS[5]}>{STATUS[5]}</option>
              </select>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "100px" }}>ID đơn hàng</th>
                    <th style={{ width: "120px" }}>ID khách hàng</th>
                    <th style={{ width: "300px" }}>Địa chỉ</th>
                    <th style={{ width: "200px" }}>Số điện thoại</th>
                    <th style={{ width: "300px" }}>Đối tác vận chuyển</th>
                    <th style={{ width: "140px" }}>Trạng thái</th>
                    <th style={{ width: "140px" }}>Chi tiết</th>
                    <th>Sửa</th>
                    <th>Xoá</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersFollowStatus &&
                    ordersFollowStatus.map((order, index) => (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td>{order.makh}</td>
                        <td>{order.diaChi}</td>
                        <td>{order.sdt}</td>
                        <td>{GetNameShippingPartner(order.doiTacVCId)}</td>
                        <td>
                          <button className="btn-outline-status">
                            {order.trangThai}
                          </button>
                        </td>
                        <td>
                          <button className="btn-update"
                            onClick={() => {
                              console.log(order.id);
                              GetOrderDetail(order.id);
                              openDetail();
                            }}
                          >
                            xem
                          </button>
                        </td>
                        <td>
                          {order.orderStatus !== "CART" && order.orderStatus !== "SUCCESS" && <button
                            className="btn-update"
                            onClick={() => {
                              console.log(order);
                              setOrderUpdate(order);
                              openUpdateOrder();
                            }}
                          >
                            sửa
                          </button>}
                        </td>
                        <td>
                          {
                            <button
                              className="btn-delete"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you wish to delete this item?"
                                  )
                                )
                                  DeleteOrder(order)
                              }}
                            >
                              xoá
                            </button>
                          }
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Update */}
      <Modal show={showUpdate} onHide={closeUpdateOrder}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>ID đơn hàng</Form.Label>
              <Form.Control
                id="inputOrderId"
                type="text"
                value={orderUpdate.id}
                readOnly={true}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>ID khách hàng</Form.Label>
              <Form.Control
                id="inputUserId"
                type="text"
                value={orderUpdate.makh}
                readOnly={true}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                id="inputOrderAddress"
                type="text"
                value={orderUpdate.diaChi}
                readOnly={true}
                onChange={(e) =>
                  setOrderUpdate({
                    ...orderUpdate,
                    diaChi: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                id="inputOrderPhone"
                type="text"
                value={orderUpdate.sdt}
                readOnly={true}
                onChange={(e) =>
                  setOrderUpdate({
                    ...orderUpdate,
                    sdt: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
              value={orderUpdate.trangThai}
                onChange={(e) =>
                  setOrderUpdate({
                    ...orderUpdate,
                    trangThai: e.target.value,
                  })
                }
              >
                <option value={orderUpdate.orderStatus}>
                  {orderUpdate.orderStatus}
                </option>
                {orderUpdate.orderStatus !== STATUS[0] && (
                  <option value={STATUS[0]}>{STATUS[0]}</option>
                )}
                {orderUpdate.orderStatus !== STATUS[1] && (
                  <option value={STATUS[1]}>{STATUS[1]}</option>
                )}
                {orderUpdate.orderStatus !== STATUS[2] && (
                  <option value={STATUS[2]}>{STATUS[2]}</option>
                )}
                {orderUpdate.orderStatus !== STATUS[3] && (
                  <option value={STATUS[3]}>{STATUS[3]}</option>
                )}
                {orderUpdate.orderStatus !== STATUS[4] && (
                  <option value={STATUS[4]}>{STATUS[4]}</option>
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Đối tác vận chuyển</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setOrderUpdate({
                    ...orderUpdate,
                    doiTacVCId: parseInt(e.target.value),
                  })
                }
              >
                {shippingPartners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.hoTen}
                  </option>
                ))}
                
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpdateOrder}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              UpdateOrder(orderUpdate.id);
              console.log(orderUpdate);
              closeUpdateOrder();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* show detail */}
      <Modal show={showDetail} onHide={closeDetail}>
            <Modal.Header closeButton>
              <Modal.Title>Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "70px" }}></th>
                    <th style={{ width: "400px", alignItems: "center" }}>Name</th>
                    <th style={{ width: "140px" }}>Amount</th>
                    <th style={{ width: "140px" }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetail &&
                    orderDetail.map((item, index) => (
                      <tr key={index}>
                        <td style={{maxHeight: "76px"}}>
                          <img src={getImageProduct(item.monId)} alt="mon" style={{width: "50px", height: "56px"}}></img>
                        </td>
                        <td style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "76px",}}>{GetNameProductById(item.monId)}</td>
                        <td style={{alignItems: "center", minHeight: "76px", paddingTop: "24px", paddingLeft: "44px"}}>{item.soLuong}</td>
                        <td style={{alignItems: "center", minHeight: "76px", paddingTop: "24px", paddingLeft: "26px"}}>{getCostProduct(item.soLuong, item.monId)} đ</td>
                      </tr>
                    ))}
                    
                </tbody>
              </Table>
              <div style={{marginTop: "20px", marginBottom: "0px", border: "none", display: "flex", justifyContent: "right"}}>Total price: {tong} đ</div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeDetail}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
    </>
  );
};

export default OrdersManagement;
