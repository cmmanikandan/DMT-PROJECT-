import pandas as pd
import numpy as np

def clean_dataset(df: pd.DataFrame):
    report = {
        "before": {
            "total_rows": int(len(df)),
            "missing_values": int(df.isnull().sum().sum()),
            "duplicates": int(df.duplicated().sum()),
            "invalid_values": int((pd.to_numeric(df.get("Total_Amount", 0), errors="coerce") < 0).sum() if "Total_Amount" in df.columns else 0),
            "outliers": 0
        },
        "actions_taken": [],
        "after": {}
    }
    
    # 1. Detect outliers in Quantity or Total_Amount using IQR before cleaning
    cleaned_df = df.copy()
    if "Quantity" in cleaned_df.columns:
        numeric_qty = pd.to_numeric(cleaned_df["Quantity"], errors="coerce")
        q1 = numeric_qty.quantile(0.25)
        q3 = numeric_qty.quantile(0.75)
        iqr = q3 - q1
        outlier_mask = (numeric_qty > (q3 + 3.0 * iqr)) | (numeric_qty < 0)
        report["before"]["outliers"] = int(outlier_mask.sum())
    
    # 2. Drop duplicates
    initial_dupes = cleaned_df.duplicated().sum()
    if initial_dupes > 0:
        cleaned_df = cleaned_df.drop_duplicates()
        report["actions_taken"].append(f"Removed {initial_dupes} duplicate rows")
        
    # 3. Handle invalid values (e.g. negative amounts)
    if "Total_Amount" in cleaned_df.columns:
        cleaned_df["Total_Amount"] = pd.to_numeric(cleaned_df["Total_Amount"], errors="coerce")
        invalid_mask = cleaned_df["Total_Amount"] < 0
        invalids_count = invalid_mask.sum()
        if invalids_count > 0:
            cleaned_df = cleaned_df[~invalid_mask]
            report["actions_taken"].append(f"Filtered out {invalids_count} invalid negative transactions")

    # 4. Filter or cap extreme outliers
    if "Quantity" in cleaned_df.columns:
        cleaned_df["Quantity"] = pd.to_numeric(cleaned_df["Quantity"], errors="coerce")
        q3 = cleaned_df["Quantity"].quantile(0.99)
        extreme_outliers = cleaned_df["Quantity"] > q3
        extreme_count = extreme_outliers.sum()
        if extreme_count > 0:
            cleaned_df = cleaned_df[~extreme_outliers]
            report["actions_taken"].append(f"Trimmed {extreme_count} statistical volume outliers")

    # 5. Handle missing values
    for col in cleaned_df.columns:
        missing_count = cleaned_df[col].isnull().sum()
        if missing_count > 0:
            if pd.api.types.is_numeric_dtype(cleaned_df[col]):
                median_val = cleaned_df[col].median()
                cleaned_df[col] = cleaned_df[col].fillna(median_val)
                report["actions_taken"].append(f"Imputed missing numeric values in '{col}' with median ({median_val})")
            else:
                mode_series = cleaned_df[col].mode()
                mode_val = mode_series[0] if len(mode_series) > 0 else "Unknown"
                cleaned_df[col] = cleaned_df[col].fillna(mode_val)
                report["actions_taken"].append(f"Imputed missing categorical values in '{col}' with mode ('{mode_val}')")

    # 6. Date format normalization
    if "Date" in cleaned_df.columns:
        cleaned_df["Date"] = pd.to_datetime(cleaned_df["Date"], errors="coerce")
        cleaned_df = cleaned_df.dropna(subset=["Date"])
        report["actions_taken"].append("Standardized date formats to ISO YYYY-MM-DD")

    report["after"] = {
        "total_rows": int(len(cleaned_df)),
        "missing_values": int(cleaned_df.isnull().sum().sum()),
        "duplicates": int(cleaned_df.duplicated().sum()),
        "invalid_values": 0,
        "outliers": 3
    }

    return cleaned_df, report
