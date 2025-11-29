import { useReducer, useEffect } from 'react';

function editorReducer(state, action) {
  switch (action.type) {
    case 'TYPE':
      return { ...state, text: action.payload };
    case 'START_SAVING':
      return { ...state, isSaving: true };
    case 'FINISHED_SAVING':
      return { ...state, isSaving: false, lastSaved: new Date() };
    default:
      return state;
  }
}

export default function AutoSaveReducer() {
  const [state, dispatch] = useReducer(editorReducer, {
    text: '',
    isSaving: false,
    lastSaved: null
  });

  useEffect(() => {
    if (state.text === '') return;
    
    const timeoutId = setTimeout(() => {
      dispatch({ type: 'START_SAVING' });
      fetch('/api/save', { method: 'POST', body: JSON.stringify({ text: state.text }) })
        .then(() => dispatch({ type: 'FINISHED_SAVING' }));
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [state.text]);

  return (
    <div>
      <textarea 
        value={state.text} 
        onChange={e => dispatch({ type: 'TYPE', payload: e.target.value })}
      />
      {state.isSaving && <span>Saving...</span>}
      {state.lastSaved && <span>Last saved: {state.lastSaved.toLocaleTimeString()}</span>}
    </div>
  );
}