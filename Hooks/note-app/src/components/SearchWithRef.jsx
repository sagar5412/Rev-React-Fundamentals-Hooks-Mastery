import { useState, useEffect, useRef } from 'react';

export default function SearchWithRef() {
  const [search, setSearch] = useState('');
  const prevSearchRef = useRef(''); 

  useEffect(() => {
    if (prevSearchRef.current !== search) {
      console.log('Searching for:', search);
      prevSearchRef.current = search; 
    }
  }, [search]); 

  return <input value={search} onChange={e => setSearch(e.target.value)} />;
}