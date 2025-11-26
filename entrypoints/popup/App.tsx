import './style.css';
import { Login } from '@pages/login';
import { Home } from '@pages/home';
import { Loading } from '@pages/loading';
import { Settings } from '@pages/settings';
import { Profile } from '@pages/profile';

import { RouterProvider, useMiniRouter } from '@context/router-context';
import { RequiredAuth } from '@guard/require-auth';
import { CreateNote } from '@pages/create-note';
import { ChatProvider } from '@context/chat-context';

// This component contains the main app logic and uses the router
const AppContent: React.FC = () => {
  const { route } = useMiniRouter();

  const renderView = () => {
    switch (route) {
      case 'loading':
        return (
          <RequiredAuth>
            <Loading />
          </RequiredAuth>
        );
      case 'home':
        return (
          <RequiredAuth>
            <Home />
          </RequiredAuth>
        );
      case 'create-note':
        return (
          <RequiredAuth>
            <CreateNote />
          </RequiredAuth>
        );
      case 'settings':
        return (
          <RequiredAuth>
            <Settings />
          </RequiredAuth>
        );
      case 'profile':
        return (
          <RequiredAuth>
            <Profile />
          </RequiredAuth>
        );
      case 'login':
      default:
        return <Login />;
    }
  };

  return renderView();
};

const App: React.FC = () => {
  return (
    <RouterProvider initial="loading">
      <ChatProvider>
        <div className="app-container">
          <div className="app-content">
            <AppContent />
          </div>
        </div>
      </ChatProvider>
    </RouterProvider>
  );
};

export default App;
