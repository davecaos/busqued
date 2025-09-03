import { useState } from 'react';

type StateUpdater<T> = Partial<T> | ((prevState: T) => Partial<T>);
type SetState<T> = (updates: StateUpdater<T>) => void;

function useSetStateReducer<T>(initialState: T): [T, SetState<T>] {
  const [state, setState] = useState<T>(initialState);

  const updateState: SetState<T> = (updates) => {
    setState((prev) => {
      const newState = typeof updates === 'function' ? updates(prev) : updates;
      return { ...prev, ...newState };
    });
  };

  return [state, updateState];
}

export default useSetStateReducer;
