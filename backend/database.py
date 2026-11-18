import os
from datetime import datetime
from typing import Optional, Dict, Any, List
import pandas as pd
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_PORT = int(os.getenv("MYSQL_PORT", 3306))
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "CMMANI02")
DB_NAME = os.getenv("MYSQL_DATABASE", "ecomsight_db")

SQLITE_PATH = os.path.join(os.path.dirname(__file__), "ecomsight.db")

ACTIVE_ENGINE_TYPE = "MySQL"
engine = None
SessionLocal = None
Base = declarative_base()


# 1. ORM Models
class SalesTransactionModel(Base):
    __tablename__ = "sales_transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    transaction_id = Column(String(50), index=True, nullable=True)
    date = Column(String(50), index=True, nullable=True)
    customer_id = Column(String(50), index=True, nullable=True)
    customer_name = Column(String(100), nullable=True)
    region = Column(String(50), index=True, nullable=True)
    product_id = Column(String(50), index=True, nullable=True)
    product_name = Column(String(150), index=True, nullable=True)
    category = Column(String(100), index=True, nullable=True)
    unit_price = Column(Float, nullable=True)
    quantity = Column(Float, nullable=True)
    discount_percent = Column(Float, nullable=True)
    total_amount = Column(Float, nullable=True)
    payment_method = Column(String(50), nullable=True)
    dataset_name = Column(String(100), default="default", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class DatasetMetaModel(Base):
    __tablename__ = "dataset_metadata"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(150), nullable=False)
    rows_count = Column(Integer, default=0)
    columns_count = Column(Integer, default=0)
    missing_values = Column(Integer, default=0)
    duplicates = Column(Integer, default=0)
    quality_status = Column(String(50), default="Raw")
    uploaded_at = Column(DateTime, default=datetime.utcnow)


def initialize_engine():
    global engine, SessionLocal, ACTIVE_ENGINE_TYPE
    
    # First attempt: Try MySQL
    try:
        import pymysql
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
            charset="utf8mb4",
            connect_timeout=2
        )
        with conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        conn.commit()
        conn.close()
        
        mysql_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
        engine = create_engine(mysql_url, pool_pre_ping=True, pool_recycle=3600, echo=False)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base.metadata.create_all(bind=engine)
        ACTIVE_ENGINE_TYPE = "MySQL"
        print(f"[Database] Connected to MySQL database '{DB_NAME}' on {DB_HOST}:{DB_PORT}.")
        return True
    except Exception as e:
        print(f"[Database Notice] MySQL unavailable ({e}). Falling back to local SQLite database.")

    # Fallback attempt: Use zero-config local SQLite
    try:
        sqlite_url = f"sqlite:///{SQLITE_PATH.replace(os.sep, '/')}"
        engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base.metadata.create_all(bind=engine)
        ACTIVE_ENGINE_TYPE = "SQLite (Zero-Config Local Database)"
        print(f"[Database] SQLite engine active at: {SQLITE_PATH}")
        return True
    except Exception as sqle:
        print(f"[Database Error] Could not initialize SQLite: {sqle}")
        return False

# Initialize on module load
initialize_engine()


def ensure_database_exists():
    if engine is None:
        return initialize_engine()
    return True


def get_db():
    if SessionLocal is None:
        initialize_engine()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(sample_csv_path: Optional[str] = None):
    """Creates tables and seeds sample data into active database if empty."""
    ensure_database_exists()
    Base.metadata.create_all(bind=engine)

    if sample_csv_path and os.path.exists(sample_csv_path):
        db = SessionLocal()
        try:
            count = db.query(SalesTransactionModel).count()
            if count == 0:
                print(f"[{ACTIVE_ENGINE_TYPE}] Seeding sample dataset from {sample_csv_path}...")
                df = pd.read_csv(sample_csv_path)
                save_dataframe_to_db(df, dataset_name=os.path.basename(sample_csv_path), replace=True)
                print(f"[{ACTIVE_ENGINE_TYPE}] Successfully seeded {len(df)} records.")
            else:
                print(f"[{ACTIVE_ENGINE_TYPE}] Table already has {count} transactions. Seeding skipped.")
        except Exception as e:
            print(f"[{ACTIVE_ENGINE_TYPE} Error] Seeding error: {e}")
        finally:
            db.close()


def save_dataframe_to_db(df: pd.DataFrame, dataset_name: str = "dataset.csv", replace: bool = True) -> int:
    """Saves a pandas DataFrame into the active database."""
    ensure_database_exists()
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        if replace:
            db.query(SalesTransactionModel).filter(SalesTransactionModel.dataset_name == dataset_name).delete()
            db.commit()

        records = []
        for _, row in df.iterrows():
            def get_val(key, default=None):
                for col in df.columns:
                    if col.lower() == key.lower():
                        val = row[col]
                        if pd.isna(val):
                            return default
                        return val
                return default

            records.append(
                SalesTransactionModel(
                    transaction_id=str(get_val("Transaction_ID", "")) or None,
                    date=str(get_val("Date", "")) or None,
                    customer_id=str(get_val("Customer_ID", "")) or None,
                    customer_name=str(get_val("Customer_Name", "")) or None,
                    region=str(get_val("Region", "")) or None,
                    product_id=str(get_val("Product_ID", "")) or None,
                    product_name=str(get_val("Product_Name", "")) or None,
                    category=str(get_val("Category", "")) or None,
                    unit_price=float(get_val("Unit_Price", 0.0) or 0.0),
                    quantity=float(get_val("Quantity", 0.0) or 0.0),
                    discount_percent=float(get_val("Discount_Percent", 0.0) or 0.0),
                    total_amount=float(get_val("Total_Amount", 0.0) or 0.0),
                    payment_method=str(get_val("Payment_Method", "")) or None,
                    dataset_name=dataset_name
                )
            )

        db.bulk_save_objects(records)
        db.commit()

        # Record metadata
        meta = DatasetMetaModel(
            filename=dataset_name,
            rows_count=len(df),
            columns_count=len(df.columns),
            missing_values=int(df.isnull().sum().sum()),
            duplicates=int(df.duplicated().sum()),
            quality_status=f"Active in {ACTIVE_ENGINE_TYPE}"
        )
        db.add(meta)
        db.commit()

        return len(records)
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


def load_dataframe_from_db(dataset_name: Optional[str] = None) -> pd.DataFrame:
    """Loads transactions from database back into a pandas DataFrame."""
    ensure_database_exists()
    db = SessionLocal()
    try:
        query = db.query(SalesTransactionModel)
        if dataset_name:
            query = query.filter(SalesTransactionModel.dataset_name == dataset_name)
        
        rows = query.all()
        if not rows:
            return pd.DataFrame()

        data = []
        for r in rows:
            data.append({
                "Transaction_ID": r.transaction_id,
                "Date": r.date,
                "Customer_ID": r.customer_id,
                "Customer_Name": r.customer_name,
                "Region": r.region,
                "Product_ID": r.product_id,
                "Product_Name": r.product_name,
                "Category": r.category,
                "Unit_Price": r.unit_price,
                "Quantity": r.quantity,
                "Discount_Percent": r.discount_percent,
                "Total_Amount": r.total_amount,
                "Payment_Method": r.payment_method
            })
        return pd.DataFrame(data)
    finally:
        db.close()


def get_db_status() -> Dict[str, Any]:
    """Checks database connection and returns stats."""
    try:
        ensure_database_exists()
        db = SessionLocal()
        total_transactions = db.query(SalesTransactionModel).count()
        distinct_datasets = [d[0] for d in db.query(SalesTransactionModel.dataset_name).distinct().all()]
        db.close()
        return {
            "status": "connected",
            "engine": ACTIVE_ENGINE_TYPE,
            "database": DB_NAME if "MySQL" in ACTIVE_ENGINE_TYPE else os.path.basename(SQLITE_PATH),
            "host": DB_HOST if "MySQL" in ACTIVE_ENGINE_TYPE else "localhost",
            "port": DB_PORT if "MySQL" in ACTIVE_ENGINE_TYPE else 0,
            "user": DB_USER if "MySQL" in ACTIVE_ENGINE_TYPE else "local",
            "total_transactions": total_transactions,
            "datasets": distinct_datasets
        }
    except Exception as e:
        return {
            "status": "disconnected",
            "engine": ACTIVE_ENGINE_TYPE,
            "database": DB_NAME,
            "error": str(e)
        }
