import { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const showMessage = (title, messageText, type = 'info') => {
    setMessage({ title, message: messageText, type });
  };

  const hideMessage = () => {
    setMessage(null);
  };

  return (
    <MessageContext.Provider value={{ message, showMessage, hideMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
