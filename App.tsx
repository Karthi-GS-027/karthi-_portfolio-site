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
    'title': 'Senior Frontend Engineer & UI/UX Specialist',
    'Nationality': 'Indian',
    'Date of Birth': '1998-05-20',
    'Gender': 'Male',
    'Marital Status': 'Single',
    'profile_picture_url': './img/karthi.jpeg',
  },
  contact_info: {
    'Mobile': '+91 9791165688',
    'Email': 'gkarthi.ui@gmail.com',
    'Location': 'Chennai, India',
  },
  socials: {
    'LinkedIn': 'https://www.linkedin.com/in/karthi-g-76b360294/',
    'Naukri': 'https://www.naukri.com/mnjuser/profile',
  },
  experience_log: [
    "Virtusa - ( Jan 2024 - Present )",
    "- Senior Consultant",
    "Cognizant Technology Solutions - ( Jun 2021 - Dec 2023 )",
    "- Programmer Analyst",
    "Codea Technologies - ( Jun 2019 - May 2021 )",
    "- Software Developer"
  ],
  education: [
    "B.E in Computer Science from Anna University (2015-2019)",
    "HSC from Govt. Hr. Sec. School (2014-2015)",
  ],
  languages: ["English", "Tamil"],
  skills_list: {
    "Frontend": ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"],
    "Backend": ["Node.js", "Express"],
    "Databases": ["MongoDB", "MySQL"],
    "Tools": ["Git", "Docker", "Webpack", "Jira"],
  },
  resume_base64: '',
};

const initialColors: Customization = {
  outline: '#facc15', // yellow-400
  text: '#e5e7eb', // gray-200
  link: '#60a5fa', // blue-400
  accent: '#f97316', // orange-500
};

const App: React.FC = () => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const savedData = localStorage.getItem('portfolioData');
      return savedData ? JSON.parse(savedData) : initialPortfolioData;
    } catch (error) {
      console.error("Failed to parse portfolio data from localStorage", error);
      return initialPortfolioData;
    }
  });
  
  const [colors, setColors] = useState<Customization>(() => {
    try {
      const savedColors = localStorage.getItem('portfolioColors');
      return savedColors ? JSON.parse(savedColors) : initialColors;
    } catch (error) {
      console.error("Failed to parse color data from localStorage", error);
      return initialColors;
    }
  });

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('portfolioData', JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save portfolio data to localStorage", error);
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolioColors', JSON.stringify(colors));
    } catch (error) {
      console.error("Failed to save color data to localStorage", error);
    }
  }, [colors]);

  const handleCustomize = (target: keyof Customization, color: string) => {
    setColors(prev => ({ ...prev, [target]: color }));
  };

  const handleLogin = () => {
    setIsAdminMode(true);
  };
  
  const handleLogout = () => {
    setIsAdminMode(false);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 sm:p-8 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-gray-900/20 animate-pulse-bg"
        style={{
          background: `radial-gradient(circle, ${colors.outline}33 0%, transparent 70%)`,
        }}
      />

      <header className="text-center mb-8 relative z-10">
        <h1 className="text-4xl sm:text-5xl font-bold" style={{ color: colors.accent }}>CMD Portfolio Generator</h1>
        <p className="mt-2 text-sm sm:text-base opacity-80" style={{ color: colors.text }}>
          An interactive terminal-based portfolio. Type '<span style={{ color: colors.accent, fontWeight: 500 }}>help</span>' to get started.
        </p>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex justify-center items-center">
          <IDCard data={data} onInviteClick={() => setIsInterviewModalOpen(true)} colors={colors} />
        </div>
        <Terminal data={data} setData={setData} colors={colors} onCustomize={handleCustomize} onLogin={handleLogin} />
      </main>

      {isInterviewModalOpen && (
        <Modal onClose={() => setIsInterviewModalOpen(false)} colors={colors}>
          <InterviewForm onSubmit={() => setIsInterviewModalOpen(false)} colors={colors} />
        </Modal>
      )}

      {isAdminMode && (
        <AdminPage onLogout={handleLogout} colors={colors} data={data} setData={setData} />
      )}
    </div>
  );
};

export default App;
