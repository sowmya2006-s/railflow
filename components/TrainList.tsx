
import React, { useState, useEffect } from 'react';
import { Train, TrainClass } from '../types';
import { getRealTimeTrainStatus, getRouteTips } from '../services/grok';

interface TrainListProps {
  trains: Train[];
  onSelect: (train: Train, tClass: TrainClass) => void;
}

export const TrainList: React.FC<TrainListProps> = ({ trains, onSelect }) => {
  const [liveStatuses, setLiveStatuses] = useState<Record<string, { text: string, urls: string[], loading: boolean }>>({});
  const [routeTips, setRouteTips] = useState<string>('');

  useEffect(() => {
    if (trains.length > 0) {
      const fetchTips = async () => {
        const tips = await getRouteTips(trains[0].from, trains[0].to);
        setRouteTips(tips);
      };
      fetchTips();
    }
  }, [trains]);

  const fetchLiveStatus = async (trainId: string, trainNum: string, trainName: string) => {
    setLiveStatuses(prev => ({ ...prev, [trainId]: { text: '', urls: [], loading: true } }));
    const result = await getRealTimeTrainStatus(trainNum, trainName);
    setLiveStatuses(prev => ({ ...prev, [trainId]: { ...result, loading: false } }));
  };

  if (trains.length === 0) {
    return (
      <div className="max-w-5xl mx-auto -mt-16 px-6 mb-20">
        <div className="bg-white p-12 rounded-3xl shadow-sm text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No trains found</h3>
          <p className="text-gray-400">Try searching for a different date or route.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto -mt-16 px-6 space-y-6 mb-20">
      {routeTips && (
        <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg animate-in fade-in duration-500">
          <div className="flex items-center space-x-3">
            <span className="text-xl">💡</span>
            <span className="text-sm font-medium italic">{routeTips}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">AI Smart Tip (Lite)</span>
        </div>
      )}

      {trains.map((train) => (
        <div key={train.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{train.name}</h3>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">#{train.number}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => fetchLiveStatus(train.id, train.number, train.name)}
                  className="flex items-center space-x-2 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <span>AI LIVE STATUS</span>
                </button>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Running Days</p>
                  <p className="text-sm text-gray-600">M T W T F S S</p>
                </div>
              </div>
            </div>

            {liveStatuses[train.id] && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in slide-in-from-top-2 duration-300">
                {liveStatuses[train.id].loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-xs font-medium text-gray-500">Fetching live info using Grok AI...</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Search Grounded Intelligence</span>
                      <span className="text-[10px] text-gray-400">Model: Grok 2</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">{liveStatuses[train.id].text}</p>
                    {liveStatuses[train.id].urls.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Sources:</span>
                        {liveStatuses[train.id].urls.slice(0, 2).map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline truncate max-w-[150px]">
                            {url.split('/')[2]}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{train.departure}</p>
                <p className="text-sm text-gray-500 font-medium">{train.from.split('(')[0]}</p>
              </div>
              <div className="flex-1 px-8 flex flex-col items-center">
                <p className="text-xs text-gray-400 font-bold mb-1">{train.duration}</p>
                <div className="h-0.5 w-full bg-gray-100 relative">
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{train.arrival}</p>
                <p className="text-sm text-gray-500 font-medium">{train.to.split('(')[0]}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {train.classes.map((cls) => (
                <button
                  key={cls.type}
                  disabled={cls.available === 0}
                  onClick={() => onSelect(train, cls)}
                  className={`p-4 rounded-xl border-2 text-left transition ${cls.available > 0
                    ? 'border-gray-100 hover:border-blue-500 hover:bg-blue-50'
                    : 'bg-gray-50 opacity-50 cursor-not-allowed border-transparent'
                    }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-800">{cls.type}</span>
                    <span className="text-blue-600 font-bold">₹{cls.price}</span>
                  </div>
                  <p className={`text-xs font-bold ${cls.available > 10 ? 'text-green-600' : 'text-orange-500'}`}>
                    {cls.available > 0 ? `AVL ${cls.available}` : 'NOT AVAILABLE'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase">Confirm Prob: 98%</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
