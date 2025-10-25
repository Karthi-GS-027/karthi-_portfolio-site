import React, { useState, useEffect } from 'react';
import type { PortfolioData } from '../types';

interface IDCardProps {
  data: PortfolioData;
  onInviteClick: () => void;
}

const IDCard: React.FC<IDCardProps> = ({ data, onInviteClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = () => {
    setIsFlipped(prev => !prev);
  };

  return (
    <div
      className="w-full max-w-md h-[30rem] [perspective:1000px] cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label="Toggle ID card details"
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full [backface-visibility:hidden] border-2 border-green-400 bg-gray-900/50 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(0,255,0,0.4)]">
          <img
            src={data.personal.profile_picture_url || `https://picsum.photos/seed/${data.personal.Name}/150/150`}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-green-400 mb-4 object-cover"
          />
          <h1 className="text-3xl font-bold text-white">{data.personal.Name}</h1>
          <p className="text-green-300 mt-2">System Administrator</p>
          <div className="mt-4 border-t-2 border-green-400/50 w-2/3"></div>
           <p className="text-sm text-green-500 mt-4 animate-pulse">-- Click or wait to flip --</p>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-green-400 bg-gray-900/50 rounded-lg p-6 flex flex-col justify-between shadow-[0_0_15px_rgba(0,255,0,0.4)] relative overflow-hidden">
          
          {/* Animated Background */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-pulse-bg z-0"
            style={{ backgroundImage: "url('https://i.imgur.com/5i514f5.jpeg')" }}
          ></div>

          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="0.5" stroke="currentColor" className="w-48 h-48 text-green-400 opacity-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.668 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.337 6.337 0 0 1-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.337 6.337 0 0 1-.22-.127c-.324-.196-.72-.257-1.075.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.003-.827c.293-.24.438.613.438.995s-.145-.755-.438-.995l-1.003-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.075-.124.073-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-xl font-bold text-white border-b-2 border-green-400/50 pb-2">CONTACT</h2>
              <div className="mt-4 text-sm space-y-2">
                <p><span className="font-bold text-white">Email:</span> {data.contact_info.Email}</p>
                <p><span className="font-bold text-white">Mobile:</span> {data.contact_info.Mobile}</p>
                <p><span className="font-bold text-white">Status:</span> {data.personal['Marital Status']}</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card from flipping when button is clicked
                  onInviteClick();
                }}
                className="w-full bg-green-500/20 hover:bg-green-500/40 border border-green-500 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Send Interview Invitation
              </button>
              <div className="text-center text-xs text-green-600">
                [ ID Card v1.0 | Property of {data.personal.Name} ]
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IDCard;