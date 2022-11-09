import React, { createContext, useContext, useReducer } from "react";

export type AppState = {
  selectedMarket: string | undefined;
};

export type TitleState = {
  title: string | undefined;
};

export type StateAction = {
  type: string;
  payload?: any;
};

export type TitleAction = {
  type: string;
  payload?: any;
};

export type AppContextValue = {
  state: AppState;
  titleState: TitleState;
  dispatch: (arg0: StateAction) => void;
  titleDispatch: (arg0: TitleAction) => void;
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

const titleInitialState = {
  title: undefined,
};

const titleReducer = (state: TitleState, action: TitleAction) => {
  switch (action.type) {
    case "PORTFOLIO":
      console.log("PORTFOLIO", action.payload);
    case "TRADE":
      console.log("TRADE", action.payload);
    case "STAKE":
      console.log("STAKE", action.payload);
    case "GUIDE":
      console.log("GUIDE", action.payload);
    default:
      throw new Error();
  }
};

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [titleState, titleDispatch] = useReducer(
    titleReducer,
    titleInitialState
  );

  return (
    <AppContext.Provider value={{ state, dispatch, titleState, titleDispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  return useContext(AppContext);
};
