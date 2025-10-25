import React, { useState, useEffect } from 'react';
import IDCard from './components/IDCard';
import Terminal from './components/Terminal';
import Modal from './components/Modal';
import InterviewForm from './components/InterviewForm';
import type { PortfolioData } from './types';

const initialPortfolioData: PortfolioData = {
  personal: {
    'Name': 'Karthi G',
    'Nationality': 'Indian',
    'Date of Birth': '17/06/2000',
    'Gender': 'Male',
    'Marital Status': 'Single',
    'profile_picture_url': 'https://i.imgur.com/8b23K1A.png'
  },
  contact_info: {
    'Mobile': '+91-9361191640',
    'Email': 'gkarthi.ui@gmail.com',
    'Location': 'Mayiladuthurai, Tamil Nadu, India'
  },
  experience_log: [
    'System Administrator, GS-sysnet, Bangalore, Karnataka (May 2024 - Present)',
    '- Provided IT support for 1000+ users, resolving hardware, software, and network issues with a 95% first-call resolution rate.',
    '- Troubleshot and resolved hardware, software, and network issues for end-users via phone, email, or in-person.',
    '- Installed and configured operating systems on new and existing hardware.',
    '- Managed and maintained the company’s IT infrastructure, including monitoring network performance and implementing improvements.',
    '- Set up and maintained network and local printers to ensure seamless functionality.',
    '- Assisted in the setup and configuration of new hardware and software.',
    '- Provided technical support and training to staff, enhancing their IT proficiency.'
  ],
  skills_list: {
    'Networking & Protocols': ['TCP/IP', 'DNS', 'DHCP', 'VPN', 'LAN/WAN', 'OSI Model'],
    'System Administration': ['OS Installation (Windows/Linux, including server OS)', 'Hardware/Software Installation & Troubleshooting'],
    'Technical Support': ['End-user Training', 'Problem-solving', 'Issue Escalation', 'Outlook Configuration & MS-Office Problem Solving'],
    'Tools & Platforms': ['CRM Software', 'Ticketing Systems', 'Remote Troubleshooting Tools'],
    'Microsoft 365': ['Configuration and Management'],
    'Printers': ['Printer Configuration & Troubleshooting'],
    'Cloud Computing': ['Basic AWS Knowledge (EC2, S3, IAM)', 'Understanding of Cloud Computing Principles'],
    'Camera Installation': ['Installation & Configuration'],
  }
};

const App: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialPortfolioData);
  const [modalState, setModalState] = useState<'closed' | 'form' | 'success'>('closed');

  const handleFormSubmit = () => {
    setModalState('success');
  };
  
  const closeModal = () => {
    setModalState('closed');
  };

  useEffect(() => {
    if (modalState === 'success') {
      const timer = setTimeout(() => {
        closeModal();
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [modalState]);

  return (
    <>
      <main className="bg-black text-green-400 h-screen font-mono flex flex-col md:flex-row md:items-center overflow-hidden">
        <div className="w-full md:w-2/5 flex items-center justify-center p-4 md:p-8">
          <IDCard data={portfolioData} onInviteClick={() => setModalState('form')} />
        </div>
        <div className="hidden md:block w-px bg-green-400/50"></div>
        <div className="w-full md:w-3/5 p-4 md:p-8 flex items-center justify-center">
          <Terminal data={portfolioData} setData={setPortfolioData} />
        </div>
      </main>
      {modalState !== 'closed' && (
        <Modal onClose={closeModal}>
          {modalState === 'form' && <InterviewForm onSubmit={handleFormSubmit} />}
          {modalState === 'success' && (
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Success!</h2>
              <p className="text-green-300">Invitation Sent Successfully!</p>
              <p className="text-xs text-green-500 mt-4 animate-pulse">This window will close automatically.</p>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default App;
