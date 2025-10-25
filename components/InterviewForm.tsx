import React, { useState } from 'react';

interface InterviewFormProps {
  onSubmit: () => void;
}

const InterviewForm: React.FC<InterviewFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

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

    // This creates a link that opens the user's default email client
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;

    // Triggers the success message in the parent component
    onSubmit();
  };

  return (
    <div className="p-8 text-white w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Interview Invitation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-green-400 mb-1 font-semibold">Your Name</label>
          <input 
            type="text" 
            id="name" 
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
            className="w-full bg-gray-800 border border-green-400/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-500"
            placeholder="e.g., Jane Doe" 
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-green-400 mb-1 font-semibold">Company Name</label>
          <input 
            type="text" 
            id="company" 
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required 
            className="w-full bg-gray-800 border border-green-400/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-500"
            placeholder="e.g., Tech Solutions Inc."
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-green-400 mb-1 font-semibold">Location</label>
          <input 
            type="text" 
            id="location" 
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required 
            className="w-full bg-gray-800 border border-green-400/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-500"
            placeholder="e.g., San Francisco, CA"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-green-400 mb-1 font-semibold">Proposed Date</label>
          <input 
            type="date" 
            id="date" 
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required 
            className="w-full bg-gray-800 border border-green-400/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <button type="submit" className="w-full mt-6 bg-green-500/20 hover:bg-green-500/40 border border-green-500 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
          Send Invitation
        </button>
      </form>
    </div>
  );
};

export default InterviewForm;