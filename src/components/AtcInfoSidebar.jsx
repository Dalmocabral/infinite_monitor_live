import React from 'react'

const AtcInfoSidebar = ({atc}) => {
  return (
    <div>
      <h2>ATC Information</h2>
      <p><strong>Username:</strong> {atc.username}</p>
      <p><strong>Airport:</strong> {atc.airportName}</p>
      <p><strong>Type:</strong> {['Ground', 'Tower', 'Unicom', 'Clearance', 'Approach', 'Departure', 'Center', 'ATIS', 'Aircraft', 'Recorded', 'Unknown', 'Unused'][atc.type]}</p>
      <p><strong>Start Time:</strong> {new Date(atc.startTime).toLocaleString()}</p>
    </div>
  )
}

export default AtcInfoSidebar