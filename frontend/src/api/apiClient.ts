const API_BASE_URL = "http://localhost:8000/api";

export async function checkBackendHealth(): Promise<{ online: boolean; details?: any }> {
  try {
    const res = await fetch(`http://localhost:8000/api/health`, { method: 'GET', signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      return { online: true, details: data };
    }
  } catch (err) {
    // Offline
  }
  return { online: false };
}

export async function uploadDatasetFile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/dataset/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }
  return await res.json();
}

export async function deleteUploadedDataset(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/dataset`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`Delete dataset failed with status ${res.status}`);
  }
  return await res.json();
}

export async function reloadSampleDataset(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/dataset/reset-sample`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Reload sample dataset failed with status ${res.status}`);
  }
  return await res.json();
}

export async function fetchDatasetPreview(page: number = 1, pageSize: number = 15, search: string = ''): Promise<any> {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`${API_BASE_URL}/dataset/preview?page=${page}&page_size=${pageSize}${searchParam}`);
  if (!res.ok) {
    throw new Error(`Preview failed with status ${res.status}`);
  }
  return await res.json();
}

export async function fetchAvailableDatasets(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/datasets/available`);
  if (!res.ok) {
    throw new Error(`Failed to list datasets: ${res.status}`);
  }
  return await res.json();
}

export async function selectActiveDataset(name: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/datasets/select?name=${encodeURIComponent(name)}`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Failed to activate dataset: ${res.status}`);
  }
  return await res.json();
}

export async function triggerDataCleaning(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/dataset/clean`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Cleaning failed with status ${res.status}`);
  }
  return await res.json();
}

export async function fetchSalesAnalytics(granularity: string = "monthly"): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/sales/analysis?granularity=${granularity}`);
  if (!res.ok) {
    throw new Error(`Analytics failed with status ${res.status}`);
  }
  return await res.json();
}

export async function fetchSalesPrediction(params: {
  prediction_type: string;
  category: string;
  product: string;
  period: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/sales/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Prediction failed with status ${res.status}`);
  }
  return await res.json();
}

export async function fetchProductDemand(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/product/demand`);
  if (!res.ok) {
    throw new Error(`Product demand failed with status ${res.status}`);
  }
  return await res.json();
}

export async function fetchCustomerSegmentation(clusters: number = 4): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/customers/segment?clusters=${clusters}`);
  if (!res.ok) {
    throw new Error(`Customer segmentation failed with status ${res.status}`);
  }
  return await res.json();
}

export async function fetchMarketBasket(minSupport: number = 0.05, minConfidence: number = 0.4): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/market-basket/analyze?min_support=${minSupport}&min_confidence=${minConfidence}`);
  if (!res.ok) {
    throw new Error(`Market basket failed with status ${res.status}`);
  }
  return await res.json();
}

export async function fetchDatabaseStatus(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/db/status`);
  if (!res.ok) {
    throw new Error(`Database status check failed with status ${res.status}`);
  }
  return await res.json();
}

export async function syncDatasetToDatabase(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/db/sync`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Database sync failed with status ${res.status}`);
  }
  return await res.json();
}

export async function loadDatasetFromDatabase(datasetName?: string): Promise<any> {
  const url = datasetName 
    ? `${API_BASE_URL}/db/load?dataset_name=${encodeURIComponent(datasetName)}`
    : `${API_BASE_URL}/db/load`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Load from database failed with status ${res.status}`);
  }
  return await res.json();
}

export async function fetchInventoryAlerts(leadTimeDays: number = 7): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/inventory/alerts?lead_time_days=${leadTimeDays}`);
  if (!res.ok) {
    throw new Error(`Inventory alerts failed with status ${res.status}`);
  }
  return await res.json();
}

export async function fetchAnomalies(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/analytics/anomalies`);
  if (!res.ok) {
    throw new Error(`Anomaly detection failed with status ${res.status}`);
  }
  return await res.json();
}

export async function askAIAssistant(query: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/ai/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`AI assistant query failed with status ${res.status}`);
  }
  return await res.json();
}


