import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
const UsersManagement = () => {
  const hostUsers = process.env.REACT_APP_HOST_USERS;

  const [showAdd, setShowAdd] = React.useState(false);
  const closeAddUser = () => setShowAdd(false);
  const openAddUser = () => setShowAdd(true);

  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdateUser = () => setUpdate(false);
  const openUpdateUser = () => setUpdate(true);

  //for post user
  const [hoTen, setHoTen] = React.useState("");
  const [diaChi, setDiaChi] = React.useState("");
  const [sdt, setSDT] = React.useState("");
  const [vaiTro, setVaiTro] = React.useState("ROLE_KHACHHANG");
  const [matKhau, setMatKhau] = React.useState("");

  //update
  const [userUpdate, setUserUpdate] = React.useState({});

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const [users, setUsers] = React.useState([]);
  const [usersFollowRole, setUsersFollowRole] = React.useState([]);
  const roleUser = "ROLE_KHACHHANG";
  const roleShop = "ROLE_NHANVIEN";
  const [roleSelected, setRoleSelected] = React.useState("ALL");

  React.useEffect(() => {
    fetch(hostUsers, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
      },
    })
      .then((res) => res.json())
      .then((users) => {
        setUsers(users);
        setUsersFollowRole(users);
      })
      .catch((err) => console.log(err));
  }, [hostUsers, userDetail.token]);

  const AddUser = async () => {
    console.log(hoTen, diaChi, sdt, vaiTro, matKhau);
    const response = await fetch(hostUsers, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hoTen: hoTen,
        diaChi: diaChi,
        sdt: sdt,
        vaiTro: vaiTro,
        matKhau: matKhau
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }
    const data = await response.json();
    console.log(data);
    users.push(data);
    setUsers(users);
    if (data.role === roleSelected) {
      usersFollowRole.push(data);
      setUsersFollowRole(usersFollowRole);
    }
    closeAddUser();
    alert("Thêm người dùng thành công!");
  };

  const DeleteUser = async (id) => {
    console.log(id);
    const response = await fetch(hostUsers + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alert('Không thể xoá người dùng này!');
      throw new Error("Failed to delete user");
    }
    const data = await response.json();
    console.log(data);
    const updatedUser1 = usersFollowRole.filter((user) => user.id !== id);
    const updatedUser2 = users.filter((user) => user.id !== id);
    setUsersFollowRole(updatedUser1);
    setUsers(updatedUser2);
  };

  const UpdateUser = async (id) => {
    console.log("jdhjahjf");
    console.log(userUpdate);
    const response = await fetch(hostUsers + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hoTen: userUpdate.hoTen,
        diaChi: userUpdate.diaChi,
        sdt: userUpdate.sdt,
        vaiTro: userUpdate.vaiTro,
        matKhau: userUpdate.matKhau
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    const data = await response.json();
    console.log(data);

    let updateUsers1 = usersFollowRole.map((user) => {
      if (user.id === data.id) {
        return {
          ...user,
          hoTen: userUpdate.hoTen,
          diaChi: userUpdate.diaChi,
          sdt: userUpdate.sdt,
          vaiTro: userUpdate.vaiTro,
        };
      }
      return user;
    });
    let updateUsers2 = users.map((user) => {
      if (user.id === data.id) {
        return {
          ...user,
          hoTen: userUpdate.hoTen,
          diaChi: userUpdate.diaChi,
          sdt: userUpdate.sdt,
          vaiTro: userUpdate.vaiTro,
        };
      }
      return user;
    });
    setUsersFollowRole(updateUsers1);
    if (roleSelected !== "ALL") {
      let updatedUsersRole1 = updateUsers1.filter(
        (user) => user.vaiTro === roleSelected
      );
      setUsersFollowRole(updatedUsersRole1);
    }

    setUsers(updateUsers2);
  };

  const SetUserFollowRole = (userRole) => {
    if (userRole !== "ALL") {
      let usersFollowRole = users.filter((user) => user.vaiTro === userRole);
      setUsersFollowRole(usersFollowRole);
    } else {
      setUsersFollowRole(users);
    }
  };

  console.log(usersFollowRole);
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <Button variant="info" onClick={openAddUser} className="btn-add">
              Add User
            </Button>
            <div className="select">
              <select
                className="form-select"
                id="select-option"
                onChange={(e) => {
                  SetUserFollowRole(e.target.value);
                  setRoleSelected(e.target.value);
                }}
              >
                <option value="ALL">All user</option>
                <option value={roleUser}>Khách hàng</option>
                <option value={roleShop}>Nhân viên</option>
              </select>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên tài khoản</th>
                    <th>Địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Sửa</th>
                    <th>Xoá</th>
                  </tr>
                </thead>
                <tbody>
                  {usersFollowRole &&
                    usersFollowRole.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.hoTen}</td>
                        <td>{user.diaChi}</td>
                        <td>{user.sdt}</td>
                        <td>{user.vaiTro}</td>
                        <td>
                          <button
                            className="btn-update"
                            onClick={() => {
                              setUserUpdate(user);
                              openUpdateUser();
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
                                  "Bạn chắc chắn muốn xoá người dùng này?"
                                )
                              )
                                DeleteUser(user.id);
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
      <Modal show={showAdd} onHide={closeAddUser}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Vai trò</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setVaiTro(e.target.value);
                }}
              >
                <option value={roleUser}>Khách hàng</option>
                <option value={roleShop}>Nhân viên</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Tên tài khoản</Form.Label>
              <Form.Control
                id="inputTenTaiKhoan"
                type="text"
                placeholder="Tên tài khoản"
                onChange={(e) => setHoTen(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                id="inputDiaChi"
                type="text"
                placeholder="Địa chỉ"
                onChange={(e) => setDiaChi(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                id="inputMatKhau"
                type="password"
                placeholder="Mật khẩu"
                onChange={(e) => setMatKhau(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                id="inputSDT"
                type="text"
                placeholder="Số điện thoại"
                onChange={(e) => setSDT(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddUser}>
            Đóng
          </Button>
          <Button variant="primary" onClick={AddUser}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* update user */}
      <Modal show={showUpdate} onHide={closeUpdateUser}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa thông tin người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Tên tài khoản</Form.Label>
              <Form.Control
                id="inputTenTaiKhoan"
                type="text"
                value={userUpdate.hoTen}
                placeholder="Tên tài khoản"
                readOnly={true}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                id="inputDiaChi"
                type="text"
                placeholder="Địa chỉ"
                value={userUpdate.diaChi}
                onChange={(e) =>
                  setUserUpdate({
                    ...userUpdate,
                    diaChi: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                id="inputSDT"
                type="number"
                placeholder="Số điện thoại"
                value={userUpdate.sdt}
                onChange={(e) =>
                  setUserUpdate({
                    ...userUpdate,
                    sdt: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpdateUser}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              UpdateUser(userUpdate.id);
              closeUpdateUser();
            }}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersManagement;
