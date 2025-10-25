import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PortfolioData, OutputLine } from '../types';

interface TerminalProps {
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData>>;
}

const Terminal: React.FC<TerminalProps> = ({ data, setData }) => {
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // For file uploads
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
        setHistory(prev => [...prev, { type: 'output', content: 'Success: Profile picture updated.' }]);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setHistory(prev => [...prev, { type: 'output', content: 'Error: Please select a valid image file.' }]);
    }
    // Reset file input value to allow re-uploading the same file
    if (event.target) {
      event.target.value = '';
    }
  };

  const processCommand = useCallback((commandStr: string) => {
    const newHistory: OutputLine[] = [{ type: 'input', content: `${userName}> ${commandStr}` }];
    const commandParts = commandStr.trim().split(/\s+/);
    const command = commandParts[0].toLowerCase();
    const args = commandParts.slice(1);
    let output: React.ReactNode = `Error: command not found: ${command}. Type 'help' for a list of commands.`;

    switch (command) {
      case 'whoami':
        output = (
          <div>
            <p>Welcome! This is the interactive portfolio of Karthi G.</p>
            <p>To start, try <span className="text-white">'summary'</span>. For all options, type <span className="text-white">'help'</span>.</p>
          </div>
        );
        break;
      
      case 'help':
        output = (
          <ul className="list-inside grid grid-cols-2 gap-x-4">
            <li><span className="text-white w-28 inline-block">summary</span>- Brief summary.</li>
            <li><span className="text-white w-28 inline-block">contact</span>- Contact info.</li>
            <li><span className="text-white w-28 inline-block">socials</span>- Social media links.</li>
            <li><span className="text-white w-28 inline-block">about</span>- Personal details.</li>
            <li><span className="text-white w-28 inline-block">experience</span>- Work experience.</li>
            <li><span className="text-white w-28 inline-block">skills</span>- Technical skills.</li>
            <li><span className="text-white w-28 inline-block">download</span>- Download resume.</li>
            <li><span className="text-white w-28 inline-block">upload</span>- Upload a picture.</li>
            <li><span className="text-white w-28 inline-block">clear</span>- Clear screen.</li>
            <li><span className="text-white w-28 inline-block">whoami</span>- Welcome message.</li>
            <li><span className="text-white w-28 inline-block">ipconfig</span>- Show network info.</li>
            <li><span className="text-white w-28 inline-block">hostname</span>- Display hostname.</li>
            <li><span className="text-white w-28 inline-block">date</span>- Show current date.</li>
            <li><span className="text-white w-28 inline-block">echo</span>- Print arguments.</li>
            <li><span className="text-white w-28 inline-block">ping</span>- Ping a host.</li>
            <li><span className="text-white w-28 inline-block">ls</span>- List files.</li>
            <li><span className="text-white w-28 inline-block">cat</span>- View file contents.</li>
            <li><span className="text-white w-28 inline-block">neofetch</span>- System info.</li>
            <li><span className="text-white w-28 inline-block">exit</span>- Close terminal.</li>
          </ul>
        );
        break;

      case 'summary':
        output = (
          <ul className="list-inside list-disc">
            <li>Email: {data.contact_info.Email}</li>
            <li>Location: {data.contact_info.Location}</li>
            <li>Role: System Administrator</li>
            <li>Type <span className="text-white">'download'</span> to get my full resume.</li>
          </ul>
        );
        break;

      case 'contact':
        output = (
          <div>
            {Object.entries(data.contact_info).map(([k, v]) => (
              <p key={k}><span className="text-white w-20 inline-block">{k}:</span> {v}</p>
            ))}
          </div>
        );
        break;
        
      case 'socials':
        output = (
          <div>
            {Object.entries(data.socials).map(([k, v]) => (
              <p key={k}>
                <span className="text-white w-20 inline-block">{k}:</span> 
                <a href={v} target="_blank" rel="noopener noreferrer" className="text-green-300 underline hover:text-white">{v}</a>
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
              <p key={k}><span className="text-white w-32 inline-block">{k}:</span> {v}</p>
            ))}
          </div>
        );
        break;
      
      case 'exp':
      case 'experience':
        output = (
          <ul className="list-inside list-disc">
            {data.experience_log.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
        break;

      case 'skills':
        output = (
          <div>
            {Object.entries(data.skills_list).map(([category, skills]) => (
              <div key={category} className="mb-1">
                <p className="text-white">{category}:</p>
                <p className="pl-4 text-green-300"> * {skills.join(', ')}</p>
              </div>
            ))}
          </div>
        );
        break;
      
      case 'download':
        const link = document.createElement('a');
        link.href = 'data:application/pdf;base64,'; // Placeholder
        link.download = 'Karthi-Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        output = "Success: Download initiated for Karthi-Resume.pdf...";
        break;

      case 'upload':
        if (args[0]?.toLowerCase() === 'picture') {
          output = (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-500/20 hover:bg-green-500/40 border border-green-500 text-white font-bold py-1 px-3 rounded transition-colors duration-300"
            >
              Choose File...
            </button>
          );
        } else {
          output = `Usage: upload picture`;
        }
        break;
      
      case 'clear':
        setHistory([]);
        return;
        
      // New commands
      case 'ipconfig':
        output = (
          <div>
            <p>Network Interface Card:</p>
            <p className="pl-4">IPv4 Address: 192.168.1.101</p>
            <p className="pl-4">Subnet Mask: 255.255.255.0</p>
            <p className="pl-4">Default Gateway: 192.168.1.1</p>
          </div>
        );
        break;

      case 'hostname':
        output = 'portfolio-server-01';
        break;

      case 'date':
        output = new Date().toLocaleString();
        break;

      case 'echo':
        output = args.join(' ');
        break;

      case 'ping':
        const host = args[0] || 'localhost';
        output = (
          <div>
            <p>Pinging {host} with 32 bytes of data:</p>
            <p>Reply from {host}: bytes=32 time=1ms TTL=128</p>
            <p>Reply from {host}: bytes=32 time=1ms TTL=128</p>
            <p>Reply from {host}: bytes=32 time=1ms TTL=128</p>
          </div>
        );
        break;
        
      case 'ls':
        output = (
          <div className="grid grid-cols-3 gap-x-4">
            <span className="text-blue-400">projects/</span>
            <span>about.txt</span>
            <span>contact.txt</span>
            <span>resume.pdf</span>
            <span>skills.json</span>
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
        
      case 'neofetch':
        output = (
          <pre className="whitespace-pre-wrap">
            {`
   <span class="text-white">${userName}@portfolio</span>
   -----------------
   <span class="text-white">OS:</span> Web Browser
   <span class="text-white">Host:</span> ${window.location.hostname}
   <span class="text-white">Kernel:</span> ReactJS
   <span class="text-white">Uptime:</span> Online
   <span class="text-white">Shell:</span> /bin/portfolio-cmd
   <span class="text-white">CPU:</span> Your Brain
   <span class="text-white">GPU:</span> Your Eyes
   <span class="text-white">Memory:</span> System RAM
            `}
          </pre>
        );
        break;
        
      case 'exit':
        output = 'Thank you for visiting. Have a great day!';
        break;
    }
    
    newHistory.push({ type: 'output', content: output });
    setHistory(prev => [...prev, ...newHistory]);
  }, [data, setData, userName]);

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
      className="w-full bg-black/80 border-2 border-green-400/50 rounded-lg p-4 text-sm flex flex-col h-[30rem]"
      onClick={handleTerminalClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="flex-grow overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {history.map((line, index) => (
          <div key={index} className={line.type === 'input' ? 'text-green-400' : 'text-green-400 mb-2'}>
            {typeof line.content === 'string' ? (
              <span dangerouslySetInnerHTML={{ __html: line.content }} />
            ) : (
              line.content
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <div className="flex items-center mt-2 flex-shrink-0">
        <span className="text-green-400 mr-2">{`${userName}>`}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none text-green-400 w-full focus:outline-none placeholder:text-green-400/60"
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