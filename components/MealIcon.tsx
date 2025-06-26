
import React from 'react';

interface MealIconProps {
  mealName: string;
}

const MealIcon: React.FC<MealIconProps> = ({ mealName }) => {
  const lowerCaseName = mealName.toLowerCase();

  const ShakeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const FishIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5s-2.5-1.5-5-1.5S3 5 3 5v14s2.5-1.5 5-1.5 5 1.5 5 1.5V5z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5c2.5-1.5 5-1.5 5-1.5s2.5 1.5 2.5 1.5v14s-2.5-1.5-5-1.5-5 1.5-5 1.5"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01"/>
    </svg>
  );

  const MeatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
    </svg>
  );
  
  const ChickenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 10.5v2.625c0 .399.303.75.706.75h1.288c.403 0 .706-.351.706-.75V10.5m-2.7 4.875c-.399.303-.75.706-.75 1.288v1.288c0 .403.351.706.75.706h2.7c.403 0 .75-.303.75-.706v-1.288c0-.582-.351-1.012-.75-1.288m-2.7-4.875A2.625 2.625 0 0112 7.875a2.625 2.625 0 012.625 2.625m-5.25 0v2.625c0 .399.303.75.706.75h1.288c.403 0 .706-.351.706-.75V10.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.966 8.966 0 003.766-1.066 8.966 8.966 0 003.766-2.934 8.966 8.966 0 001.067-3.766A8.966 8.966 0 0021 12a8.966 8.966 0 00-1.067-3.766 8.966 8.966 0 00-2.934-3.766 8.966 8.966 0 00-3.766-1.067A8.966 8.966 0 0012 3a8.966 8.966 0 00-3.766 1.067 8.966 8.966 0 00-3.766 2.934 8.966 8.966 0 00-1.067 3.766A8.966 8.966 0 003 12a8.966 8.966 0 001.067 3.766 8.966 8.966 0 002.934 3.766 8.966 8.966 0 003.766 1.067A8.966 8.966 0 0012 21z" />
    </svg>
  );

  const EggIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  );

  const BurgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15.75c0-1.423.56-2.734 1.465-3.688A4.5 4.5 0 019 10.5h6a4.5 4.5 0 014.035 1.562A4.5 4.5 0 0121 15.75v3.75a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-3.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5v-3.75a3.375 3.375 0 013.375-3.375h5.25A3.375 3.375 0 0118 6.75v3.75" />
    </svg>
  );


  const DefaultIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
  
  const getIcon = () => {
    if (lowerCaseName.includes('batido')) {
      return <ShakeIcon />;
    }
    if (lowerCaseName.includes('salmón') || lowerCaseName.includes('pescado') || lowerCaseName.includes('sardinas') || lowerCaseName.includes('merluza') || lowerCaseName.includes('lubina') || lowerCaseName.includes('dorada')) {
      return <FishIcon />;
    }
    if (lowerCaseName.includes('bistec') || lowerCaseName.includes('chuletas') || lowerCaseName.includes('carne')) {
        return <MeatIcon />;
    }
    if (lowerCaseName.includes('pollo') || lowerCaseName.includes('pavo')) {
      return <ChickenIcon />;
    }
    if (lowerCaseName.includes('huevos')) {
      return <EggIcon />;
    }
     if (lowerCaseName.includes('hamburguesas')) {
      return <BurgerIcon />;
    }
    return <DefaultIcon />;
  };

  return (
    <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center ring-2 ring-teal-100 flex-shrink-0">
      {getIcon()}
    </div>
  );
};

export default MealIcon;
