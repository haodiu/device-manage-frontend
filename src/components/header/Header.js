import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
  const [userDetail, setUserDetail] = React.useState(
    JSON.parse(localStorage.getItem("auth"))
  );

  const Signout = () => {
    try {
      localStorage.removeItem("auth");
      setUserDetail({});
      window.location.reload();
      console.log("signout success!");
      console.log(userDetail);
    } catch (e) {
      console.log(e);
    }
  };

  const disableClick = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <header className="header-upper py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-2 shop ">
              <h4 className="shop-name">
                {userDetail?.role === "maintenance_staff" && (
                  <Link className="shop-name" to={"/"}>
                    <div className="lezada button type3">ZACorp</div>
                  </Link>
                )}
                {userDetail?.role === "device_user" && (
                  <Link className="shop-name" to={"/"} onClick={disableClick}>
                  <div className="lezada button type3">ZACorp</div>
                </Link>
                )}
              </h4>
            </div>
            <div className="col-1 nav-option">
              {userDetail?.role === "maintenance_staff" && (
                <div className="btn-cont">
                  <a href="/devices" className="btn">
                    DANH SÁCH THIẾT BỊ
                    <span className="line-1"></span>
                    <span className="line-2"></span>
                    <span className="line-3"></span>
                    <span className="line-4"></span>
                  </a>
                </div>
              )}
            </div>

            {userDetail?.role === "maintenance_staff" && (
              <div className="col-1 nav-option">
                <div className="btn-cont">
                  <a href="/logbooks" className="btn">
                    YÊU CẦU BẢO TRÌ
                    <span className="line-1"></span>
                    <span className="line-2"></span>
                    <span className="line-3"></span>
                    <span className="line-4"></span>
                  </a>
                </div>
              </div>
            )}

            {userDetail?.role === "device_user" && (
              <div className="col-1 nav-option">
                <div className="btn-cont">
                  <a href="/user-devices" className="btn">
                    DANH SÁCH THIẾT BỊ
                    <span className="line-1"></span>
                    <span className="line-2"></span>
                    <span className="line-3"></span>
                    <span className="line-4"></span>
                  </a>
                </div>
              </div>
            )}

            {userDetail?.role && (
              <div className="col-1 nav-option">
                <div className="btn-cont">
                  <a href="/profile" className="btn">
                    THÔNG TIN CÁ NHÂN
                    <span className="line-1"></span>
                    <span className="line-2"></span>
                    <span className="line-3"></span>
                    <span className="line-4"></span>
                  </a>
                </div>
              </div>
            )}

            <div className="col-1 btn-auth">
              {!userDetail ? (
                <Link className="button type2" as={Link} to="/login">
                  Đăng nhập
                </Link>
              ) : (
                <Link
                  className="button type2"
                  as={Link}
                  to="/login"
                  onClick={Signout}
                >
                  Đăng xuất
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
