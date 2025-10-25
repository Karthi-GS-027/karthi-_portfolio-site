import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PortfolioData, OutputLine, PersonalData, ContactInfo, Customization } from '../types';

interface TerminalProps {
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData>>;
  colors: Customization;
  onCustomize: (target: keyof Customization, color: string) => void;
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


const Terminal: React.FC<TerminalProps> = ({ data, setData, colors, onCustomize }) => {
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
        setHistory(prev => [...prev, { type: 'output', content: 'Success: Profile picture updated.' }]);
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
            <p>To start, try <span className="text-white">'summary'</span>. For all options, type <span className="text-white">'help'</span>.</p>
          </div>
        );
        break;
      
      case 'help':
        output = (
          <div>
            <p className="mb-2">Here are the essential commands to get started:</p>
            <ul className="list-inside grid grid-cols-2 gap-x-4">
              <li><span className="text-white w-28 inline-block">summary</span>- Brief summary.</li>
              <li><span className="text-white w-28 inline-block">about</span>- Personal details.</li>
              <li><span className="text-white w-28 inline-block">skills</span>- Technical skills.</li>
              <li><span className="text-white w-28 inline-block">download</span>- Download resume.</li>
              <li><span className="text-white w-28 inline-block">socials</span>- Social media links.</li>
              <li><span className="text-white w-28 inline-block">experience</span>- Work experience.</li>
              <li><span className="text-white w-28 inline-block">education</span>- Education history.</li>
              <li><span className="text-white w-28 inline-block">contact</span>- Contact info.</li>
            </ul>
            <p className="mt-2">For a full list of all commands, type '<span className="text-white">help me</span>'.</p>
            <p className="mt-1">For detailed instructions, type '<span className="text-white">guide customize</span>'.</p>
          </div>
        );
        break;

      case 'help me':
         output = (
          <div>
            <p className="text-white font-bold">-- Portfolio Commands --</p>
            <ul className="list-inside grid grid-cols-2 gap-x-4 mb-2">
              <li><span className="text-white w-24 inline-block">summary</span>- Brief summary.</li>
              <li><span className="text-white w-24 inline-block">about</span>- Personal details.</li>
              <li><span className="text-white w-24 inline-block">contact</span>- Contact info.</li>
              <li><span className="text-white w-24 inline-block">socials</span>- Social media links.</li>
              <li><span className="text-white w-24 inline-block">experience</span>- Work experience.</li>
              <li><span className="text-white w-24 inline-block">skills</span>- Technical skills.</li>
              <li><span className="text-white w-24 inline-block">education</span>- Education history.</li>
              <li><span className="text-white w-24 inline-block">languages</span>- Known languages.</li>
              <li><span className="text-white w-24 inline-block">download</span>- Download my resume.</li>
            </ul>

            <p className="text-white font-bold">-- Interaction Commands --</p>
            <ul className="list-inside grid grid-cols-2 gap-x-4 mb-2">
               <li><span className="text-white w-24 inline-block">set</span>- Edit ID card data.</li>
               <li><span className="text-white w-24 inline-block">customize</span>- Change UI colors.</li>
               <li><span className="text-white w-24 inline-block">upload</span>- Upload new picture.</li>
               <li><span className="text-white w-24 inline-block">guide</span>- Get command help.</li>
            </ul>
            
            <p className="text-white font-bold">-- System & Utility Commands --</p>
            <ul className="list-inside grid grid-cols-2 gap-x-4">
              <li><span className="text-white w-24 inline-block">whoami</span>- Welcome message.</li>
              <li><span className="text-white w-24 inline-block">ipconfig</span>- Network info.</li>
              <li><span className="text-white w-24 inline-block">hostname</span>- System hostname.</li>
              <li><span className="text-white w-24 inline-block">date</span>- Current date/time.</li>
              <li><span className="text-white w-24 inline-block">echo</span>- Print arguments.</li>
              <li><span className="text-white w-24 inline-block">ping</span>- Ping a host.</li>
              <li><span className="text-white w-24 inline-block">ls</span>- List "files".</li>
              <li><span className="text-white w-24 inline-block">cat</span>- View "file" contents.</li>
              <li><span className="text-white w-24 inline-block">neofetch</span>- System info.</li>
              <li><span className="text-white w-24 inline-block">clear</span>- Clear the screen.</li>
              <li><span className="text-white w-24 inline-block">exit</span>- Sign off.</li>
            </ul>
          </div>
        );
        break;

      case 'summary':
        output = (
          <ul className="list-inside list-disc">
            <li>Email: {data.contact_info.Email}</li>
            <li>Location: {data.contact_info.Location}</li>
            <li>Role: {data.personal.title}</li>
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
                <a href={v} target="_blank" rel="noopener noreferrer" className="underline hover:text-white" style={{color: colors.link}}>{v}</a>
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
              <p key={k}><span className="text-white w-32 inline-block">{k === 'title' ? 'Title' : k}:</span> {v}</p>
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
                <p className="text-white">{category}:</p>
                <p className="pl-4" style={{ color: colors.link }}> * {skills.join(', ')}</p>
              </div>
            ))}
          </div>
        );
        break;
      
      case 'download':
        const link = document.createElement('a');
        link.href = 'data:application/pdf;base64,';
        link.download = 'Karthi-Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        output = "Success: Download initiated for Karthi-Resume.pdf...";
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
            <span className="text-blue-400">projects/</span>
            <span>about.txt</span>
            <span>contact.txt</span>
            <span>resume.pdf</span>
            <span>skills.json</span>
          </div>
        );
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
        
      case 'guide':
        const topic = args[0];
        if (!topic) {
            output = "This command provides detailed instructions for other features. Usage: guide <command>. Try 'guide customize' or 'guide set'.";
        } else if (topic.toLowerCase() === 'customize') {
            output = (
                <div>
                    <p className="text-white font-bold">-- Customization Guide --</p>
                    <p>You can change the color scheme of this portfolio using the 'customize' command.</p>
                    <p className="mt-2">Usage: <span className="text-white">customize &lt;target&gt; &lt;color&gt;</span></p>
                    <p className="mt-2">Targets available:</p>
                    <ul className="list-disc list-inside pl-4">
                        <li><span className="text-white w-20 inline-block">outline:</span> The border color of all elements.</li>
                        <li><span className="text-white w-20 inline-block">text:</span> The main text color.</li>
                        <li><span className="text-white w-20 inline-block">link:</span> The color of links and secondary text.</li>
                        <li><span className="text-white w-20 inline-block">accent:</span> The color for buttons and highlights.</li>
                    </ul>
                    <p className="mt-2">Example:</p>
                    <p className="pl-4"><span className="text-white">customize outline #ff00ff</span> (changes borders to magenta)</p>
                    <p className="pl-4"><span className="text-white">customize text white</span> (changes text to white)</p>
                </div>
            );
        } else if (topic.toLowerCase() === 'set') {
             output = (
                <div>
                    <p className="text-white font-bold">-- Set Data Guide --</p>
                    <p>You can edit the information on the ID card in real-time using the 'set' command.</p>
                    <p className="mt-2">Usage: <span className="text-white">set &lt;field&gt; &lt;new value&gt;</span></p>
                    <p className="mt-2">Fields available:</p>
                    <ul className="list-disc list-inside pl-4">
                         <li>name, title, nationality, dob, gender, status</li>
                         <li>mobile, email, location</li>
                    </ul>
                    <p className="mt-2">Example:</p>
                    <p className="pl-4"><span className="text-white">set title Lead Developer</span></p>
                    <p className="pl-4"><span className="text-white">set name John Doe</span></p>
                </div>
            );
        } else {
            output = `No guide available for '${topic}'. Try 'guide customize' or 'guide set'.`;
        }
        break;

      default:
        switch(command) {
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
              output = `Success: '${field}' updated to '${value}'.`;
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
                    <p>Try this: <span className="text-white block mt-1">{`set ${bestMatch} ${value}`}</span></p>
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
                  <p>Usage: customize &lt;target&gt; &lt;color&gt;</p>
                  <p>Example: customize outline hotpink</p>
                  <p>Available targets: {validTargets.join(', ')}</p>
                  <p>Color can be a name (e.g., red), hex (e.g., #FF0000), or rgb.</p>
                </div>
              );
            } else if (validTargets.includes(target.toLowerCase())) {
              onCustomize(target.toLowerCase() as keyof Customization, color);
              output = `Success: '${target}' color set to '${color}'.`;
            } else {
              output = `Error: Invalid target '${target}'. Available targets: ${validTargets.join(', ')}.`;
            }
            break;

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
            'education', 'languages',
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
                   <p>{`Did you mean: `}<span className="text-white">{suggestion}{remainingArgs ? ' ' + remainingArgs : ''}</span>{`?`}</p>
               </div>
            );
        } else {
            output = `Error: command not found: ${command}. Type 'help' for a list of commands.`;
        }
    }
    
    newHistory.push({ type: 'output', content: output });
    setHistory(prev => [...prev, ...newHistory]);
  }, [data, setData, userName, onCustomize, colors.link]);

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
              <div key={index} className="mb-2" style={{ color: 'white' }}>
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