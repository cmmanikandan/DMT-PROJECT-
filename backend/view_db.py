import pandas as pd
from database import engine

print("=" * 70)
print("       ECOMSIGHT - MYSQL DATABASE VIEWER (ecomsight_db)")
print("=" * 70)

# 1. Check datasets summary
summary_sql = """
SELECT 
    dataset_name, 
    COUNT(*) AS total_records,
    COUNT(DISTINCT customer_id) AS unique_customers,
    COUNT(DISTINCT product_name) AS unique_products,
    ROUND(SUM(total_amount), 2) AS total_revenue
FROM sales_transactions
GROUP BY dataset_name;
"""

df_summary = pd.read_sql(summary_sql, engine)
print("\n[1] DATASETS STORED IN MYSQL:")
print(df_summary.to_string(index=False))

# 2. View recent sample rows
sample_sql = """
SELECT 
    transaction_id, 
    date, 
    customer_id, 
    region, 
    product_name, 
    category, 
    unit_price, 
    quantity, 
    total_amount, 
    payment_method,
    dataset_name
FROM sales_transactions
LIMIT 10;
"""

df_sample = pd.read_sql(sample_sql, engine)
print("\n[2] SAMPLE 10 RECORDS FROM 'sales_transactions':")
print(df_sample.to_string(index=False))

# 3. Overall stats
total_count = pd.read_sql("SELECT COUNT(*) AS total FROM sales_transactions;", engine).iloc[0]["total"]
print("\n" + "=" * 70)
print(f" TOTAL TRANSACTIONS IN MYSQL: {total_count:,} records")
print("=" * 70)
