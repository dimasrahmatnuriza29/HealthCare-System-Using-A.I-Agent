import { useEffect, useState } from 'react';
import ServiceSelection from './components/ServiceSelection.jsx';
import StaffLocator from './components/StaffLocator.jsx';

function getInitialView() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === 'staff' || window.location.hash === '#staff') {
    return 'staff';
  }
  return 'services';
}

function pushViewToUrl(view) {
  const url = new URL(window.location.href);
  if (view === 'staff') {
    url.searchParams.set('view', 'staff');
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

  return <ServiceSelection onOpenStaff={() => navigate('staff')} />;
}
