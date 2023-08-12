import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";
const UsersManagement = () => {
  const hostInventory = process.env.REACT_APP_HOST_INVENTORY;
  const hostMaterial = process.env.REACT_APP_HOST_MATERIALS;
  const hostProduct = process.env.REACT_APP_HOST_PRODUCTS;

  const [showAdd, setShowAdd] = React.useState(false);
  const closeAdd = () => setShowAdd(false);
  const openAdd = () => setShowAdd(true);

  const [showAddMaterial, setShowAddMaterial] = React.useState(false);
  const closeAddMaterial = () => setShowAddMaterial(false);
  const openAddMaterial = () => setShowAddMaterial(true);

  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdate = () => setUpdate(false);
  const openUpdate = () => setUpdate(true);

  //for post inventory
  const [tenNguyenLieu, setTenNguyenLieu] = React.useState("");
  const [soLuongTon, setSoLuongTon] = React.useState(Number);
  const [donVi, setDonVi] = React.useState("");

  // post nguyen lieu
  const [material, setMaterial] = React.useState({})
  const [products, setProducts] = React.useState([])

  //update
  const [inventoryUpdate, setInventoryUpdate] = React.useState({});

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const [inventory, setInventory] = React.useState([]);

  React.useEffect(() => {
    fetch(hostInventory, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setInventory(data);
      })
      .catch((err) => console.log(err));

      fetch(hostProduct, {
        headers: {
          Authorization: "Bearer " + userDetail.token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
        })
        .catch((err) => console.log(err));
  }, [hostInventory, hostProduct, userDetail.token]);

  const AddItem = async () => {
    const response = await fetch(hostInventory, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tenNguyenLieu: tenNguyenLieu,
        soLuongTon: soLuongTon,
        donVi: donVi
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add item to inventory");
    }
    const data = await response.json();
    console.log(data);
    inventory.push(data);
    setInventory(inventory);
    closeAdd();
    alert("Thêm thành công!");
  };

  const DeleteItem = async (id) => {
    console.log(id);
    const response = await fetch(hostInventory + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete item from inventory");
    }
    const data = await response.json();
    console.log(data);
    const updateInventory = inventory.filter((item) => item.id !== id);
    setInventory(updateInventory);
    window.location = "/inventory"
  };

  const UpdateItem = async (id) => {
    console.log(inventoryUpdate);
    const response = await fetch(hostInventory + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tenNguyenLieu: inventoryUpdate.tenNguyenLieu,
        soLuongTon: inventoryUpdate.soLuongTon,
        donVi: inventoryUpdate.donVi
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update inventory");
    }
    const data = await response.json();
    console.log(data);

    let updatedInventory = inventory.map((item) => {
      if (item.idTonKho === data.idTonKho) {
        return {
          ...item,
          tenNguyenLieu: inventoryUpdate.tenNguyenLieu,
          soLuongTon: inventoryUpdate.soLuongTon,
          donVi: inventoryUpdate.donVi
        };
      }
      return item;
    });
    setInventory(updatedInventory);
  };

  const AddMaterial = async () => {
    console.log(material);
    const response = await fetch(hostMaterial, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tonKhoId: material.tonKhoId,
        monId: material.monId,
        soLuong: material.soLuong,
        donVi: material.donVi
      }),
    })
    
    if (!response.ok) {
      throw new Error("Failed to add material!")
    }

    const data = await response.json();
    console.log(data);
  }
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <Button variant="info" onClick={openAdd} className="btn-add">
              Nhập
            </Button>
          </div>
          <div className="card">
            <div className="card-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên nguyên liệu</th>
                    <th>Số lượng tồn</th>
                    <th>Đơn vị</th>
                    <th>Thêm nguyên liệu cho sp</th>
                    <th>Sửa</th>
                    <th>Xoá</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                      <tr key={item.idTonKho}>
                        <td>{item.idTonKho}</td>
                        <td>{item.tenNguyenLieu}</td>
                        <td>{item.soLuongTon}</td>
                        <td>{item.donVi}</td>
                        <td>
                          <button className="btn-update"
                            onClick={() => {
                              setMaterial({
                                ...material,
                                tonKhoId: parseInt(item.idTonKho),
                                donVi: item.donVi.trim()
                              })
                              openAddMaterial();
                            }}
                          >
                            Thêm
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-update"
                            onClick={() => {
                              setInventoryUpdate(item);
                              openUpdate();
                            }}
                          >
                            sửa
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Bạn chắc chắn muốn xoá item này?"
                                )
                              )
                                DeleteItem(item.idTonKho);
                            }}
                          >
                            xoá
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* add user */}
      <Modal show={showAdd} onHide={closeAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Tên nguyên liệu</Form.Label>
              <Form.Control
                id="inputTenNguyenLieu"
                type="text"
                placeholder="Tên nguyên liệu"
                onChange={(e) => setTenNguyenLieu(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Số lượng tồn</Form.Label>
              <Form.Control
                id="inputSoLuongTon"
                type="number"
                placeholder="Số lượng tồn"
                onChange={(e) => setSoLuongTon(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Đơn vị</Form.Label>
              <Form.Control
                id="inputDonVi"
                type="text"
                placeholder="Đơn vị"
                onChange={(e) => setDonVi(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAdd}>
            Đóng
          </Button>
          <Button variant="primary" onClick={AddItem}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* update user */}
      <Modal show={showUpdate} onHide={closeUpdate}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Tên nguyên liệu</Form.Label>
              <Form.Control
                id="inputTenNguyenLieu"
                type="text"
                value={inventoryUpdate.tenNguyenLieu}
                placeholder="Tên nguyên liệu"
                onChange={(e) =>
                    setInventoryUpdate({
                      ...inventoryUpdate,
                      tenNguyenLieu: e.target.value,
                    })
                  }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Số lượng tồn</Form.Label>
              <Form.Control
                id="inputSoLuongTon"
                type="number"
                placeholder="Số lượng tồn"
                value={inventoryUpdate.soLuongTon}
                onChange={(e) =>
                  setInventoryUpdate({
                    ...inventoryUpdate,
                    soLuongTon: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Đơn vị</Form.Label>
              <Form.Control
                id="inputDonVi"
                type="text"
                placeholder="Đơn vị"
                value={inventoryUpdate.donVi}
                onChange={(e) =>
                  setInventoryUpdate({
                    ...inventoryUpdate,
                    donVi: e.target.value,
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
              UpdateItem(inventoryUpdate.idTonKho);
              closeUpdate();
            }}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

      {/* add material */}
      <Modal show={showAddMaterial} onHide={closeAddMaterial}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm nguyên liệu cho đồ uống</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Nguyên liệu cho đồ uống</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setMaterial({
                    ...material,
                    monId: parseInt(e.target.value),
                  })
                }
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.tenMon}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                id="inputSoLuong"
                type="number"
                placeholder="Số lượng"
                onChange={(e) =>
                  setMaterial({
                    ...material,
                    soLuong: parseInt(e.target.value),
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddMaterial}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              AddMaterial();
              closeAddMaterial();
            }}
          >
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersManagement;
