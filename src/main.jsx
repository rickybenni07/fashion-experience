import { createRoot } from 'react-dom/client';
import { ShopProvider } from './store/ShopContext.jsx';
import App from './App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <ShopProvider>
    <App />
  </ShopProvider>,
);
