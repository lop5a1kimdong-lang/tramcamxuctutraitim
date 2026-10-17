import React from 'react';

// 3D Emotion Character: Vui vẻ (3D Glossy Sunny Clay)
export const HappyAvatar: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* 3D Sun Sphere Gradient */}
      <radialGradient id="sun3d" cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="25%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </radialGradient>
      {/* 3D Ray Gradient */}
      <linearGradient id="ray3d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      {/* Cheek Blush */}
      <radialGradient id="blush3d" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
      </radialGradient>
      {/* Drop shadow filter */}
      <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#D97706" floodOpacity="0.35" />
      </filter>
    </defs>

    {/* 3D Rotating Golden Rays */}
    <g className="animate-[spin_25s_linear_infinite]" style={{ transformOrigin: '60px 60px' }}>
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <rect
          key={i}
          x="55"
          y="4"
          width="10"
          height="14"
          rx="5"
          fill="url(#ray3d)"
          transform={`rotate(${angle} 60 60)`}
          filter="drop-shadow(0 2px 3px rgba(217,119,6,0.3))"
        />
      ))}
    </g>

    {/* Main 3D Sphere Body */}
    <circle cx="60" cy="60" r="44" fill="url(#sun3d)" filter="url(#shadow3d)" />

    {/* Top-left Specular Gloss Highlight */}
    <ellipse cx="44" cy="36" rx="16" ry="9" fill="white" opacity="0.45" transform="rotate(-30 44 36)" />
    <circle cx="34" cy="32" r="3.5" fill="white" opacity="0.8" />

    {/* 3D Curved Friendly Eyes */}
    <path d="M42 53C42 47 50 47 50 53" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M70 53C70 47 78 47 78 53" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />

    {/* Cheerful 3D Cheeks */}
    <circle cx="38" cy="63" r="8" fill="url(#blush3d)" />
    <circle cx="82" cy="63" r="8" fill="url(#blush3d)" />

    {/* 3D Big Open Smile with Tongue */}
    <path d="M47 62C47 77 73 77 73 62Z" fill="#991B1B" />
    <path d="M47 62C47 77 73 77 73 62" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* Tongue */}
    <path d="M53 71C56 66 64 66 67 71C64 74 56 74 53 71Z" fill="#F43F5E" />
    {/* White Teeth Rim */}
    <path d="M51 63C54 65 66 65 69 63" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 3D Emotion Character: Buồn bã (3D Water Droplet Crystal)
export const SadAvatar: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sad3d" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="30%" stopColor="#7DD3FC" />
        <stop offset="75%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </radialGradient>
      <linearGradient id="tearGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
    </defs>

    {/* 3D Teardrop Body */}
    <path
      d="M60 14C60 14 22 52 22 75C22 96 39 110 60 110C81 110 98 96 98 75C98 52 60 14 60 14Z"
      fill="url(#sad3d)"
      filter="drop-shadow(0 10px 14px rgba(2, 132, 199, 0.35))"
    />

    {/* Specular curved reflection on surface */}
    <path
      d="M40 50C32 62 34 82 42 90"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
      opacity="0.55"
    />
    <circle cx="50" cy="30" r="3.5" fill="white" opacity="0.75" />

    {/* Sad Downward Eyebrows */}
    <path d="M42 56L53 62" stroke="#0C4A6E" strokeWidth="4" strokeLinecap="round" />
    <path d="M78 56L67 62" stroke="#0C4A6E" strokeWidth="4" strokeLinecap="round" />

    {/* Glistening Sad Eyes */}
    <circle cx="48" cy="68" r="5" fill="#0C4A6E" />
    <circle cx="50" cy="66" r="2" fill="white" />
    <circle cx="72" cy="68" r="5" fill="#0C4A6E" />
    <circle cx="74" cy="66" r="2" fill="white" />

    {/* Soft Cheeks */}
    <ellipse cx="38" cy="76" rx="6" ry="3.5" fill="#BAE6FD" opacity="0.8" />
    <ellipse cx="82" cy="76" rx="6" ry="3.5" fill="#BAE6FD" opacity="0.8" />

    {/* Sad Wobbly Pout */}
    <path d="M51 86C55 81 65 81 69 86" stroke="#0C4A6E" strokeWidth="4" strokeLinecap="round" fill="none" />

    {/* 3D Shiny Tear falling */}
    <g transform="translate(76, 75)">
      <path
        d="M6 0C6 0 0 8 0 12C0 15.3 2.7 18 6 18C9.3 18 12 15.3 12 12C12 8 6 0 6 0Z"
        fill="url(#tearGlow)"
        filter="drop-shadow(0 2px 4px rgba(14, 165, 233, 0.4))"
      />
      <circle cx="4.5" cy="10" r="1.5" fill="white" opacity="0.9" />
    </g>
  </svg>
);

// 3D Emotion Character: Lo lắng (3D Marshmallow Lavender)
export const WorriedAvatar: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="worried3d" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F5F3FF" />
        <stop offset="25%" stopColor="#DDD6FE" />
        <stop offset="70%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6D28D9" />
      </radialGradient>
    </defs>

    {/* 3D Rounded Squishy Body */}
    <rect
      x="16"
      y="22"
      width="88"
      height="82"
      rx="38"
      fill="url(#worried3d)"
      filter="drop-shadow(0 10px 16px rgba(109, 40, 217, 0.35))"
    />

    {/* Top Highlight sheen */}
    <ellipse cx="45" cy="35" rx="20" ry="8" fill="white" opacity="0.45" />

    {/* Cute spiral top antenna */}
    <path d="M60 22C60 14 66 10 71 11C75 12 76 15 74 18" stroke="#4C1D95" strokeWidth="4" strokeLinecap="round" />

    {/* Slanted Worried Eyebrows */}
    <path d="M38 50L51 55" stroke="#2E1065" strokeWidth="4" strokeLinecap="round" />
    <path d="M82 50L69 55" stroke="#2E1065" strokeWidth="4" strokeLinecap="round" />

    {/* Big Worried Eyes */}
    <circle cx="45" cy="63" r="6" fill="#2E1065" />
    <circle cx="47.5" cy="61" r="2.5" fill="white" />
    <circle cx="75" cy="63" r="6" fill="#2E1065" />
    <circle cx="77.5" cy="61" r="2.5" fill="white" />

    {/* Lavender Blush */}
    <ellipse cx="33" cy="71" rx="6" ry="4" fill="#C4B5FD" />
    <ellipse cx="87" cy="71" rx="6" ry="4" fill="#C4B5FD" />

    {/* Wobbly wavy mouth */}
    <path d="M48 78Q54 73 60 78Q66 83 72 78" stroke="#2E1065" strokeWidth="4" strokeLinecap="round" fill="none" />

    {/* Sweat drop on forehead */}
    <path d="M96 42C96 42 100 46 100 49C100 51.2 98.2 53 96 53C93.8 53 92 51.2 92 49C92 46 96 42 96 42Z" fill="#A78BFA" />
  </svg>
);

// 3D Emotion Character: Tức giận (3D Bouncing Coral Orb)
export const AngryAvatar: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="angry3d" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFF1F2" />
        <stop offset="25%" stopColor="#FDA4AF" />
        <stop offset="70%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </radialGradient>
    </defs>

    {/* Steam puffs */}
    <path d="M22 28C22 22 27 20 30 20" stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M98 28C98 22 93 20 90 20" stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" />

    {/* 3D Volumetric Red Orb */}
    <circle cx="60" cy="64" r="44" fill="url(#angry3d)" filter="drop-shadow(0 10px 16px rgba(225, 29, 72, 0.4))" />

    {/* Highlight sheen */}
    <ellipse cx="44" cy="40" rx="16" ry="8" fill="white" opacity="0.4" transform="rotate(-20 44 40)" />

    {/* Angry V-shaped Eyebrows */}
    <path d="M36 53L53 59" stroke="#4C0519" strokeWidth="5" strokeLinecap="round" />
    <path d="M84 53L67 59" stroke="#4C0519" strokeWidth="5" strokeLinecap="round" />

    {/* Fierce Eyes */}
    <circle cx="45" cy="66" r="5" fill="#4C0519" />
    <circle cx="75" cy="66" r="5" fill="#4C0519" />

    {/* Flushed red cheeks */}
    <ellipse cx="32" cy="73" rx="7" ry="4.5" fill="#FB7185" />
    <ellipse cx="88" cy="73" rx="7" ry="4.5" fill="#FB7185" />

    {/* Pouting Puffed Mouth */}
    <path d="M50 82C55 76 65 76 70 82" stroke="#4C0519" strokeWidth="4.5" strokeLinecap="round" fill="#881337" />
  </svg>
);

// 3D Emotion Character: Khó nói thành lời (3D Mint Translucent Bubble)
export const ShyAvatar: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="shy3d" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F0FDFA" />
        <stop offset="30%" stopColor="#5EEAD4" />
        <stop offset="75%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#115E59" />
      </radialGradient>
    </defs>

    {/* 3D Mint Sphere */}
    <circle cx="60" cy="62" r="44" fill="url(#shy3d)" filter="drop-shadow(0 10px 16px rgba(13, 148, 136, 0.35))" />

    {/* Top Glass highlight */}
    <ellipse cx="44" cy="38" rx="16" ry="8" fill="white" opacity="0.5" transform="rotate(-25 44 38)" />

    {/* 3D Glossy Speech Bubble with dots */}
    <g transform="translate(74, 18)">
      <rect x="0" y="0" width="40" height="26" rx="10" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
      <path d="M8 26L2 32L12 26Z" fill="white" />
      <circle cx="11" cy="13" r="3" fill="#0D9488" />
      <circle cx="20" cy="13" r="3" fill="#0D9488" />
      <circle cx="29" cy="13" r="3" fill="#0D9488" />
    </g>

    {/* Shy Soft Eyes */}
    <circle cx="46" cy="62" r="5" fill="#042F2E" />
    <circle cx="48" cy="60" r="1.8" fill="white" />
    <circle cx="74" cy="62" r="5" fill="#042F2E" />
    <circle cx="76" cy="60" r="1.8" fill="white" />

    {/* Peach Blush */}
    <ellipse cx="36" cy="70" rx="6" ry="4" fill="#99F6E4" />
    <ellipse cx="84" cy="70" rx="6" ry="4" fill="#99F6E4" />

    {/* Quiet gentle smile */}
    <path d="M54 74C58 77 62 77 66 74" stroke="#042F2E" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

// 3D Giant Warm Heart with Kids & Rainbow Hero Illustration
export const HeroKidsHuggingHeart: React.FC<{ className?: string }> = ({ className = 'w-full max-w-md h-auto' }) => (
  <svg viewBox="0 0 480 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* 3D Heart Gradient */}
      <radialGradient id="heart3d" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFF1F2" />
        <stop offset="25%" stopColor="#FB7185" />
        <stop offset="70%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </radialGradient>
      {/* Rainbow Gradients */}
      <linearGradient id="rainbow1" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="35%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#67E8F9" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>
    </defs>

    {/* 3D Rainbow Arch in background */}
    <path
      d="M80 250C80 130 380 130 380 250"
      stroke="url(#rainbow1)"
      strokeWidth="24"
      strokeLinecap="round"
      opacity="0.5"
    />
    <path
      d="M100 250C100 150 360 150 360 250"
      stroke="white"
      strokeWidth="10"
      strokeLinecap="round"
      opacity="0.4"
    />

    {/* Floating 3D Clouds */}
    <g opacity="0.85" className="animate-[bounce_6s_ease-in-out_infinite]">
      <rect x="40" y="80" width="70" height="34" rx="17" fill="white" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.06))" />
      <circle cx="65" cy="75" r="22" fill="white" />
      <circle cx="85" cy="80" r="16" fill="white" />
    </g>

    <g opacity="0.8" className="animate-[bounce_7s_ease-in-out_infinite_1s]">
      <rect x="360" y="70" width="65" height="30" rx="15" fill="white" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.06))" />
      <circle cx="385" cy="65" r="18" fill="white" />
      <circle cx="405" cy="70" r="14" fill="white" />
    </g>

    {/* Golden Sparkles */}
    <path d="M50 50L53 58L61 61L53 64L50 72L47 64L39 61L47 58Z" fill="#FBBF24" />
    <path d="M430 45L432 51L438 53L432 55L430 61L428 55L422 53L428 51Z" fill="#F472B6" />
    <circle cx="120" cy="95" r="3" fill="#FDE047" />
    <circle cx="340" cy="105" r="4" fill="#38BDF8" />

    {/* 3D SCULPTED GIANT HEART IN CENTER */}
    <g filter="drop-shadow(0 18px 30px rgba(225, 29, 72, 0.45))">
      <path
        d="M240 250C190 215 130 170 130 115C130 75 162 48 200 48C222 48 235 60 240 65C245 60 258 48 280 48C318 48 350 75 350 115C350 170 290 215 240 250Z"
        fill="url(#heart3d)"
      />
      {/* 3D Gloss Highlight on Heart */}
      <path
        d="M175 75C155 90 150 115 155 135"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="180" cy="72" r="4" fill="white" opacity="0.8" />

      {/* Heart Smiling Face */}
      <ellipse cx="210" cy="122" rx="9" ry="5.5" fill="#FB7185" opacity="0.75" />
      <ellipse cx="270" cy="122" rx="9" ry="5.5" fill="#FB7185" opacity="0.75" />
      <path d="M202 110C202 103 214 103 214 110" stroke="#881337" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M266 110C266 103 278 103 278 110" stroke="#881337" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M228 126C234 134 246 134 252 126" stroke="#881337" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>

    {/* BOY ON LEFT (3D Clothing & Hugging Arm) */}
    <g>
      {/* Backpack */}
      <rect x="70" y="125" width="34" height="52" rx="12" fill="#0284C7" transform="rotate(-12 70 125)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
      {/* Body */}
      <path d="M95 150C95 125 140 125 160 142L175 190C165 208 120 208 95 190Z" fill="#38BDF8" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.1))" />
      {/* Arm reaching over heart */}
      <path d="M150 152C175 154 205 160 220 178C214 186 195 184 178 172Z" fill="#FED7AA" />
      <circle cx="218" cy="180" r="8" fill="#FED7AA" />

      {/* Boy Head */}
      <circle cx="128" cy="100" r="27" fill="#FED7AA" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))" />
      {/* Dark brown hair */}
      <path d="M101 98C101 74 120 66 140 70C156 74 158 90 156 100C152 90 145 87 136 89C127 91 122 84 114 88C108 92 106 97 101 98Z" fill="#3E2723" />
      {/* Cheeks */}
      <ellipse cx="116" cy="106" rx="6" ry="3.5" fill="#F87171" opacity="0.75" />
      <ellipse cx="142" cy="106" rx="6" ry="3.5" fill="#F87171" opacity="0.75" />
      {/* Eyes */}
      <path d="M113 96C113 91 120 91 120 96" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M136 96C136 91 143 91 143 96" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" />
      {/* Smile */}
      <path d="M121 107C125 116 135 116 139 107" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" fill="#DC2626" />
    </g>

    {/* GIRL ON RIGHT */}
    <g>
      {/* Body (Yellow dress) */}
      <path d="M385 150C385 125 340 125 320 142L305 190C315 208 360 208 385 190Z" fill="#FBBF24" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.1))" />
      {/* Arm reaching over heart */}
      <path d="M330 152C305 154 275 160 260 178C266 186 285 184 302 172Z" fill="#FED7AA" />
      <circle cx="262" cy="180" r="8" fill="#FED7AA" />

      {/* Girl Head */}
      <circle cx="352" cy="100" r="27" fill="#FED7AA" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))" />
      {/* Girl Hair with Pigtails */}
      <path d="M324 100C324 73 355 66 377 73C383 82 383 95 381 104C374 91 366 87 358 91C349 87 340 91 333 96Z" fill="#3E2723" />
      <circle cx="382" cy="95" r="7" fill="#F43F5E" />
      <ellipse cx="390" cy="106" rx="8" ry="16" fill="#3E2723" transform="rotate(22 390 106)" />
      {/* Cheeks */}
      <ellipse cx="340" cy="106" rx="6" ry="3.5" fill="#F87171" opacity="0.75" />
      <ellipse cx="366" cy="106" rx="6" ry="3.5" fill="#F87171" opacity="0.75" />
      {/* Eyes */}
      <path d="M337 96C337 91 344 91 344 96" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M360 96C360 91 367 91 367 96" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" />
      {/* Smile */}
      <path d="M345 107C349 116 359 116 363 107" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" fill="#DC2626" />
    </g>
  </svg>
);

// 3D Isometric School Building
export const SchoolBuilding: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="roof3d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
      <linearGradient id="wall3d" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF9C3" />
        <stop offset="100%" stopColor="#FDE047" />
      </linearGradient>
    </defs>

    {/* Shadow base */}
    <ellipse cx="80" cy="120" rx="65" ry="8" fill="#CBD5E1" opacity="0.6" />

    {/* Main Building Body */}
    <rect x="25" y="60" width="110" height="55" rx="8" fill="url(#wall3d)" stroke="#F59E0B" strokeWidth="2.5" />
    {/* 3D Roof */}
    <polygon points="15,62 80,26 145,62" fill="url(#roof3d)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />

    {/* Clock Tower Center */}
    <rect x="66" y="24" width="28" height="36" fill="#FDE047" stroke="#F59E0B" strokeWidth="2.5" />
    <polygon points="61,24 80,6 99,24" fill="#EF4444" />
    {/* Flag */}
    <line x1="80" y1="6" x2="80" y2="0" stroke="#64748B" strokeWidth="2" />
    <polygon points="80,0 92,3.5 80,7" fill="#F43F5E" />

    {/* Clock */}
    <circle cx="80" cy="40" r="9" fill="white" stroke="#64748B" strokeWidth="2" />
    <line x1="80" y1="40" x2="80" y2="34" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <line x1="80" y1="40" x2="85" y2="40" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

    {/* Windows */}
    <rect x="38" y="72" width="16" height="20" rx="3" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
    <rect x="106" y="72" width="16" height="20" rx="3" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />

    {/* Door */}
    <path d="M71 115V88C71 83 89 83 89 88V115H71Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />

    {/* School Tag Badge */}
    <rect x="32" y="100" width="96" height="15" rx="7.5" fill="#E11D48" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
    <text x="80" y="111" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="900" fontFamily="Nunito, sans-serif">
      Trường học hạnh phúc
    </text>
  </svg>
);

// Sidebar Cute Kids Mascot with Heart & Flowers (Matching mockup bottom-left card)
export const SidebarKidsWithHeart: React.FC<{ className?: string }> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 160 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sidebarHeart" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFF1F2" />
        <stop offset="25%" stopColor="#FB7185" />
        <stop offset="75%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </radialGradient>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Soft Glow & Clouds */}
    <circle cx="80" cy="55" r="50" fill="url(#sunGlow)" />
    <circle cx="25" cy="30" r="3" fill="#FBBF24" opacity="0.8" />
    <circle cx="135" cy="25" r="2.5" fill="#F472B6" opacity="0.8" />
    <path d="M15 45L17 50L22 52L17 54L15 59L13 54L8 52L13 50Z" fill="#FBBF24" opacity="0.7" />

    {/* Big Pink Heart in Center */}
    <g filter="drop-shadow(0 6px 12px rgba(225, 29, 72, 0.35))">
      <path
        d="M80 88C60 72 35 55 35 36C35 21 47 11 62 11C70 11 76 15 80 18C84 15 90 11 98 11C113 11 125 21 125 36C125 55 100 72 80 88Z"
        fill="url(#sidebarHeart)"
      />
      {/* Heart highlight */}
      <path d="M52 24C46 29 44 38 46 45" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <circle cx="53" cy="22" r="2" fill="white" opacity="0.8" />
      {/* Heart Smile */}
      <circle cx="68" cy="42" r="3" fill="#881337" />
      <circle cx="92" cy="42" r="3" fill="#881337" />
      <path d="M75 48C77 52 83 52 85 48" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="63" cy="45" rx="3.5" ry="2" fill="#FB7185" />
      <ellipse cx="97" cy="45" rx="3.5" ry="2" fill="#FB7185" />
    </g>

    {/* Boy on Left */}
    <g>
      <rect x="18" y="45" width="14" height="22" rx="5" fill="#0284C7" transform="rotate(-15 18 45)" />
      <path d="M25 56C25 45 44 45 52 52L58 72C52 78 35 78 25 72Z" fill="#38BDF8" />
      <circle cx="40" cy="35" r="14" fill="#FED7AA" />
      <path d="M26 34C26 21 36 17 46 19C54 21 55 29 54 35C52 30 48 29 44 30C39 31 37 28 33 30C30 32 29 34 26 34Z" fill="#3E2723" />
      <circle cx="34" cy="33" r="2" fill="#3E2723" />
      <circle cx="44" cy="33" r="2" fill="#3E2723" />
      <ellipse cx="32" cy="37" rx="3" ry="1.8" fill="#F87171" opacity="0.8" />
      <ellipse cx="46" cy="37" rx="3" ry="1.8" fill="#F87171" opacity="0.8" />
      <path d="M37 38C38 42 42 42 43 38" stroke="#3E2723" strokeWidth="1.8" strokeLinecap="round" />
      {/* Arm hugging heart */}
      <path d="M48 56C58 57 70 60 76 68" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
    </g>

    {/* Girl on Right */}
    <g>
      <path d="M135 56C135 45 116 45 108 52L102 72C108 78 125 78 135 72Z" fill="#FBBF24" />
      <circle cx="120" cy="35" r="14" fill="#FED7AA" />
      <path d="M106 35C106 21 122 17 133 21C136 26 136 32 135 37C131 30 127 28 123 30C118 28 114 30 110 33Z" fill="#3E2723" />
      <circle cx="134" cy="33" r="4" fill="#F43F5E" />
      <ellipse cx="138" cy="38" rx="4" ry="8" fill="#3E2723" transform="rotate(20 138 38)" />
      <circle cx="114" cy="33" r="2" fill="#3E2723" />
      <circle cx="124" cy="33" r="2" fill="#3E2723" />
      <ellipse cx="112" cy="37" rx="3" ry="1.8" fill="#F87171" opacity="0.8" />
      <ellipse cx="126" cy="37" rx="3" ry="1.8" fill="#F87171" opacity="0.8" />
      <path d="M117 38C118 42 122 42 123 38" stroke="#3E2723" strokeWidth="1.8" strokeLinecap="round" />
      {/* Arm hugging heart */}
      <path d="M112 56C102 57 90 60 84 68" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
    </g>

    {/* Flowers & Leaves at Bottom */}
    <g>
      <path d="M10 115Q80 98 150 115" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
      {/* Daisies */}
      <circle cx="30" cy="100" r="5" fill="#FBBF24" />
      <circle cx="30" cy="100" r="3" fill="#EA580C" />
      <circle cx="65" cy="103" r="6" fill="#F43F5E" />
      <circle cx="65" cy="103" r="3" fill="#FDE047" />
      <circle cx="95" cy="103" r="6" fill="#38BDF8" />
      <circle cx="95" cy="103" r="3" fill="#FDE047" />
      <circle cx="130" cy="100" r="5" fill="#A855F7" />
      <circle cx="130" cy="100" r="3" fill="#FDE047" />
    </g>
  </svg>
);
