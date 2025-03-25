
// Chrome extension API type definitions
declare namespace chrome {
  export namespace tabs {
    export function query(queryInfo: {active: boolean, currentWindow: boolean}, callback: (tabs: chrome.tabs.Tab[]) => void): void;
    export function sendMessage(tabId: number, message: any, callback?: (response: any) => void): void;
  }
  
  export namespace runtime {
    export function sendMessage(message: any, callback?: (response: any) => void): void;
    export const lastError: chrome.runtime.LastError | undefined;
    
    export interface LastError {
      message?: string;
    }
    
    export interface MessageSender {
      tab?: chrome.tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
    }
    
    export type MessageCallback = (message: any, sender: MessageSender, sendResponse: (response?: any) => void) => void | boolean;
    
    export interface OnMessageEvent {
      addListener(callback: MessageCallback): void;
      removeListener(callback: MessageCallback): void;
      hasListeners(): boolean;
    }
    
    export const onMessage: OnMessageEvent;
  }
  
  export namespace scripting {
    export function executeScript<T>(details: {target: {tabId: number}, function: () => T}, callback: (results: {result: T}[]) => void): void;
  }
  
  export namespace storage {
    export const local: {
      get(keys: string | string[] | Object | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: Object, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
      clear(callback?: () => void): void;
    };
  }
  
  export interface Tab {
    id?: number;
    url?: string;
    title?: string;
    active: boolean;
    incognito: boolean;
    windowId?: number;
  }
}
