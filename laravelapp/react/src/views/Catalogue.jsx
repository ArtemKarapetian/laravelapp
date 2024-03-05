import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Catalogue() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(1);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useStateContext();


    useEffect(() => {
        getCategories();
        getProducts();
    }, [currentPage, selectedCategory]);

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

    const onOrderClick = (product) => {
        const quantity = document.querySelector(".quantity-input").value;
        axiosClient.post("/orders", {
            order_date: new Date().toISOString(),
            product_id: product.id,
            quantity: quantity,
            user_id: user.id,
        });
    }

    const renderCardActions = (product) => {
        return (
            <div className="card-actions">
            {user.role === "Admin" && (
                <>
                <div style={{ display: "flex", gap: "10px" }}>
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
                    </>
                )}
                <div style={{ paddingTop: "10px" }}>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        defaultValue="1"
                        className="quantity-input"
                    />
                </div>
                <button
                    className="btn-order"
                    onClick={(ev) => onOrderClick(product)}
                >
                    Order
                </button>
            </div>
        );
    };


    const getCategories = () => {
        axiosClient.get("/categories")
        .then(({ data }) => {
            setCategories(data.data);
        })
        .catch((error) => {
            console.error("Error fetching categories", error);
        });
    };

    const getProducts = () => {
        setLoading(true);
        let url = `/products?page=${currentPage}`;
        if (selectedCategory) {
            url += `&category=${selectedCategory}`;
        }
        axiosClient.get(url).then(({ data }) => {
            setLoading(false);
            setProducts(data.data);
            setTotalPages(data.meta.last_page);
        });
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
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
                <div>
                    <span>Filter by category:</span>
                    <select onChange={(e) => handleCategoryChange(e.target.value)}>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
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
                                <div style={{ marginTop: "auto" }}>
                                    {renderCardActions(p)}
                                </div>
                            </div>
                        ))}
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
