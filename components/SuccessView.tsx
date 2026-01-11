
import React from 'react';
import { Train, Passenger } from '../types';
import { jsPDF } from 'jspdf';

interface SuccessViewProps {
  train: Train;
  passengers: Passenger[];
  pnr: string;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ train, passengers, pnr }) => {
  
  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    // Brand Colors
    const primaryBlue = [30, 58, 138];
    const lightGray = [248, 250, 252];
    const textGray = [107, 114, 128];

    // Header with Logo
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Logo "RF"
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 10, 15, 15, 2, 2, 'F');
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RF', 19, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('RailFlow E-Ticket', 35, 21);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Seamless Rail Journey Partner', 35, 27);

    // PNR Section
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(15, 45, 180, 25, 3, 3, 'F');
    
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.setFontSize(9);
    doc.text('PNR NUMBER', 25, 55);
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setFontSize(20);
    doc.setFont('courier', 'bold');
    doc.text(pnr, 25, 63);

    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('BOOKING DATE', 140, 55);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(new Date().toLocaleDateString(), 140, 63);

    // Journey Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Journey Details', 15, 85);
    
    doc.setDrawColor(229, 231, 235);
    doc.line(15, 88, 195, 88);

    doc.setFontSize(11);
    doc.text(train.name, 15, 98);
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.text(`#${train.number}`, 15, 104);

    doc.setTextColor(0,0,0);
    doc.setFontSize(10);
    doc.text('FROM', 70, 98);
    doc.setFontSize(12);
    doc.text(train.from, 70, 104);

    doc.setFontSize(10);
    doc.text('TO', 140, 98);
    doc.setFontSize(12);
    doc.text(train.to, 140, 104);

    doc.setFontSize(9);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text('Departure', 70, 110);
    doc.setTextColor(0, 0, 0);
    doc.text(train.departure, 70, 115);

    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text('Arrival', 140, 110);
    doc.setTextColor(0, 0, 0);
    doc.text(train.arrival, 140, 115);

    // Passenger List
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Passenger Information', 15, 135);
    doc.line(15, 138, 195, 138);

    // Table Header
    doc.setFillColor(243, 244, 246);
    doc.rect(15, 145, 180, 10, 'F');
    doc.setFontSize(9);
    doc.text('Name', 20, 151);
    doc.text('Age/Gender', 80, 151);
    doc.text('Preference', 120, 151);
    doc.text('Status', 160, 151);

    let yPos = 162;
    passengers.forEach((p, i) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(p.name, 20, yPos);
      doc.text(`${p.age} / ${p.gender}`, 80, yPos);
      doc.text(p.seatPreference || 'None', 120, yPos);
      doc.setTextColor(16, 185, 129); // Green status
      doc.setFont('helvetica', 'bold');
      doc.text('CNF', 160, yPos);
      doc.setTextColor(0, 0, 0);
      doc.setDrawColor(243, 244, 246);
      doc.line(15, yPos + 4, 195, yPos + 4);
      yPos += 12;
    });

    // Footer
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a computer-generated document. No signature is required.', 105, 280, { align: 'center' });
    doc.text('RailFlow Technologies - Travel with Intelligence', 105, 285, { align: 'center' });

    doc.save(`RailFlow_Ticket_${pnr}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-10 inline-flex items-center justify-center w-28 h-28 rounded-full bg-green-100 text-green-600 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">Booking Confirmed!</h1>
      <p className="text-gray-500 text-xl mb-12">Your intelligent travel plan is ready. Details sent to your email.</p>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden text-left transform transition-all hover:shadow-blue-100/50">
        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">PNR Number</p>
            <p className="text-4xl font-mono font-extrabold text-blue-600">{pnr}</p>
          </div>
          <div className="text-right">
             <button 
              onClick={handleDownload}
              className="bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-700 shadow-xl transition-all flex items-center gap-3 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF Ticket
            </button>
          </div>
        </div>
        
        <div className="p-10">
          <div className="mb-10 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-800">{train.name}</h3>
                <span className="text-sm font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">#{train.number}</span>
              </div>
              <p className="text-gray-500 font-medium text-lg flex items-center gap-2">
                {train.from} 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                {train.to}
              </p>
            </div>
            <div className="text-right pl-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Boarding Time</p>
              <p className="text-3xl font-extrabold text-gray-800">{train.departure}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirmed Passengers</h4>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>
            {passengers.map((p, i) => (
              <div key={i} className="flex justify-between items-center py-5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-4 -mx-4 rounded-xl transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {i+1}
                  </div>
                  <div>
                    <p className="font-extrabold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">{p.name}</p>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-tight">
                      {p.age} Yrs • {p.gender} • {p.seatPreference !== 'No Preference' ? p.seatPreference : 'Auto Berth'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl inline-block shadow-sm">
                    Coach S{Math.floor(Math.random() * 8) + 1} | Seat {Math.floor(Math.random() * 72) + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => window.location.reload()}
        className="mt-12 text-gray-400 font-bold hover:text-blue-600 transition-all flex items-center justify-center mx-auto gap-2 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        Book Another Journey
      </button>
    </div>
  );
};
