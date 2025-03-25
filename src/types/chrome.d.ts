
// Chrome extension API type definitions
declare namespace chrome {
  export namespace tabs {
    export function query(queryInfo: {active: boolean, currentWindow: boolean}, callback: (tabs: chrome.tabs.Tab[]) => void): void;
    export function sendMessage(tabId: number, message: any, callback?: (response: any) => void): void;
  }
  
  export namespace runtime {
    export function onMessage(listener: (message: any, sender: any, sendResponse: (response?: any) => void) => void | boolean): void;
    export function onMessage(listener: (message: any, sender: any, sendResponse: (response?: any) => void) => void | boolean): void;
    export function sendMessage(message: any, callback?: (response: any) => void): void;
    export const lastError: chrome.runtime.LastError | undefined;
    
    export interface LastError {
      message?: string;
    }
  }
  
  export namespace scripting {
    export function executeScript<T>(details: {target: {tabId: number}, function: () => T}, callback: (results: {result: T}[]) => void): void;
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
