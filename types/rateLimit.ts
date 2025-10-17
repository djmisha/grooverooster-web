export interface RateLimitResult {
  allowed: boolean;
  error?: string;
  isPreflight?: boolean;
}
