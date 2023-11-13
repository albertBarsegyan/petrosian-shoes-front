import React, {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useHttp} from "../../hooks/http.hooks";


const PopularContItem = ({item}) => {
  const [img, setImg] = useState(process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.avatarImg}`);

  return (
    <Link className='popular-card' to={`/detail/${item.shortId}`} key={item.shortId}>
      <img
        alt='Avatar'
        src={img}
        onMouseOut={() => {
          setImg(process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.avatarImg}`)
        }}
        onMouseEnter={() => {
          setImg(process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.hoverImg}`)
        }}
      />
      <div className='item-name-coll'><strong>{item.name}</strong></div>
    </Link>
  );
}

function PopularCont({items}) {
  return (
    <div className='popular-card-cont'>
      {items.map(item => <PopularContItem key={item?.id} item={item}/>)}
    </div>
  )
}

export default function Popular() {
  const [items, setItems] = useState([]);
  const {request} = useHttp();


  let fetchItems = useCallback(async () => {
    try {
      let fetched = await request('/api/link/popular', 'GET', null);
      setItems(fetched);
    } catch (e) {
    }
  }, [request]);


  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className='popular-card-cont-wrap'>
      <h1>Most Popular</h1>
      <PopularCont items={items}/>
    </div>
  );
}
