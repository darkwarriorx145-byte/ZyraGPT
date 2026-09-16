import type { AIModel, GpuTier, EdgePoP } from '@/types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'zyra-mini',
    name: 'Zyra Mini',
    provider: 'Google Gemma 4 26B A4B (free)',
    description: 'Fast, efficient model for everyday tasks',
    contextWindow: '256K tokens',
    badge: 'Free',
  },
  {
    id: 'zyra-flash',
    name: 'Zyra Flash',
    provider: 'Google Gemma 4 26B A4B (free)',
    description: 'Ultra-fast multimodal inference at the edge',
    contextWindow: '256K tokens',
    badge: 'Fast',
  },
  {
    id: 'zyra-pro',
    name: 'Zyra Pro',
    provider: 'Google Gemma 4 26B A4B (free)',
    description: 'Balanced quality and speed for production use',
    contextWindow: '256K tokens',
    badge: 'Pro',
  },
  {
    id: 'zyra-reason',
    name: 'Zyra Reason',
    provider: 'Google Gemma 4 26B A4B (free)',
    description: 'Deep reasoning for complex problem-solving',
    contextWindow: '256K tokens',
    badge: 'Reasoning',
  },
];

export const GPU_TIERS: GpuTier[] = [
  {
    id: 'starter',
    name: 'Edge Starter',
    gpus: '1x NVIDIA L40S',
    vram: '48 GB GDDR6',
    tflops: '90.2 TFLOPS',
    price: '€289',
    pricePer: '/month',
    features: [
      '48GB GPU Memory',
      '90.2 TFLOPS FP32',
      'Sub-30ms edge latency',
      'Auto-scaling included',
      '24/7 monitoring',
    ],
  },
  {
    id: 'pro',
    name: 'Edge Pro',
    gpus: '2x NVIDIA L40S',
    vram: '96 GB GDDR6',
    tflops: '180.4 TFLOPS',
    price: '€579',
    pricePer: '/month',
    popular: true,
    features: [
      '96GB GPU Memory',
      '180.4 TFLOPS FP32',
      'Sub-20ms edge latency',
      'Priority auto-scaling',
      'Load balancing included',
      '24/7 priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Edge Enterprise',
    gpus: '3x NVIDIA L40S',
    vram: '144 GB GDDR6',
    tflops: '270.6 TFLOPS',
    price: '€869',
    pricePer: '/month',
    features: [
      '144GB GPU Memory',
      '270.6 TFLOPS FP32',
      'Sub-15ms edge latency',
      'Dedicated GPU clusters',
      'Custom model fine-tuning',
      'SLA 99.99% uptime',
      'Dedicated support engineer',
    ],
  },
];

export const EDGE_POPS: EdgePoP[] = [
  { city: 'Frankfurt', country: 'Germany', flag: '🇩🇪', latency: '12ms', status: 'online' },
  { city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', latency: '18ms', status: 'online' },
  { city: 'London', country: 'United Kingdom', flag: '🇬🇧', latency: '22ms', status: 'online' },
  { city: 'Paris', country: 'France', flag: '🇫🇷', latency: '19ms', status: 'online' },
  { city: 'New York', country: 'USA', flag: '🇺🇸', latency: '28ms', status: 'online' },
  { city: 'San Francisco', country: 'USA', flag: '🇺🇸', latency: '24ms', status: 'online' },
  { city: 'Singapore', country: 'Singapore', flag: '🇸🇬', latency: '29ms', status: 'online' },
  { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', latency: '27ms', status: 'online' },
  { city: 'Sydney', country: 'Australia', flag: '🇦🇺', latency: '30ms', status: 'deploying' },
  { city: 'São Paulo', country: 'Brazil', flag: '🇧🇷', latency: '26ms', status: 'online' },
  { city: 'Mumbai', country: 'India', flag: '🇮🇳', latency: '25ms', status: 'online' },
  { city: 'Dubai', country: 'UAE', flag: '🇦🇪', latency: '23ms', status: 'maintenance' },
];

export const RECENT_SESSIONS = [
  { id: '1', title: 'Edge inference optimization', time: '2m ago', model: 'zyra-pro' },
  { id: '2', title: 'Stable Diffusion prompt engineering', time: '1h ago', model: 'zyra-flash' },
  { id: '3', title: 'Whisper model deployment', time: '3h ago', model: 'zyra-mini' },
  { id: '4', title: 'Multi-GPU load balancing', time: '5h ago', model: 'zyra-reason' },
  { id: '5', title: 'RAG pipeline architecture', time: '1d ago', model: 'zyra-pro' },
  { id: '6', title: 'Token streaming at the edge', time: '2d ago', model: 'zyra-flash' },
];
