import React from 'react';

const AboutPage: React.FC = () => {
  // Ensure you return valid JSX from this component
  return (
    <div className="about-container">
      <h1>Om Oss</h1>
      <p>
        Velkommen til vår QnA-plattform! Dette er et fellesskap drevet av nysgjerrighet og et ønske om å dele kunnskap. 
      </p>
      
      <h2>Møt Grunnleggerne</h2>
      <div className="founder-profiles">
        <div className="founder">
          <h3>Valentin</h3>
        </div>

        <div className="founder">
          <h3>Kine</h3>
        </div>

        <div className="founder">
          <h3>Ali</h3>
        </div>

        <div className="founder">
          <h3>Fran</h3>
        </div>
      </div>
    </div>
  );
}


export default AboutPage;
