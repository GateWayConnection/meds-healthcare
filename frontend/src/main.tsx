
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeDemoData } from './utils/demoData'
import { initializeChatData } from './utils/chatData'

// Initialize demo data
initializeDemoData();

// Initialize chat data
initializeChatData();

createRoot(document.getElementById("root")!).render(<App />);
