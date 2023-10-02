import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hooks'
import { Collections } from '../../components/Collections/Collections';

function ManSummer() {
  const [items, setItems] = useState([]);
  const { loading, request } = useHttp();
  let fetched;
  const fetchItems = useCallback(async () => {
    try {
      fetched = await request('/api/link/man/spring-summer', 'GET', null);
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

export default ManSummer;