const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD
});

app.get("/", (req, res) => {
	res.send("Expense Tracker Backend is running!");
});

app.get("/expenses", async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM expenses ORDER BY expense_date DESC"
		);

		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Database error"
		});
	}
});

app.post("/expenses", async (req, res) => {
	try {
		const { title, category, amount, expense_date } = req.body;

		const result = await pool.query(
			`INSERT INTO expenses (title, category, amount, expense_date)
			 VALUES ($1, $2, $3, $4)
			 RETURNING *`,
			[title, category, amount, expense_date]
		);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Failed to add expense"
		});
	}
});
app.put("/expenses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, amount, expense_date } = req.body;

        const result = await pool.query(
            `UPDATE expenses
             SET title = $1,
                 category = $2,
                 amount = $3,
                 expense_date = $4
             WHERE id = $5
             RETURNING *`,
            [title, category, amount, expense_date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update expense"
        });
    }
});
app.delete("/expenses/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			"DELETE FROM expenses WHERE id = $1 RETURNING *",
			[id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({
				error: "Expense not found"
			});
		}

		res.json({
			message: "Expense deleted successfully"
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Failed to delete expense"
		});
	}
});

const PORT = 5000;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
