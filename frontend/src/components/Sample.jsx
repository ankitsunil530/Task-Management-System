import React, { useEffect, useState } from 'react'
import axios from 'axios'
function Sample() {
    const [mobile, setMobile] =useState([]);
    useEffect(()=>{
        axios.get('/api/mobile')
        .then(
            (response)=>{
                setMobile(response.data);
            }
        )
        .catch(
            (error)=>{
                console.error(error);
            }
        )
    })

  return (
    <>
    <h1 className='text-2xl font-bold'>Sample Data</h1>
    <p className='text-lg'>Mobile:{mobile.length}</p>
    {
        mobile.map((item)=>
        <div key={item.id} className='bg-gray-200 p-8 rounded-lg shadow-lg w-full md:w-1/2 mb-8 md:mb-0 '>
            <p>{item.name}</p>
            <p>{item.version}</p>
            <p>{item.BatteryLevel}</p>
        </div>
        )
    }
    </>
    
  )
}

export default Sample;