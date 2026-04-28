import { useEffect, useState } from 'react';
import MasterDataManagement from './components/MasterDataManagement.jsx';
import ServiceSelection from './components/ServiceSelection.jsx';
import ServiceHistoryManagement from './components/ServiceHistoryManagement.jsx';
import StaffLocator from './components/StaffLocator.jsx';
import StockManagement from './components/StockManagement.jsx';

const validViews = new Set(['services', 'staff', 'history', 'master', 'stock']);

function getInitialView() {
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get('view');
  if (validViews.has(viewParam)) {
    return viewParam;
  }
  if (window.location.hash === '#staff') {
    return 'staff';
  }
  return 'services';
}

function pushViewToUrl(view) {
  const url = new URL(window.location.href);
  if (view !== 'services') {
    url.searchParams.set('view', view);
  } else {
    url.searchParams.delete('view');
    url.hash = '';
  }
  window.history.pushState({ view }, '', `${url.pathname}${url.search}${url.hash}`);
}

export default function App() {
  const [view, setView] = useState(getInitialView);

  useEffect(() => {
    const handlePopState = () => setView(getInitialView());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (nextView) => {
    setView(nextView);
    pushViewToUrl(nextView);
  };

  if (view === 'staff') {
    return <StaffLocator onBack={() => navigate('services')} />;
  }

  if (view === 'history') {
    return <ServiceHistoryManagement onBack={() => navigate('services')} />;
  }

  if (view === 'master') {
    return <MasterDataManagement onBack={() => navigate('services')} />;
  }

  if (view === 'stock') {
    return <StockManagement onBack={() => navigate('services')} />;
  }

  return (
    <ServiceSelection
      onOpenStaff={() => navigate('staff')}
      onOpenHistory={() => navigate('history')}
      onOpenMaster={() => navigate('master')}
      onOpenStock={() => navigate('stock')}
    />
  );
}
