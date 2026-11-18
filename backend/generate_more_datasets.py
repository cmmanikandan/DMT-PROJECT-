import os
import random
import csv
from datetime import datetime, timedelta
import pandas as pd
from database import init_db, save_dataframe_to_db, get_db_status, SalesTransactionModel, SessionLocal

def create_expanded_datasets():
    random.seed(42)
    sample_dir = os.path.join(os.path.dirname(__file__), "sample_data")
    os.makedirs(sample_dir, exist_ok=True)

    customers = [
        (f"CUST-{1000 + i}", f"Customer {i+1}", random.choice(["North", "South", "East", "West", "Central"]))
        for i in range(500)
    ]

    products = [
        # Electronics
        ("PROD-101", "Wireless Earbuds", "Electronics", 2499.00),
        ("PROD-102", "Smart Watch v2", "Electronics", 3999.00),
        ("PROD-103", "Bluetooth Speaker", "Electronics", 1899.00),
        ("PROD-104", "Fast USB-C Charger", "Electronics", 899.00),
        ("PROD-105", "Noise Cancelling Headphones", "Electronics", 6499.00),
        ("PROD-106", "Wireless Mouse", "Electronics", 799.00),
        ("PROD-107", "Mechanical Keyboard", "Electronics", 3299.00),
        ("PROD-108", "4K Ultra-HD Webcam", "Electronics", 4599.00),
        ("PROD-109", "Portable Power Bank 20k", "Electronics", 1999.00),
        # Footwear (Shoes)
        ("PROD-201", "Running Shoes Pro", "Footwear", 3199.00),
        ("PROD-202", "Casual Lifestyle Sneakers", "Footwear", 2299.00),
        ("PROD-203", "Sports Socks (Pack of 3)", "Footwear", 399.00),
        ("PROD-204", "Leather Formal Shoes", "Footwear", 4499.00),
        ("PROD-205", "Trail Hiking Boots", "Footwear", 4999.00),
        ("PROD-206", "Slip-on Canvas Loafers", "Footwear", 1799.00),
        ("PROD-207", "Cushioned Athletic Slides", "Footwear", 1299.00),
        # Apparel
        ("PROD-301", "Cotton Crew T-Shirt", "Apparel", 699.00),
        ("PROD-302", "Slim Fit Denim Jeans", "Apparel", 1799.00),
        ("PROD-303", "Hooded Sweatshirt", "Apparel", 1499.00),
        ("PROD-304", "Formal Oxford Shirt", "Apparel", 1299.00),
        ("PROD-305", "Athletic Track Pants", "Apparel", 999.00),
        ("PROD-306", "Performance Windbreaker", "Apparel", 2499.00),
        ("PROD-307", "Breathable Polo Shirt", "Apparel", 1199.00),
        # Accessories
        ("PROD-401", "Ergonomic Laptop Backpack", "Accessories", 1899.00),
        ("PROD-402", "Leather Bi-Fold Wallet", "Accessories", 899.00),
        ("PROD-403", "Polarized UV Sunglasses", "Accessories", 1299.00),
        ("PROD-404", "Stainless Steel Water Bottle", "Accessories", 649.00),
        ("PROD-405", "Phone Protection Case", "Accessories", 499.00),
        ("PROD-406", "Travel Duffel Bag", "Accessories", 2299.00),
        # Home & Living
        ("PROD-501", "Aromatherapy Oil Diffuser", "Home & Living", 1499.00),
        ("PROD-502", "Ceramic Artisan Coffee Mug", "Home & Living", 499.00),
        ("PROD-503", "Memory Foam Orthopedic Pillow", "Home & Living", 1899.00),
        # Festive Diwali Collection
        ("PROD-601", "Royal Kaju Katli Gift Hamper (1kg)", "Sweets & Dry Fruits", 1299.00),
        ("PROD-602", "Assorted California Almonds & Pistachios (500g)", "Sweets & Dry Fruits", 999.00),
        ("PROD-603", "Handcrafted Brass Diya Set (Set of 6)", "Home & Lighting Decor", 849.00),
        ("PROD-604", "LED Smart Curtain Fairy Lights 3x3m", "Home & Lighting Decor", 1199.00),
        ("PROD-605", "Designer Lotus Rangoli Template Kit", "Home & Lighting Decor", 499.00),
        ("PROD-606", "Banarasi Pure Silk Zari Saree", "Festive Apparel", 4999.00),
        ("PROD-607", "Embroidered Silk Blend Kurta Pajama", "Festive Apparel", 2799.00),
        ("PROD-608", "24K Gold-Plated Laxmi-Ganesh Medallion", "Gold & Silver Jewelry", 1999.00),
        ("PROD-609", "Pure 999 Fine Silver Coin 20g", "Gold & Silver Jewelry", 2499.00),
        ("PROD-610", "Smart Digital Air Fryer 5.5L", "Home & Lighting Decor", 5499.00),
        # Beauty & Wellness Collection
        ("PROD-701", "20% Vitamin C Radiance Face Serum 30ml", "Skincare", 899.00),
        ("PROD-702", "Kumkumadi Ayurvedic Miracle Face Oil 25ml", "Skincare", 1499.00),
        ("PROD-703", "Hyaluronic Acid Hydrating Gel Cream", "Skincare", 699.00),
        ("PROD-704", "Rosemary & Redensyl Hair Growth Tonic", "Haircare", 799.00),
        ("PROD-705", "Onion & Biotin Anti-Hairfall Shampoo", "Haircare", 549.00),
        ("PROD-706", "French Oud Luxury Eau De Parfum 100ml", "Aromatherapy & Wellness", 2299.00),
        ("PROD-707", "Pure French Lavender Essential Oil 15ml", "Aromatherapy & Wellness", 499.00),
        ("PROD-708", "Pure Himalayan Shilajit Resin 20g", "Organic Supplements", 1299.00),
        ("PROD-709", "Marine Collagen Peptides 200g Powder", "Organic Supplements", 1799.00),
        ("PROD-710", "Rose Quartz Vibrating Facial Sculpting Roller", "Skincare", 999.00),
    ]

    prod_map = {p[0]: p for p in products}
    payment_methods = ["Credit Card", "Debit Card", "UPI", "Net Banking", "Cash on Delivery"]
    payment_weights = [0.35, 0.20, 0.30, 0.10, 0.05]

    basket_rules = {
        "PROD-201": "PROD-203", # Running Shoes + Sports Socks
        "PROD-202": "PROD-203", # Sneakers + Sports Socks
        "PROD-301": "PROD-302", # T-Shirt + Jeans
        "PROD-101": "PROD-104", # Earbuds + Charger
        "PROD-106": "PROD-107", # Mouse + Keyboard
        "PROD-401": "PROD-404", # Backpack + Bottle
        "PROD-601": "PROD-602", # Kaju Katli + Dry Fruits
        "PROD-603": "PROD-604", # Diya Set + Fairy Lights
        "PROD-606": "PROD-608", # Silk Saree + Gold Medallion
        "PROD-701": "PROD-703", # Vitamin C + Hyaluronic Gel
        "PROD-704": "PROD-705", # Hair Tonic + Shampoo
        "PROD-708": "PROD-709", # Shilajit + Collagen
    }

    start_date = datetime(2025, 1, 1)

    def generate_records(num_target, allowed_categories=None, prefix="TXN", date_range_months=12, discount_boost=0.0):
        records = []
        filtered_products = [p for p in products if allowed_categories is None or p[2] in allowed_categories]
        
        max_days = int(date_range_months * 30.5)
        for i in range(1, num_target + 1):
            tx_id = f"{prefix}-{100000 + i}"
            day_offset = random.randint(0, max_days)
            tx_date = start_date + timedelta(days=day_offset)
            
            cust = random.choice(customers[:60]) if random.random() < 0.4 else random.choice(customers[60:])
            prod = random.choice(filtered_products)
            
            qty = random.choices([1, 2, 3, 4, 5], weights=[0.55, 0.25, 0.12, 0.05, 0.03])[0]
            base_discount = random.choices([0.0, 0.05, 0.10, 0.15, 0.20], weights=[0.4, 0.25, 0.2, 0.1, 0.05])[0]
            discount = min(0.50, round(base_discount + discount_boost, 2))
            
            unit_price = prod[3]
            total = round(unit_price * qty * (1.0 - discount), 2)
            payment = random.choices(payment_methods, weights=payment_weights)[0]
            
            records.append({
                "Transaction_ID": tx_id,
                "Date": tx_date.strftime("%Y-%m-%d"),
                "Customer_ID": cust[0],
                "Customer_Name": cust[1],
                "Region": cust[2] if random.random() > 0.05 else None,  # intentional realistic null
                "Product_ID": prod[0],
                "Product_Name": prod[1],
                "Category": prod[2],
                "Unit_Price": unit_price,
                "Quantity": qty,
                "Discount_Percent": int(discount * 100),
                "Total_Amount": total,
                "Payment_Method": payment if random.random() > 0.04 else None # intentional realistic null
            })
            
            # Cross-selling basket rule companion
            if prod[0] in basket_rules and random.random() < 0.6:
                c_id = basket_rules[prod[0]]
                if c_id in prod_map:
                    c_prod = prod_map[c_id]
                    c_qty = 1
                    c_total = round(c_prod[3] * c_qty * (1.0 - discount), 2)
                    records.append({
                        "Transaction_ID": f"{tx_id}-B",
                        "Date": tx_date.strftime("%Y-%m-%d"),
                        "Customer_ID": cust[0],
                        "Customer_Name": cust[1],
                        "Region": cust[2],
                        "Product_ID": c_prod[0],
                        "Product_Name": c_prod[1],
                        "Category": c_prod[2],
                        "Unit_Price": c_prod[3],
                        "Quantity": c_qty,
                        "Discount_Percent": int(discount * 100),
                        "Total_Amount": c_total,
                        "Payment_Method": payment
                    })
        return records

    print("Generating comprehensive main e-commerce sales dataset (5,000+ rows)...")
    main_records = generate_records(4500, prefix="TXN")
    main_df = pd.DataFrame(main_records)
    main_csv = os.path.join(sample_dir, "ecommerce_sales_dataset.csv")
    main_df.to_csv(main_csv, index=False)
    print(f"Saved main dataset: {len(main_df)} rows to {main_csv}")

    print("Generating footwear & apparel specialized dataset...")
    footwear_records = generate_records(2000, allowed_categories=["Footwear", "Apparel"], prefix="FA")
    footwear_df = pd.DataFrame(footwear_records)
    footwear_csv = os.path.join(sample_dir, "footwear_apparel_sales.csv")
    footwear_df.to_csv(footwear_csv, index=False)
    print(f"Saved footwear & apparel dataset: {len(footwear_df)} rows to {footwear_csv}")

    print("Generating electronics & tech specialized dataset...")
    tech_records = generate_records(2000, allowed_categories=["Electronics", "Accessories"], prefix="TECH")
    tech_df = pd.DataFrame(tech_records)
    tech_csv = os.path.join(sample_dir, "electronics_tech_sales.csv")
    tech_df.to_csv(tech_csv, index=False)
    print(f"Saved tech dataset: {len(tech_df)} rows to {tech_csv}")

    print("Generating Festive Diwali Sale 2025 specialized dataset...")
    diwali_records = generate_records(2200, allowed_categories=["Festive Apparel", "Sweets & Dry Fruits", "Home & Lighting Decor", "Gold & Silver Jewelry"], prefix="DIWALI", discount_boost=0.15)
    diwali_df = pd.DataFrame(diwali_records)
    diwali_csv = os.path.join(sample_dir, "festive_diwali_sale_2025.csv")
    diwali_df.to_csv(diwali_csv, index=False)
    print(f"Saved Festive Diwali dataset: {len(diwali_df)} rows to {diwali_csv}")

    print("Generating Beauty & Wellness Lifestyle specialized dataset...")
    beauty_records = generate_records(2000, allowed_categories=["Skincare", "Haircare", "Aromatherapy & Wellness", "Organic Supplements"], prefix="BEAUTY", discount_boost=0.05)
    beauty_df = pd.DataFrame(beauty_records)
    beauty_csv = os.path.join(sample_dir, "beauty_wellness_lifestyle.csv")
    beauty_df.to_csv(beauty_csv, index=False)
    print(f"Saved Beauty & Wellness dataset: {len(beauty_df)} rows to {beauty_csv}")

    # Synchronize all into database
    print("\nSynchronizing generated datasets into database (MySQL / SQLite)...")
    init_db()
    save_dataframe_to_db(main_df, dataset_name="ecommerce_sales_dataset.csv", replace=True)
    save_dataframe_to_db(footwear_df, dataset_name="footwear_apparel_sales.csv", replace=True)
    save_dataframe_to_db(tech_df, dataset_name="electronics_tech_sales.csv", replace=True)
    save_dataframe_to_db(diwali_df, dataset_name="festive_diwali_sale_2025.csv", replace=True)
    save_dataframe_to_db(beauty_df, dataset_name="beauty_wellness_lifestyle.csv", replace=True)

    status = get_db_status()
    print("\nUpdated Database Status:")
    print(status)
    return status

if __name__ == "__main__":
    create_expanded_datasets()

