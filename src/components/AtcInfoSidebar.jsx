import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AtcInfoSidebar.css";

const AtcInfoSidebar = ({ atc, sessionId }) => {
  const [atisInfo, setAtisInfo] = useState(null);
  const [notams, setNotams] = useState([]);
  const [airportStatus, setAirportStatus] = useState({
    inboundFlightsCount: 0,
    outboundFlightsCount: 0,
    airportName: "",
  });

  useEffect(() => {
    if (atc && sessionId) {
      const fetchAtisInfo = async () => {
        try {
          const response = await axios.get(
            `https://api.infiniteflight.com/public/v2/sessions/${sessionId}/airport/${atc.airportName}/atis?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`
          );
          setAtisInfo(response.data.result);
        } catch (error) {
          console.error("Error fetching ATIS info:", error);
        }
      };

      const fetchNotams = async () => {
        try {
          const response = await axios.get(
            `https://api.infiniteflight.com/public/v2/sessions/${sessionId}/notams?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`
          );
          const filteredNotams = response.data.result.filter(
            (notam) => notam.icao === atc.airportName
          );
          setNotams(filteredNotams);
        } catch (error) {
          console.error("Error fetching NOTAMs:", error);
        }
      };

      const fetchAirportStatus = async () => {
        try {
          const response = await axios.get(
            `https://api.infiniteflight.com/public/v2/sessions/${sessionId}/airport/${atc.airportName}/status?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`
          );
          const { inboundFlightsCount, outboundFlightsCount, airportName } =
            response.data.result;
          setAirportStatus({
            inboundFlightsCount,
            outboundFlightsCount,
            airportName,
          });
        } catch (error) {
          console.error("Error fetching airport status:", error);
        }
      };

      fetchAtisInfo();
      fetchNotams();
      fetchAirportStatus();
    }
  }, [atc, sessionId]);

  return (
    <div className="atc-info-sidebar">
      <div className="atc-info-header">
        <h3>
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
        </h3>
        <h5>{atc.airportName}</h5>
        <p>{airportStatus.airportName}</p>
      </div>
      <div className="atc-info-atis">
        <span>ATIS</span>
        <p>{atisInfo ? atisInfo : "Loading ATIS information..."}</p>
      </div>
      <div className="atc-info-notam">
        <span>NOTAMs</span>
        {notams.length > 0 ? (
          notams.map((notam) => (
            <div key={notam.id} className="notam">
              <h4>{notam.title}</h4>
              <p>{notam.message}</p>
              <p>
                <strong>Author:</strong> {notam.author}
              </p>
            </div>
          ))
        ) : (
          <p>No NOTAMs available.</p>
        )}
      </div>
      <div className="atc-info-inbout-outbount">
        <div>
          <p className="inbound">
            <strong>Inbound Flights :</strong>{" "}
            {airportStatus.inboundFlightsCount}
          </p>
          <p className="outbound">
            <strong>Outbound Flights :</strong>{" "}
            {airportStatus.outboundFlightsCount}
          </p>
        </div>
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
