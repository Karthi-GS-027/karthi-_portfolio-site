import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PortfolioData, OutputLine, PersonalData, ContactInfo, Customization } from '../types';

interface TerminalProps {
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData>>;
  colors: Customization;
  onCustomize: (target: keyof Customization, color: string) => void;
  onLogin: () => void;
}

const levenshteinDistance = (a: string, b: string): number => {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;

    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(null));

    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,      // Deletion
                dp[i][j - 1] + 1,      // Insertion
                dp[i - 1][j - 1] + cost // Substitution
            );
        }
    }
    return dp[m][n];
};


const Terminal: React.FC<TerminalProps> = ({ data, setData, colors, onCustomize, onLogin }) => {
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userName = data.personal.Name.split(' ')[0];

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setData(prevData => ({
          ...prevData,
          personal: {
            ...prevData.personal,
            'profile_picture_url': base64String,
          },
        }));
        setHistory(prev => [...prev, { type: 'output', content: <div><span style={{ color: colors.text }}>Success:</span> Profile picture updated and saved.</div> }]);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setHistory(prev => [...prev, { type: 'output', content: 'Error: Please select a valid image file.' }]);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const processCommand = useCallback((commandStr: string) => {
    const newHistory: OutputLine[] = [{ type: 'input', content: `${userName}> ${commandStr}` }];
    const commandParts = commandStr.trim().split(/\s+/);
    const command = commandParts[0].toLowerCase();
    const args = commandParts.slice(1);
    let output: React.ReactNode = null;

    let effectiveCommand = command;
    if (command === 'help' && args[0]?.toLowerCase() === 'me') {
      effectiveCommand = 'help me';
    }

    switch (effectiveCommand) {
      case 'karthi':
        output = "That's my name! To see what you can do, type 'help'.";
        break;

      case 'whoami':
        output = (
          <div>
            <p>Welcome! This is the interactive portfolio of {data.personal.Name}.</p>
            <p>To start, try '<span style={{ color: colors.text }}>summary</span>'. For all options, type '<span style={{ color: colors.text }}>help</span>'.</p>
          </div>
        );
        break;
      
      case 'help':
        output = (
          <div>
            <p className="mb-2" style={{ color: colors.text }}>Here are the essential commands to get started:</p>
            <ul className="list-inside grid grid-cols-2 gap-x-4">
              <li><span className="font-semibold w-28 inline-block" style={{ color: colors.text }}>summary</span>- Brief summary.</li>
              <li><span className="font-semibold w-28 inline-block" style={{ color: colors.text }}>about</span>- Personal details.</li>
              <li><span className="font-semibold w-28 inline-block" style={{ color: colors.text }}>skills</span>- Technical skills.</li>
              <li><span className="font-semibold w-28 inline-block" style={{ color: colors.text }}>download</span>- Download resume.</li>
              <li><span className="font-semibold w-28 inline-block" style={{ color: colors.text }}>socials</span>- Social media links.</li>
              <li><span className="font-semibold w-28 inline-block" style={{ color: colors.text }}>experience</span>- Work experience.</li>
              <li><span className="font-semibold w-28 inline-block" style={{ color: colors.text }}>education</span>- Education history.</li>
              <li><span className="font-semibold w-28 inline-block" style={{ color: colors.text }}>contact</span>- Contact info.</li>
            </ul>
            <p className="mt-2">For a full list of all commands, type '<span style={{ color: colors.text }}>help me</span>'.</p>
            <p className="mt-1">For detailed instructions, type '<span style={{ color: colors.text }}>guide customize</span>'.</p>
          </div>
        );
        break;

      case 'help me':
         output = (
          <div>
            <p className="font-bold" style={{ color: colors.text }}>-- Portfolio Commands --</p>
            <ul className="list-inside grid grid-cols-2 gap-x-4 mb-2">
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>summary</span>- Brief summary.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>about</span>- Personal details.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>contact</span>- Contact info.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>socials</span>- Social media links.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>experience</span>- Work experience.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>skills</span>- Technical skills.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>education</span>- Education history.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>languages</span>- Known languages.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>download</span>- Download my resume.</li>
            </ul>

            <p className="font-bold" style={{ color: colors.text }}>-- Interaction Commands --</p>
            <ul className="list-inside grid grid-cols-2 gap-x-4 mb-2">
               <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>set</span>- Edit ID card data.</li>
               <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>customize</span>- Change UI colors.</li>
               <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>upload</span>- Upload new picture.</li>
               <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>reset</span>- Reset portfolio data.</li>
               <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>guide</span>- Get command help.</li>
            </ul>
            
            <p className="font-bold" style={{ color: colors.text }}>-- System & Utility Commands --</p>
            <ul className="list-inside grid grid-cols-2 gap-x-4">
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>whoami</span>- Welcome message.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>ipconfig</span>- Network info.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>hostname</span>- System hostname.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>date</span>- Current date/time.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>echo</span>- Print arguments.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>ping</span>- Ping a host.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>ls</span>- List "files".</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>cat</span>- View "file" contents.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>neofetch</span>- System info.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>clear</span>- Clear the screen.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>login</span>- Access admin panel.</li>
              <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>exit</span>- Sign off.</li>
            </ul>
          </div>
        );
        break;

      case 'summary':
        output = (
          <div>
            <p className="font-bold mb-1" style={{ color: colors.text }}>-- Professional Summary --</p>
            <ul className="list-inside list-disc">
              <li><span className="font-semibold" style={{ color: colors.text }}>Email:</span> {data.contact_info.Email}</li>
              <li><span className="font-semibold" style={{ color: colors.text }}>Location:</span> {data.contact_info.Location}</li>
              <li><span className="font-semibold" style={{ color: colors.text }}>Role:</span> {data.personal.title}</li>
              <li style={{ color: colors.text }}>Type 'download' to get my full resume.</li>
            </ul>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div>
            {Object.entries(data.contact_info).map(([k, v]) => (
              <p key={k}><span className="font-semibold w-20 inline-block" style={{ color: colors.text }}>{k}:</span> {v}</p>
            ))}
          </div>
        );
        break;
        
      case 'socials':
        output = (
          <div>
            {Object.entries(data.socials).map(([k, v]) => (
              <p key={k}>
                <span className="font-semibold w-20 inline-block" style={{ color: colors.text }}>{k}:</span> 
                <a href={v} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80" style={{ color: colors.link }}>{v}</a>
              </p>
            ))}
          </div>
        );
        break;

      case 'about':
        output = (
          <div>
            {Object.entries(data.personal)
              .filter(([key]) => key !== 'profile_picture_url')
              .map(([k, v]) => (
              <p key={k}><span className="font-semibold w-32 inline-block" style={{ color: colors.text }}>{k === 'title' ? 'Title' : k}:</span> {v}</p>
            ))}
          </div>
        );
        break;
      
      case 'exp':
      case 'experience':
        output = (
          <ul className="list-inside list-disc">
            {data.experience_log.map((item, i) => <li key={i}>{item.startsWith('-') ? <span className="ml-4">{item}</span> : <span className="font-semibold" style={{ color: colors.text }}>{item}</span>}</li>)}
          </ul>
        );
        break;

      case 'education':
        output = (
          <ul className="list-inside list-disc">
            {data.education.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
        break;

      case 'languages':
        output = (
          <ul className="list-inside list-disc">
            {data.languages.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
        break;

      case 'skills':
        output = (
          <div>
            {Object.entries(data.skills_list).map(([category, skills]) => (
              <div key={category} className="mb-1">
                <p className="font-semibold" style={{ color: colors.text }}>{category}:</p>
                <p className="pl-4"> * {skills.join(', ')}</p>
              </div>
            ))}
          </div>
        );
        break;
      
      case 'download':
        if (data.resume_base64 && data.resume_base64.startsWith('data:application/pdf;base64,')) {
            const link = document.createElement('a');
            link.href = data.resume_base64;
            link.download = 'Karthi-Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            output = <div><span style={{ color: colors.text }}>Success:</span> Download initiated for Karthi-Resume.pdf...</div>;
        } else {
            output = <div><span style={{ color: '#f97316' }}>Warning:</span> No resume has been uploaded. Please use the admin panel to upload a PDF resume.</div>;
        }
        break;
      
      case 'clear':
        setHistory([]);
        return;
        
      case 'hostname':
        output = 'portfolio-server-01';
        break;

      case 'date':
        output = new Date().toLocaleString();
        break;
        
      case 'ls':
        output = (
          <div className="grid grid-cols-3 gap-x-4">
            <span>projects/</span>
            <span>about.txt</span>
            <span>contact.txt</span>
            <span>resume.pdf</span>
            <span>skills.json</span>
          </div>
        );
        break;
        
      case 'neofetch':
        const neofetchLines = [
            `${userName}@portfolio`,
            '-----------------',
            `OS: Web Browser`,
            `Host: ${window.location.hostname}`,
            `Kernel: ReactJS`,
            `Uptime: Online`,
            `Shell: /bin/portfolio-cmd`,
            `CPU: Your Brain`,
            `GPU: Your Eyes`,
            `Memory: System RAM`
        ];
        output = (
            <pre className="whitespace-pre-wrap">
                {neofetchLines.map((line, i) => {
                    if (i === 0) {
                        return <div key={i} style={{ color: colors.text }}>{line}</div>;
                    }
                    const parts = line.split(':');
                    if (parts.length > 1) {
                        return (
                            <div key={i}>
                                <span style={{ color: colors.text }}>{parts[0]}:</span>
                                <span>{parts.slice(1).join(':')}</span>
                            </div>
                        );
                    }
                    return <div key={i}>{line}</div>;
                })}
            </pre>
        );
        break;
        
      case 'exit':
        output = 'Thank you for visiting. Have a great day!';
        break;
        
      case 'login':
        onLogin();
        output = 'Entering Super Admin mode...';
        break;

      case 'guide':
        const topic = args[0];
        if (!topic) {
            output = "This command provides detailed instructions. Usage: guide <command>. Try 'guide customize', 'guide set', 'guide upload', or 'guide reset'.";
        } else if (topic.toLowerCase() === 'customize') {
            output = (
                <div>
                    <p className="font-bold" style={{ color: colors.text }}>-- Customization Guide --</p>
                    <p>Change the portfolio color scheme using the 'customize' command.</p>
                    <p className="mt-2"><span style={{ color: colors.text }}>Usage:</span> <span className="font-semibold" style={{ color: colors.text }}>customize &lt;target&gt; &lt;color&gt;</span></p>
                    <p className="mt-2"><span style={{ color: colors.text }}>Targets:</span></p>
                    <ul className="list-disc list-inside pl-4">
                        <li><span className="font-semibold w-20 inline-block" style={{ color: colors.text }}>outline:</span> The border color.</li>
                        <li><span className="font-semibold w-20 inline-block" style={{ color: colors.text }}>text:</span> The main text color.</li>
                        <li><span className="font-semibold w-20 inline-block" style={{ color: colors.text }}>link:</span> The color of links.</li>
                        <li><span className="font-semibold w-20 inline-block" style={{ color: colors.text }}>accent:</span> The color for highlights.</li>
                    </ul>
                    <p className="mt-2"><span style={{ color: colors.text }}>Example:</span></p>
                    <p className="pl-4"><span className="font-semibold" style={{ color: colors.text }}>customize outline #ff00ff</span></p>
                </div>
            );
        } else if (topic.toLowerCase() === 'set') {
             output = (
                <div>
                    <p className="font-bold" style={{ color: colors.text }}>-- Set Data Guide --</p>
                    <p>Edit ID card information in real-time using the 'set' command.</p>
                    <p className="mt-2"><span style={{ color: colors.text }}>Usage:</span> <span className="font-semibold" style={{ color: colors.text }}>set &lt;field&gt; &lt;new value&gt;</span></p>
                    <p className="mt-2"><span style={{ color: colors.text }}>Fields:</span></p>
                    <ul className="list-disc list-inside pl-4">
                         <li>name, title, nationality, dob, gender, status</li>
                         <li>mobile, email, location</li>
                    </ul>
                    <p className="mt-2"><span style={{ color: colors.text }}>Example:</span></p>
                    <p className="pl-4"><span className="font-semibold" style={{ color: colors.text }}>set title Lead Developer</span></p>
                </div>
            );
        } else if (topic.toLowerCase() === 'upload') {
            output = (
               <div>
                   <p className="font-bold" style={{ color: colors.text }}>-- Upload Guide --</p>
                   <p>Update the ID card profile picture with your own image.</p>
                   <p className="mt-2"><span style={{ color: colors.text }}>Usage:</span> <span className="font-semibold" style={{ color: colors.text }}>upload picture</span></p>
                   <p className="mt-2">This command opens a file dialog. The selected image is saved in your browser and will persist on your next visit.</p>
                   <p className="mt-2"><span style={{ color: colors.text }}>To reset to the default picture, type:</span></p>
                   <p className="pl-4"><span className="font-semibold" style={{ color: colors.text }}>upload reset</span></p>

                   <p className="font-bold mt-4" style={{ color: colors.accent }}>-- For Developers: Changing the Default Picture --</p>
                   <p>To permanently change the default image in the code:</p>
                   <ol className="list-decimal list-inside pl-2 mt-1 space-y-1">
                       <li>
                           <strong>Add your image to the project:</strong> Place your picture in a `public` or `assets/images` folder (e.g., `public/myphoto.jpg`).
                       </li>
                       <li>
                           <strong>Update the code:</strong> Open `App.tsx` and find the `initialPortfolioData` object. Change the `profile_picture_url` value:
                           <pre className="bg-gray-800/50 p-2 rounded mt-1 text-xs whitespace-pre-wrap">{`personal: {
  // ...
  'profile_picture_url': '/myphoto.jpg',
}`}</pre>
                       </li>
                       <li>
                           <strong>(Optional) Use a URL:</strong> You can also use a direct URL from the web.
                           <pre className="bg-gray-800/50 p-2 rounded mt-1 text-xs whitespace-pre-wrap">{`'profile_picture_url': 'https://avatars.githubusercontent.com/u/yourid'`}</pre>
                       </li>
                   </ol>
               </div>
           );
       } else if (topic.toLowerCase() === 'reset') {
            output = (
               <div>
                   <p className="font-bold" style={{ color: colors.text }}>-- Reset Guide --</p>
                   <p>Restore data to its original state.</p>
                   <p className="mt-2"><span style={{ color: colors.text }}>Usage:</span> <span className="font-semibold" style={{ color: colors.text }}>reset &lt;target&gt;</span></p>
                    <p className="mt-2"><span style={{ color: colors.text }}>Targets:</span></p>
                   <ul className="list-disc list-inside pl-4">
                       <li><span className="font-semibold w-24 inline-block" style={{ color: colors.text }}>portfolio:</span> Resets all data (personal info, skills, picture, resume) to the original version and reloads the page.</li>
                   </ul>
                   <p className="mt-2"><strong style={{ color: '#fb923c' }}>Warning: This action cannot be undone.</strong></p>

                   <p className="font-bold mt-2" style={{ color: colors.text }}>Related command:</p>
                   <p className="pl-4">Use '<span className="font-semibold" style={{ color: colors.text }}>upload reset</span>' to only reset the profile picture.</p>
               </div>
           );
       } else {
            output = `No guide available for '${topic}'. Try 'guide customize', 'guide set', 'guide upload', or 'guide reset'.`;
        }
        break;

      case 'reset':
        if (args[0]?.toLowerCase() === 'portfolio') {
          localStorage.removeItem('portfolioData');
          output = 'Portfolio data has been reset. Reloading...';
          setHistory(prev => [...prev, { type: 'input', content: `${userName}> ${commandStr}` }, {type: 'output', content: output}]);
          setTimeout(() => window.location.reload(), 1000);
          return;
        } else {
            output = `Usage: reset portfolio. This will clear all local changes and restore the default portfolio.`
        }
        break;

      default:
        switch(command) {
          case 'upload':
            if (args[0]?.toLowerCase() === 'picture') {
              output = (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ backgroundColor: colors.accent, borderColor: colors.outline }}
                  className="bg-opacity-50 hover:bg-opacity-75 border text-white font-bold py-1 px-3 rounded transition-colors duration-300"
                >
                  Choose File...
                </button>
              );
            } else if (args[0]?.toLowerCase() === 'reset') {
              const defaultPic = './img/karthi.jpeg';
              setData(prevData => ({
                ...prevData,
                personal: {
                  ...prevData.personal,
                  'profile_picture_url': defaultPic,
                },
              }));
              output = <div><span style={{ color: colors.text }}>Success:</span> Profile picture reset to default.</div>;
            } else {
              output = `Usage: upload <picture|reset>`;
            }
            break;
          
          case 'set':
            const [field, ...valueParts] = args;
            const value = valueParts.join(' ');
          
            if (!field || !value) {
              output = 'Usage: set <field> <value>. Example: set title Senior Developer';
              break;
            }
          
            const fieldLower = field.toLowerCase();
            let updated = false;
          
            const personalFieldMap: { [key: string]: keyof PersonalData } = {
              'name': 'Name',
              'title': 'title',
              'nationality': 'Nationality',
              'dob': 'Date of Birth',
              'gender': 'Gender',
              'status': 'Marital Status'
            };
          
            const contactFieldMap: { [key: string]: keyof ContactInfo } = {
              'mobile': 'Mobile',
              'phone': 'Mobile',
              'email': 'Email',
              'location': 'Location'
            };
          
            if (Object.keys(personalFieldMap).includes(fieldLower)) {
              const keyToUpdate = personalFieldMap[fieldLower];
              setData(prev => ({ ...prev, personal: { ...prev.personal, [keyToUpdate]: value } }));
              updated = true;
            } else if (Object.keys(contactFieldMap).includes(fieldLower)) {
              const keyToUpdate = contactFieldMap[fieldLower];
              setData(prev => ({ ...prev, contact_info: { ...prev.contact_info, [keyToUpdate]: value } }));
              updated = true;
            }
          
            if (updated) {
              output = <div><span style={{ color: colors.text }}>Success:</span> {`'${field}' updated to '${value}'.`}</div>;
            } else {
              const validFields = [...Object.keys(personalFieldMap), ...Object.keys(contactFieldMap)];
              let bestMatch: string | null = null;
              let minDistance = 3;

              for (const validField of validFields) {
                const distance = levenshteinDistance(fieldLower, validField);
                if (distance < minDistance) {
                  minDistance = distance;
                  bestMatch = validField;
                }
              }

              if (bestMatch) {
                output = (
                  <div>
                    <p>Error: Invalid field '{field}'.</p>
                    <p><span style={{ color: colors.text }}>Try this:</span> <span className="font-semibold block mt-1" style={{ color: colors.text }}>{`set ${bestMatch} ${value}`}</span></p>
                  </div>
                );
              } else {
                output = `Error: Field '${field}' not found. Available fields: name, title, nationality, dob, gender, status, mobile, email, location.`;
              }
            }
            break;
          
          case 'customize':
            const [target, color] = args;
            const validTargets = ['outline', 'text', 'link', 'accent'];
            if (!target || !color) {
              output = (
                <div>
                  <p><span style={{ color: colors.text }}>Usage:</span> customize &lt;target&gt; &lt;color&gt;</p>
                  <p><span style={{ color: colors.text }}>Example:</span> customize outline hotpink</p>
                  <p><span style={{ color: colors.text }}>Targets:</span> {validTargets.join(', ')}</p>
                  <p>Color can be a name (e.g., red), hex (e.g., #FF0000), or rgb.</p>
                </div>
              );
            } else if (validTargets.includes(target.toLowerCase())) {
              onCustomize(target.toLowerCase() as keyof Customization, color);
              output = <div><span style={{ color: colors.text }}>Success:</span> {`'${target}' color set to '${color}'.`}</div>;
            } else {
              output = `Error: Invalid target '${target}'. Available targets: ${validTargets.join(', ')}.`;
            }
            break;

          case 'ipconfig':
            output = (
              <div>
                <p style={{ color: colors.text }}>Network Interface Card:</p>
                <p className="pl-4">IPv4 Address: 192.168.1.101</p>
                <p className="pl-4">Subnet Mask: 255.255.255.0</p>
                <p className="pl-4">Default Gateway: 192.168.1.1</p>
              </div>
            );
            break;

          case 'echo':
            output = args.join(' ');
            break;

          case 'ping':
            const host = args[0] || 'localhost';
            output = (
              <div>
                <p style={{ color: colors.text }}>Pinging {host} with 32 bytes of data:</p>
                <p>Reply from {host}: bytes=32 time=1ms TTL=128</p>
                <p>Reply from {host}: bytes=32 time=1ms TTL=128</p>
                <p>Reply from {host}: bytes=32 time=1ms TTL=128</p>
              </div>
            );
            break;
            
          case 'cat':
            const fileName = args[0];
            if (!fileName) {
              output = 'Usage: cat [filename]. Try "cat about.txt"';
            } else if (fileName === 'about.txt') {
              processCommand('about');
              return;
            } else if (fileName === 'contact.txt') {
              processCommand('contact');
              return;
            } else {
              output = `cat: ${fileName}: No such file or directory`;
            }
            break;
        }
    }
    
    if (output === null) {
        const ALL_COMMANDS = [
            'help', 'help me', 'summary', 'contact', 'socials', 'about', 'experience', 'exp', 'skills',
            'education', 'languages', 'login', 'reset',
            'set', 'upload', 'download', 'clear', 'whoami', 'ipconfig', 'hostname', 'date',
            'echo', 'ping', 'ls', 'cat', 'neofetch', 'customize', 'exit', 'karthi', 'guide'
        ];
        let suggestion: string | null = null;
        let minDistance = 3; // Threshold: suggest if distance is 1 or 2

        for (const cmd of ALL_COMMANDS) {
            const distance = levenshteinDistance(command, cmd);
            if (distance < minDistance) {
                minDistance = distance;
                suggestion = cmd;
            }
        }
        
        if (suggestion) {
            const remainingArgs = args.join(' ');
            output = (
               <div>
                   <p>{`Error: command not found: ${command}`}</p>
                   <p><span style={{ color: colors.text }}>{`Did you mean: `}</span><span className="font-semibold" style={{ color: colors.text }}>{suggestion}{remainingArgs ? ' ' + remainingArgs : ''}</span>{`?`}</p>
               </div>
            );
        } else {
            output = `Error: command not found: ${command}. Type 'help' for a list of commands.`;
        }
    }
    
    newHistory.push({ type: 'output', content: output });
    setHistory(prev => [...prev, ...newHistory]);
  }, [data, setData, userName, onCustomize, onLogin, colors.text, colors.accent, colors.link]);

  useEffect(() => {
    processCommand('whoami');
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        processCommand(input);
        setInput('');
      }
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className="w-full bg-black/80 rounded-lg p-4 text-sm flex flex-col h-[30rem]"
      style={{
        borderColor: colors.outline,
        borderStyle: 'solid',
        borderWidth: 2,
        color: colors.text
      }}
      onClick={handleTerminalClick}
    >
      <style>{`
        .custom-placeholder::placeholder {
          color: ${colors.text};
          opacity: 0.6;
        }
      `}</style>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="flex-grow overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {history.map((line, index) => {
          const content = typeof line.content === 'string'
            ? <span dangerouslySetInnerHTML={{ __html: line.content }} />
            : line.content;

          if (line.type === 'output') {
            return (
              <div key={index} className="mb-2 text-white">
                {content}
              </div>
            );
          }
          
          return (
            <div key={index}>
              {content}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>
      <div className="flex items-center mt-2 flex-shrink-0">
        <span className="mr-2">{`${userName}>`}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none w-full focus:outline-none custom-placeholder"
          style={{ color: colors.text }}
          autoFocus
          spellCheck="false"
          autoComplete="off"
          placeholder="type help for commands..."
        />
      </div>
    </div>
  );
};

export default Terminal;
