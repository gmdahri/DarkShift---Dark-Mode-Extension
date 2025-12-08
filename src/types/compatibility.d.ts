export interface CompatibilityResult {
  compatible: boolean;
  disableToggle: boolean;
  message: string;
  reason?: string;
  warnings?: string[];
  confidence: 'high' | 'medium' | 'low';
}

export type CompatibilityState = 'checking' | 'compatible' | 'incompatible' | 'partial';

