
import React from 'react';

const SocialLinks: React.FC = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/wakkiekak/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@wakkiekak',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
          <path d="m10 15 5-3-5-3z"/>
        </svg>
      ),
    },
    {
      name: 'E-mail',
      url: 'mailto:wakkiekak@gmail.com',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      ),
    },
    {
      name: 'Website',
      url: 'https://wakkiekak.nl',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="glass-card">
      <h2 className="section-title">Contact</h2>
      
      <div className="space-y-6">
        <p className="text-ext-text-light text-sm">
          LearnbeatAI is gemaakt door WakkieKak. Volg ons op sociale media voor meer updates en tools.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-ext-medium/50"
            >
              <div className="text-ext-accent">{link.icon}</div>
              <span>{link.name}</span>
            </a>
          ))}
        </div>
        
        <div className="animated-border mt-6">
          <div className="bg-ext-medium/70 p-4 rounded-xl">
            <h3 className="text-center text-xl font-medium mb-2">Bedankt voor het gebruiken van LearnbeatAI</h3>
            <p className="text-center text-sm text-ext-text-light">
              Gemaakt met ❤️ door WakkieKak
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
