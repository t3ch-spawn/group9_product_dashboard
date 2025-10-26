import { createContext, useState, useContext } from "react";

// 1️⃣ Create the context
const AppContext = createContext();

// 2️⃣ Provide it
export function AppProvider({ children }) {
  const [updated, setUpdated] = useState(false);
  return (
    <AppContext.Provider value={{ updated, setUpdated }}>
      {children}
    </AppContext.Provider>
  );
}

// 3️⃣ Custom hook (optional but clean)
export function useApp() {
  return useContext(AppContext);
}

export const broadcast = new BroadcastChannel("product_updates");
