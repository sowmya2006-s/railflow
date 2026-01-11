
import { Train } from './types';

export const STATIONS = [
  "New Delhi (NDLS)",
  "Mumbai Central (MMCT)",
  "Howrah Junction (HWH)",
  "Chennai Central (MAS)",
  "Bengaluru City (SBC)",
  "Ahmedabad Junction (ADI)",
  "Pune Junction (PUNE)",
  "Jaipur Junction (JP)",
  "Coimbatore Junction (CBE)",
  "Tirunelveli Junction (TEN)",
  "Erode Junction (ED)",
  "Tiruppur (TUP)",
  "Salem Junction (SA)"
];

export const TRAINS: Train[] = [
  {
    id: "1",
    number: "12424",
    name: "Rajdhani Express",
    from: "New Delhi (NDLS)",
    to: "Mumbai Central (MMCT)",
    departure: "16:25",
    arrival: "08:15",
    duration: "15h 50m",
    classes: [
      { type: "1A", price: 4500, available: 4 },
      { type: "2A", price: 2800, available: 12 },
      { type: "3A", price: 1900, available: 45 }
    ]
  },
  {
    id: "4",
    number: "20643",
    name: "Vande Bharat Express",
    from: "Coimbatore Junction (CBE)",
    to: "Tirunelveli Junction (TEN)",
    departure: "06:00",
    arrival: "12:00",
    duration: "6h 00m",
    classes: [
      { type: "EC", price: 2100, available: 15 },
      { type: "CC", price: 1100, available: 140 }
    ]
  },
  {
    id: "6",
    number: "12674",
    name: "Cheran SF Express",
    from: "Coimbatore Junction (CBE)",
    to: "Erode Junction (ED)",
    departure: "22:50",
    arrival: "00:20",
    duration: "1h 30m",
    classes: [
      { type: "1A", price: 1200, available: 2 },
      { type: "2A", price: 750, available: 10 },
      { type: "3A", price: 550, available: 40 },
      { type: "SL", price: 175, available: 150 }
    ]
  },
  {
    id: "7",
    number: "12676",
    name: "Kovai SF Express",
    from: "Coimbatore Junction (CBE)",
    to: "Chennai Central (MAS)",
    departure: "15:15",
    arrival: "22:50",
    duration: "7h 35m",
    classes: [
      { type: "CC", price: 650, available: 85 },
      { type: "2S", price: 195, available: 210 }
    ]
  },
  {
    id: "8",
    number: "12672",
    name: "Nilgiri Express",
    from: "Coimbatore Junction (CBE)",
    to: "Erode Junction (ED)",
    departure: "21:20",
    arrival: "22:55",
    duration: "1h 35m",
    classes: [
      { type: "1A", price: 1250, available: 4 },
      { type: "2A", price: 710, available: 15 },
      { type: "SL", price: 145, available: 80 }
    ]
  },
  {
    id: "2",
    number: "12002",
    name: "Shatabdi Express",
    from: "New Delhi (NDLS)",
    to: "Jaipur Junction (JP)",
    departure: "06:10",
    arrival: "10:45",
    duration: "4h 35m",
    classes: [
      { type: "EC", price: 1800, available: 8 },
      { type: "CC", price: 950, available: 110 }
    ]
  }
];

export const PAYMENT_MODES = [
  { id: 'upi', name: 'UPI (PhonePe/GPay)', icon: '📱' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦' }
];
