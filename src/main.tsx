// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from '@/components/ui/provider';
import './index.css';
import App from './App.tsx';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface PasswordCredentialData {
    id: string;
    name?: string;
    iconURL?: string;
    password: string;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface PasswordCredentialConstructor extends Credential {
    new (passwordCredentialData: PasswordCredentialData): PasswordCredential;
    new (htmlFormElement: HTMLFormElement): PasswordCredential;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface PasswordCredential extends Credential {
    readonly iconURL: string;
    readonly password: string;
    readonly name: string;
  }

  const PasswordCredential: PasswordCredentialConstructor;

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-unused-vars
  interface Window {
    PasswordCredential: PasswordCredentialConstructor;
  }

  interface CredentialContainer {
    get(options?: {
      password?: boolean;
      unmediated?: boolean;
      federated?: {
        providers?: string[];
        protocols?: string[];
      };
    }): Promise<Credential>;
    store(credential: Credential): Promise<Credential>;
    requireUserMediation(): Promise<void>;
  }

  interface Navigator {
    credentials?: CredentialContainer;
  }

  interface Credential {
    readonly iconURL: string;
    readonly id: string;
    readonly name: string;
    readonly type: 'password' | 'federated';
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
);
