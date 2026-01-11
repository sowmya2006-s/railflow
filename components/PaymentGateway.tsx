
import React, { useState, useMemo } from 'react';
import { PAYMENT_MODES } from '../constants';

interface PaymentGatewayProps {
  amount: number;
  onSuccess: () => void;
  onFailure: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, onSuccess, onFailure }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>(PAYMENT_MODES[0].id);

  const convenienceFee = useMemo(() => {
    switch (selectedMode) {
      case 'upi': return 0;
      case 'card': return Math.round(amount * 0.02); // 2% charge
      case 'netbanking': return 15; // Fixed 15 INR
      default: return 0;
    }
  }, [selectedMode, amount]);

  const totalAmount = amount + convenienceFee;

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);
    
    // Simulate payment API call
    setTimeout(() => {
      // 10% failure chance for realism
      const isSuccess = Math.random() > 0.1;
      setProcessing(false);
      if (isSuccess) {
        onSuccess();
      } else {
        setError("Payment timed out. Please check your bank and retry.");
        onFailure();
      }
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gray-50 p-10 border-b border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Payable</p>
            <h2 className="text-5xl font-extrabold text-gray-800">₹{totalAmount}</h2>
            {convenienceFee > 0 && (
              <p className="text-xs text-blue-600 font-bold mt-1">Incl. ₹{convenienceFee} convenience fee</p>
            )}
          </div>
          <div className="text-right">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase shadow-sm">Secure SSL Gateway</span>
          </div>
        </div>

        <div className="p-10">
          <h3 className="text-xl font-bold text-gray-800 mb-8">Select Payment Mode</h3>
          <div className="space-y-4 mb-10">
            {PAYMENT_MODES.map(mode => (
              <label 
                key={mode.id} 
                className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                  selectedMode === mode.id 
                  ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-500/10' 
                  : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <input 
                  type="radio" 
                  name="paymode" 
                  className="w-6 h-6 text-blue-600 mr-5" 
                  checked={selectedMode === mode.id}
                  onChange={() => setSelectedMode(mode.id)}
                />
                <span className="text-3xl mr-5">{mode.icon}</span>
                <div className="flex-1">
                  <span className={`block font-extrabold text-lg ${selectedMode === mode.id ? 'text-blue-800' : 'text-gray-700'}`}>
                    {mode.name}
                  </span>
                  <span className="text-xs text-gray-400 font-bold uppercase">
                    {mode.id === 'upi' ? 'Zero Processing Fee' : mode.id === 'card' ? '2% Transaction Fee' : '₹15 Fixed Fee'}
                  </span>
                </div>
              </label>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-5 rounded-2xl mb-8 flex items-center border border-red-100 animate-shake">
              <span className="mr-3 text-xl">⚠️</span>
              <span className="font-bold">{error}</span>
            </div>
          )}

          <button 
            disabled={processing}
            onClick={handlePayment}
            className={`w-full py-6 rounded-2xl font-extrabold text-2xl shadow-2xl transition-all ${
              processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-[1.02] active:scale-95'
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-7 w-7 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AUTHORIZING...
              </span>
            ) : `PROCEED TO PAY ₹${totalAmount}`}
          </button>
          
          <p className="text-center text-gray-400 text-sm mt-8 font-medium">
            By paying, you agree to the IRCTC terms of service and RailFlow policies.
          </p>
        </div>
      </div>
    </div>
  );
};
