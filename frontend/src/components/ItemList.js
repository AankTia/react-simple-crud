import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ItemList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/items");
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhhost:5000/api/items/${id}`);
            fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div>
            <h2>Items List</h2>
            <Link to="/add" className="btn btn-primary mb-3">
                Add Item
            </Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>
                                <Link to={`/edit/${item.id}`} className="btn btn-sm btn-warning mr-2">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemList;