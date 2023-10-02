import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

export const ItemList = ({ links: items }) => {
  const [select, setSelect] = useState(0);

  const man = [];
  const woman = [];

  items.map(el => el.type === 'Man' ? man.push(el) : woman.push(el));


  if (!items.length) {
    return <p className="center">Empty</p>
  }

  return (
    <div>
      <div className='array-purchase-wrap'>
        <Tabs
          selectedIndex={select}
          onSelect={index => setSelect(index)}
        >
          <TabList>
            <Tab disabled={!(man && man.length)}>Man</Tab>
            <Tab disabled={!(woman && woman.length)}>Woman</Tab>
          </TabList>
          <TabPanel>
            {(man.length === 0 &&
              <h1>Empty</h1>)
              ||
              ((man && man.length) &&

                man.map((item, index) => {
                  return (
                    <Link key={index} to={`/detailAdmin/${item.shortId}`}>
                      <img alt='Avatar' height='200'
                        src={process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.avatarImg}`} />
                    </Link>
                  )
                })
              )}
          </TabPanel>
          <TabPanel>
            {(woman.length === 0 &&
              <h1>Empty</h1>)
              ||
              ((woman && woman.length) &&

                woman.map((item, index) => {
                  return (
                    <Link key={index} to={`/detailAdmin/${item.shortId}`}>
                      <img alt='Avatar' height='200'
                        src={process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.avatarImg}`} />
                    </Link>
                  )
                })
              )}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}
