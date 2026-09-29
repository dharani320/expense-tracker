import { useEffect, useState } from "react";

function App() {
    const [expenses, setExpenses] = useState([]);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Food");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    const [editingId, setEditingId] = useState(null);

    // Search and filter
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    // Load expenses from PostgreSQL
    useEffect(() => {
        fetch("http://localhost:5000/expenses")
            .then((response) => response.json())
            .then((data) => {
                setExpenses(
                    data.map((expense) => ({
                        id: expense.id,
                        title: expense.title,
                        category: expense.category,
                        amount: Number(expense.amount),
                        date: expense.expense_date.slice(0, 10),
                    }))
                );
            })
            .catch((error) => {
                console.error("Error loading expenses:", error);
            });
    }, []);

    // Add or update expense
    const saveExpense = async (event) => {
        event.preventDefault();

        if (!title || !amount || !date) {
            alert("Please fill all fields");
            return;
        }

        try {
            // UPDATE
            if (editingId !== null) {
                const response = await fetch(
                    `http://localhost:5000/expenses/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            title,
                            category,
                            amount: Number(amount),
                            expense_date: date,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to update expense");
                }

                const updatedExpense = await response.json();

                setExpenses(
                    expenses.map((expense) =>
                        expense.id === editingId
                            ? {
                                  id: updatedExpense.id,
                                  title: updatedExpense.title,
                                  category: updatedExpense.category,
                                  amount: Number(updatedExpense.amount),
                                  date: updatedExpense.expense_date.slice(
                                      0,
                                      10
                                  ),
                              }
                            : expense
                    )
                );

                setEditingId(null);
            } else {
                // ADD
                const response = await fetch(
                    "http://localhost:5000/expenses",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            title,
                            category,
                            amount: Number(amount),
                            expense_date: date,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to add expense");
                }

                const newExpense = await response.json();

                setExpenses([
                    {
                        id: newExpense.id,
                        title: newExpense.title,
                        category: newExpense.category,
                        amount: Number(newExpense.amount),
                        date: newExpense.expense_date.slice(0, 10),
                    },
                    ...expenses,
                ]);
            }

            setTitle("");
            setAmount("");
            setDate("");
            setCategory("Food");
        } catch (error) {
            console.error(error);
            alert("Failed to save expense");
        }
    };

    // Start editing
    const startEdit = (expense) => {
        setEditingId(expense.id);
        setTitle(expense.title);
        setCategory(expense.category);
        setAmount(expense.amount);
        setDate(expense.date);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setTitle("");
        setAmount("");
        setDate("");
        setCategory("Food");
    };

    // Delete expense
    const deleteExpense = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:5000/expenses/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete expense");
            }

            setExpenses(
                expenses.filter((expense) => expense.id !== id)
            );
        } catch (error) {
            console.error(error);
            alert("Failed to delete expense");
        }
    };

    // Filter expenses
    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch = expense.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCategory =
            filterCategory === "All" ||
            expense.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    // Calculate total
    const totalExpenses = expenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    // Calculate average
    const averageExpense =
        expenses.length > 0
            ? totalExpenses / expenses.length
            : 0;
	// Calculate category totals
    const categoryTotals = {};

expenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] += expense.amount;
});


    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>Expense Tracker</h1>

                <p style={styles.subtitle}>
                    Track your daily expenses easily
                </p>

                {/* Summary Cards */}
                <div style={styles.summaryContainer}>
                    <div style={styles.card}>
                        <p style={styles.cardLabel}>
                            Total Expenses
                        </p>

                        <h2 style={styles.cardValue}>
                            ₹{totalExpenses.toFixed(2)}
                        </h2>
                    </div>

                    <div style={styles.card}>
                        <p style={styles.cardLabel}>
                            Transactions
                        </p>

                        <h2 style={styles.cardValue}>
                            {expenses.length}
                        </h2>
                    </div>

                    <div style={styles.card}>
                        <p style={styles.cardLabel}>
                            Average Expense
                        </p>

                        <h2 style={styles.cardValue}>
                            ₹{averageExpense.toFixed(2)}
                        </h2>
                    </div>
                </div>

                {/* Add / Edit Expense */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        {editingId !== null
                            ? "Edit Expense"
                            : "Add Expense"}
                    </h2>

                    <form onSubmit={saveExpense}>
                        <div style={styles.formGrid}>
                            <div>
                                <label style={styles.label}>
                                    Title
                                </label>

                                <input
                                    style={styles.input}
                                    type="text"
                                    placeholder="e.g. Lunch"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Category
                                </label>

                                <select
                                    style={styles.input}
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(event.target.value)
                                    }
                                >
                                    <option value="Food">
                                        Food
                                    </option>

                                    <option value="Travel">
                                        Travel
                                    </option>

                                    <option value="Shopping">
                                        Shopping
                                    </option>

                                    <option value="Bills">
                                        Bills
                                    </option>

                                    <option value="Entertainment">
                                        Entertainment
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Amount
                                </label>

                                <input
                                    style={styles.input}
                                    type="number"
                                    placeholder="e.g. 250"
                                    value={amount}
                                    onChange={(event) =>
                                        setAmount(event.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Date
                                </label>

                                <input
                                    style={styles.input}
                                    type="date"
                                    value={date}
                                    onChange={(event) =>
                                        setDate(event.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <button
                            style={styles.addButton}
                            type="submit"
                        >
                            {editingId !== null
                                ? "Update Expense"
                                : "Add Expense"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                style={styles.cancelButton}
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
				{/* Category Summary */}
<div style={styles.section}>
    <h2 style={styles.sectionTitle}>
        Category Summary
    </h2>

    {Object.keys(categoryTotals).length === 0 ? (
        <p style={styles.emptyText}>
            No expenses yet.
        </p>
    ) : (
        <div style={styles.categoryGrid}>
            {Object.entries(categoryTotals).map(
                ([category, total]) => (
                    <div
                        key={category}
                        style={styles.categoryCard}
                    >
                        <p style={styles.categoryName}>
                            {category}
                        </p>

                        <h3 style={styles.categoryAmount}>
                            ₹{total.toFixed(2)}
                        </h3>
                    </div>
                )
            )}
        </div>
    )}
</div>
{/* Category Summary */}
<div style={styles.section}>
    <h2 style={styles.sectionTitle}>
        Category Summary
    </h2>

    {Object.keys(categoryTotals).length === 0 ? (
        <p style={styles.emptyText}>
            No expenses yet.
        </p>
    ) : (
        <div style={styles.categoryGrid}>
            {Object.entries(categoryTotals).map(
                ([category, total]) => (
                    <div
                        key={category}
                        style={styles.categoryCard}
                    >
                        <p style={styles.categoryName}>
                            {category}
                        </p>

                        <h3 style={styles.categoryAmount}>
                            ₹{total.toFixed(2)}
                        </h3>
                    </div>
                )
            )}
        </div>
    )}
</div>

                {/* Recent Expenses */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        Recent Expenses
                    </h2>

                    {/* Search and Filter */}
                    <div style={styles.filterContainer}>
                        <input
                            style={styles.searchInput}
                            type="text"
                            placeholder="Search expenses..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                        <select
                            style={styles.filterSelect}
                            value={filterCategory}
                            onChange={(event) =>
                                setFilterCategory(event.target.value)
                            }
                        >
                            <option value="All">
                                All Categories
                            </option>

                            <option value="Food">
                                Food
                            </option>

                            <option value="Travel">
                                Travel
                            </option>

                            <option value="Shopping">
                                Shopping
                            </option>

                            <option value="Bills">
                                Bills
                            </option>

                            <option value="Entertainment">
                                Entertainment
                            </option>

                            <option value="Other">
                                Other
                            </option>
                        </select>
                    </div>

                    {filteredExpenses.length === 0 ? (
                        <p style={styles.emptyText}>
                            No matching expenses found.
                        </p>
                    ) : (
                        <div>
                            {filteredExpenses.map((expense) => (
                                <div
                                    key={expense.id}
                                    style={styles.expenseRow}
                                >
                                    <div>
                                        <h3 style={styles.expenseTitle}>
                                            {expense.title}
                                        </h3>

                                        <p style={styles.expenseDetails}>
                                            {expense.category} •{" "}
                                            {expense.date}
                                        </p>
                                    </div>

                                    <div style={styles.rightSide}>
                                        <strong style={styles.amount}>
                                            ₹{expense.amount.toFixed(2)}
                                        </strong>

                                        <button
                                            style={styles.editButton}
                                            onClick={() =>
                                                startEdit(expense)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            style={styles.deleteButton}
                                            onClick={() =>
                                                deleteExpense(expense.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #0f172a, #111827, #1e1b4b)",
        color: "#ffffff",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
    },

    container: {
        maxWidth: "1000px",
        margin: "0 auto",
    },

    title: {
        fontSize: "42px",
        marginBottom: "8px",
    },

    subtitle: {
        color: "#a5b4fc",
        marginBottom: "30px",
    },

    summaryContainer: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "30px",
    },

    card: {
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "16px",
        padding: "24px",
        backdropFilter: "blur(10px)",
    },

    cardLabel: {
        color: "#cbd5e1",
        marginBottom: "10px",
    },

    cardValue: {
        fontSize: "28px",
        margin: 0,
    },

    section: {
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "16px",
        padding: "25px",
        marginBottom: "25px",
    },

    sectionTitle: {
        marginTop: 0,
        marginBottom: "20px",
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "18px",
    },

    label: {
        display: "block",
        marginBottom: "8px",
        color: "#cbd5e1",
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #475569",
        background: "#1e293b",
        color: "#ffffff",
        fontSize: "15px",
    },

    addButton: {
        marginTop: "20px",
        padding: "12px 22px",
        border: "none",
        borderRadius: "8px",
        background: "#6366f1",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
    },

    cancelButton: {
        marginTop: "20px",
        marginLeft: "10px",
        padding: "12px 22px",
        border: "none",
        borderRadius: "8px",
        background: "#64748b",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
    },

    filterContainer: {
        display: "flex",
        gap: "12px",
        marginBottom: "20px",
        flexWrap: "wrap",
    },

    searchInput: {
        flex: 1,
        minWidth: "220px",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #475569",
        background: "#1e293b",
        color: "#ffffff",
        fontSize: "15px",
        boxSizing: "border-box",
    },

    filterSelect: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #475569",
        background: "#1e293b",
        color: "#ffffff",
        fontSize: "15px",
    },

    expenseRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "18px 0",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
    },

    expenseTitle: {
        margin: "0 0 6px 0",
    },

    expenseDetails: {
        margin: 0,
        color: "#94a3b8",
    },

    rightSide: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },

    amount: {
        fontSize: "18px",
        marginRight: "5px",
    },

    editButton: {
        padding: "8px 14px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "#ffffff",
        cursor: "pointer",
    },

    deleteButton: {
        padding: "8px 14px",
        border: "none",
        borderRadius: "6px",
        background: "#dc2626",
        color: "#ffffff",
        cursor: "pointer",
    },

    emptyText: {
        color: "#94a3b8",
    },
	    categoryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px",
    },

    categoryCard: {
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        padding: "18px",
    },

    categoryName: {
        margin: "0 0 8px 0",
        color: "#cbd5e1",
    },

    categoryAmount: {
        margin: 0,
        fontSize: "22px",
    },
};

export default App;