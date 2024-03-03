import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client.js";

export default function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({
        id: null,
        name: "",
        description: "",
        price: ""
    });
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/products/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setProduct(data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, [])
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (product.id) {
            axiosClient
                .put(`/products/${product.id}`, product)
                .then(() => {
                    navigate("/catalogue");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post("/products", product)
                .then(() => {
                    navigate("/catalogue");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    return (
        <>
            {product.id && <h1>Update Product: {product.name}</h1>}
            {!product.id && <h1>New Product</h1> }
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <input
                            value={product.name}
                            onChange={(ev) =>
                                setProduct({ ...product, name: ev.target.value })
                            }
                            placeholder="Name"
                        />
                        <input
                            value={product.description}
                            onChange={(ev) =>
                                setProduct({
                                    ...product,
                                    description: ev.target.value
                                })
                            }
                            placeholder="Description"
                        />
                        <input
                            value={product.price}
                            onChange={(ev) =>
                                setProduct({ ...product, price: ev.target.value })
                            }
                            placeholder="Price"
                        />
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </>
    );
}
