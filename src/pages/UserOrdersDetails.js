import React from "react";
import { useParams } from "react-router-dom";
import { Table } from "react-bootstrap";

const UserOrdersDetails = () => {
  const hostOrderDetailViews = process.env.REACT_APP_HOST_AUTH_ORDERDETAILVIEWS;
  const hostProduct = process.env.REACT_APP_HOST_PRODUCTS;
  const hostUsers = process.env.REACT_APP_HOST_USERS;

  let params = useParams();

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));

  if (userDetail === null) {
    window.location = "/login";
  }

  const [user, setUser] = React.useState({});
  const [orderDetails, setOrderDetails] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetch(hostOrderDetailViews + params.id, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOrderDetails(data);
      })
      .catch((e) => console.log("can't fecth orderDetails data " + e));

    fetch(hostProduct, {})
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((e) => console.log("can't fecth products data " + e));

    fetch(hostUsers + params.id, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data);
      })
      .catch((e) => console.log("can't fecth users data " + e));
  }, [
    hostOrderDetailViews,
    hostProduct,
    hostUsers,
    params.id,
    userDetail.token,
  ]);

  const Profile = ({ firstName, lastName, phone, email, address }) => {
    return (
      <>
        <div className="user-info-container">
          <div className="user-info user-info-image">
            <img
              src="/img/avt.png"
              alt="avatar"
              style={{ height: "170px", width: "170px" }}
            />
          </div>
          <div className="user-info info ">
            <div>
              <h2>
                {lastName} {firstName}
              </h2>
            </div>
            <div>
              <span>Phone: </span>
              <span>{phone}</span>
            </div>
            <div>
              <span>Email: </span>
              <span>{email}</span>
            </div>
            <div>
              <span>Address: </span>
              <span>{address}</span>
            </div>
          </div>
        </div>
      </>
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
                  firstName={user.firstName}
                  lastName={user.lastName}
                  email={user.email}
                  address={user.address}
                />
                <div>
                  <Table className="table-products table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Product Image</th>
                        <th>Amount</th>
                        <th>Remain</th>
                        <th>Delivery Address</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails &&
                        orderDetails.map((orderDetail, index) => (
                          <tr key={index}>
                            <td>{orderDetail.orderId}</td>
                            <td>{orderDetail.productId}</td>
                            <td>
                              {products
                                .filter(
                                  (product) =>
                                    product.productId === orderDetail.productId
                                )
                                .map((product) => (
                                  <div key={product.productId}>
                                    {product.productName}
                                  </div>
                                ))}
                            </td>
                            <td>
                              <img
                                src={orderDetail.url}
                                alt="img"
                                style={{ height: "100px", width: "70px" }}
                              />
                            </td>
                            <td>{orderDetail.amount}</td>
                            <td>{orderDetail.remain}</td>
                            <td>{orderDetail.address}</td>
                            <td>{orderDetail.status}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserOrdersDetails;
