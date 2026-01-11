
import { useState, useCallback, useEffect } from 'react';
import { BookingStep, Train, TrainClass, Passenger, AnalyticsEvent, User } from '../types';

export const useBookingStore = () => {
  const [step, setStep] = useState<BookingStep>(BookingStep.AUTH);
  const [user, setUser] = useState<User | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedClass, setSelectedClass] = useState<TrainClass | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [lockTimer, setLockTimer] = useState<number | null>(null);

  const trackEvent = useCallback((step: BookingStep, data?: any) => {
    setEvents(prev => [...prev, { step, timestamp: Date.now(), data }]);
  }, []);

  const navigateTo = useCallback((nextStep: BookingStep) => {
    setStep(nextStep);
    trackEvent(nextStep);
  }, [trackEvent]);

  const login = useCallback((userData: User) => {
    setUser(userData);
    navigateTo(BookingStep.SEARCH);
  }, [navigateTo]);

  const selectTrain = useCallback((train: Train, tClass: TrainClass) => {
    setSelectedTrain(train);
    setSelectedClass(tClass);
    setLockTimer(300); // 5 minutes lock
    navigateTo(BookingStep.PASSENGERS);
  }, [navigateTo]);

  const resetBooking = useCallback(() => {
    setStep(BookingStep.SEARCH);
    setSelectedTrain(null);
    setSelectedClass(null);
    setPassengers([]);
    setLockTimer(null);
  }, []);

  useEffect(() => {
    let interval: any;
    if (lockTimer !== null && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (lockTimer === 0) {
      alert("Session expired! Seats released.");
      resetBooking();
    }
    return () => clearInterval(interval);
  }, [lockTimer, resetBooking]);

  return {
    step,
    user,
    login,
    navigateTo,
    selectedTrain,
    selectedClass,
    passengers,
    setPassengers,
    selectTrain,
    resetBooking,
    events,
    lockTimer
  };
};
