import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@orcaai/provider-name/v1';

type ProviderContextValue = {
  providerName: string;
  setProviderName: (name: string) => void;
  isLoading: boolean;
};

const ProviderContext = createContext<ProviderContextValue | undefined>(undefined);

/**
 * Nome do prestador — o único dado de "perfil" que existe no MVP.
 * Guardado localmente só para o PDF e o texto de WhatsApp terem um
 * cabeçalho com quem está mandando o orçamento; sem cadastro, sem tela própria.
 */
export function ProviderProvider({ children }: { children: React.ReactNode }) {
  const [providerName, setProviderNameState] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!active) return;
      setProviderNameState(stored ?? '');
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const setProviderName = (name: string) => {
    const trimmed = name.trim();
    setProviderNameState(trimmed);
    void AsyncStorage.setItem(STORAGE_KEY, trimmed);
  };

  return (
    <ProviderContext.Provider value={{ providerName, setProviderName, isLoading }}>
      {children}
    </ProviderContext.Provider>
  );
}

export function useProvider(): ProviderContextValue {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider precisa estar dentro de <ProviderProvider>.');
  }
  return context;
}
