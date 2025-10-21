import pandas as pd
import os

# Load the CSV file
# df = pd.read_csv( "./data/products_db.csv")


# Get the directory of the current file (main.py or your service file)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build the absolute path to the CSV file
DATA_PATH = os.path.join(BASE_DIR, os.pardir, "data", "products_db.csv")

df = pd.read_csv(DATA_PATH)

# Calculate total cost for each product
df['total_cost'] = (df['cost_price'] + df['holding_cost']) * df['units_sold']

# Calculate average daily sales for each product
df['average_daily_sales'] = round( df['units_sold'] / 30, 2)

# Calculate revenue for each product
df['revenue'] = df['units_sold'] * df['selling_price']

# Calculate reorder point of each product
safety_stock = 10

df['reorder_point'] = round((df['average_daily_sales'] * df['lead_time']) + safety_stock)

# Create a column for if a product needs reodering
df['need_reorder'] = df.apply(
    lambda row: 'yes' if row['units_in_stock'] < row['reorder_point'] else 'no',
    axis=1
)

# Get number of products needing a reorder
number_reorder = df['need_reorder'].value_counts()['yes']

# Calculate profit margin for each product
df['profit_margin'] = round(((df['revenue'] - df['total_cost']) / df['revenue']) * 100, 2)

# Calculate stock value of each product
df["Stock Value"] = (df["cost_price"] + df["holding_cost"]) * df["units_in_stock"]


#  Calculate total revenue, total cost, total stock value, averages, and other metrics
total_revenue = df['revenue'].sum()
total_cost = df['total_cost'].sum()
total_stock_value = df["Stock Value"].sum()
avg_lead = df['lead_time'].mean()
avg_profit = df['profit_margin'].mean()
avg_holding = df['holding_cost'].mean()


# print('Units in stock')
# print(df['units_in_stock'])

print(df['title'])

# print('Reorder point')
# print(df['reorder_point'])

# print(df['need_reorder'])

def get_all_products():
    data = df.to_dict(orient="records")
    return data

def get_all_metrics():
    data = {
        "Total Revenue": int(total_revenue),
        "Total Cost": int(total_cost),
        "Avg. Lead Time": int(avg_lead),
        "Avg. Profit Margin": int(avg_profit),
        "Products to Reorder": int(number_reorder),
        "Avg. Holding Cost": int(avg_holding),
        "Total Stock Value": int(total_stock_value)
    }
    return data

def get_product(title):
    product_row = df[df['title'] == title]
    product_data = product_row.to_dict(orient="records")
    return product_data