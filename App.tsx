import React, { useState, useEffect } from 'react';
import IDCard from './components/IDCard';
import Terminal from './components/Terminal';
import Modal from './components/Modal';
import InterviewForm from './components/InterviewForm';
import AdminPage from './components/AdminPage';
import type { PortfolioData, Customization } from './types';

const initialPortfolioData: PortfolioData = {
  "personal": {
    "Name": "Karthi G",
    "title": "System Administrator",
    "Nationality": "Indian",
    "Date of Birth": "17/06/2000",
    "Gender": "Male",
    "Marital Status": "Single",
    "profile_picture_url": "data:image/jpeg;base64,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..."
  },
  "contact_info": {
    "Mobile": "+91-9361191640",
    "Email": "gkarthi.ui@gmail.com",
    "Location": "Mayiladuthurai, Tamil Nadu, India"
  },
  "socials": {
    "LinkedIn": "https://www.linkedin.com/in/karthi-g17/",
    "Naukri": "https://www.naukri.com/mnjuser/profile?id=&altresid"
  },
  "experience_log": [
    "System Administrator, GS-sysnet, Bangalore, Karnataka (May 2024 - Present)",
    "- Provided IT support for 1000+ users, resolving hardware, software, and network issues with a 95% first-call resolution rate.",
    "- Troubleshot and resolved hardware, software, and network issues for end-users via phone, email, or in-person.",
    "- Installed and configured operating systems on new and existing hardware.",
    "- Managed and maintained the company’s IT infrastructure, including monitoring network performance and implementing improvements.",
    "- Set up and maintained network and local printers to ensure seamless functionality.",
    "- Assisted in the setup and configuration of new hardware and software.",
    "- Provided technical support and training to staff, enhancing their IT proficiency."
  ],
  "education": [
    "WebDevelopment Internship - Sai Techno Solution, Coimbatore (2023)",
    "Post Graduate Diploma in Computer Applications (PGDCA) - Guru Computers, Kuthalam (2022)",
    "Bachelor’s Degree in Chemistry - Bharathidasan University, Trichy (2017-2020)"
  ],
  "languages": [
    "Tamil (Native)",
    "English (Professional Working Proficiency)"
  ],
  "skills_list": {
    "Networking & Protocols": ["TCP/IP", "DNS", "DHCP", "VPN", "LAN/WAN", "OSI Model"],
    "System Administration": ["OS Installation (Windows/Linux, including server OS)", "Hardware/Software Installation & Troubleshooting"],
    "Technical Support": ["End-user Training", "Problem-solving", "Issue Escalation", "Outlook Configuration & MS-Office Problem Solving"],
    "Tools & Platforms": ["CRM Software", "Ticketing Systems", "Remote Troubleshooting Tools"],
    "Microsoft 365": ["Configuration and Management"],
    "Printers": ["Printer Configuration & Troubleshooting"],
    "Cloud Computing": ["Basic AWS Knowledge (EC2, S3, IAM)", "Understanding of Cloud Computing Principles"],
    "Camera Installation": ["Installation & Configuration"]
  }
};

const initialCustomization: Customization = {
  theme: 'dark',
  accentColor: '#4ade80',
  showAnimations: true,
};

function App() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [customization, setCustomization] = useState<Customization>(initialCustomization);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showInterview, setShowInterview] = useState(false);

  useEffect(() => {
    // Future: load from API or localStorage
  }, []);

  return (
    <div className={`app theme-${customization.theme}`}>
      <IDCard personal={data.personal} socials={data.socials} />
      <Terminal experience={data.experience_log} skills={data.skills_list} education={data.education} languages={data.languages} />

      <div className="controls">
        <button onClick={() => setShowAdmin(true)}>Open Admin</button>
        <button onClick={() => setShowInterview(true)}>Open Interview Form</button>
      </div>

      {showAdmin && (
        <Modal onClose={() => setShowAdmin(false)} title="Admin Panel">
          <AdminPage data={data} onUpdate={setData} customization={customization} onCustomize={setCustomization} />
        </Modal>
      )}

      {showInterview && (
        <Modal onClose={() => setShowInterview(false)} title="Interview Form">
          <InterviewForm />
        </Modal>
      )}
    </div>
  );
}

export default App;
