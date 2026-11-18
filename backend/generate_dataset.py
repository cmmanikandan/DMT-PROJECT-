import os
import random
import csv
from datetime import datetime, timedelta

def generate_dataset(output_path, num_records=3000):
    random.seed(42)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    customers = [
        (f"CUST-{1000 + i}", f"Customer {i+1}", random.choice(["North", "South", "East", "West", "Central"]))
        for i in range(250)
    ]
    
    products = [
        ("PROD-101", "Wireless Earbuds", "Electronics", 2499.00),
        ("PROD-102", "Smart Watch v2", "Electronics", 3999.00),
        ("PROD-103", "Bluetooth Speaker", "Electronics", 1899.00),
        ("PROD-104", "Fast USB-C Charger", "Electronics", 899.00),
        ("PROD-105", "Noise Cancelling Headphones", "Electronics", 6499.00),
        ("PROD-106", "Wireless Mouse", "Electronics", 799.00),
        ("PROD-107", "Mechanical Keyboard", "Electronics", 3299.00),
        ("PROD-201", "Running Shoes", "Footwear", 3199.00),
        ("PROD-202", "Casual Sneakers", "Footwear", 2299.00),
        ("PROD-203", "Sports Socks (Pack of 3)", "Footwear", 399.00),
        ("PROD-204", "Leather Formal Shoes", "Footwear", 4499.00),
        ("PROD-301", "Cotton Crew T-Shirt", "Apparel", 699.00),
        ("PROD-302", "Slim Fit Denim Jeans", "Apparel", 1799.00),
        ("PROD-303", "Hooded Sweatshirt", "Apparel", 1499.00),
        ("PROD-304", "Formal Oxford Shirt", "Apparel", 1299.00),
        ("PROD-305", "Athletic Track Pants", "Apparel", 999.00),
        ("PROD-401", "Ergonomic Laptop Backpack", "Accessories", 1899.00),
        ("PROD-402", "Leather Bi-Fold Wallet", "Accessories", 899.00),
        ("PROD-403", "Polarized Sunglasses", "Accessories", 1299.00),
        ("PROD-404", "Stainless Steel Water Bottle", "Accessories", 649.00),
        ("PROD-405", "Phone Protection Case", "Accessories", 499.00),
    ]
    
    payment_methods = ["Credit Card", "Debit Card", "UPI", "Net Banking", "Cash on Delivery"]
    payment_weights = [0.35, 0.20, 0.30, 0.10, 0.05]
    
    start_date = datetime(2025, 1, 1)
    
    headers = [
        "Transaction_ID", "Date", "Customer_ID", "Customer_Name", "Region",
        "Product_ID", "Product_Name", "Category", "Unit_Price", "Quantity",
        "Discount_Percent", "Total_Amount", "Payment_Method"
    ]
    
    records = []
    basket_rules = {
        "PROD-301": "PROD-302",
        "PROD-401": "PROD-106",
        "PROD-201": "PROD-203",
        "PROD-101": "PROD-104",
    }
    prod_map = {p[0]: p for p in products}
    
    for i in range(1, num_records + 1):
        tx_id = f"TXN-{100000 + i}"
        day_offset = random.randint(0, 364)
        tx_date = start_date + timedelta(days=day_offset)
        
        if random.random() < 0.4:
            cust = random.choice(customers[:40])
        else:
            cust = random.choice(customers[40:])
            
        prod = random.choice(products)
        qty = random.choices([1, 2, 3, 4, 5], weights=[0.55, 0.25, 0.12, 0.05, 0.03])[0]
        discount = random.choices([0.0, 0.05, 0.10, 0.15, 0.20], weights=[0.4, 0.25, 0.2, 0.1, 0.05])[0]
        
        unit_price = prod[3]
        total = round(unit_price * qty * (1.0 - discount), 2)
        payment = random.choices(payment_methods, weights=payment_weights)[0]
        
        records.append([
            tx_id, tx_date.strftime("%Y-%m-%d"), cust[0], cust[1], cust[2],
            prod[0], prod[1], prod[2], unit_price, qty,
            int(discount * 100), total, payment
        ])
        
        if prod[0] in basket_rules and random.random() < 0.65:
            companion_prod = prod_map[basket_rules[prod[0]]]
            c_qty = 1
            c_discount = discount
            c_total = round(companion_prod[3] * c_qty * (1.0 - c_discount), 2)
            c_tx_id = f"TXN-{100000 + i}-B"
            records.append([
                c_tx_id, tx_date.strftime("%Y-%m-%d"), cust[0], cust[1], cust[2],
                companion_prod[0], companion_prod[1], companion_prod[2], companion_prod[3], c_qty,
                int(c_discount * 100), c_total, payment
            ])

    # Inject duplicates (approx 126)
    for _ in range(126):
        idx = random.randint(0, len(records) - 1)
        records.append(list(records[idx]))

    # Inject outliers (approx 32)
    for _ in range(32):
        idx = random.randint(0, len(records) - 1)
        records[idx][9] = random.randint(85, 200)
        records[idx][11] = round(records[idx][8] * records[idx][9], 2)

    # Inject missing values (approx 842 in Region, Discount, or Payment)
    for _ in range(842):
        idx = random.randint(0, len(records) - 1)
        col = random.choice([4, 10, 12])
        records[idx][col] = ""

    # Inject invalid values (approx 18)
    for _ in range(18):
        idx = random.randint(0, len(records) - 1)
        records[idx][11] = -999.00

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(records)

    print(f"Generated {len(records)} records at {output_path}")

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(__file__), "sample_data", "ecommerce_sales_dataset.csv")
    generate_dataset(out)
