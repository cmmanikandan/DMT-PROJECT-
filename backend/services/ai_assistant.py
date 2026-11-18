import os
import json
import urllib.request
import re
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

def call_groq_llm(system_prompt: str, user_prompt: str) -> str:
    if not GROQ_API_KEY:
        return ""
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 1024
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "EcomSightAI/1.0"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            data = json.loads(response.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"[Groq LLM Error] {e}")
        return ""

def process_ai_query(query: str, df: pd.DataFrame) -> Dict[str, Any]:
    if df is None or len(df) == 0:
        return {
            "answer": "No dataset is currently loaded. Please upload a dataset or load the sample data first.",
            "data_type": "text",
            "data": None,
            "suggestions": ["Upload a sales dataset", "Load sample ecommerce data"]
        }

    work_df = df.copy()
    col_map = {}
    for col in work_df.columns:
        c_lower = col.lower().strip()
        if c_lower in ['product_name', 'product', 'item']:
            col_map[col] = 'Product_Name'
        elif c_lower in ['category']:
            col_map[col] = 'Category'
        elif c_lower in ['region']:
            col_map[col] = 'Region'
        elif c_lower in ['total_amount', 'sales', 'amount', 'revenue']:
            col_map[col] = 'Total_Amount'
        elif c_lower in ['quantity', 'qty', 'units']:
            col_map[col] = 'Quantity'
        elif c_lower in ['payment_method', 'payment']:
            col_map[col] = 'Payment_Method'
        elif c_lower in ['customer_id', 'customer']:
            col_map[col] = 'Customer_ID'
        elif c_lower in ['customer_name']:
            col_map[col] = 'Customer_Name'
        elif c_lower in ['discount_percent', 'discount']:
            col_map[col] = 'Discount_Percent'
        elif c_lower in ['date', 'order_date']:
            col_map[col] = 'Date'

    work_df = work_df.rename(columns=col_map)
    if "Total_Amount" in work_df.columns:
        work_df["Total_Amount"] = pd.to_numeric(work_df["Total_Amount"], errors="coerce").fillna(0)
    if "Quantity" in work_df.columns:
        work_df["Quantity"] = pd.to_numeric(work_df["Quantity"], errors="coerce").fillna(1)

    # Calculate live dataset summary context
    total_rev = float(work_df["Total_Amount"].sum()) if "Total_Amount" in work_df.columns else 0.0
    total_orders = len(work_df)
    total_units = int(work_df["Quantity"].sum()) if "Quantity" in work_df.columns else total_orders
    aov = total_rev / max(total_orders, 1)

    top_products_summary = []
    if "Product_Name" in work_df.columns:
        tp = work_df.groupby("Product_Name")["Total_Amount"].sum().sort_values(ascending=False).head(5)
        top_products_summary = [f"{p}: ₹{val:,.0f}" for p, val in tp.items()]

    regional_summary = []
    if "Region" in work_df.columns:
        reg = work_df.groupby("Region")["Total_Amount"].sum().sort_values(ascending=False)
        regional_summary = [f"{r}: ₹{val:,.0f}" for r, val in reg.items()]

    category_summary = []
    if "Category" in work_df.columns:
        cat = work_df.groupby("Category")["Total_Amount"].sum().sort_values(ascending=False)
        category_summary = [f"{c}: ₹{val:,.0f}" for c, val in cat.items()]

    payment_summary = []
    if "Payment_Method" in work_df.columns:
        pay = work_df.groupby("Payment_Method")["Total_Amount"].count().sort_values(ascending=False)
        payment_summary = [f"{p}: {cnt} transactions" for p, cnt in pay.items()]

    # Extract structured chart data based on query intent
    q = query.lower().strip()
    data_type = "text"
    chart_data = None
    value_label = None

    if any(k in q for k in ["product", "item", "selling"]):
        if "Product_Name" in work_df.columns and "Total_Amount" in work_df.columns:
            top_p = work_df.groupby("Product_Name").agg(
                sales=("Total_Amount", "sum"),
                units=("Quantity", "sum")
            ).sort_values("sales", ascending=False).head(5).reset_index()
            chart_data = [
                {"name": str(row["Product_Name"])[:25], "value": round(float(row["sales"]), 2), "units": int(row["units"])}
                for _, row in top_p.iterrows()
            ]
            data_type = "bar_chart"
            value_label = "Revenue (₹)"

    elif any(k in q for k in ["region", "area", "zone", "state"]):
        if "Region" in work_df.columns and "Total_Amount" in work_df.columns:
            region_df = work_df.groupby("Region").agg(
                sales=("Total_Amount", "sum"),
                orders=("Total_Amount", "count")
            ).sort_values("sales", ascending=False).reset_index()
            chart_data = [
                {"name": str(r["Region"]), "value": round(float(r["sales"]), 2), "orders": int(r["orders"])}
                for _, r in region_df.iterrows()
            ]
            data_type = "bar_chart"
            value_label = "Regional Sales (₹)"

    elif any(k in q for k in ["category", "categories", "department"]):
        if "Category" in work_df.columns and "Total_Amount" in work_df.columns:
            cat_df = work_df.groupby("Category").agg(
                sales=("Total_Amount", "sum"),
                quantity=("Quantity", "sum")
            ).sort_values("sales", ascending=False).reset_index()
            chart_data = [
                {"name": str(r["Category"]), "value": round(float(r["sales"]), 2), "quantity": int(r["quantity"])}
                for _, r in cat_df.iterrows()
            ]
            data_type = "pie_chart"
            value_label = "Category Revenue"

    elif any(k in q for k in ["payment", "upi", "card", "cash on delivery", "cod"]):
        if "Payment_Method" in work_df.columns:
            pay_df = work_df.groupby("Payment_Method").agg(
                count=("Total_Amount", "count"),
                sales=("Total_Amount", "sum")
            ).sort_values("count", ascending=False).reset_index()
            chart_data = [
                {"name": str(r["Payment_Method"]), "value": int(r["count"]), "revenue": round(float(r["sales"]), 2)}
                for _, r in pay_df.iterrows()
            ]
            data_type = "pie_chart"
            value_label = "Transaction Count"

    # Call Groq LLM (OpenAI GPT-OSS-120B on Groq)
    system_prompt = f"""You are EcomSight AI Copilot, the AI Chief Analytics Officer for an enterprise E-Commerce platform.
You are analyzing the user's LIVE e-commerce dataset.

LIVE DATASET METRICS:
- Total Revenue: ₹{total_rev:,.2f}
- Total Transactions / Orders: {total_orders:,}
- Average Order Value (AOV): ₹{aov:,.2f}
- Total Units Sold: {total_units:,}
- Top Products: {', '.join(top_products_summary[:5])}
- Regional Breakdown: {', '.join(regional_summary[:5])}
- Category Breakdown: {', '.join(category_summary[:5])}
- Payment Methods: {', '.join(payment_summary[:5])}

INSTRUCTIONS:
1. Ground your answers strictly on the LIVE metrics provided above.
2. Provide concise, executive-level insights with markdown formatting, bold numbers, and bullet points.
3. Suggest practical strategic business advice where appropriate.
4. Keep the response under 150 words for fast conversational reading."""

    llm_response = call_groq_llm(system_prompt, query)

    if not llm_response:
        # Fallback to local response if LLM call is unavailable
        llm_response = (
            f"Based on your live dataset of **{total_orders:,} orders** generating **₹{total_rev:,.0f}**:\n"
            f"- **Average Order Value (AOV)**: ₹{aov:,.2f}\n"
            f"- **Top Products**: {top_products_summary[0] if top_products_summary else 'N/A'}\n"
            f"- **Leading Region**: {regional_summary[0] if regional_summary else 'N/A'}"
        )

    suggestions = [
        "What are the top 5 products by revenue?",
        "Which region has the highest sales volume?",
        "What is total revenue and average order value?",
        "Show payment method distribution"
    ]

    return {
        "answer": llm_response,
        "data_type": data_type,
        "data": chart_data,
        "value_label": value_label,
        "suggestions": suggestions,
        "model_used": GROQ_MODEL
    }
