import React, { useState, useEffect, useRef } from 'react';
import { FaYoutube, FaInstagram, FaTwitter, FaTiktok, FaTelegram, FaFacebook } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

const socialLinks = [
  { name: 'TikTok', url: 'https://www.tiktok.com/@somosdorci1/', icon: <FaTiktok className="text-gray-900"/>},
  { name: 'Instagram', url: 'https://www.instagram.com/gobierno_falcon/', icon: <FaInstagram className="text-pink-600"/>},
  { name: 'Twitter (X)', url: 'https://twitter.com/SOMOSDORCI', icon: <FaX classname="text-gray-900"/>},
  { name: 'Telegram', url: 'https://t.me/gobernaciondefalcon', icon: <FaTelegram className="text-blue-500"/>},
  { name: 'Facebook', url: 'https://www.facebook.com/people/Dorci-Falc%C3%B3n/100092381717839/', icon: <FaFacebook className="text-blue-700"/>}
];

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-yellow-300 font-medium focus:outline-none"
      >
        Redes Sociales
        <svg className={`ml-1 h-5 w-5 transform transition-transform ${isOpen ? '-rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                role="menuitem"
              >
                <span className="mr-3">{link.icon}</span> 
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}