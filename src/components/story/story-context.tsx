import { createContext, useContext } from "react";

export type StoryState = {
  started: boolean;
  soundOn: boolean;
};

export const StoryContext = createContext<StoryState>({ started: false, soundOn: false });

export const useStory = () => useContext(StoryContext);
