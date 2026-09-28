export type Language = 'bn' | 'en';

export type DeviceModel =
  | 'Smartphone (Android / iOS)'
  | 'Apple iPhone 15 Pro Max'
  | 'Samsung Galaxy S24 Ultra'
  | 'Xiaomi 14 Ultra'
  | 'OnePlus 12'
  | 'Windows 11 PC / Laptop'
  | 'Apple MacBook Pro M3';

export type ScanType = 'quick' | 'deep' | 'hardware';

export interface LogMessage {
  id: string;
  time: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}
