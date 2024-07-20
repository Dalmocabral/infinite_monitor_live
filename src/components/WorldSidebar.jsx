import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorldSidebar.css'; // Crie um CSS específico para o WorldSidebar

const WorldSidebar = ({ sessionId, sessionName }) => {
  const [userCount, setUserCount] = useState(0);
  const [airports, setAirports] = useState([]);
  const [atcData, setAtcData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.infiniteflight.com/public/v2/sessions/${sessionId}?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`);
        const sessionData = response.data.result;
        setUserCount(sessionData.userCount);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    fetchData(); // Busca inicial
    const intervalId = setInterval(fetchData, 300000); // Atualiza a cada 5 minutos

    return () => clearInterval(intervalId); // Limpeza do intervalo ao desmontar
  }, [sessionId]);

  useEffect(() => {
    const fetchAirportsData = async () => {
      try {
        const response = await axios.get(`https://api.infiniteflight.com/public/v2/world/status/${sessionId}?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`);
        const airportData = response.data.result;
        const sortedAirports = airportData.sort((a, b) => b.inboundFlightsCount - a.inboundFlightsCount).slice(0, 5);
        setAirports(sortedAirports);
      } catch (error) {
        console.error('Erro ao buscar dados da API de aeroportos:', error);
      }
    };

    fetchAirportsData(); // Busca inicial
    const intervalId = setInterval(fetchAirportsData, 300000); // Atualiza a cada 5 minutos

    return () => clearInterval(intervalId); // Limpeza do intervalo ao desmontar
  }, [sessionId]);

  useEffect(() => {
    const fetchAtcData = async () => {
      try {
        const response = await axios.get(`https://api.infiniteflight.com/public/v2/sessions/${sessionId}/atc?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`);
        setAtcData(response.data.result.filter(atc => atc.airportName && atc.type !== null));
      } catch (error) {
        console.error('Erro ao buscar dados da API ATC:', error);
      }
    };

    fetchAtcData(); // Busca inicial
    const intervalId = setInterval(fetchAtcData, 300000); // Atualiza a cada 5 minutos

    return () => clearInterval(intervalId); // Limpeza do intervalo ao desmontar
  }, [sessionId]);

  const getTypeLabel = (type) => {
    const typeLabels = ["grd", "twr", "unicom", "clr", "app", "dep", "ctr", "atis"];
    return typeLabels[type] || "";
  };

  const atcGroupedByAirport = atcData.reduce((acc, atc) => {
    const { airportName, type } = atc;
    const typeLabel = getTypeLabel(type);
    if (!acc[airportName]) {
      acc[airportName] = { grd: false, twr: false, app: false, dep: false, ctr: false, atis: false };
    }
    if (typeLabel) {
      acc[airportName][typeLabel] = true;
    }
    return acc;
  }, {});

  return (
    <div className="world-sidebar">
      <div className="statistics-user-count">
        <h4>Online: <span>{userCount}</span></h4>
      </div>
      <div className="statistics-content">
        <div className="statistics-section">
          <h4>Most Popular Airports</h4>
          <div className="airport-table">
            <div className="airport-table-header">
              <span className="labelInbound">Inbound</span>
              <span className="labelOutbound">Outbound</span>
            </div>
            {airports.map(airport => (
              <div key={airport.airportIcao} className="airport-stat">
                <span className="inbound">{airport.inboundFlightsCount}</span>
                <span className="airport">{airport.airportIcao}</span>
                <span className="outbound">{airport.outboundFlightsCount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="statistics-section-atc">
          <h4>ATC Status</h4>
          <ul>
            {Object.keys(atcGroupedByAirport).map(airport => (
              <li key={airport} className="airport-stat">
                <span className="airport">{airport}</span>
                <span className="atc-status">
                  {atcGroupedByAirport[airport].grd && <span>Grd</span>}
                  {atcGroupedByAirport[airport].twr && <span>Twr</span>}
                  {atcGroupedByAirport[airport].app && <span>App</span>}
                  {atcGroupedByAirport[airport].dep && <span>Dep</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorldSidebar;
