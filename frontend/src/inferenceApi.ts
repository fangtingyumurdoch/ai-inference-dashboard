import type { PredictionResponse } from '@/types/inference';

const API_BASE_URL = 'http://localhost:8000';

export async function predictImage(
  file: File,
  modelName: string
): Promise<PredictionResponse> {
  const formData = new FormData();

  formData.append('image', file);
  formData.append('model_name', modelName);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Prediction request failed');
  }

  return response.json();
}