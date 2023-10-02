import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hooks'
import { AuthContext } from '../../context/AuthContext'
import { ItemList } from '../../components/Admin/ItemList'

export const LinksPage = () => {
  const [items, setItems] = useState([])
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext)

  const fetchItems = useCallback(async () => {
    try {
      const fetched = await request('/api/link', 'GET', null);
      setItems(fetched);
    } catch (e) { }
  }, [token, request])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  if (loading) {
    return <div></div>
  }

  return (
    <div>
      {!loading && <ItemList links={items} />}
    </div>
  )
}
