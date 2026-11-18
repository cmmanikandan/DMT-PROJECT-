export interface KpiData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  comparisonText: string;
  iconName: string;
}

export interface SalesOverviewPoint {
  period: string;
  sales: number;
  orders: number;
}

export interface CategoryData {
  name: string;
  sales: number;
  percentage: number;
  color: string;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  salesDisplay: string;
  quantity: number;
  trend: string;
  isPositive: boolean;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface PredictionPoint {
  date: string;
  actual: number | null;
  forecast: number | null;
}

export interface DemandProduct {
  product: string;
  category: string;
  currentSales: number;
  predictedSales: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  growth: string;
}

export interface ClusterSummary {
  cluster: string;
  name: string;
  count: number;
  percentage: number;
  avgSpending: number;
  avgFrequency: number;
  color: string;
}

export interface CustomerSegmentPoint {
  customerId: string;
  customerName: string;
  frequency: number;
  spending: number;
  recency: number;
  cluster: number;
  clusterName: string;
}

export interface CustomerDetail {
  customerId: string;
  customerName: string;
  cluster: string;
  clusterName: string;
  totalSpending: number;
  totalSpendingDisplay: string;
  orderCount: number;
  recencyDays: number;
}

export interface AssociationRule {
  antecedent: string;
  consequent: string;
  support: number;
  supportDisplay: string;
  confidence: number;
  confidenceDisplay: string;
  lift: number;
  recommendation: string;
}

export const INITIAL_KPIS: KpiData[] = [
  {
    title: "Total Revenue",
    value: "₹12,84,500",
    change: "+12.6%",
    isPositive: true,
    comparisonText: "vs last month",
    iconName: "DollarSign"
  },
  {
    title: "Total Orders",
    value: "18,450",
    change: "+8.2%",
    isPositive: true,
    comparisonText: "vs last month",
    iconName: "ShoppingBag"
  },
  {
    title: "Total Customers",
    value: "6,240",
    change: "+7.4%",
    isPositive: true,
    comparisonText: "vs last month",
    iconName: "Users"
  },
  {
    title: "Total Products",
    value: "1,284",
    change: "+4.2%",
    isPositive: true,
    comparisonText: "vs last month",
    iconName: "Package"
  }
];

export const DEMO_SALES_TREND: SalesOverviewPoint[] = [
  { period: "Jan", sales: 85000, orders: 1210 },
  { period: "Feb", sales: 92400, orders: 1340 },
  { period: "Mar", sales: 104500, orders: 1520 },
  { period: "Apr", sales: 98200, orders: 1410 },
  { period: "May", sales: 112000, orders: 1650 },
  { period: "Jun", sales: 118400, orders: 1720 },
  { period: "Jul", sales: 125600, orders: 1840 },
  { period: "Aug", sales: 122100, orders: 1790 },
  { period: "Sep", sales: 134500, orders: 1980 },
  { period: "Oct", sales: 142800, orders: 2110 },
  { period: "Nov", sales: 156200, orders: 2320 },
  { period: "Dec", sales: 168400, orders: 2490 }
];

export const DEMO_CATEGORIES: CategoryData[] = [
  { name: "Electronics", sales: 482000, percentage: 37.5, color: "#1769E0" },
  { name: "Footwear", sales: 321000, percentage: 25.0, color: "#10B981" },
  { name: "Apparel", sales: 284500, percentage: 22.1, color: "#F59E0B" },
  { name: "Accessories", sales: 197000, percentage: 15.4, color: "#8B5CF6" }
];

export const DEMO_TOP_PRODUCTS: TopProduct[] = [
  {
    id: "PROD-101",
    name: "Wireless Earbuds",
    category: "Electronics",
    sales: 245000,
    salesDisplay: "₹2,45,000",
    quantity: 98,
    trend: "+15.2%",
    isPositive: true,
    status: "In Stock"
  },
  {
    id: "PROD-201",
    name: "Running Shoes",
    category: "Footwear",
    sales: 198400,
    salesDisplay: "₹1,98,400",
    quantity: 62,
    trend: "+11.8%",
    isPositive: true,
    status: "In Stock"
  },
  {
    id: "PROD-102",
    name: "Smart Watch",
    category: "Electronics",
    sales: 184000,
    salesDisplay: "₹1,84,000",
    quantity: 46,
    trend: "+9.4%",
    isPositive: true,
    status: "Low Stock"
  },
  {
    id: "PROD-401",
    name: "Backpack",
    category: "Accessories",
    sales: 142500,
    salesDisplay: "₹1,42,500",
    quantity: 75,
    trend: "+6.1%",
    isPositive: true,
    status: "In Stock"
  }
];

export const DEMO_PREDICTION_CHART: PredictionPoint[] = [
  { date: "01 Sep", actual: 14200, forecast: null },
  { date: "03 Sep", actual: 16500, forecast: null },
  { date: "05 Sep", actual: 15800, forecast: null },
  { date: "07 Sep", actual: 18200, forecast: null },
  { date: "09 Sep", actual: 17400, forecast: null },
  { date: "11 Sep", actual: 19800, forecast: null },
  { date: "13 Sep", actual: 21000, forecast: 21000 },
  { date: "15 Sep", actual: null, forecast: 22400 },
  { date: "17 Sep", actual: null, forecast: 23800 },
  { date: "19 Sep", actual: null, forecast: 24900 },
  { date: "21 Sep", actual: null, forecast: 26100 },
  { date: "23 Sep", actual: null, forecast: 27500 },
  { date: "25 Sep", actual: null, forecast: 28900 }
];

export const DEMO_DEMAND_PRODUCTS: DemandProduct[] = [
  { product: "T-Shirt", category: "Apparel", currentSales: 420, predictedSales: 510, demandLevel: "High", growth: "+21.4%" },
  { product: "Shoes", category: "Footwear", currentSales: 280, predictedSales: 350, demandLevel: "High", growth: "+25.0%" },
  { product: "Jeans", category: "Apparel", currentSales: 210, predictedSales: 260, demandLevel: "Medium", growth: "+23.8%" },
  { product: "Watch", category: "Electronics", currentSales: 160, predictedSales: 195, demandLevel: "Medium", growth: "+21.8%" },
  { product: "Bag", category: "Accessories", currentSales: 120, predictedSales: 140, demandLevel: "Low", growth: "+16.6%" },
  { product: "Cap", category: "Accessories", currentSales: 90, predictedSales: 110, demandLevel: "Low", growth: "+22.2%" }
];

export const DEMO_CLUSTER_SUMMARIES: ClusterSummary[] = [
  { cluster: "Cluster 1", name: "High Value", count: 1250, percentage: 19.4, avgSpending: 42500, avgFrequency: 14.2, color: "#1769E0" },
  { cluster: "Cluster 2", name: "Regular", count: 2840, percentage: 44.2, avgSpending: 18200, avgFrequency: 6.5, color: "#10B981" },
  { cluster: "Cluster 3", name: "Occasional", count: 1920, percentage: 29.8, avgSpending: 7400, avgFrequency: 2.8, color: "#F59E0B" },
  { cluster: "Cluster 4", name: "Low Activity", count: 1420, percentage: 22.1, avgSpending: 2100, avgFrequency: 1.2, color: "#8B5CF6" }
];

export const DEMO_SCATTER_POINTS: CustomerSegmentPoint[] = [
  { customerId: "CUST-1001", customerName: "Aarav Sharma", frequency: 16, spending: 48500, recency: 3, cluster: 1, clusterName: "High Value" },
  { customerId: "CUST-1002", customerName: "Priya Patel", frequency: 14, spending: 42000, recency: 6, cluster: 1, clusterName: "High Value" },
  { customerId: "CUST-1003", customerName: "Rohan Verma", frequency: 15, spending: 45200, recency: 5, cluster: 1, clusterName: "High Value" },
  { customerId: "CUST-1004", customerName: "Kavita Reddy", frequency: 13, spending: 39800, recency: 8, cluster: 1, clusterName: "High Value" },
  { customerId: "CUST-1005", customerName: "Anil Deshmukh", frequency: 17, spending: 51200, recency: 2, cluster: 1, clusterName: "High Value" },

  { customerId: "CUST-1006", customerName: "Neha Singh", frequency: 7, spending: 19500, recency: 18, cluster: 2, clusterName: "Regular" },
  { customerId: "CUST-1007", customerName: "Vikram Rao", frequency: 6, spending: 16800, recency: 22, cluster: 2, clusterName: "Regular" },
  { customerId: "CUST-1008", customerName: "Manish Tiwari", frequency: 8, spending: 21400, recency: 14, cluster: 2, clusterName: "Regular" },
  { customerId: "CUST-1009", customerName: "Pooja Malhotra", frequency: 7, spending: 18900, recency: 16, cluster: 2, clusterName: "Regular" },
  { customerId: "CUST-1010", customerName: "Deepak Iyer", frequency: 6, spending: 17200, recency: 20, cluster: 2, clusterName: "Regular" },

  { customerId: "CUST-1011", customerName: "Ananya Joshi", frequency: 3, spending: 8200, recency: 45, cluster: 3, clusterName: "Occasional" },
  { customerId: "CUST-1012", customerName: "Karan Johar", frequency: 2, spending: 6500, recency: 62, cluster: 3, clusterName: "Occasional" },
  { customerId: "CUST-1013", customerName: "Shreya Sen", frequency: 4, spending: 9800, recency: 38, cluster: 3, clusterName: "Occasional" },
  { customerId: "CUST-1014", customerName: "Nitin Gadkari", frequency: 3, spending: 7400, recency: 50, cluster: 3, clusterName: "Occasional" },

  { customerId: "CUST-1015", customerName: "Rahul Gupta", frequency: 1, spending: 2400, recency: 85, cluster: 4, clusterName: "Low Activity" },
  { customerId: "CUST-1016", customerName: "Sunita Nair", frequency: 1, spending: 1800, recency: 110, cluster: 4, clusterName: "Low Activity" },
  { customerId: "CUST-1017", customerName: "Harish Bhatt", frequency: 1, spending: 2900, recency: 92, cluster: 4, clusterName: "Low Activity" },
  { customerId: "CUST-1018", customerName: "Meera Das", frequency: 2, spending: 3100, recency: 78, cluster: 4, clusterName: "Low Activity" }
];

export const DEMO_CUSTOMER_DETAILS: CustomerDetail[] = [
  { customerId: "CUST-1001", customerName: "Aarav Sharma", cluster: "Cluster 1", clusterName: "High Value", totalSpending: 48500, totalSpendingDisplay: "₹48,500", orderCount: 16, recencyDays: 3 },
  { customerId: "CUST-1002", customerName: "Priya Patel", cluster: "Cluster 1", clusterName: "High Value", totalSpending: 42000, totalSpendingDisplay: "₹42,000", orderCount: 14, recencyDays: 6 },
  { customerId: "CUST-1003", customerName: "Rohan Verma", cluster: "Cluster 1", clusterName: "High Value", totalSpending: 45200, totalSpendingDisplay: "₹45,200", orderCount: 15, recencyDays: 5 },
  { customerId: "CUST-1006", customerName: "Neha Singh", cluster: "Cluster 2", clusterName: "Regular", totalSpending: 19500, totalSpendingDisplay: "₹19,500", orderCount: 7, recencyDays: 18 },
  { customerId: "CUST-1007", customerName: "Vikram Rao", cluster: "Cluster 2", clusterName: "Regular", totalSpending: 16800, totalSpendingDisplay: "₹16,800", orderCount: 6, recencyDays: 22 },
  { customerId: "CUST-1011", customerName: "Ananya Joshi", cluster: "Cluster 3", clusterName: "Occasional", totalSpending: 8200, totalSpendingDisplay: "₹8,200", orderCount: 3, recencyDays: 45 },
  { customerId: "CUST-1012", customerName: "Karan Johar", cluster: "Cluster 3", clusterName: "Occasional", totalSpending: 6500, totalSpendingDisplay: "₹6,500", orderCount: 2, recencyDays: 62 },
  { customerId: "CUST-1015", customerName: "Rahul Gupta", cluster: "Cluster 4", clusterName: "Low Activity", totalSpending: 2400, totalSpendingDisplay: "₹2,400", orderCount: 1, recencyDays: 85 },
  { customerId: "CUST-1016", customerName: "Sunita Nair", cluster: "Cluster 4", clusterName: "Low Activity", totalSpending: 1800, totalSpendingDisplay: "₹1,800", orderCount: 1, recencyDays: 110 }
];

export const DEMO_ASSOCIATION_RULES: AssociationRule[] = [
  { antecedent: "T-Shirt", consequent: "Jeans", support: 24.0, supportDisplay: "24%", confidence: 68.0, confidenceDisplay: "68%", lift: 1.8, recommendation: "Bundle discount: 15% off when bought together" },
  { antecedent: "Laptop", consequent: "Wireless Mouse", support: 18.0, supportDisplay: "18%", confidence: 72.0, confidenceDisplay: "72%", lift: 2.1, recommendation: "Display mouse at cart checkout as recommended accessory" },
  { antecedent: "Shoes", consequent: "Socks", support: 16.0, supportDisplay: "16%", confidence: 65.0, confidenceDisplay: "65%", lift: 1.7, recommendation: "Enable 1-click socks add-on on shoe product page" },
  { antecedent: "Phone", consequent: "Phone Case", support: 14.0, supportDisplay: "14%", confidence: 62.0, confidenceDisplay: "62%", lift: 1.5, recommendation: "Cross-sell protection case during device customization" },
  { antecedent: "Bag", consequent: "Wallet", support: 12.0, supportDisplay: "12%", confidence: 58.0, confidenceDisplay: "58%", lift: 1.3, recommendation: "Promote leather gift set bundle" }
];
