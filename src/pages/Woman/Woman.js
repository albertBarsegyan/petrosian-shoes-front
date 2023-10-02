import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hooks'
import './Woman.css';
import { Collections } from '../../components/Collections/Collections';

function Woman() {
  const [items, setItems] = useState([]);
  const { loading, request } = useHttp();

  const fetchItems = useCallback(async () => {
    try {
      let fetched = await request('/api/link/woman', 'GET', null);
      setItems(fetched);
    } catch (e) { }
  }, [request]);

  useEffect(() => {
    fetchItems()
  }, [fetchItems]);

  if (loading) {
    return <div className='empty-collection'></div>
  }

  return (
    <div className='collection-cont'>
      {!loading && <Collections items={items} />}
    </div>
  );
}

export default Woman;