import React, { createContext, useContext, useReducer } from "react";

export type AppState = {
  selectedMarket: string | undefined;
};

export type StateAction = {
  type: string;
  payload?: any;
};

export type AppContextValue = {
  state: AppState;
  dispatch: (arg0: StateAction) => void;
};

export const AppContext = createContext<AppContextValue>({} as AppContextValue);

export type AppStateProviderProps = {
  children: React.ReactNode;
};

const initialState = {
  selectedMarket: undefined,
};

const reducer = (state: AppState, action: StateAction) => {
  switch (action.type) {
    case "CHANGE_MARKET":
      return { ...state, selectedMarket: action.payload };
    default:
      throw new Error();
  }
};

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  return useContext(AppContext);
};
