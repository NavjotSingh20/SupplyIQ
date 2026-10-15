import express from "express";

const app = express();
const PORT = 3000;

// Middleware 1: Parse incoming JSON request bodies.
app.use(express.json());

// Middleware 2: Log every incoming request.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET: Check whether the backend is running.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SupplyIQ backend is running"
  });
});

// POST: Accept and validate a product.
app.post("/api/products", (req, res) => {
  const { name, quantity } = req.body;

  // Validate the product name.
  if (
    typeof name !== "string" ||
    name.trim().length === 0
  ) {
    res.status(400).json({
      error: "Product name must be a non-empty string"
    });
    return;
  }

  // Validate the quantity.
  if (
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 0
  ) {
    res.status(400).json({
      error: "Quantity must be a non-negative integer"
    });
    return;
  }

  // Both fields are valid.
  const product = {
    name: name.trim(),
    quantity
  };

  res.status(201).json({
    message: "Product received successfully",
    product
  });
});

// Handle malformed JSON bodies.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      error: "Invalid JSON in request body"
    });
    return;
  }

  next(err);
});

app.listen(PORT, () => {
  console.log(
    `SupplyIQ backend running on http://localhost:${PORT}`
  );
});
