import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function MyOrders() {
    const { user } = useStateContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getOrders();
    }, [currentPage ]);

    const getOrders = () => {
        setLoading(true);
        let url = `/orders?page=${currentPage}&user=${user.id}`;
        axiosClient.get(url).then(({ data }) => {
            console.log(data);
            setLoading(false);
            setOrders(data.data);
            setTotalPages(data.meta.last_page);
        });
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
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
                <h1>My orders</h1>
            </div>
            <div className="card-container">
                {loading && <p>Loading...</p>}
                {!loading && (
                    <div className="card-grid" style={{ display: "flex", flexWrap: "wrap" }}>
                        {orders.length !== 0 ? (
                            orders.map((o) => (
                                <div className="card" key={o.id}>
                                    <h3>{o.product_name}</h3>
                                    <p>Quantity: {o.quantity}</p>
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
