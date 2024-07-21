import React from "react";
import "./AtcInfoSidebar.css";

const AtcInfoSidebar = ({ atc }) => {
  return (
    <div className="atc-info-sidebar">
      <div className="atc-info-header">
        <h3>{atc.airportName}</h3>
        <p>
          {" "}
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
        <p>
          ts-1.sa-east-1.ivao.aero/SBXS_APP Salvador Control Information BRAVO
          recorded at 0040z SBSV 202300Z 19006KT 140V230 8000 VCSH SCT020
          FEW025TCU SCT060 25/21 Q1020 ARR RWY 10 ILS Z 17 RNP Z / DEP RWY 10 17
          / TRL FL075 / TA 7000ft CONFIRM ATIS INFO BRAVO on initial contact
          CPDLC ID SBXS
        </p>
      </div>
      <div className="atc-info--notan">

      </div>
      <div className="atc-info-inbout-outbount">

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
