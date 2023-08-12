import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";

const OrdersManagement = () => {
  const hostShippingPartner = process.env.REACT_APP_HOST_SHIPPINGPARTNER;
  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdatePartner = () => setUpdate(false);
  const openUpdatePartner = () => setUpdate(true);

  const [showAdd, setShowAdd] = React.useState(false);
  const closeAddPartner = () => setShowAdd(false);
  const openAddPartner = () => setShowAdd(true);

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const [shippingPartners, setShippingPartners] = React.useState([]);

  //for update
  const [thoiGianGH, setThoiGianGH] = React.useState(Number);
  const [hoTen, setHoTen] = React.useState("");

  const [shippingPartnerUpdate, setShippingPartnerUpdate] = React.useState({});

  React.useEffect(() => {
    fetch(hostShippingPartner, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setShippingPartners(data);
      })
      .catch((err) => console.log(err));
  }, [hostShippingPartner, userDetail.token]);

  const AddShippingPartner = async () => {
    const response = await fetch(hostShippingPartner, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hoTen: hoTen,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }
    const data = await response.json();
    console.log(data);
    shippingPartners.push(data);
    console.log(shippingPartners);
    setShippingPartners(shippingPartners);

    alert("Thêm đơn vị vận chuyển thành công!");
    window.location = "/shipping";
  };

  const UpdateShippingPartner = async (id) => {
    console.log(shippingPartnerUpdate);
    const response = await fetch(hostShippingPartner + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: shippingPartnerUpdate.id,
        thoiGianGH: shippingPartnerUpdate.thoiGianGH,
        hoTen: shippingPartnerUpdate.hoTen,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update shipping partner!");
    }
    const data = await response.json();
    console.log(data);

    let updatedShippingPartner = shippingPartners.map((partner) => {
      if (partner.id === data.id) {
        return {
          ...partner,
          thoiGianGH: data.thoiGianGH,
          hoTen: data.hoTen,
        };
      }
      return partner;
    });
    setShippingPartners(updatedShippingPartner);
  };

  const DeleteShippingPartner = async (id) => {
    console.log(id);
    const response = await fetch(hostShippingPartner + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alert("Đối tác đang vận chuyển đơn hàng. Không thể xoá!");
      throw new Error("Failed to delete shipping partner!");
    } else {
      window.location = "/shipping";
    }
  };

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <Button variant="info" onClick={openAddPartner} className="btn-add">
              Thêm đối tác
            </Button>
          </div>

          <div className="card">
            <div className="card-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "100px" }}>ID</th>
                    <th style={{ width: "100px" }}>Tên đối tác</th>
                    <th>Sửa</th>
                    <th>Xoá</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingPartners &&
                    shippingPartners.map((partner, index) => (
                      <tr key={index}>
                        <td>{partner.id}</td>
                        <td>{partner.hoTen}</td>
                        <td>
                          <button
                            className="btn-update"
                            onClick={() => {
                              console.log(partner);
                              setShippingPartnerUpdate(partner);
                              openUpdatePartner();
                            }}
                          >
                            sửa
                          </button>
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
                                  DeleteShippingPartner(partner.id);
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

      {/* add */}
      <Modal show={showAdd} onHide={closeAddPartner}>
        <Modal.Header closeButton>
          <Modal.Title>Đối tác vận chuyển</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Tên đối tác</Form.Label>
              <Form.Control
                id="inputName"
                type="text"
                placeholder="Tên đối tác"
                onChange={(e) =>
                  setHoTen(e.target.value)
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddPartner}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              AddShippingPartner();
              closeAddPartner();
            }}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update */}
      <Modal show={showUpdate} onHide={closeUpdatePartner}>
        <Modal.Header closeButton>
          <Modal.Title>Đối tác vận chuyển</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>ID</Form.Label>
              <Form.Control
                id="inputPartnerId"
                type="text"
                value={shippingPartnerUpdate.id}
                readOnly={true}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Tên đối tác</Form.Label>
              <Form.Control
                id="inputName"
                type="text"
                value={shippingPartnerUpdate.hoTen}
                onChange={(e) =>
                  setShippingPartnerUpdate({
                    ...shippingPartnerUpdate,
                    hoTen: e.target.value,
                  })
                }
              />
            </Form.Group>

            {/* <Form.Group as={Row} className="mp-3">
              <Form.Label>Thời gian giao hàng</Form.Label>
              <Form.Control
                id="inputOrderPhone"
                type="text"
                value={shippingPartnerUpdate.thoiGianGH}
                readOnly={true}
              />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpdatePartner}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              UpdateShippingPartner(shippingPartnerUpdate.id);
              console.log(shippingPartnerUpdate);
              closeUpdatePartner();
            }}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrdersManagement;
