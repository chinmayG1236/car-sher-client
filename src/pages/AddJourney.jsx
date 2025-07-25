import React from 'react'
import PlacesSearchBox from '../components/PlacesSearchBox'
import OtherInfo from '../components/OtherInfo'

export default function AddJourney() {
  return (
    <div>
      <h2 className='font-black text-center' >planning a ney journey ? enter the details below</h2>
      <h3 className='text-center'>Enter your start point</h3>
      <PlacesSearchBox/>
      <h3 className='text-center'>Enter your end point</h3>
      <PlacesSearchBox/>
      <OtherInfo/>
    </div>
  )
}
