import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hooks'
import { Loader } from '../../components/Loader/Loader'
import './Accessories.css';
import { Collections } from '../../components/Collections/Collections';

function Accessories() {
  const [items, setItems] = useState([]);
  const { loading, request } = useHttp();
  let fetched;
  const fetchItems = useCallback(async () => {
    try {
      fetched = await request('/api/link/accessories', 'GET', null);
      setItems(fetched);
    } catch (e) { }
  }, [request]);

  useEffect(() => {
    fetchItems()
  }, [fetchItems]);

  if (loading) {
    return <div className='empty-collection'><Loader /></div>
  }

  return (
    <div className='collection-cont'>
      {!loading && <Collections items={items} />}
    </div>
  );
}

export default Accessories;