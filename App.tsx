import React, { useState, useEffect } from 'react';
import IDCard from './components/IDCard';
import Terminal from './components/Terminal';
import Modal from './components/Modal';
import InterviewForm from './components/InterviewForm';
import AdminPage from './components/AdminPage';
import type { PortfolioData, Customization } from './types';

const initialPortfolioData: PortfolioData = {
  personal: {
    'Name': 'Karthi G',
    'title': 'System Administrator',
    'Nationality': 'Indian',
    'Date of Birth': '17/06/2000',
    'Gender': 'Male',
    'Marital Status': 'Single',
    'profile_picture_url': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iIzRhZGU4MCIvPjxwYXRoIGQ9Ik0xNSA5NSBDIDE1IDc1LCA4NSA3NSwgODUgOTUiIGZpbGw9IiM0YWRlODAiLz48L3N2Zz4='
  },
  contact_info: {
    'Mobile': '+91-9361191640',
    'Email': 'gkarthi.ui@gmail.com',
    'Location': 'Mayiladuthurai, Tamil Nadu, India'
  },
  socials: {
    'LinkedIn': 'https://www.linkedin.com/in/karthi-g17/',
    'Naukri': 'https://www.naukri.com/mnjuser/profile?id=&altresid'
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
  education: [
    'WebDevelopment Internship - Sai Techno Solution, Coimbatore (2023)',
    'Post Graduate Diploma in Computer Applications (PGDCA) - Guru Computers, Kuthalam (2022)',
    'Bachelor’s Degree in Chemistry - Bharathidasan University, Trichy (2017-2020)'
  ],
  languages: [
    'Tamil (Native)',
    'English (Professional Working Proficiency)'
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
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    const savedPic = localStorage.getItem('profilePicture');
    if (savedPic) {
      return {
        ...initialPortfolioData,
        personal: {
          ...initialPortfolioData.personal,
          'profile_picture_url': savedPic,
        },
      };
    }
    return initialPortfolioData;
  });

  const [modalState, setModalState] = useState<'closed' | 'form' | 'success'>('closed');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [customColors, setCustomColors] = useState<Customization>({
    outline: '#4ade80', // green-400
    text: '#4ade80',    // green-400
    link: '#6ee7b7',    // green-300
    accent: '#22c55e',  // green-500
  });

  const handleCustomize = (target: keyof Customization, color: string) => {
    setCustomColors(prev => ({ ...prev, [target]: color }));
  };

  const handleFormSubmit = () => {
    setModalState('success');
  };
  
  const closeModal = () => {
    setModalState('closed');
  };
  
  const handleLogin = () => {
    setIsAdminMode(true);
  };
  
  const handleLogout = () => {
    setIsAdminMode(false);
  };

  useEffect(() => {
    if (modalState === 'success') {
      const timer = setTimeout(() => {
        closeModal();
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [modalState]);

  useEffect(() => {
    // Don't save the default SVG placeholder
    if (portfolioData.personal.profile_picture_url && !portfolioData.personal.profile_picture_url.startsWith('data:image/svg+xml')) {
        localStorage.setItem('profilePicture', portfolioData.personal.profile_picture_url);
    }
  }, [portfolioData.personal.profile_picture_url]);

  return (
    <>
      <main 
        className="bg-black h-screen font-mono flex flex-col md:flex-row md:items-center overflow-hidden"
      >
        <div className="w-full md:w-2/5 flex items-center justify-center p-4 md:p-8">
          <IDCard data={portfolioData} onInviteClick={() => setModalState('form')} colors={customColors} />
        </div>
        <div 
            className="hidden md:block w-px"
            style={{ backgroundColor: customColors.outline, opacity: 0.5 }}
        ></div>
        <div className="w-full md:w-3/5 p-4 md:p-8 flex items-center justify-center">
          <Terminal data={portfolioData} setData={setPortfolioData} colors={customColors} onCustomize={handleCustomize} onLogin={handleLogin} />
        </div>
      </main>
      {modalState !== 'closed' && (
        <Modal onClose={closeModal} colors={customColors}>
          {modalState === 'form' && <InterviewForm onSubmit={handleFormSubmit} colors={customColors} />}
          {modalState === 'success' && (
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Success!</h2>
              <p style={{ color: customColors.link }}>Invitation Sent Successfully!</p>
              <p className="text-xs mt-4 animate-pulse" style={{ color: customColors.accent }}>This window will close automatically.</p>
            </div>
          )}
        </Modal>
      )}
      {isAdminMode && <AdminPage onLogout={handleLogout} colors={customColors} data={portfolioData} setData={setPortfolioData} />}
    </>
  );
};

export default App;