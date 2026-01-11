
import React, { useState } from 'react';
import { Passenger, Train, TrainClass } from '../types';

interface PassengerEntryProps {
  train: Train;
  tClass: TrainClass;
  timer: number | null;
  onNext: (passengers: Passenger[]) => void;
  onBack: () => void;
}

export const PassengerEntry: React.FC<PassengerEntryProps> = ({ train, tClass, timer, onNext, onBack }) => {
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: '', age: 0, gender: 'Male', seatPreference: 'No Preference' }
  ]);

  const addPassenger = () => setPassengers([...passengers, { name: '', age: 0, gender: 'Male', seatPreference: 'No Preference' }]);
  const removePassenger = (idx: number) => setPassengers(passengers.filter((_, i) => i !== idx));

  const updatePassenger = (idx: number, field: keyof Passenger, value: any) => {
    const updated = [...passengers];
    updated[idx] = { ...updated[idx], [field]: value };
    setPassengers(updated);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Passenger Details</h2>
          <p className="text-gray-500">{train.name} | {tClass.type}</p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-6 py-3 rounded-2xl flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider mb-1">Seats Locked</span>
          <span className="text-2xl font-mono font-bold">
            {timer ? `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}` : '00:00'}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {passengers.map((p, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Name</label>
              <input 
                type="text" 
                placeholder="Full Name as per ID"
                className="w-full p-3 border-b-2 border-gray-100 focus:border-blue-500 focus:outline-none font-semibold text-gray-800"
                value={p.name}
                onChange={(e) => updatePassenger(idx, 'name', e.target.value)}
              />
            </div>
            <div className="w-24">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Age</label>
              <input 
                type="number" 
                className="w-full p-3 border-b-2 border-gray-100 focus:border-blue-500 focus:outline-none font-semibold text-gray-800"
                value={p.age || ''}
                onChange={(e) => updatePassenger(idx, 'age', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Gender</label>
              <select 
                className="w-full p-3 border-b-2 border-gray-100 focus:border-blue-500 focus:outline-none font-semibold text-gray-800 cursor-pointer"
                value={p.gender}
                onChange={(e) => updatePassenger(idx, 'gender', e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-44">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Seat Preference</label>
              <select 
                className="w-full p-3 border-b-2 border-gray-100 focus:border-blue-500 focus:outline-none font-semibold text-gray-800 cursor-pointer"
                value={p.seatPreference}
                onChange={(e) => updatePassenger(idx, 'seatPreference', e.target.value)}
              >
                <option value="No Preference">No Preference</option>
                <option value="Window">Window</option>
                <option value="Middle">Middle</option>
                <option value="Aisle">Aisle</option>
                <hr className="my-1 border-gray-100" />
                <option value="Lower Berth">Lower Berth</option>
                <option value="Middle Berth">Middle Berth</option>
                <option value="Upper Berth">Upper Berth</option>
                <option value="Side Lower">Side Lower</option>
                <option value="Side Upper">Side Upper</option>
              </select>
            </div>
            {passengers.length > 1 && (
              <button onClick={() => removePassenger(idx)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove Passenger">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={addPassenger}
        className="flex items-center space-x-2 text-blue-600 font-bold px-6 py-2 hover:bg-blue-50 rounded-xl transition-all mb-12 border border-transparent hover:border-blue-100"
      >
        <span className="text-xl leading-none">+</span>
        <span>Add Another Passenger</span>
      </button>

      <div className="flex justify-between items-center">
        <button onClick={onBack} className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition">Back</button>
        <div className="flex flex-col items-end">
           <p className="text-sm text-gray-400 font-medium mb-1">Total {passengers.length} Passenger(s)</p>
           <button 
            onClick={() => onNext(passengers)}
            className="px-12 py-4 bg-orange-500 text-white font-extrabold rounded-2xl shadow-lg hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-95"
          >
            Review & Pay ₹{tClass.price * passengers.length}
          </button>
        </div>
      </div>
    </div>
  );
};
