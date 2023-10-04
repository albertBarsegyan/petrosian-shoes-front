import React, {useState, useEffect, useContext, useCallback} from 'react';
import {UploadPic} from '../../components/Admin/FileUpload';
import FilesUpload from '../../components/Admin/FilesUpload';
import {AuthContext} from '../../context/AuthContext';
import {useHttp} from '../../hooks/http.hooks';
import {useHistory} from 'react-router';
import './CreatePage.css'
import 'antd/lib/upload/style/index.css';

export const CreatePage = () => {
  //#region declarations
  const history = useHistory();
  const {token} = useContext(AuthContext);
  const {request} = useHttp();

  const [type, setType] = useState('Man');
  const [collectionType, setCollectionType] = useState([]);
  const [amd, setAmd] = useState('');
  const [usd, setUsd] = useState('');
  const [eur, setEur] = useState('');
  const [rub, setRub] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [detailList, setDetailList] = useState(['']);
  const [shortId, setShortId] = useState('');
  const [sizeRange1, setSizeRange1] = useState(0);
  const [sizeRange2, setSizeRange2] = useState(0);
  const [sizeArrBool, setSizeArrBool] = useState(false);
  const [sizeArr, setSizeArr] = useState([]);
  const [existingSizeArr, setExistingSizeArr] = useState([]);
  const [carousel, setCarousel] = useState(false);

  const [avatarImg, setAvatarImg] = useState();
  const [hoverImg, setHoverImg] = useState();
  const [collectionImg, setCollectionImg] = useState();
  //#endregion

  const fetchShortId = useCallback(async () => {
    try {
      const fetched = await request('/api/link/shortid', 'GET', null);
      setShortId(fetched.shortId);
    } catch (e) {
    }
  }, [token, request])

  useEffect(() => {
    fetchShortId();
  }, [fetchShortId]);

  const changeDetailListComponent = (e, i) => {
    let arr = detailList;
    arr[i] = e.target.value;
    setDetailList(arr);
  };

  function setExistingEl(el) {
    if (existingSizeArr.indexOf(el) === -1) {
      existingSizeArr.push(el);
    } else {
      let arr = existingSizeArr;
      arr.splice(existingSizeArr.splice(existingSizeArr.indexOf(el), 1));
      setExistingSizeArr(arr);
    }
  }

  const submitHandler = async event => {
    if (!((amd || usd || eur || rub) && shortId && avatarImg && name && collectionType.length && sizeArr.length)) {
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
    })

    if (collectionType !== []) {
      let arr = collectionType;

      arr.forEach((el, i) => {
        switch (el) {
          case 0:
            arr[i] = 'Spring / Summer';
            break;
          case 1:
            arr[i] = 'Autumn / Winter';
            break;
          default:
            break;
        }
      });
      setCollectionType(arr);
    }

    try {
      let form = {
        type,
        name,
        collectionType,
        prices: [amd, usd, eur, rub],
        description,
        arrDetailList,
        shortId,
        avatarImg,
        hoverImg,
        collectionImg,
        sizeArr,
        existingSizeArr,
        carousel
      }

      const data = await request('/api/link/generate', 'POST', form, {
        Authorization: `Bearer ${token}`
      });

      history.push(`/detailAdmin/${data.item.shortId}`);
    } catch (e) {
      alert(e.message)
    }
  };

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

  function generateSizeArr() {
    let arr = [];
    if (sizeRange1 > sizeRange2) {
      alert('Wrong sizes');
      return;
    }
    for (let i = Number(sizeRange1); i <= Number(sizeRange2); i += 1) {
      arr.push(i + ' EU / ' + Number(i - 33) + ' US');
    }
    if (arr !== []) {
      setSizeArrBool(true);
      setSizeArr(arr);
    }
  }

  return (
    <div className='add-item-cont'>
      <h1>Create new item</h1>
      <div className="input-field">
        <label htmlFor="type">Select type*</label>
        <select id="type" name="type" value={type} onChange={e => setType(e.target.value)}>
          <option value="Man">Man</option>
          <option value="Woman">Woman</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      <div className="input-field">
        <label htmlFor="name">Enter name*</label>
        <input
          placeholder="Name.."
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className='price-inputs'>
        <div className='column'>
          <div className="input-field">
            <label htmlFor="priceAMD">AMD</label>
            <input
              placeholder="AMD"
              id="priceAMD"
              type="number"
              value={amd}
              onChange={e => setAmd(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="priceUSD">USD*</label>
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
            <label htmlFor="priceEUR">EUR</label>
            <input
              placeholder="EUR"
              id="priceEUR"
              type="number"
              value={eur}
              onChange={e => setEur(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="priceRUB">RUB</label>
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
        <label htmlFor="description">Enter some info</label>
        <input
          placeholder="Description.."
          id="description"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="input-field">
        <label>Pick range</label>
        <div className='range-row'>
          <input type='number' value={sizeRange1} onChange={e => setSizeRange1(e.target.value)}/>
          <input type='number' value={sizeRange2} onChange={e => setSizeRange2(e.target.value)}/>
          <button className='generate-size-btn' onClick={() => {
            generateSizeArr()
          }}>Generate
          </button>
        </div>
      </div>

      {sizeArrBool &&
        <div>
          {
            sizeArr.map((el, i) => {
              return (
                <div className="checkbox-container" key={i}>
                  <input id={i} onChange={() => setExistingEl(el)} type="checkbox"/>
                  <label className="checkmark" htmlFor={i}></label>
                  <label className='size-label' htmlFor={i}>{el}</label>
                </div>
              )
            })
          }
        </div>
      }

      <div className="input-field">
        <label htmlor='collectionType'>Season*</label>
        <div className='collectionType' name='collectionType'>
          <label className="checkbox-container">Spring / Summer
            <input type="checkbox" onChange={() => handleCheckbox('Spring / Summer')}/>
            <span className="checkmark"></span>
          </label>
          <label className="checkbox-container">Autumn / Winter
            <input type="checkbox" onChange={() => handleCheckbox('Autumn / Winter')}/>
            <span className="checkmark"></span>
          </label>
        </div>
      </div>

      <div className="input-field">
        <label htmlFor="description">Details</label>
        <div style={{width: '100%'}}>
          {
            detailList.map((el, i) => {
              return (<input
                placeholder="Details.."
                id={`detailList${i}`}
                type="text"
                key={i}
                onChange={e => {
                  changeDetailListComponent(e, i)
                }}
              />)
            })
          }
        </div>
        <button onClick={() => {
          setDetailList(detailList.concat(''))
        }}>+
        </button>
      </div>
      <div className="input-field">
        <div className='collectionType' name='carousel'>
          <label className="checkbox-container">Add to carousel
            <input type="checkbox" onChange={() => setCarousel(!carousel)}/>
            <span className="checkmark"></span>
          </label>
        </div>
      </div>

      <div className='ipf-row-cp'>
        <div className="input-field">
          <label htmlFor='avatar'>Avatar*</label>
          <UploadPic item={{shortId, type: 'avatar', setAvatarImg}}/>
        </div>
        <div className="input-field">
          <label htmlFor='hover'>On hover</label>
          <UploadPic item={{shortId, type: 'hover', setHoverImg}}/>
        </div>
      </div>

      <div className="input-field collection">
        <label htmlFor='collection'>Collection</label>
        <FilesUpload setImgs={setCollectionImg} id={shortId} type='collection'/>
      </div>
      <button className='create-button' onClick={submitHandler}>Create</button>
    </div>
  )
}
