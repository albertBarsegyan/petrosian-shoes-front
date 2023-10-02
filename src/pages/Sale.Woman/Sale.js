import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hooks'
import { CollectionsWithPrice } from '../../components/Collections/Collections';

function SaleWoman() {

  const [items, setItems] = useState([]);
  const { loading, request } = useHttp();

  let fetchItems = useCallback(async () => {
    try {
      let fetched = await request('/api/link/sale/woman', 'GET', null);
      setItems(fetched);
    } catch (e) { }
  }, [request]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading) {
    return <div style={{ marginTop: '150px' }}></div>
  }

  return (
    <div className='collection-cont'>
      {!loading && <CollectionsWithPrice items={items} />}
    </div>
  );
}

export default SaleWoman;