export interface ChatSession {
  id: string;
  title: string;
  model: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  image_url?: string | null;
  created_at: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: string;
  badge?: string;
}

export interface GpuTier {
  id: string;
  name: string;
  gpus: string;
  vram: string;
  tflops: string;
  price: string;
  pricePer: string;
  popular?: boolean;
  features: string[];
}

export interface EdgePoP {
  city: string;
  country: string;
  flag: string;
  latency: string;
  status: 'online' | 'maintenance' | 'deploying';
}
