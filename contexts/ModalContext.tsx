import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isSuccessModalVisible: boolean;
  setSuccessModalVisible: (visible: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  return (
    <ModalContext.Provider value={{ isSuccessModalVisible, setSuccessModalVisible }}>
      {children}
    </ModalContext.Provider>
  );
};
