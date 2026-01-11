
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { SearchHero } from './components/SearchHero';
import { TrainList } from './components/TrainList';
import { PassengerEntry } from './components/PassengerEntry';
import { PaymentGateway } from './components/PaymentGateway';
import { SuccessView } from './components/SuccessView';
import { AnalyticsView } from './components/AnalyticsView';
import { AIChatBot } from './components/AIChatBot';
import { useBookingStore } from './store/useBookingStore';
import { BookingStep, Train, TrainClass } from './types';
import { TRAINS } from './constants';

const App: React.FC = () => {
  const { 
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
  } = useBookingStore();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (from: string, to: string) => {
    const fFrom = from.toLowerCase();
    const fTo = to.toLowerCase();
    
    // Improved station code extraction and matching
    const extractCode = (str: string) => {
      const match = str.match(/\((.*?)\)/);
      return match ? match[1].toLowerCase() : str.toLowerCase();
    };

    const fromCode = extractCode(fFrom);
    const toCode = extractCode(fTo);

    const results = TRAINS.filter(t => {
      const tFrom = t.from.toLowerCase();
      const tTo = t.to.toLowerCase();
      const tFromCode = extractCode(tFrom);
      const tToCode = extractCode(tTo);

      const matchesFrom = tFrom.includes(fFrom) || fFrom.includes(tFrom.split(' ')[0].toLowerCase()) || tFromCode === fromCode;
      const matchesTo = tTo.includes(fTo) || fTo.includes(tTo.split(' ')[0].toLowerCase()) || tToCode === toCode;
      
      return matchesFrom && matchesTo;
    });

    setFilteredTrains(results);
    setShowResults(true);
    navigateTo(BookingStep.TRAIN_SELECTION);
  };

  const handlePassengerSubmit = (data: any) => {
    setPassengers(data);
    navigateTo(BookingStep.PAYMENT);
  };

  const renderStep = () => {
    if (isAdmin) return <AnalyticsView events={events} />;

    switch (step) {
      case BookingStep.AUTH:
        return <Login onLogin={login} />;
      case BookingStep.SEARCH:
      case BookingStep.TRAIN_SELECTION:
        return (
          <>
            <SearchHero onSearch={handleSearch} />
            {showResults && (
              <TrainList 
                trains={filteredTrains} 
                onSelect={(train, tClass) => selectTrain(train, tClass)} 
              />
            )}
            {!showResults && (
               <div className="max-w-5xl mx-auto py-20 px-6 text-center text-gray-400 font-medium">
                 Enter source and destination to start your journey.
               </div>
            )}
          </>
        );
      case BookingStep.PASSENGERS:
        return selectedTrain && selectedClass ? (
          <PassengerEntry 
            train={selectedTrain} 
            tClass={selectedClass} 
            timer={lockTimer}
            onBack={() => navigateTo(BookingStep.SEARCH)}
            onNext={handlePassengerSubmit}
          />
        ) : null;
      case BookingStep.PAYMENT:
        return (
          <PaymentGateway 
            amount={(selectedClass?.price || 0) * (passengers.length || 1)}
            onSuccess={() => navigateTo(BookingStep.CONFIRMATION)}
            onFailure={() => { }}
          />
        );
      case BookingStep.CONFIRMATION:
        return selectedTrain ? (
          <SuccessView 
            train={selectedTrain} 
            passengers={passengers} 
            pnr={`RF${Math.floor(Math.random() * 900000000) + 100000000}`}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar onAdmin={() => setIsAdmin(!isAdmin)} isAdmin={isAdmin} user={user} />
      
      {!isAdmin && step !== BookingStep.SEARCH && step !== BookingStep.AUTH && (
        <div className="bg-white border-b border-gray-100 py-3 sticky top-[72px] z-40">
          <div className="max-w-3xl mx-auto px-6 flex justify-between">
            {[
              { id: BookingStep.TRAIN_SELECTION, label: 'Train' },
              { id: BookingStep.PASSENGERS, label: 'Passengers' },
              { id: BookingStep.PAYMENT, label: 'Payment' },
              { id: BookingStep.CONFIRMATION, label: 'Confirmation' }
            ].map((s, i) => {
              const active = step === s.id;
              const completed = Object.values(BookingStep).indexOf(step) > Object.values(BookingStep).indexOf(s.id);
              return (
                <div key={s.id} className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                    active ? 'border-blue-600 bg-blue-600 text-white' : completed ? 'border-green-500 bg-green-500 text-white' : 'border-gray-200 text-gray-400'
                  }`}>
                    {completed ? '✓' : i + 1}
                  </div>
                  <span className={`ml-2 text-xs font-bold ${active ? 'text-blue-600' : 'text-gray-400'}`}>{s.label}</span>
                  {i < 3 && <div className="mx-4 w-8 h-0.5 bg-gray-100"></div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <main>
        {renderStep()}
      </main>

      <AIChatBot />

      <footer className="mt-20 border-t border-gray-100 py-10 px-6 text-center text-gray-400 text-sm">
        <div className="max-w-5xl mx-auto">
          <p>© 2024 RailFlow Technologies. Built with Gemini AI Intelligence.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
            <a href="#" className="hover:text-gray-600">Refund Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
