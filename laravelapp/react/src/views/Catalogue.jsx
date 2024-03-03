import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Catalogue() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useStateContext();

    useEffect(() => {
        getProducts();
    }, [currentPage]);

    const onDeleteClick = (product) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        if (user.role === "Admin") { // Check if user has the "Admin" role
            axiosClient.delete(`/products/${product.id}`).then(() => {
                getProducts();
                setCurrentPage(1); // Update the current page to 1 after deleting a product
            });
        } else {
            alert("You don't have permission to delete this product.");
        }
    };

    const renderCardActions = (product) => {
        if (user.role === "Admin") {
            return (
                <div className="card-actions">
                    <Link className="btn-edit" to={"/products/" + product.id}>
                        Edit
                    </Link>
                    <button
                        className="btn-delete"
                        onClick={(ev) => onDeleteClick(product)}
                    >
                        Delete
                    </button>
                </div>
            );
        }
        return null;
    };

    const getProducts = () => {
        setLoading(true);
        axiosClient
            .get(`/products?page=${currentPage}`)
            .then(({ data }) => {
                setLoading(false);
                setProducts(data.data);
                setTotalPages(data.meta.last_page);
            })
            .catch(() => {
                setLoading(false);
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
                <h1>Catalogue</h1>
                {user.role === "Admin" && (
                    <Link className="btn-add" to="/products/new">
                        Add new
                    </Link>
                )}
            </div>
            <div className="card-container">
                {loading && <p>Loading...</p>}
                {!loading && (
                    <div className="card-grid" style={{ display: "flex", flexWrap: "wrap" }}>
                        {products.map((p) => (
                            <div className="card" key={p.id}>
                                <h3>{p.name}</h3>
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="product-image"
                                    style={{ maxWidth: "100%" }}
                                />
                                <p>{p.description}</p>
                                <p>Price: {p.price}</p>
                                {renderCardActions(p)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="pagination">
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
