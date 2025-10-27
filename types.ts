export interface PersonalData {
  'Name': string;
  'title': string;
  'Nationality': string;
  'Date of Birth': string;
  'Gender': 'Male' | 'Female' | 'Other';
  'Marital Status': string;
  'profile_picture_url': string;
}

export interface ContactInfo {
  'Mobile': string;
  'Email': string;
  'Location': string;
}

export interface PortfolioData {
  personal: PersonalData;
  contact_info: ContactInfo;
  socials: Record<string, string>;
  experience_log: string[];
  education: string[];
  languages: string[];
  skills_list: Record<string, string[]>;
  resume_base64?: string;
}

export interface OutputLine {
  type: 'input' | 'output';
  content: React.ReactNode;
}

export interface Customization {
  outline: string;
  text: string;
  link: string;
  accent: string;
}