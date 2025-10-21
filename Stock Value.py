import pandas as pd

# === Step 1: Load the CSV file ===
df = pd.read_csv("products_db.csv")

# === Step 2: Calculate Stock Value for each product ===
df["Stock Value"] = (df["cost_price"] + df["holding_cost"]) * df["units_in_stock"]

# === Step 3: Display stock value for each product ===
print("Stock Value for each product:\n")
print(df[["title", "cost_price", "holding_cost", "units_in_stock", "Stock Value"]])

# === Step 4: Calculate total stock value ===
total_stock_value = df["Stock Value"].sum()

print("\n=====================================")
print(f"Total Stock Value: ₦{total_stock_value:,}")
print("=====================================")

# === Step 5 (Optional): Save the updated file ===
df.to_csv("products_db_with_stock_value.csv", index=False)
