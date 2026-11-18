import pandas as pd
import numpy as np

df = pd.read_csv("backend/sample_data/ecommerce_sales_dataset.csv")

total_rows = len(df)
total_cols = len(df.columns)
duplicates = int(df.duplicated().sum())
missing_values = int(df.isnull().sum().sum())
invalid_values = int((pd.to_numeric(df["Total_Amount"], errors="coerce") < 0).sum())

numeric_qty = pd.to_numeric(df["Quantity"], errors="coerce")
q1 = numeric_qty.quantile(0.25)
q3 = numeric_qty.quantile(0.75)
iqr = q3 - q1
outliers = int(((numeric_qty > (q3 + 3.0 * iqr)) | (numeric_qty < 0)).sum())

print("EXACT_STATS:")
print(f"Rows: {total_rows}")
print(f"Cols: {total_cols}")
print(f"Duplicates: {duplicates}")
print(f"Missing: {missing_values}")
print(f"Invalid: {invalid_values}")
print(f"Outliers: {outliers}")

col_info = []
for c in df.columns:
    col_info.append({
        "column": c,
        "dtype": str(df[c].dtype),
        "missing": int(df[c].isnull().sum())
    })
print("COL_INFO:", col_info)
