import os
import io
import pandas as pd
import numpy as np
from typing import Optional, List
from fastapi import FastAPI, File, UploadFile, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.data_cleaning import clean_dataset
from services.sales_analytics import compute_sales_analytics
from services.prediction_engine import predict_sales, get_product_demand_predictions
from services.customer_segmentation import perform_customer_segmentation
from services.market_basket import run_market_basket_analysis
from services.inventory_alerts import compute_inventory_alerts
from services.anomaly_detector import detect_anomalies
from services.ai_assistant import process_ai_query
from database import (
    init_db,
    get_db_status,
    save_dataframe_to_db,
    load_dataframe_from_db,
    ensure_database_exists
)

app = FastAPI(
    title="ECOMSIGHT API",
    description="E-Commerce Sales Intelligence & Prediction System Backend with MySQL Database",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for active dataset
CURRENT_DATASET: Optional[pd.DataFrame] = None
CURRENT_DATASET_META: Optional[dict] = None

def compute_dataset_metadata(df: pd.DataFrame, filename: str):
    total_rows = len(df)
    total_cols = len(df.columns)
    duplicates_count = int(df.duplicated().sum())
    missing_count = int(df.isnull().sum().sum())
    
    invalid_count = 0
    if "Total_Amount" in df.columns:
        invalid_count = int((pd.to_numeric(df["Total_Amount"], errors="coerce") < 0).sum())

    outliers_count = 0
    if "Quantity" in df.columns:
        numeric_qty = pd.to_numeric(df["Quantity"], errors="coerce")
        q1 = numeric_qty.quantile(0.25)
        q3 = numeric_qty.quantile(0.75)
        iqr = q3 - q1
        outliers_count = int(((numeric_qty > (q3 + 3.0 * iqr)) | (numeric_qty < 0)).sum())

    columns_info = []
    for col in df.columns:
        columns_info.append({
            "name": col,
            "dtype": str(df[col].dtype),
            "missing": int(df[col].isnull().sum())
        })

    return {
        "filename": filename,
        "upload_date": pd.Timestamp.now().strftime("%d-%m-%Y"),
        "rows": total_rows,
        "columns": total_cols,
        "missing_values": missing_count,
        "duplicates": duplicates_count,
        "invalid_values": invalid_count,
        "outliers": outliers_count,
        "quality_status": "Cleaned & Ready" if (missing_count == 0 and duplicates_count == 0) else "Raw / Preprocessing Required",
        "columns_info": columns_info
    }

# Startup Initialization: Connect & seed MySQL database
SAMPLE_PATH = os.path.join(os.path.dirname(__file__), "sample_data", "ecommerce_sales_dataset.csv")
try:
    init_db(sample_csv_path=SAMPLE_PATH)
    # Prefer loading primary dataset from MySQL database
    db_df = load_dataframe_from_db(dataset_name="ecommerce_sales_dataset.csv")
    if not db_df.empty:
        CURRENT_DATASET = db_df
        CURRENT_DATASET_META = compute_dataset_metadata(CURRENT_DATASET, "ecommerce_sales_dataset.csv")
        print(f"[Database] Loaded {len(CURRENT_DATASET)} records from database for primary dataset.")
    elif os.path.exists(SAMPLE_PATH):
        CURRENT_DATASET = pd.read_csv(SAMPLE_PATH)
        CURRENT_DATASET_META = compute_dataset_metadata(CURRENT_DATASET, "ecommerce_sales_dataset.csv")
        save_dataframe_to_db(CURRENT_DATASET, "ecommerce_sales_dataset.csv")
except Exception as e:
    print(f"[Startup Notice] Database initialization: {e}")
    if os.path.exists(SAMPLE_PATH):
        try:
            CURRENT_DATASET = pd.read_csv(SAMPLE_PATH)
            CURRENT_DATASET_META = compute_dataset_metadata(CURRENT_DATASET, "ecommerce_sales_dataset.csv")
        except Exception as err:
            print(f"Fallback CSV error: {err}")

@app.get("/")
def root():
    return {
        "app": "ECOMSIGHT API",
        "status": "online",
        "version": "1.0.0",
        "database": get_db_status(),
        "dataset_loaded": CURRENT_DATASET is not None,
        "dataset_rows": len(CURRENT_DATASET) if CURRENT_DATASET is not None else 0
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "backend": "FastAPI 0.115+",
        "database": get_db_status(),
        "ml_engine": "Scikit-Learn / Pandas",
        "dataset_active": CURRENT_DATASET is not None,
        "dataset_meta": CURRENT_DATASET_META
    }

@app.get("/api/db/status")
def database_status():
    return get_db_status()

@app.post("/api/db/sync")
def sync_dataset_to_db():
    global CURRENT_DATASET, CURRENT_DATASET_META
    if CURRENT_DATASET is None:
        raise HTTPException(status_code=400, detail="No active dataset in memory to sync.")
    dataset_name = CURRENT_DATASET_META["filename"] if CURRENT_DATASET_META else "ecommerce_sales_dataset.csv"
    count = save_dataframe_to_db(CURRENT_DATASET, dataset_name=dataset_name, replace=True)
    return {
        "status": "success",
        "message": f"Successfully synchronized {count} records into MySQL database.",
        "records_count": count
    }

@app.post("/api/db/load")
def load_dataset_from_database(dataset_name: Optional[str] = None):
    global CURRENT_DATASET, CURRENT_DATASET_META
    df = load_dataframe_from_db(dataset_name=dataset_name)
    if df.empty:
        raise HTTPException(status_code=404, detail="No records found in MySQL database.")
    CURRENT_DATASET = df
    CURRENT_DATASET_META = compute_dataset_metadata(df, dataset_name or "MySQL Dataset")
    return {
        "status": "success",
        "message": f"Loaded {len(df)} records from MySQL database.",
        "metadata": CURRENT_DATASET_META,
        "preview": df.head(15).fillna("").to_dict(orient="records")
    }

@app.post("/api/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    global CURRENT_DATASET, CURRENT_DATASET_META
    try:
        content = await file.read()
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Only CSV and XLSX files are supported.")

        CURRENT_DATASET = df
        CURRENT_DATASET_META = compute_dataset_metadata(df, file.filename)
        preview = df.head(15).fillna("").to_dict(orient="records")

        # Automatically persist uploaded dataset to MySQL
        try:
            save_dataframe_to_db(df, dataset_name=file.filename, replace=True)
        except Exception as dbe:
            print(f"[MySQL Sync Warning] Failed to auto-persist to MySQL: {dbe}")

        return {
            "status": "success",
            "metadata": CURRENT_DATASET_META,
            "columns": list(df.columns),
            "preview": preview,
            "saved_to_db": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/dataset")
def delete_dataset():
    global CURRENT_DATASET, CURRENT_DATASET_META
    CURRENT_DATASET = None
    CURRENT_DATASET_META = None
    return {
        "status": "success",
        "message": "Dataset successfully cleared from memory."
    }

@app.post("/api/dataset/reset-sample")
def reset_sample_dataset():
    global CURRENT_DATASET, CURRENT_DATASET_META
    # Try loading from MySQL first
    df = load_dataframe_from_db()
    if not df.empty:
        CURRENT_DATASET = df
        CURRENT_DATASET_META = compute_dataset_metadata(CURRENT_DATASET, "ecommerce_sales_dataset.csv (MySQL)")
        return {
            "status": "success",
            "metadata": CURRENT_DATASET_META,
            "preview": CURRENT_DATASET.head(15).fillna("").to_dict(orient="records")
        }
    if os.path.exists(SAMPLE_PATH):
        CURRENT_DATASET = pd.read_csv(SAMPLE_PATH)
        CURRENT_DATASET_META = compute_dataset_metadata(CURRENT_DATASET, "ecommerce_sales_dataset.csv")
        save_dataframe_to_db(CURRENT_DATASET, "ecommerce_sales_dataset.csv")
        return {
            "status": "success",
            "metadata": CURRENT_DATASET_META,
            "preview": CURRENT_DATASET.head(15).fillna("").to_dict(orient="records")
        }
    raise HTTPException(status_code=404, detail="Sample dataset not found.")

@app.get("/api/datasets/available")
def list_available_datasets():
    datasets = []
    try:
        from database import SessionLocal, SalesTransactionModel
        from sqlalchemy import func
        db = SessionLocal()
        results = db.query(
            SalesTransactionModel.dataset_name,
            func.count(SalesTransactionModel.id)
        ).group_by(SalesTransactionModel.dataset_name).all()
        db.close()
        for dname, cnt in results:
            datasets.append({
                "name": dname or "Main E-Commerce Dataset",
                "rows": cnt,
                "source": "MySQL (ecomsight_db)"
            })
    except Exception as e:
        print("[MySQL Error] Listing datasets:", e)

    sample_dir = os.path.join(os.path.dirname(__file__), "sample_data")
    if os.path.exists(sample_dir):
        for f in os.listdir(sample_dir):
            if f.endswith(".csv") and not any(d["name"] == f for d in datasets):
                fpath = os.path.join(sample_dir, f)
                try:
                    df_temp = pd.read_csv(fpath)
                    datasets.append({
                        "name": f,
                        "rows": len(df_temp),
                        "source": "Sample File"
                    })
                except Exception:
                    pass
    return {
        "status": "success",
        "datasets": datasets,
        "active_dataset": CURRENT_DATASET_META["filename"] if CURRENT_DATASET_META else None
    }

@app.post("/api/datasets/select")
def select_dataset(name: str = Query(...)):
    global CURRENT_DATASET, CURRENT_DATASET_META
    # Try loading from MySQL
    df = load_dataframe_from_db(dataset_name=name)
    if df.empty:
        sample_file = os.path.join(os.path.dirname(__file__), "sample_data", name)
        if os.path.exists(sample_file):
            df = pd.read_csv(sample_file)
            save_dataframe_to_db(df, dataset_name=name, replace=True)

    if df.empty:
        raise HTTPException(status_code=404, detail=f"Dataset '{name}' not found.")
    
    CURRENT_DATASET = df
    CURRENT_DATASET_META = compute_dataset_metadata(df, name)
    return {
        "status": "success",
        "message": f"Successfully activated dataset '{name}' with {len(df)} records.",
        "metadata": CURRENT_DATASET_META,
        "preview": df.head(15).fillna("").to_dict(orient="records")
    }

@app.get("/api/dataset/preview")
def get_dataset_preview(page: int = 1, page_size: int = 15, search: Optional[str] = None):
    if CURRENT_DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset uploaded yet.")
    
    df = CURRENT_DATASET
    if search and search.strip():
        term = search.strip().lower()
        mask = df.astype(str).apply(lambda row: row.str.lower().str.contains(term, regex=False).any(), axis=1)
        df = df[mask]

    total_rows = len(df)
    total_pages = max(1, int(np.ceil(total_rows / page_size)))
    current_page = max(1, min(page, total_pages))
    
    start_idx = (current_page - 1) * page_size
    end_idx = min(start_idx + page_size, total_rows)
    preview = df.iloc[start_idx:end_idx].fillna("").to_dict(orient="records")
    
    return {
        "metadata": CURRENT_DATASET_META,
        "columns": list(CURRENT_DATASET.columns),
        "total_rows": total_rows,
        "page": current_page,
        "page_size": page_size,
        "total_pages": total_pages,
        "preview": preview
    }

@app.post("/api/dataset/clean")
def trigger_data_cleaning():
    global CURRENT_DATASET, CURRENT_DATASET_META
    if CURRENT_DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset available to clean.")
    
    cleaned_df, report = clean_dataset(CURRENT_DATASET)
    CURRENT_DATASET = cleaned_df
    CURRENT_DATASET_META = compute_dataset_metadata(cleaned_df, CURRENT_DATASET_META["filename"] if CURRENT_DATASET_META else "cleaned_dataset.csv")
    CURRENT_DATASET_META["quality_status"] = "Cleaned & Verified"

    # Persist cleaned dataset to MySQL
    try:
        save_dataframe_to_db(cleaned_df, dataset_name=CURRENT_DATASET_META["filename"], replace=True)
    except Exception as dbe:
        print(f"[MySQL Sync Warning] Failed to update MySQL with cleaned data: {dbe}")

    return {
        "status": "success",
        "report": report,
        "metadata": CURRENT_DATASET_META,
        "preview": cleaned_df.head(15).fillna("").to_dict(orient="records")
    }

@app.get("/api/sales/analysis")
def get_sales_analytics(granularity: str = "monthly"):
    if CURRENT_DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset uploaded yet.")
    return compute_sales_analytics(CURRENT_DATASET, granularity=granularity)

class PredictionRequest(BaseModel):
    prediction_type: str = "Overall Sales"
    category: str = "All"
    product: str = "All"
    period: str = "Next Month"

@app.post("/api/sales/predict")
def run_sales_prediction(req: PredictionRequest):
    if CURRENT_DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset uploaded yet.")
    return predict_sales(
        CURRENT_DATASET,
        prediction_type=req.prediction_type,
        category=req.category,
        product=req.product,
        period=req.period
    )

@app.get("/api/product/demand")
def get_product_demand():
    if CURRENT_DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset uploaded yet.")
    return get_product_demand_predictions(CURRENT_DATASET)

@app.get("/api/customers/segment")
def get_customer_segmentation(clusters: int = 4):
    if CURRENT_DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset uploaded yet.")
    return perform_customer_segmentation(CURRENT_DATASET, n_clusters=clusters)

@app.get("/api/market-basket/analyze")
def get_market_basket_analysis(min_support: float = 0.05, min_confidence: float = 0.4):
    if CURRENT_DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset uploaded yet.")
    return run_market_basket_analysis(CURRENT_DATASET, min_support=min_support, min_confidence=min_confidence)

@app.get("/api/inventory/alerts")
def get_inventory_alerts(lead_time_days: int = 7):
    if CURRENT_DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset uploaded yet.")
    return compute_inventory_alerts(CURRENT_DATASET, default_lead_time_days=lead_time_days)

@app.get("/api/analytics/anomalies")
def get_detected_anomalies():
    if CURRENT_DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset uploaded yet.")
    return detect_anomalies(CURRENT_DATASET)

class AIQueryRequest(BaseModel):
    query: str

@app.post("/api/ai/query")
def run_ai_assistant_query(req: AIQueryRequest):
    return process_ai_query(req.query, CURRENT_DATASET)

class WhatIfRequest(BaseModel):
    discount_pct: float = 10.0
    price_change_pct: float = 0.0
    marketing_multiplier: float = 1.0
    festival_mode: bool = False
    category: str = "All"

@app.post("/api/simulation/what-if")
def simulate_scenario(req: WhatIfRequest):
    if CURRENT_DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset uploaded yet.")
    
    df = CURRENT_DATASET.copy()
    if req.category != "All" and "Category" in df.columns:
        df = df[df["Category"] == req.category]
        if df.empty:
            df = CURRENT_DATASET.copy()

    total_amount_col = "Total_Amount" if "Total_Amount" in df.columns else ("Sales" if "Sales" in df.columns else None)
    qty_col = "Quantity" if "Quantity" in df.columns else None
    
    baseline_revenue = float(df[total_amount_col].sum()) if total_amount_col else 100000.0
    baseline_units = int(df[qty_col].sum()) if qty_col else 1500
    baseline_orders = len(df)
    baseline_aov = baseline_revenue / max(1, baseline_orders)

    # Price Elasticity: E-commerce average PED is -1.4 (elastic demand)
    elasticity = -1.4
    net_price_effect_pct = (req.price_change_pct - req.discount_pct) / 100.0
    qty_elasticity_pct = elasticity * net_price_effect_pct

    # Marketing diminishing returns model
    marketing_factor = max(0.1, req.marketing_multiplier)
    mktg_uplift_pct = (marketing_factor ** 0.4 - 1.0)

    # Festival effect
    festival_uplift_pct = 0.35 if req.festival_mode else 0.0

    # Combined quantity factor
    simulated_qty_multiplier = max(0.2, 1.0 + qty_elasticity_pct + mktg_uplift_pct + festival_uplift_pct)
    simulated_units = int(baseline_units * simulated_qty_multiplier)

    # Price per unit factor
    simulated_price_multiplier = max(0.4, (1.0 + (req.price_change_pct / 100.0)) * (1.0 - (req.discount_pct / 100.0)))
    simulated_revenue = float(baseline_revenue * simulated_qty_multiplier * simulated_price_multiplier)
    
    # Estimated Gross Margin (assuming 55% average baseline COGS + ad spend scaling)
    cogs_pct = 0.48
    base_gross_profit = baseline_revenue * (1.0 - cogs_pct)
    ad_spend_cost = (req.marketing_multiplier - 1.0) * 0.08 * baseline_revenue if req.marketing_multiplier > 1.0 else 0.0
    simulated_gross_profit = max(0.0, (simulated_revenue * (1.0 - cogs_pct)) - ad_spend_cost)
    
    simulated_margin_pct = (simulated_gross_profit / max(1.0, simulated_revenue)) * 100.0
    baseline_margin_pct = (base_gross_profit / max(1.0, baseline_revenue)) * 100.0

    # Category projection if category col exists
    categories_breakdown = []
    if "Category" in CURRENT_DATASET.columns:
        cat_group = CURRENT_DATASET.groupby("Category")[total_amount_col].sum().reset_index()
        for _, row in cat_group.iterrows():
            c_name = str(row["Category"])
            c_base = float(row[total_amount_col])
            c_sim = float(c_base * simulated_qty_multiplier * simulated_price_multiplier)
            categories_breakdown.append({
                "category": c_name,
                "baseline_revenue": round(c_base, 2),
                "simulated_revenue": round(c_sim, 2),
                "growth_pct": round(((c_sim - c_base) / max(1.0, c_base)) * 100.0, 1)
            })

    # AI Recommendation
    rev_change_pct = ((simulated_revenue - baseline_revenue) / max(1.0, baseline_revenue)) * 100.0
    if rev_change_pct > 15 and simulated_margin_pct >= 40:
        recommendation = "Highly Favorable Scenario: Strong top-line growth with healthy margin protection."
        status = "optimal"
    elif rev_change_pct > 0 and simulated_margin_pct < 35:
        recommendation = "Margin Compression Risk: Revenue increases, but steep discounts or high marketing costs erode profit."
        status = "warning"
    elif rev_change_pct <= 0:
        recommendation = "Suboptimal Scenario: Price hike or reduced marketing suppresses consumer demand below break-even."
        status = "critical"
    else:
        recommendation = "Balanced Scenario: Moderate demand expansion with stable operating profit."
        status = "neutral"

    return {
        "status": status,
        "recommendation": recommendation,
        "baseline": {
            "revenue": round(baseline_revenue, 2),
            "units": baseline_units,
            "gross_profit": round(base_gross_profit, 2),
            "margin_pct": round(baseline_margin_pct, 1),
            "aov": round(baseline_aov, 2)
        },
        "simulated": {
            "revenue": round(simulated_revenue, 2),
            "units": simulated_units,
            "gross_profit": round(simulated_gross_profit, 2),
            "margin_pct": round(simulated_margin_pct, 1),
            "revenue_growth_pct": round(rev_change_pct, 1),
            "unit_growth_pct": round(((simulated_units - baseline_units) / max(1, baseline_units)) * 100.0, 1)
        },
        "category_breakdown": categories_breakdown
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
