import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Orders() {
    const { user, token } = useStateContext();
    if (!token || !user.role === "Admin") {
        return <Navigate to="/catalogue" />;
    }

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getOrders();
    }, [currentPage ]);

    const getOrders = () => {
        setLoading(true);
        let url = `/orders?page=${currentPage}`;
        if (selectedUser) {
            url += `&user=${selectedUser}`;
        }
        axiosClient.get(url).then(({ data }) => {
            setLoading(false);
            setOrders(data.data);
            setTotalPages(data.meta.last_page);
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) {
            return;
        }
        if (user.role === "Admin") {
            axiosClient.delete(`/orders/${orderId}`).then(() => {
                getOrders();
                setCurrentPage(1);
            });
        } else {
            alert("You don't have permission to delete this order.");
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setSelectedUser(event.target.value);
        setCurrentPage(1);
        getOrders();
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Orders</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Write user ID"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className="card-container">
                {loading && <p>Loading...</p>}
                {!loading && (
                    <div className="card-grid" style={{ display: "flex", flexWrap: "wrap" }}>
                        {orders.length !== 0 ? (
                            orders.map((o) => (
                                <div className="card" key={o.id}>
                                    <h3>{o.product_name}</h3>
                                    <p>User: {o.user_name}</p>
                                    <p>Quantity: {o.quantity}</p>
                                    {user.role === "Admin" && (
                                        <button className="btn-delete"  onClick={() => handleDelete(o.id)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div>No matching orders found</div>
                        )}
                    </div>
                )}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={currentPage === page ? "active" : ""}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}
