import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ItemForm = () => {
    const [item, setItem] = useState({ name: "", description: "" });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchItem();
        }
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/items/${id}`);
            setItem(response.data);
        } catch (error) {
            console.log("Error fetching items:", error);
        }
    };

    const handleChange = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:5000/api/items/${id}`, item);
            } else {
                await axios.post("http://localhost:5000/api/items", item);
            }
            navigate("/");
        } catch (error) {
            console.error("Error saving item:", error);
        }
    };

    return (
        <div>
            <h2>{id ? "Edit Item" : "Add Item"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" className="form-control" value={item.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" className="form-control" value={item.description} onChange={handleChange} />
                </div>
                <button type="submbit" className="btn btn-primary mt-3">
                    Save
                </button>
            </form>
        </div>
    );
};

export default ItemForm;