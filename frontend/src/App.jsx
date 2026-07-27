import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import ChatBot from './components/ChatBot';
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ChatBot />
    </AuthProvider>
  );
}

export default App;
