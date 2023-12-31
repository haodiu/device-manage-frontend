import React from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
const UserOrdersDetails = () => {
  const hostProfile = process.env.REACT_APP_HOST_PROFILE;
  const hostUser = process.env.REACT_APP_HOST_USERS;

  const [showChangePassword, setShowChangePassword] = React.useState(false);
  const closeChangePassword = () => setShowChangePassword(false);
  const openChangePassword = () => setShowChangePassword(true);

  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdate = () => setUpdate(false);
  const openUpdate = () => setUpdate(true);
  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));

  if (userDetail === null) {
    window.location = "/login";
  }

  const [user, setUser] = React.useState({});
  const [password, setPassword] = React.useState({});
  const [profile, setProfile] = React.useState({});

  React.useEffect(() => {
    fetch(hostProfile, {
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.result.data);
        setUser(res.result.data);
      })
      .catch((e) => console.log("can't fecth user data " + e));
  }, [hostProfile, userDetail.accessToken]);

  const handleChangePassword = async () => {
    console.log(password);
    const response = await fetch(
      hostUser + userDetail.id + "/change-password",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userDetail.accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: password.oldPassword,
          newPassword: password.newPassword,
          confirmPassword: password.confirmPassword,
        }),
      }
    );

    if (!response.ok) {
      alert("Đổi mật khẩu thất bại!");
      throw new Error("Đổi mật khẩu thất bại!");
    }
    alert("Đổi mật khẩu thành công!");
  };

  const handleUpdateProfile = async () => {
    console.log(profile);
    const response = await fetch(hostUser + userDetail.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: profile.phone,
        citizenId: profile.citizenId,
        name: profile.name,
        gender: profile.gender,
        birthday: profile.birthday ? profile.birthday : undefined,
        address: profile.address,
        // avatar: profile.avatar,
      }),
    });

    if (!response.ok) {
      alert("Cập nhật thất bại!");
      throw new Error("Cập nhật thất bại!");
    }
    alert("Cập nhật thành công!");
    window.location = "/profile";
  };

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/3607/3607444.png"

  const Profile = ({
    name,
    email,
    phone,
    citizenId,
    gender,
    birthday,
    address,
    avatar,
    role,
  }) => {
    return (
      <>
        <div className="user-info-container">
          <div className="user-info user-info-image">
            <img
              src={avatar}
              alt="avatar"
              style={{ height: "170px", width: "170px", borderRadius: "50%" }}
            />
          </div>
          <div className="user-info info ">
            <div>
              <h2>{name}</h2>
            </div>
            <div>
              <span>Email: </span>
              <span>{email}</span>
            </div>
            <div>
              <span>Số điện thoại: </span>
              <span>{phone}</span>
            </div>
            <div>
              <span>CCCD: </span>
              <span>{citizenId}</span>
            </div>
            <div>
              <span>Giới tính: </span>
              <span>{gender === "male" ? "Nam" : "Nữ"}</span>
            </div>
            <div>
              <span>Ngày sinh: </span>
              <span>{birthday}</span>
            </div>
            <div>
              <span>Địa chỉ: </span>
              <span>{address}</span>
            </div>
            <div>
              <span>Vai trò: </span>
              <span>
                {role === "maintenance_staff"
                  ? "Nhân viên bảo trì"
                  : "Người dùng thiết bị"}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const isInvalidCCCD = profile.citizenId?.length !== 12;
  const isInvalidPhone = profile.phone?.length !== 10;
  const isValidBirthday = (inputValue) => {
    return /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/.test(
      inputValue
    );
  };
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="card">
            <div className="card-body">
              <div className="user-detail-container">
                <Profile
                  name={user.name}
                  phone={user.phone}
                  email={user.email}
                  citizenId={user.citizenId}
                  gender={user.gender}
                  birthday={user.birthday}
                  address={user.address}
                  avatar={user.avatar? user.avatar : defaultAvatar}
                  role={user.role}
                />
                <div
                  className="btn-update"
                  style={{
                    marginBottom: "10px",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    setProfile(user);
                    openUpdate();
                  }}
                >
                  Cập nhật thông tin cá nhân
                </div>

                <div
                  className="btn-update"
                  style={{
                    marginBottom: "10px",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    openChangePassword();
                  }}
                >
                  Đổi mật khẩu
                </div>
              </div>
            </div>
          </div>
          {/* Change password  */}
          <Modal show={showChangePassword} onHide={closeChangePassword}>
            <Modal.Header closeButton>
              <Modal.Title>Thay đổi mật khẩu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Mật khẩu cũ</Form.Label>
                  <Form.Control
                    id="inputOldPassword"
                    type="password"
                    placeholder="6-40 kí tự"
                    onChange={(e) => {
                      setPassword({
                        ...password,
                        oldPassword: e.target.value,
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control
                    id="inputNewPassword"
                    type="password"
                    placeholder="6-40 kí tự"
                    onChange={(e) => {
                      setPassword({
                        ...password,
                        newPassword: e.target.value,
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Xác nhận mật khẩu</Form.Label>
                  <Form.Control
                    id="inputConfirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    onChange={(e) => {
                      setPassword({
                        ...password,
                        confirmPassword: e.target.value,
                      });
                    }}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeChangePassword}>
                Đóng
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleChangePassword();
                  closeChangePassword();
                }}
              >
                Xác nhận
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Update profile]  */}
          <Modal show={showUpdate} onHide={closeUpdate}>
            <Modal.Header closeButton>
              <Modal.Title>Thay đổi thông tin cá nhân</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    id="inputPhone"
                    type="text"
                    placeholder="Số điện thoại"
                    value={profile.phone}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        phone: e.target.value,
                      });
                    }}
                    isInvalid={isInvalidPhone}
                  />
                  {isInvalidPhone && (
                    <Form.Control.Feedback type="invalid">
                      Số điện thoại phải gồm 10 chữ số
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>CCCD</Form.Label>
                  <Form.Control
                    id="inputCCCD"
                    type="text"
                    placeholder="CCCD"
                    value={profile.citizenId}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        citizenId: e.target.value,
                      });
                    }}
                    isInvalid={isInvalidCCCD}
                  />
                  {isInvalidCCCD && (
                    <Form.Control.Feedback type="invalid">
                      CCCD phải gồm 12 chữ số.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Tên</Form.Label>
                  <Form.Control
                    id="inputName"
                    type="text"
                    placeholder="Tên"
                    value={profile.name}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        name: e.target.value,
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value={user.gender}>
                      {user.gender === "male" ? "Nam" : "Nữ"}
                    </option>
                    {user.gender !== "male" && (
                      <option value={"male"}>Nam</option>
                    )}
                    {user.gender !== "female" && (
                      <option value={"female"}>Nữ</option>
                    )}
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    id="inputBirthday"
                    type="text"
                    placeholder="Ngày sinh"
                    value={profile.birthday}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        birthday: e.target.value,
                      });
                    }}
                  />
                  {!isValidBirthday(profile.birthday) && (
                    <Form.Text className="text-danger">
                      Ngày sinh không hợp lệ. Sử dụng định dạng dd/mm/yyyy.
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    id="inputAddress"
                    type="text"
                    placeholder="Địa chỉ"
                    value={profile.address}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        address: e.target.value,
                      });
                    }}
                  />
                </Form.Group>

                {/* <Form.Group as={Row} className="mp-3">
                  <Form.Label>Avatar</Form.Label>
                  <Form.Control
                    id="inputAvatar"
                    type="text"
                    placeholder="Link avatar"
                    value={profile.avatar}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        avatar: e.target.value,
                      });
                    }}
                  />
                </Form.Group> */}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeUpdate}>
                Đóng
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleUpdateProfile();
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

export default UserOrdersDetails;
