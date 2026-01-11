
export enum BookingStep {
  AUTH = 'AUTH',
  SEARCH = 'SEARCH',
  TRAIN_SELECTION = 'TRAIN_SELECTION',
  PASSENGERS = 'PASSENGERS',
  PAYMENT = 'PAYMENT',
  CONFIRMATION = 'CONFIRMATION'
}

export interface User {
  name: string;
  email: string;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  classes: TrainClass[];
}

export interface TrainClass {
  type: string;
  price: number;
  available: number;
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  seatPreference?: string;
}

export interface AnalyticsEvent {
  step: BookingStep;
  timestamp: number;
  data?: any;
}

export interface AnalyticsMetrics {
  dropOffs: Record<string, number>;
  totalBookings: number;
  paymentFailures: number;
  averageTime: number;
}
