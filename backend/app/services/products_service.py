import pandas as pd
import os

# Load the CSV file
# df = pd.read_csv( "./data/products_db.csv")


# Get the directory of the current file (main.py or your service file)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build the absolute path to the CSV file
DATA_PATH = os.path.join(BASE_DIR, os.pardir, "data", "products_db.csv")

df = pd.read_csv(DATA_PATH)

def process_df(df):
    # Calculate total cost for each product
    df['total_cost'] = (df['cost_price'] + df['holding_cost']) * df['units_sold']

    # Calculate total holding cost for each product
    df['total_holding_cost'] = df['holding_cost'] * df['units_in_stock']

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

    # Calculate profit value for each product
    df['profit'] = round((df['revenue'] - df['total_cost']), 2)

    # Calculate profit margin for each product
    df['profit_margin'] = round(((df['revenue'] - df['total_cost']) / df['revenue']) * 100, 2)

    # Calculate stock value of each product
    df["stock_value"] = (df["cost_price"] + df["holding_cost"]) * df["units_in_stock"]

    # Calculate stock out risk
    df['lead_demand'] = df['average_daily_sales'] * df['lead_time']
    df['stock_out_risk'] = round(((df['lead_demand'] - df['units_in_stock']) / df['lead_demand']) * 100, 2)


# Call processing function
process_df(df)


# print('Units in stock')
# print(df['units_in_stock'])


# print('Reorder point')
# print(df['reorder_point'])

# print(df['need_reorder'])

async def update_data(request):
    global df
    payload = await request.json()
    df = pd.DataFrame(payload["data"])
    process_df(df)
    df.to_csv(DATA_PATH)
    return {"message": "Data updated successfully!"}

def get_all_products():
    data = df.to_dict(orient="records")
    return data

def to_records(df):
        return df.to_dict(orient="records")


def get_all_metrics():
    
    process_df(df)
    #  Calculate total revenue, total cost, total stock value, averages, and other metrics
    total_revenue = df['revenue'].sum()
    total_cost = df['total_cost'].sum()
    total_stock_value = df["stock_value"].sum()
    avg_lead = df['lead_time'].mean()
    avg_profit = df['profit_margin'].mean()
    avg_holding = df['holding_cost'].mean()
    number_reorder = df['need_reorder'].value_counts()['yes']
    

    # Graphs details
    categories = (
    df.groupby('category')['profit']
      .sum()
      .reset_index()
      .sort_values(by='profit', ascending=False))
    
    top_profitable = df.nlargest(5, 'profit')
    stocks = df[["title", "stock_value"]]
    reorder_counts = df['need_reorder'].value_counts().reset_index()
    revenue_totalcost =  (df.groupby('category')[['revenue', 'total_cost']]
                            .sum()
                            .reset_index())
                           
   

   

    data = {
       "metrics": {
        "Total Revenue": int(total_revenue),
        "Total Cost": int(total_cost),
        "Avg. Lead Time": int(avg_lead),
        "Avg. Profit Margin": int(avg_profit),
        "Products to Reorder": int(number_reorder),
        "Avg. Holding Cost": int(avg_holding),
        "Total Stock Value": int(total_stock_value),

       },
       'graphs': {
         "categories": to_records(categories),
         'top_profitable': to_records(top_profitable),
         "stock_value": to_records(stocks),
         "reorders": to_records(reorder_counts),
         'revenue_totalcost': to_records(revenue_totalcost)
       }
       
    }

    return data

def get_product(title):
    product_row = df[df['title'] == title]
    product_data = to_records(product_row)
    return product_data


