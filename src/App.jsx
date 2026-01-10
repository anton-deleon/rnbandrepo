import Home from './views/Home';
import Editor from './views/Editor';
import { useState } from 'react';

function App() {
  const [editing, setEditing] = useState(false);
  return editing ? <Editor setEditing={setEditing} /> : <Home setEditing={setEditing} />;
}

export default App;