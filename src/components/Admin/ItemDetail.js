import React, { useContext, useState } from 'react';
import './itemDetail.css';
import edit from './edit.png';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hooks';
import { useHistory } from 'react-router';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ItemDetail = ({ item }) => {
  const { token } = useContext(AuthContext);
  const { request } = useHttp();
  const history = useHistory()
  const [carouselImg, setCarouselImg] = useState(item.carouselImg)

  async function deletePhoto(shortId, photo) {
    try {
      await request('/api/link/deletePhoto', 'POST', { shortId, photo }, {
        Authorization: `Bearer ${token}`
      });
      alert('Success!');
      window.location.reload();
    } catch (e) {
      alert(e.message)
    }
  }
  async function removeHandler() {
    try {
      await request('/api/link/delete', 'POST', { shortId: item.shortId }, {
        Authorization: `Bearer ${token}`
      });
      alert("Deleted");
      history.push('/links');
    } catch (e) {
      alert(e.message);
    }
  };

  async function saveCarouselImg() {
    try {
      const data = await request('/api/link/setCarousel', 'POST', { img: carouselImg, shortId: item.shortId }, {
        Authorization: `Bearer ${token}`
      });
      alert(data.message);
      window.location.reload();
    } catch (e) {
      alert(e.message);
    }
  }

  const uploadFile = async (file, type) => {
    const formData = new FormData();
    const newName = item.shortId + '___' + type + '.' + file.name.split('.').pop();
    formData.append('file', file, newName);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.status === 200) {
        alert('File Uploaded');
        window.location.reload();
      }
    } catch (err) {
      if (err.response.status === 500) {
        alert('There was a problem with the server');
      } else {
        // console.log(err.response.data.msg);
      }
    }
  };

  function fileUploadAction(id) {
    document.getElementById(id).click()
  }

  async function handleChangeInputRef(event, type) {
    if (event.target.value) {
      await uploadFile(event.target.files[0], type);
    }
  }

  const collection = [];
  item.collectionImg.forEach((el, i) => {
    collection.push(
      <div className='img-card' key={i}>
        <p>Collection {i + 1}</p>
        <img alt='Other' height='200' src={process.env.PUBLIC_URL + `/upload/${item.shortId}/${el}`} />
        <div className='row'>
          <button className='deletefromCart' name='deletefromCart' onClick={() => { deletePhoto(item.shortId, el) }}></button>
          <button id={`btn_${i}`} className='refresh-btn' onClick={() => fileUploadAction(`inp_${i}`)}></button>
          <input id={`inp_${i}`} onChange={(e) => handleChangeInputRef(e, `collection_${i}`)} multiple={false} type='file' hidden />
        </div>
      </div>)
  });
  return (
    <div className='detail-admin'>
      <h1>{item.name}: {item.shortId}<Link className='admin-edit' to={`/edit/${item.shortId}`}><img src={edit} alt='Edit' title='Edit' /></Link></h1>

      {item.sale && <p><strong className='sale-color'>Sale</strong>: true</p>}
      {item.sale && <React.Fragment><p><strong className='sale-color'>Sale Prices</strong></p><p>{item.newPrices[0]} AMD, {item.newPrices[1]} USD, {item.newPrices[2]} EUR, {item.newPrices[3]} RUB </p></React.Fragment>}



      <div className='admin-detail-img-cont'>
        <div className='img-ff'>
          <div className='img-card'>
            <p>Avatar</p>
            <img alt='Avatar' height='200' src={process.env.PUBLIC_URL + `/upload/${item.shortId}/${item.avatarImg}`} />
            <button className='refresh-btn' onClick={() => fileUploadAction('inpAvatar')}></button>
            <input id='inpAvatar' onChange={(e) => handleChangeInputRef(e, 'avatar')} multiple={false} type='file' hidden />
          </div>

          {
            item.hoverImg !== item.avatarImg &&
            <div className='img-card'>
              <p>Hover</p>
              <img alt='Hover' height='200' src={process.env.PUBLIC_URL + `/upload/${item.shortId}/${item.hoverImg}`} />
              <button className='refresh-btn' onClick={() => fileUploadAction('inpHover')}></button>
              <input id='inpHover' onChange={(e) => handleChangeInputRef(e, 'hover')} multiple={false} type='file' hidden />
            </div>
          }
        </div>
        <div className='img-ff'>
          {collection.length !== 0 && collection.map(el => el)}
        </div>
      </div>

      {item.carousel && <div className="input-field">
        <label htmlFor="type">Carousel</label>
        <select value={carouselImg} onChange={e => setCarouselImg(e.target.value)}>
          <option key={item.avatarImg} value={item.avatarImg}>Avatar</option>
          <option key={item.hoverImg} value={item.hoverImg}>Hover</option>
          {item.collectionImg && item.collectionImg.length && item.collectionImg.map((el, i) => <option key={el} value={el}>Collection {i + 1}</option>)}
        </select>
        <button className='save-carousel-img-btn' onClick={async () => saveCarouselImg()}>Save</button>
      </div>}

      <p><strong>Views</strong></p>
      <p>{item.clicks || 0}</p>

      <p><strong>Added date</strong></p>
      <p>{item.date}</p>


      <p><strong>Type</strong></p>
      <p>{item.type}</p>

      <p><strong>Prices</strong></p>
      <p>{item.prices[0]} AMD, {item.prices[1]} USD, {item.prices[2]} EUR, {item.prices[3]} RUB </p>

      <p><strong>Collection Type</strong></p>
      <p>{item.collectionType.map((el, i) => <span key={i}>{el}</span>)} </p>

      <p><strong>Details</strong></p>
      <p>{item.detailList.map((el, i) => <span key={i}>{el}</span>)}</p>

      <p><strong>Description</strong></p>
      <p>{item.description}</p>
      <div className='img-del-wrap'>
        <button className='deletefromCart img-del' onClick={removeHandler}></button>
      </div>
    </div>
  )
}