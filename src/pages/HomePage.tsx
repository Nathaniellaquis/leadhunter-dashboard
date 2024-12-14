import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

import facebookLogo from '@/graphics/facebook.png';
import instagramLogo from '@/graphics/instagram.png';
import linkedinLogo from '@/graphics/linkedin.png';
import tiktokLogo from '@/graphics/tiktok.svg';
import twitterLogo from '@/graphics/twitter.png';
import youtubeLogo from '@/graphics/youtube.png';
import searchpersonlogo from '@/graphics/SearchPerson.png';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const platforms = [
    { name: 'Person Search', logo: searchpersonlogo, route: '/person-lookup', clickable: false },
    { name: 'Find LinkedIn Emails', logo: linkedinLogo, route: '/platform/linkedin', clickable: true },
    { name: 'Find Facebook Emails', logo: facebookLogo, route: '/platform/facebook', clickable: true },
    { name: 'Find Instagram Emails', logo: instagramLogo, route: '/platform/instagram', clickable: true },
    { name: 'Find Twitter Emails', logo: twitterLogo, route: '/platform/twitter', clickable: true },
    { name: 'Find YouTube Emails', logo: youtubeLogo, route: '/platform/youtube', clickable: true },
    { name: 'Find TikTok Emails', logo: tiktokLogo, route: '/platform/tiktok', clickable: true },
  ];

  const primaryColor = '#01AC1C';

  const filteredPlatforms = platforms.filter((platform) =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-screen min-h-screen bg-white">
      <div className="pt-24 pb-10 px-4 max-w-screen-lg mx-auto">
        <h2 className="text-4xl font-extrabold text-black mb-5 text-center">
          Pick Your Data <span style={{ color: primaryColor }}>Source</span>
        </h2>

        <div className="relative mx-auto mb-5 w-full max-w-md">
          <input
            type="text"
            placeholder="Search your data sources"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:border-gray-400 bg-white text-gray-900"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>

        <div
          className="grid justify-center justify-items-center items-start gap-x-9 gap-y-5 px-0"
          style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 300px))'
          }}
        >
          {filteredPlatforms.map((platform) => (
            <div
              key={platform.name}
              onClick={(e) => {
                if (!platform.clickable) {
                  e.preventDefault();
                  return;
                }
                // Navigate to the platform page
                // For example: /platform/instagram
                // route is already correct, just an example step
                navigate(platform.route);
              }}
              className={`w-[320px] h-[175px] flex flex-col items-center justify-center p-5 rounded-xl bg-gray-100 ${
                platform.clickable ? 'cursor-pointer hover:scale-105 hover:shadow-md' : 'cursor-not-allowed'
              } border border-gray-200 transition-transform transform`}
              style={{
                boxShadow: '0 1px 1px #DFE5F1'
              }}
            >
              <img
                src={platform.logo}
                alt={platform.name}
                className="h-12 w-auto mb-4"
              />
              <h6 className="font-semibold text-base text-gray-800 text-center">{platform.name}</h6>
              {!platform.clickable && (
                <p className="text-sm text-gray-500 mt-1">Coming soon</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
