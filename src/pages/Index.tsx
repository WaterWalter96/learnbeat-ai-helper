
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import TextSelector from '../components/TextSelector';
import AiResponse from '../components/AiResponse';
import SocialLinks from '../components/SocialLinks';

// Main Page Component
const MainPage: React.FC = () => {
  const [selectedText, setSelectedText] = useState('');
  
  const handleTextSelected = (text: string) => {
    setSelectedText(text);
  };
  
  return (
    <Layout>
      <TextSelector onTextSelected={handleTextSelected} />
      <AiResponse selectedText={selectedText} />
    </Layout>
  );
};

// Social Page Component
const SocialPage: React.FC = () => {
  return (
    <Layout>
      <SocialLinks />
    </Layout>
  );
};

// Index Component with Routes
const Index: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/social" element={<SocialPage />} />
    </Routes>
  );
};

export default Index;
