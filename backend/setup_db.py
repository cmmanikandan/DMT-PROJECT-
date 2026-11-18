import os
import sys
from database import init_db, get_db_status

sample_csv = os.path.join(os.path.dirname(__file__), "sample_data", "ecommerce_sales_dataset.csv")

print("Initializing MySQL database & tables...")
init_db(sample_csv_path=sample_csv)

status = get_db_status()
print("DATABASE STATUS:", status)

if status.get("status") == "connected":
    print("SUCCESS: Connected to MySQL database successfully!")
else:
    print("FAILED:", status.get("error"))
    sys.exit(1)
