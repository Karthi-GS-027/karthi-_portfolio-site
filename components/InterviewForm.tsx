import React, { useState } from 'react';
import { Customization } from '../types';

interface InterviewFormProps {
  onSubmit: () => void;
  colors: Customization;
}

const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const InterviewForm: React.FC<InterviewFormProps> = ({ onSubmit, colors }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const inputStyle = {
    borderColor: colors.outline,
    opacity: 0.5,
  };
  
  const focusStyle = {
    '--tw-ring-color': colors.outline,
  } as React.CSSProperties;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recipient = 'gkarthi.ui@gmail.com';
    const subject = `Interview Invitation from ${company}`;
    const body = `
Hello Karthi,

This is an interview invitation from ${company}.

Here are the details:
- Recruiter Name: ${name}
- Company: ${company}
- Location: ${location}
- Proposed Date: ${date}

Please let me know if this time works for you.

Best regards,
${name}
    `.trim();

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    onSubmit();
  };

  return (
    <div className="p-8 text-white w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Interview Invitation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-semibold" style={{ color: colors.text }}>Your Name</label>
          <input 
            type="text" 
            id="name" 
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
            className="w-full bg-gray-800 border rounded px-3 py-2 focus:outline-none focus:ring-2 placeholder:text-gray-500"
            style={{...inputStyle, ...focusStyle}}
            placeholder="e.g., Jane Doe" 
          />
        </div>
        <div>
          <label htmlFor="company" className="block mb-1 font-semibold" style={{ color: colors.text }}>Company Name</label>
          <input 
            type="text" 
            id="company" 
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required 
            className="w-full bg-gray-800 border rounded px-3 py-2 focus:outline-none focus:ring-2 placeholder:text-gray-500"
            style={{...inputStyle, ...focusStyle}}
            placeholder="e.g., Tech Solutions Inc."
          />
        </div>
        <div>
          <label htmlFor="location" className="block mb-1 font-semibold" style={{ color: colors.text }}>Location</label>
          <input 
            type="text" 
            id="location" 
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required 
            className="w-full bg-gray-800 border rounded px-3 py-2 focus:outline-none focus:ring-2 placeholder:text-gray-500"
            style={{...inputStyle, ...focusStyle}}
            placeholder="e.g., San Francisco, CA"
          />
        </div>
        <div>
          <label htmlFor="date" className="block mb-1 font-semibold" style={{ color: colors.text }}>Proposed Date</label>
          <input 
            type="date" 
            id="date" 
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required 
            className="w-full bg-gray-800 border rounded px-3 py-2 focus:outline-none focus:ring-2"
            style={{ ...inputStyle, ...focusStyle, colorScheme: 'dark' }}
          />
        </div>
        <button 
            type="submit" 
            className="w-full mt-6 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={{
                border: `1px solid ${colors.accent}`,
                backgroundColor: hexToRgba(colors.accent, isButtonHovered ? 0.4 : 0.2),
            }}
        >
          Send Invitation
        </button>
      </form>
    </div>
  );
};

export default InterviewForm;
