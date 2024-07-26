// UserInfoSidebar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import liveries from "./ImageAirplane.json";
import getAircraft from "./GetAircraft.json";
import stremeruser from "./Stremer.json";
import "./UserInfoSidebar.css";
import defaultImage from "../assets/ovni.png"; // Imagem padrão
import { CiPaperplane } from "react-icons/ci";
import { IoIosAirplane } from "react-icons/io";
import { FaYoutube, FaTwitch } from "react-icons/fa6"; // Importar ícones

// Função para buscar o status do usuário
async function userstatus(userid) {
  try {
    const paramentro = { userIds: [userid] };
    const headers = { "Content-type": "application/json", Accept: "text/plain" };
    const url = "https://api.infiniteflight.com/public/v2/user/stats?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw";

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(paramentro),
    });

    const data = await response.json();
    return data.result[0]; // A API retorna um array, então pegamos o primeiro item
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    return null;
  }
}

// Função para converter minutos em formato HH:mm
const convertMinutesToHHMM = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const UserInfoSidebar = ({ flight, sessionId }) => {
  const [routeInfo, setRouteInfo] = useState({
    origin: "",
    destination: "",
    distanceToDestination: 0,
  });
  const [progress, setProgress] = useState(0);
  const [etaZulu, setEtaZulu] = useState("");
  const [etaLocal, setEtaLocal] = useState("");
  const [aircraftName, setAircraftName] = useState("");
  const [waypoints, setWaypoints] = useState([]);
  const [userStatus, setUserStatus] = useState({ xp: 0, grade: "N/A", flightTime: "0:00" }); // Novos estados

  useEffect(() => {
    const fetchRouteInfo = async () => {
      try {
        const flightRouteUrl = `https://api.infiniteflight.com/public/v2/sessions/${sessionId}/flights/${flight.flightId}/route?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`;
        const flightInfoUrl = `https://api.infiniteflight.com/public/v2/sessions/${sessionId}/flights/${flight.flightId}/flightplan?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`;

        const [routeResponse, flightInfoResponse] = await Promise.all([
          axios.get(flightRouteUrl),
          axios.get(flightInfoUrl),
        ]);

        const routeData = routeResponse.data.result;
        const flightInfo = flightInfoResponse.data.result;

        

        if (flightInfo.flightPlanItems && flightInfo.flightPlanItems.length > 1) {
          const infoDep = flightInfo.flightPlanItems[0];
          const infoArr = flightInfo.flightPlanItems[flightInfo.flightPlanItems.length - 1];

          const totalDistance = getDistanceInNauticalMiles(
            infoDep.location.latitude,
            infoDep.location.longitude,
            infoArr.location.latitude,
            infoArr.location.longitude
          );

          const distanceToDestination = getDistanceInNauticalMiles(
            flight.latitude,
            flight.longitude,
            infoArr.location.latitude,
            infoArr.location.longitude
          );

          const progress = ((totalDistance - distanceToDestination) / totalDistance) * 100;

          setRouteInfo({
            origin: infoDep.identifier || "N/A",
            destination: infoArr.identifier || "N/A",
            distanceToDestination,
          });
          setProgress(progress);

          // Calcular ETA
          const speedInKnots = flight.speed;
          const timeRemainingHours = distanceToDestination / speedInKnots;
          const etaZuluTime = new Date(Date.now() + timeRemainingHours * 3600000);

          setEtaZulu(etaZuluTime.toISOString().split("T")[1].substring(0, 5));
          const localTimeOffset = etaZuluTime.getTimezoneOffset() * 60000;
          const etaLocalTime = new Date(etaZuluTime.getTime() - localTimeOffset);
          setEtaLocal(etaLocalTime.toISOString().split("T")[1].substring(0, 5));
        }

        setWaypoints(flightInfo.flightPlanItems || []);
      } catch (error) {
        console.error("Error fetching route information:", error);
      }
    };

    fetchRouteInfo();
    const intervalId = setInterval(fetchRouteInfo, 30000);
    return () => clearInterval(intervalId);
  }, [sessionId, flight.flightId, flight.latitude, flight.longitude, flight.speed]);

  useEffect(() => {
    const aircraft = getAircraft.result.find((a) => a.id === flight.aircraftId);
    setAircraftName(aircraft ? aircraft.name : "Unknown Aircraft");
  }, [flight.aircraftId]);

  useEffect(() => {
    const fetchUserStatus = async () => {
      const status = await userstatus(flight.userId);
      if (status) {
        setUserStatus({
          xp: status.xp || 0,
          grade: status.grade || "N/A",
          flightTime: convertMinutesToHHMM(status.flightTime) || "0:00",
        });
      }
    };

    fetchUserStatus();
  }, [flight.userId]);

  const handleClickInside = (e) => {
    e.stopPropagation();
  };

  const getLiveryImage = (liveryId) => {
    const livery = liveries.find((l) => l.LiveryId === liveryId);
    return livery ? livery.image : defaultImage;
  };

  const getDistanceInNauticalMiles = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon1 - lon2) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    return d / 1852;
  };

  // Verificar se o usuário é um streamer
  const streamer = stremeruser.find((user) => user.username === flight.username);

  return (
    <div className="user-info-sidebar" onClick={handleClickInside}>
      <div className="imageLivery">
        <img src={getLiveryImage(flight.liveryId)} alt="Livery" className="livery-image" />
      </div>
      <div className="usercallsign">
        <span className="circuloIcon">
          <CiPaperplane />{" "}
        </span>{" "}
        {flight.callsign}
      </div>
      <div className="userroute">
        <div className="progress-container">
          <span>{routeInfo.origin}</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
            <IoIosAirplane className="progress-icon" style={{ left: `${progress}%` }} />
          </div>
          <span>{routeInfo.destination}</span>
        </div>
      </div>
      <div className="col-info-flight-user">
        <div className="info-box">
          <span>{routeInfo.distanceToDestination.toFixed(0)} nm</span>
          <p>DISTANCE</p>
        </div>
        <div className="info-box">
          <span>{flight.altitude.toFixed(0)}</span>
          <p>ALTITUDE</p>
        </div>
        <div className="info-box">
          <span>{flight.speed.toFixed(0)}</span>
          <p>SPEED</p>
        </div>
      </div>
      <div className="col-info-flight-user">
        <div className="info-box">
          <span>{etaZulu} Z</span>
          <p>ETA Zulu</p>
        </div>
        <div className="info-box">
          <span>{etaLocal}</span>
          <p>ETA Local</p>
        </div>
        <div className="info-box">
          <span>{aircraftName}</span>
          <p>AIRCRAFT</p>
        </div>
      </div>
      <div className="route-info-user">
        <span>ROUTE</span>
        <div className="waypoints-container">
          {waypoints.map((waypoint, index) => (
            <span key={index} className="waypoint">
              {waypoint.name || "Unknown"}
              {index < waypoints.length - 1 ? ' ' : ''}
            </span>
          ))}
        </div>
      </div>
      <div className="col-info-flight-user">
        <div className="info-box-user">
          <span>{userStatus.xp}</span>
          <p>XP</p>
        </div>
        <div className="info-box-user">
          <span>{userStatus.grade}</span>
          <p>GRADE</p>
        </div>
        <div className="info-box-user">
          <span>{userStatus.flightTime}</span>
          <p>TIME</p>
        </div>
      </div>
      <div className="inforusername">
        <span>{flight.username}</span>
        {streamer && (
          <span className="stream-icons">
            {streamer.twitch && <a href={streamer.twitch} target="_blank" rel="noopener noreferrer"><FaTwitch /></a>}
            {streamer.youtube && <a href={streamer.youtube} target="_blank" rel="noopener noreferrer"><FaYoutube /></a>}
          </span>
        )}
      </div>
      <div className="stremer"></div>
    </div>
  );
};

export default UserInfoSidebar;
