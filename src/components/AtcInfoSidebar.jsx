import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AtcInfoSidebar.css";

const AtcInfoSidebar = ({ atc, sessionId }) => {
  const [atisInfo, setAtisInfo] = useState(null);
  const [notams, setNotams] = useState([]);

  useEffect(() => {
    if (atc && sessionId) {
      const fetchAtisInfo = async () => {
        try {
          const response = await axios.get(`https://api.infiniteflight.com/public/v2/sessions/${sessionId}/airport/${atc.airportName}/atis?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`);
          setAtisInfo(response.data.result);
        } catch (error) {
          console.error("Error fetching ATIS info:", error);
        }
      };

      fetchAtisInfo();

      const fetchNotams = async () => {
        try {
          const response = await axios.get(`https://api.infiniteflight.com/public/v2/sessions/${sessionId}/notams?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`);
          const filteredNotams = response.data.result.filter(notam => notam.icao === atc.airportName);
          setNotams(filteredNotams);
        } catch (error) {
          console.error("Error fetching NOTAMs:", error);
        }
      };

      fetchNotams();
    }
  }, [atc, sessionId]);

  return (
    <div className="atc-info-sidebar">
      <div className="atc-info-header">
        <h3>{atc.airportName}</h3>
        <p>
          {
            [
              "Ground",
              "Tower",
              "Unicom",
              "Clearance",
              "Approach",
              "Departure",
              "Center",
              "ATIS",
              "Aircraft",
              "Recorded",
              "Unknown",
              "Unused",
            ][atc.type]
          }
        </p>
      </div>
      <div className="atc-info-atis">
        <span>ATIS</span>
        <p>{atisInfo ? atisInfo : "Loading ATIS information..."}</p>
      </div>
      <div className="atc-info-notam">
        <span>NOTAMs</span>
        {notams.length > 0 ? (
          notams.map(notam => (
            <div key={notam.id} className="notam">
              <h4>{notam.title}</h4>
              <p>{notam.message}</p>
              <p><strong>Author:</strong> {notam.author}</p>
            </div>
          ))
        ) : (
          <p>No NOTAMs available.</p>
        )}
      </div>
      <div className="atc-info-inbout-outbount">
        {/* Add any other necessary sections here */}
      </div>
      <div className="atc-info-control">
        <h3>{atc.username}</h3>
        <p>
          <strong>Time :</strong> {new Date(atc.startTime).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default AtcInfoSidebar;
