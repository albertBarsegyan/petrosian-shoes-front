import React, { useState, useContext, useEffect } from 'react';
import FilesUpload from './FilesUpload';
import { UploadPic } from './FileUpload';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hooks';
import { useHistory } from 'react-router';
import './itemDetail.css'

export const ItemEdit = ({ item }) => {
  const history = useHistory();
  const { token } = useContext(AuthContext);
  const { request } = useHttp();

  const collection = [];
  item.collectionImg.forEach((el, i) => {
    collection.push(<p>Collection {i + 1}: <img alt='Other' height='300' src={process.env.PUBLIC_URL + `/upload/${item.shortId}/${el}`} /></p>)
  });

  const [type, setType] = useState(item.type);
  const [amd, setAmd] = useState(item.prices[0]);
  const [usd, setUsd] = useState(item.prices[1]);
  const [eur, setEur] = useState(item.prices[2]);
  const [rub, setRub] = useState(item.prices[3]);
  const [description, setDescription] = useState(item.description);
  const [detailList, setDetailList] = useState(item.detailList);
  const [avatarImg, setAvatarImg] = useState(item.avatarImg);
  const [hoverImg, setHoverImg] = useState(item.hoverImg);
  const [collectionImg, setCollectionImg] = useState(item.collectionImg);
  const [collectionType, setCollectionType] = useState(item.collectionType);
  const [name, setName] = useState(item.name);
  const [summer, setSummer] = useState(collectionType.indexOf('Spring / Summer') > -1 ? true : false);
  const [autumn, setAutumn] = useState(collectionType.indexOf('Autumn / Winter') > -1 ? true : false);
  const [sizeArr, setSizeArr] = useState(item.sizes);
  const [sizeRange1, setSizeRange1] = useState(Number.parseInt(item.sizes[0].split(' ')[0]));
  const [sizeRange2, setSizeRange2] = useState(Number.parseInt(item.sizes[item.sizes.length - 1].split(' ')[0]));
  const [sizeArrBool, setSizeArrBool] = useState(false);
  const [existingSizeArr, setExistingSizeArr] = useState(item.existingSizes);
  const [carousel, setCarousel] = useState(item.carousel);

  useEffect(() => {
    if (item.sizes.length !== 0) {
      setSizeArr(item.sizes);
      setSizeRange1(Number.parseInt(item.sizes[0].split(' ')[0]));
      setSizeRange2(Number.parseInt(item.sizes[item.sizes.length - 1].split(' ')[0]));
      setExistingSizeArr(item.existingSizes);
      setSizeArrBool(true);
    }
  })
  //collection type
  const handleCheckbox = id => {
    let array = collectionType;
    let index = array.indexOf(id);

    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(id);
    }

    setCollectionType(array);
  }

  const chageDetailListComponent = (e, i) => {
    let arr = detailList;
    arr[i] = e.target.value;
    setDetailList(arr);
  };

  const submitHandler = async event => {
    if (!(amd || usd || eur || rub) || !collectionType.length) {
      return alert('Please fill required values');
    }
    if (!hoverImg) {
      setHoverImg(avatarImg);
    }

    let arrDetailList = [];
    detailList.map(el => {
      if (el !== '') {
        arrDetailList.push(el);
      }
      return 1;
    });

    try {
      let form = {
        type,
        prices: [amd, usd, eur, rub],
        description,
        arrDetailList,
        shortId: item.shortId,
        avatarImg,
        hoverImg,
        collectionImg,
        name,
        collectionType,
        sizeArr,
        existingSizeArr,
        carousel
      };

      const data = await request('/api/link/edit', 'POST', form, {
        Authorization: `Bearer ${token}`
      });
      alert('Successfully changed');
      history.push(`/detailAdmin/${data.it.shortId}`);
    } catch (e) {
      alert(e.message)
    }
  };

  function generateSizeArr() {
    let arr = [];
    if (sizeRange1 > sizeRange2) {
      alert('Wrong sizes');
      return;
    }

    for (let i = sizeRange1; i <= sizeRange2; i += 1) {
      arr.push(`${i} EU / ${Number(i - 30).toString()} US`);
    }

    if (arr !== []) {
      setSizeArrBool(true);
      setSizeArr(arr);
      item.sizes = arr;
    }
  }

  function setExistingEl(el) {
    let arr = existingSizeArr;
    let i = arr.indexOf(el);

    if (i === -1) {
      arr.push(el);
    } else {
      arr.splice(i, 1);
    }
    setExistingSizeArr(arr);
  }

  return (
    <div className='detail-admin'>
      <p><strong>ShortId</strong></p>
      <p>{item.shortId}</p>

      <p><strong>Views</strong></p>
      <p>{item.views || 0}</p>

      <p><strong>Added date</strong></p>
      <p>{item.date}</p>

      <div className="input-field">
        <label htmlFor="type"><strong>Select type</strong>:</label>
        <select id="type" name="type" value={type} onChange={e => setType(e.target.value)}>
          <option value="Man">Man</option>
          <option value="Woman">Woman</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      <div className='price-inputs'>
        <div className='column'>
          <div className="input-field">
            <label htmlFor="priceAMD"><strong>AMD</strong></label>
            <input
              placeholder="AMD"
              id="priceAMD"
              type="number"
              value={amd}
              onChange={e => setAmd(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="priceUSD"><strong>USD</strong></label>
            <input
              placeholder="USD"
              id="priceUSD"
              type="number"
              value={usd}
              onChange={e => setUsd(e.target.value)}
            />
          </div>
        </div>
        <div className='column'>
          <div className="input-field">
            <label htmlFor="priceEUR"><strong>EUR</strong></label>
            <input
              placeholder="EUR"
              id="priceEUR"
              type="number"
              value={eur}
              onChange={e => setEur(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="priceRUB"><strong>RUB</strong></label>
            <input
              placeholder="RUB"
              id="priceRUB"
              type="number"
              value={rub}

              onChange={e => setRub(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="input-field">
        <label htmlor='collectionType' ><strong>Season*</strong></label>
        <div className='collectionType' name='collectionType'>
          <label className="checkbox-container">Spring / Summer
            <input type="checkbox" checked={summer} onClick={() => { setSummer(!summer) }} onChange={() => handleCheckbox('Spring / Summer')} />
            <span className="checkmark"></span>
          </label>
          <label className="checkbox-container">Autumn / Winter
            <input type="checkbox" checked={autumn} onClick={() => { setAutumn(!autumn) }} onChange={() => handleCheckbox('Autumn / Winter')} />
            <span className="checkmark"></span>
          </label>
        </div>
      </div>

      <div className="input-field">
        <div style={{ width: '20%', margin: '0' }}>
          <label htmlFor="description"><strong>Details</strong></label>
          <button style={{ margin: '20px' }} onClick={() => { setDetailList(detailList.concat('')) }}>+</button>
        </div>
        <div style={{ width: '100%' }}>
          {
            detailList.map((el, i) => {
              return (<input
                id={`detailList${i}`}
                type="text"
                onChange={e => { chageDetailListComponent(e, i) }}
                defaultValue={detailList[i]}
              />)
            })
          }
        </div>
      </div>

      <div className="input-field">
        <label htmlFor="description"><strong>Description</strong></label>
        <input
          placeholder="Description.."
          id="description"
          type="text"
          defaultValue={item.description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="input-field">
        <label htmlFor="name"><strong>Name</strong></label>
        <input
          placeholder="Name.."
          id="name"
          type="text"
          defaultValue={item.name}
          onChange={e => setName(e.target.value)}
        />
      </div>


      <div className="input-field">
        <label><strong>Pick range</strong></label>
        <div className='range-row'>

          <input type='number' defaultValue={sizeRange1} onChange={e => setSizeRange1(Number.parseInt(e.target.value))} />
          <input type='number' defaultValue={sizeRange2} onChange={e => setSizeRange2(Number.parseInt(e.target.value))} />
          <button className='generate-size-btn' onClick={() => { generateSizeArr() }}>Generate</button>
        </div>
      </div>

      {sizeArrBool &&
        <div className='sizeArr-check'>
          {
            sizeArr.map((el, i) => {
              let check = existingSizeArr.find(el_ => el_ === el) ? true : false;
              return (
                <div className="checkbox-container" key={i}>
                  <input defaultChecked={check} id={i} onClick={() => setExistingEl(el)} type="checkbox" />
                  <label className="checkmark" htmlFor={i}></label>
                  <label className='size-label' htmlFor={i}>{el}</label>
                </div>
              )
            })
          }
        </div>
      }

      <hr className='admin-hr' />

      <div className="input-field">
        <div className='collectionType' name='carousel'>
          <label className="checkbox-container">Add to carousel
            <input defaultChecked={carousel} type="checkbox" onChange={() => setCarousel(!carousel)} />
            <span className="checkmark"></span>
          </label>
        </div>
      </div>

      <div className='ipf-row-cp'>
        <div className="input-field">
          <label htmlFor='avatar'>Avatar*</label>
          <UploadPic item={{ shortId: item.shortId, type: 'avatar', setAvatarImg }} />
        </div>
        <div className="input-field">
          <label htmlFor='hover'>On hover</label>
          <UploadPic item={{ shortId: item.shortId, type: 'hover', setHoverImg }} />
        </div>
      </div>

      <div className="input-field">
        <label htmlFor='collection'>Collection</label>
        <FilesUpload setImgs={setCollectionImg} id={item.shortId} type='collection' />
      </div>

      <div className='admin-edit-but-cont'>
        <input type='submit' onClick={submitHandler} />
      </div>
    </div>
  )
}