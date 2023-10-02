import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hooks'
import './Man.css';
import { Collections } from '../../components/Collections/Collections';

function ManWinter() {
  const [items, setItems] = useState([]);
  const { loading, request } = useHttp();
  const fetchItems = useCallback(async () => {
    try {
      let fetched = await request('/api/link/man/autumn-winter', 'GET', null);
      setItems(fetched);
    } catch (e) { }
  }, [request]);

  useEffect(() => {
    fetchItems()
  }, [fetchItems]);

  if (loading) {
    return <div style={{ marginTop: '150px' }}></div>
  }

  return (
    <div className='collection-cont'>
      {!loading && <Collections items={items} />}
    </div>
  );
}

export default ManWinter;