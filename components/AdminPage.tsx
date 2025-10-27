import React, { useState, useEffect, useRef } from 'react';
import type { Customization, PortfolioData } from '../types';

interface AdminPageProps {
  onLogout: () => void;
  colors: Customization;
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData>>;
}

const AdminPage: React.FC<AdminPageProps> = ({ onLogout, colors, data, setData }) => {
  const [editedData, setEditedData] = useState<PortfolioData>(JSON.parse(JSON.stringify(data)));
  const [isDragging, setIsDragging] = useState(false);
  const [newSkills, setNewSkills] = useState<Record<string, string>>({});
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sync local state if the original data changes externally
    setEditedData(JSON.parse(JSON.stringify(data)));
  }, [data]);


  const focusStyle = {
    '--tw-ring-color': colors.outline,
  } as React.CSSProperties;

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditedData(prevData => ({
          ...prevData,
          personal: { ...prevData.personal, 'profile_picture_url': base64String },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeFileChange = (file: File | null) => {
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditedData(prevData => ({ ...prevData, resume_base64: base64String }));
        setResumeFileName(file.name);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid PDF file for the resume.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleDataChange = (
    section: 'personal' | 'contact_info',
    field: string,
    value: string
  ) => {
    setEditedData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleAddSkill = (category: string) => {
    const skillToAdd = newSkills[category]?.trim();
    if (skillToAdd) {
      setEditedData(prev => ({
        ...prev,
        skills_list: {
          ...prev.skills_list,
          [category]: [...prev.skills_list[category], skillToAdd],
        },
      }));
      setNewSkills(prev => ({ ...prev, [category]: '' }));
    }
  };

  const handleRemoveSkill = (category: string, skillToRemove: string) => {
    setEditedData(prev => ({
      ...prev,
      skills_list: {
        ...prev.skills_list,
        [category]: prev.skills_list[category].filter(s => s !== skillToRemove),
      },
    }));
  };

  const handleApply = () => {
    setData(editedData); // Update live view immediately
    const codeString = `const initialPortfolioData: PortfolioData = ${JSON.stringify(editedData, null, 2)};`;
    setGeneratedCode(codeString);
    setShowCodeModal(true);
  };
  
  const handleCancel = () => {
    onLogout(); // Close without saving
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      alert('Code copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
      alert('Failed to copy code.');
    });
  };

  const renderSectionInputs = (section: 'personal' | 'contact_info') => (
    <div className="space-y-4">
      {Object.entries(editedData[section])
        .filter(([key]) => key !== 'profile_picture_url')
        .map(([key, value]) => (
          <div key={key}>
            <label htmlFor={key} className="block mb-1 text-sm font-semibold capitalize" style={{ color: colors.text }}>{key}</label>
            <input
              type="text"
              id={key}
              name={key}
              value={value as string}
              onChange={(e) => handleDataChange(section, key, e.target.value)}
              className="w-full bg-gray-800 border rounded px-3 py-2 focus:outline-none focus:ring-2 placeholder:text-gray-500"
              style={{ borderColor: colors.outline, ...focusStyle }}
            />
          </div>
        ))}
    </div>
  );
  
  return (
    <>
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
        <div
          className="bg-gray-900 rounded-lg p-6 w-full max-w-6xl border-2 my-8 flex flex-col"
          style={{ borderColor: colors.outline, color: colors.text, maxHeight: '95vh' }}
        >
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h1 className="text-3xl font-bold" style={{ color: colors.accent }}>Super Admin Panel</h1>
          </div>
          <div className="border-t-2 opacity-50 mb-6 flex-shrink-0" style={{ borderColor: colors.outline }}></div>
          
          <div className="flex-grow overflow-y-auto pr-4 -mr-4">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4" style={{ color: colors.link }}>Profile Picture</h2>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={e => handleFileChange(e.target.files?.[0] ?? null)} accept="image/*" />
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'bg-gray-700/50' : ''}`}
                    style={{ borderColor: colors.outline }}
                  >
                    <p>Drag & drop an image here</p>
                    <p className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>or click to select a file</p>
                  </div>
                </div>
                 <div>
                  <h2 className="text-xl font-bold mb-4" style={{ color: colors.link }}>Resume (PDF)</h2>
                  <input type="file" ref={resumeInputRef} className="hidden" onChange={e => handleResumeFileChange(e.target.files?.[0] ?? null)} accept="application/pdf" />
                  <button
                    onClick={() => resumeInputRef.current?.click()}
                    className="w-full bg-blue-500/50 hover:bg-blue-500/75 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                  >
                    Upload New Resume
                  </button>
                  {resumeFileName && <p className="text-center mt-2 text-sm" style={{color: colors.link}}>File selected: {resumeFileName}</p>}
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-4" style={{ color: colors.link }}>Personal Details</h2>
                  {renderSectionInputs('personal')}
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-4" style={{ color: colors.link }}>Contact Info</h2>
                  {renderSectionInputs('contact_info')}
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h2 className="text-xl font-bold mb-4" style={{ color: colors.link }}>Skills Editor</h2>
                <div className="space-y-6">
                  {Object.entries(editedData.skills_list).map(([category, skills]) => (
                    <div key={category}>
                      <h3 className="font-semibold capitalize mb-2">{category}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {skills.map(skill => (
                          <span key={skill} className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                            {skill}
                            <button onClick={() => handleRemoveSkill(category, skill)} className="ml-2 text-red-400 hover:text-red-600 font-bold">
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSkills[category] || ''}
                          onChange={e => setNewSkills(prev => ({ ...prev, [category]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && handleAddSkill(category)}
                          placeholder="Add new skill..."
                          className="flex-grow bg-gray-800 border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-500"
                          style={{ borderColor: colors.outline, ...focusStyle }}
                        />
                        <button onClick={() => handleAddSkill(category)} className="bg-green-500/50 hover:bg-green-500/75 text-white font-bold py-1 px-3 rounded text-sm">Add</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 opacity-50 mt-6 pt-6 flex justify-end gap-4 flex-shrink-0" style={{ borderColor: colors.outline }}>
            <button
                onClick={handleCancel}
                className="bg-gray-500/50 hover:bg-gray-500/75 text-white font-bold py-2 px-6 rounded transition-colors duration-300"
            >
                Cancel
            </button>
            <button
                onClick={handleApply}
                className="bg-green-500/50 hover:bg-green-500/75 text-white font-bold py-2 px-6 rounded transition-colors duration-300"
            >
                Apply Changes
            </button>
          </div>
        </div>
      </div>
      
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
           <div className="bg-gray-900 rounded-lg w-full max-w-2xl border-2 flex flex-col" style={{ borderColor: colors.outline, color: colors.text, maxHeight: '80vh' }}>
                <div className="p-4 border-b-2" style={{ borderColor: colors.outline, opacity: 0.5 }}>
                    <h2 className="text-xl font-bold" style={{ color: colors.accent }}>Update Your Code</h2>
                    <p className="text-sm mt-1" style={{color: colors.link}}>To make your changes permanent, replace the `initialPortfolioData` object in your `App.tsx` file with the code below.</p>
                </div>
                <pre className="p-4 overflow-auto flex-grow text-xs bg-black/30">
                    <code>
                        {generatedCode}
                    </code>
                </pre>
                <div className="p-4 border-t-2 flex justify-between items-center" style={{ borderColor: colors.outline, opacity: 0.5 }}>
                    <button onClick={handleCopyToClipboard} className="bg-blue-500/50 hover:bg-blue-500/75 text-white font-bold py-2 px-4 rounded">
                        Copy Code
                    </button>
                    <button onClick={onLogout} className="text-white hover:opacity-80 font-bold py-2 px-4 rounded">
                        Close
                    </button>
                </div>
           </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;