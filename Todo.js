import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  // Add new item
  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { _id: Date.now(), title, description }]); // Temporarily use a unique ID
            setMessage("Item added successfully");
            setTitle("");
            setDescription("");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setError("Unable to create Todo item");
          }
        })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  // Fetch items from the server
  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };

  // Update item
  const handleUpdate = (id) => {
    const updatedTodos = todos.map((item) =>
      item._id === id
        ? { ...item, title: editTitle, description: editDescription }
        : item
    );
    setTodos(updatedTodos);
    setEditId(null);

    // Send update request to the backend
    fetch(`${apiUrl}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    })
      .then((res) => {
        if (!res.ok) {
          setError("Failed to update Todo item");
        }
      })
      .catch(() => {
        setError("Failed to update Todo item");
      });
  };

  // Delete item
  const handleDelete = (id) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete?");
  
    if (confirmDelete) {
      // Proceed with deletion if the user confirms
      const filteredTodos = todos.filter((item) => item._id !== id);
      setTodos(filteredTodos);
  
      // Send DELETE request to backend
      fetch(`${apiUrl}/todos/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            setError("Failed to delete Todo item");
          }
        })
        .catch(() => {
          setError("Failed to delete Todo item");
        });
    }
  };
  

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>Todo Project with MERN</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-3">
        <h3>Tasks</h3>
        <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
            >
              <div className="d-flex flex-column me-2">
                {editId === item._id ? (
                  <div className="form-group d-flex gap-2">
                    <input
                      placeholder="Title"
                      onChange={(e) => setEditTitle(e.target.value)}
                      value={editTitle}
                      className="form-control"
                      type="text"
                    />
                    <input
                      placeholder="Description"
                      onChange={(e) => setEditDescription(e.target.value)}
                      value={editDescription}
                      className="form-control"
                      type="text"
                    />
                  </div>
                ) : (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                  </>
                )}
              </div>
              <div className="d-flex gap-2 ms-auto">
                {editId === item._id ? (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleUpdate(item._id)}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      setEditId(item._id);
                      setEditTitle(item.title);
                      setEditDescription(item.description);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}