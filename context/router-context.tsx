import React, { createContext, useContext, useState } from 'react';

type Route = string;

type RouterContextType = {
  route: Route;
  params: Record<string, any>;
  navigate: (to: Route, params?: Record<string, any>) => void;
};

const RouterContext = createContext<RouterContextType | null>(null);

export function RouterProvider({
  initial,
  children,
}: {
  initial: Route;
  children: React.ReactNode;
}) {
  const [route, setRoute] = useState<Route>(initial);
  const [params, setParams] = useState<Record<string, any>>({});

  const navigate = (to: Route, params?: Record<string, any>) => {
    setRoute(to);
    setParams(params || {});
  };

  return (
    <RouterContext.Provider value={{ route, params, navigate }}>{children}</RouterContext.Provider>
  );
}

export function useMiniRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useMiniRouter must be used inside RouterProvider');
  return ctx;
}
