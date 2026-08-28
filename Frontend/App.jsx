import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {

  const [incident, setIncident] = useState(null);
  const [message, setMessage] = useState("");

  const [cameras, setCameras] = useState([]);
  const [hazards, setHazards] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("main");

  const [route, setRoute] = useState(null);

  const [offlineMode, setOfflineMode] = useState(false);

  const [activePage, setActivePage] = useState("dashboard");

  const [crowd, setCrowd] = useState({
    total_people: 0,
    average_density: 0,
    high_risk_cameras: 0
  });


  // --------------------------------------------------
  // LOAD CAMERA DATA
  // --------------------------------------------------

  const loadCameraData = async () => {

    try {

      const response = await fetch(`${API}/cameras`);

      const data = await response.json();

      setCameras(data.cameras);

    } catch {

      console.log("Camera service unavailable");

    }

  };


  // --------------------------------------------------
  // LOAD CROWD ANALYSIS
  // --------------------------------------------------

  const loadCrowdData = async () => {

    try {

      const response =
        await fetch(`${API}/crowd-analysis`);

      const data = await response.json();

      setCrowd(data);

    } catch {

      console.log("Crowd service unavailable");

    }

  };


  // --------------------------------------------------
  // LOAD HAZARDS
  // --------------------------------------------------

  const loadHazards = async () => {

    try {

      const response =
        await fetch(`${API}/hazards`);

      const data = await response.json();

      setHazards(data.hazards);

    } catch {

      console.log("Hazard service unavailable");

    }

  };


  useEffect(() => {

    loadCameraData();
    loadCrowdData();
    loadHazards();

    const interval =
      setInterval(() => {

        loadCameraData();
        loadCrowdData();

      }, 5000);

    return () => clearInterval(interval);

  }, []);


  // --------------------------------------------------
  // TEST BACKEND
  // --------------------------------------------------

  const testBackend = async () => {

    try {

      const response =
        await fetch(`${API}/`);

      const data =
        await response.json();

      setMessage(
        `Backend connected: ${data.message}`
      );

    } catch {

      setMessage(
        "Backend connection failed. Start FastAPI on port 8000."
      );

    }

  };


  // --------------------------------------------------
  // REPORT EMERGENCY
  // --------------------------------------------------

  const reportEmergency = async (type) => {

    const cleanType =
      type.replace(/[🔥🏥⚠️🌊]/g, "").trim();

    const newIncident = {

      type,

      time:
        new Date().toLocaleTimeString(),

      severity: "HIGH"

    };

    setIncident(newIncident);

    setMessage(
      `${type} emergency detected. AI emergency workflow activated.`
    );

    try {

      await fetch(
        `${API}/incident/${cleanType}`,
        {
          method: "POST"
        }
      );

    } catch {

      console.log("Backend incident service unavailable");

    }

  };


  // --------------------------------------------------
  // ROUTE FINDER
  // --------------------------------------------------

  const findRoute = async () => {

    try {

      const response =
        await fetch(
          `${API}/route?location=${selectedLocation}&blocked=${hazards.length > 0}`
        );

      const data =
        await response.json();

      setRoute(data);

      setActivePage("routing");

    } catch {

      setMessage(
        "Unable to calculate route."
      );

    }

  };


  // --------------------------------------------------
  // RESOLVE
  // --------------------------------------------------

  const clearEmergency = () => {

    setIncident(null);

    setMessage("");

  };


  // --------------------------------------------------
  // SIDEBAR
  // --------------------------------------------------

  const Sidebar = () => (

    <aside className="sidebar">

      <div className="sidebar-logo">

        🛡️

        <div>

          <strong>
            CampusSafe
          </strong>

          <small>
            AI Safety System
          </small>

        </div>

      </div>


      <div className="user-section">

        <span>
          CURRENT USER
        </span>

        <select
          value={selectedLocation}
          onChange={(e) =>
            setSelectedLocation(e.target.value)
          }
        >

          <option value="main">
            👨‍🎓 Student — Main Building
          </option>

          <option value="science">
            👨‍🔬 Student — Science Block
          </option>

          <option value="library">
            📚 Student — Library
          </option>

          <option value="medical">
            🏥 Staff — Medical Center
          </option>

        </select>

      </div>


      <nav>

        <button
          className={
            activePage === "dashboard"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setActivePage("dashboard")
          }
        >
          📊 Dashboard
        </button>


        <button
          className={
            activePage === "monitoring"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setActivePage("monitoring")
          }
        >
          📹 Live Monitoring
        </button>


        <button
          className={
            activePage === "routing"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setActivePage("routing")
          }
        >
          🗺️ Evacuation Router
        </button>


        <button
          className={
            activePage === "incidents"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setActivePage("incidents")
          }
        >
          🚨 Incidents
        </button>

      </nav>


      <div className="offline-box">

        <div>
          📡
        </div>

        <strong>
          Low Bandwidth Mode
        </strong>

        <p>
          Continue evacuation guidance
          during network disruption.
        </p>

        <button
          onClick={() =>
            setOfflineMode(!offlineMode)
          }
        >
          {offlineMode
            ? "ONLINE MODE"
            : "ENABLE OFFLINE"}
        </button>

      </div>

    </aside>

  );


  // --------------------------------------------------
  // DASHBOARD
  // --------------------------------------------------

  const Dashboard = () => (

    <>

      <div className="topbar">

        <div>

          <span>
            EMERGENCY CONTROL CENTER
          </span>

          <h1>
            Campus Safety Dashboard
          </h1>

        </div>

        <div className="system-status">

          <i></i>

          SYSTEM OPERATIONAL

        </div>

      </div>


      <div className="hero-small">

        <div>

          <div className="badge">
            AI-POWERED CAMPUS SAFETY
          </div>

          <h2>
            Detect. Analyze.
            <br />
            <span>Evacuate Safely.</span>
          </h2>

          <p>
            Multimodal emergency intelligence
            for safer campus evacuation.
          </p>

        </div>


        <button
          className="test-button"
          onClick={testBackend}
        >
          🚨 TEST SYSTEM
        </button>

      </div>


      {message && (

        <div className="system-message">

          ⚡

          <div>

            <strong>
              SYSTEM UPDATE
            </strong>

            <p>
              {message}
            </p>

          </div>

        </div>

      )}


      {/* ANALYTICS */}

      <div className="analytics-grid">

        <div className="metric">

          <span>
            👥
          </span>

          <div>

            <small>
              PEOPLE DETECTED
            </small>

            <strong>
              {crowd.total_people}
            </strong>

          </div>

        </div>


        <div className="metric">

          <span>
            📈
          </span>

          <div>

            <small>
              CROWD DENSITY
            </small>

            <strong>
              {crowd.average_density}%
            </strong>

          </div>

        </div>


        <div className="metric">

          <span>
            📹
          </span>

          <div>

            <small>
              ACTIVE CAMERAS
            </small>

            <strong>
              {cameras.length}
            </strong>

          </div>

        </div>


        <div className="metric">

          <span>
            ⚠️
          </span>

          <div>

            <small>
              ACTIVE HAZARDS
            </small>

            <strong>
              {hazards.length}
            </strong>

          </div>

        </div>

      </div>


      {/* EMERGENCY CARDS */}

      <h2 className="section-title">
        Emergency Response
      </h2>


      <div className="emergency-grid">

        <button
          className="emergency-card fire"
          onClick={() =>
            reportEmergency("🔥 FIRE")
          }
        >

          <div className="card-icon">
            🔥
          </div>

          <h3>
            Fire Emergency
          </h3>

          <p>
            Report fire or smoke
          </p>

        </button>


        <button
          className="emergency-card medical"
          onClick={() =>
            reportEmergency("🏥 MEDICAL")
          }
        >

          <div className="card-icon">
            🏥
          </div>

          <h3>
            Medical Emergency
          </h3>

          <p>
            Request medical assistance
          </p>

        </button>


        <button
          className="emergency-card threat"
          onClick={() =>
            reportEmergency("⚠️ SECURITY")
          }
        >

          <div className="card-icon">
            ⚠️
          </div>

          <h3>
            Security Threat
          </h3>

          <p>
            Report suspicious activity
          </p>

        </button>


        <button
          className="emergency-card flood"
          onClick={() =>
            reportEmergency("🌊 FLOOD")
          }
        >

          <div className="card-icon">
            🌊
          </div>

          <h3>
            Flood Emergency
          </h3>

          <p>
            Report flooding
          </p>

        </button>

      </div>


      {/* INCIDENT */}

      {incident && (

        <div className="incident-panel">

          <div>

            <span>
              🚨 ACTIVE EMERGENCY
            </span>

            <h2>
              {incident.type}
            </h2>

            <p>
              Detected at {incident.time}
            </p>

            <strong>
              ● Emergency response team notified
            </strong>

          </div>


          <button
            onClick={clearEmergency}
          >
            RESOLVE INCIDENT
          </button>

        </div>

      )}


      {/* ROUTE PREVIEW */}

      <div className="route-preview">

        <div>

          <span>
            AUTONOMOUS EVACUATION ROUTER
          </span>

          <h2>
            Find the Safest Route
          </h2>

          <p>
            AI analyzes hazards, crowd density
            and blocked paths before recommending
            an evacuation route.
          </p>

        </div>


        <button
          onClick={findRoute}
        >
          🗺️ CALCULATE SAFE ROUTE
        </button>

      </div>

    </>

  );


  // --------------------------------------------------
  // MONITORING
  // --------------------------------------------------

  const Monitoring = () => (

    <>

      <div className="topbar">

        <div>

          <span>
            COMPUTER VISION
          </span>

          <h1>
            Live Camera Intelligence
          </h1>

        </div>

        <div className="system-status">

          <i></i>
          AI MONITORING ACTIVE

        </div>

      </div>


      <div className="camera-grid">

        {cameras.map((camera) => (

          <div
            className="camera-card"
            key={camera.id}
          >

            <div className="camera-screen">

              <div className="camera-label">
                ● LIVE&nbsp;&nbsp; {camera.id}
              </div>

              <div className="camera-visual">

                👥

                <strong>
                  {camera.people}
                </strong>

                <small>
                  people detected
                </small>

              </div>

              {camera.hazard && (

                <div className="camera-warning">

                  ⚠️ {camera.hazard}

                </div>

              )}

            </div>


            <div className="camera-info">

              <h3>
                {camera.location}
              </h3>

              <div className="camera-stats">

                <span>
                  Density
                  <strong>
                    {camera.density}%
                  </strong>
                </span>

                <span>
                  Movement
                  <strong>
                    {camera.movement}
                  </strong>
                </span>

                <span>
                  Status
                  <strong>
                    {camera.status}
                  </strong>
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>


      <div className="analysis-panel">

        <h2>
          AI Crowd Analysis
        </h2>

        <div className="density-bar">

          <div
            style={{
              width: `${crowd.average_density}%`
            }}
          ></div>

        </div>

        <p>
          Average campus crowd density:
          <strong>
            {" "}{crowd.average_density}%
          </strong>
        </p>

        <p>
          {crowd.high_risk_cameras}
          camera(s) currently require
          attention.
        </p>

      </div>

    </>

  );


  // --------------------------------------------------
  // ROUTING
  // --------------------------------------------------

  const Routing = () => (

    <>

      <div className="topbar">

        <div>

          <span>
            EVACUATION ROUTER
          </span>

          <h1>
            Dynamic Campus Routing
          </h1>

        </div>

        <div className="system-status">

          <i></i>
          ROUTING ENGINE READY

        </div>

      </div>


      <div className="routing-layout">

        <div className="campus-map-large">

          <div className="map-road horizontal"></div>

          <div className="map-road vertical"></div>


          <div className="map-building b1">
            🏫
            <small>
              Main Building
            </small>
          </div>


          <div className="map-building b2">
            🧪
            <small>
              Science Block
            </small>
          </div>


          <div className="map-building b3">
            📚
            <small>
              Library
            </small>
          </div>


          <div className="map-building b4">
            🏥
            <small>
              Medical Center
            </small>
          </div>


          <div className="safe-map-zone zone-a">
            ✓
            <small>
              SAFE ZONE A
            </small>
          </div>


          <div className="safe-map-zone zone-b">
            ✓
            <small>
              SAFE ZONE B
            </small>
          </div>


          {hazards.map((hazard) => (

            <div
              className="hazard-marker"
              key={hazard.id}
              style={{
                left: `${hazard.x}%`,
                top: `${hazard.y}%`
              }}
            >
              ⚠️
            </div>

          ))}


          <div className="user-marker">
            📍
            <small>
              YOU
            </small>
          </div>

        </div>


        <div className="route-panel">

          <div className="route-user">

            <span>
              YOUR LOCATION
            </span>

            <select
              value={selectedLocation}
              onChange={(e) =>
                setSelectedLocation(e.target.value)
              }
            >

              <option value="main">
                Main Building
              </option>

              <option value="science">
                Science Block
              </option>

              <option value="library">
                Library
              </option>

              <option value="medical">
                Medical Center
              </option>

            </select>

          </div>


          <button
            className="calculate-button"
            onClick={findRoute}
          >
            🧠 AI CALCULATE SAFEST ROUTE
          </button>


          {route && (

            <div className="route-result">

              <div className="route-status">
                {route.status === "REPLANNED"
                  ? "⚠️ ROUTE REPLANNED"
                  : "✓ SAFE ROUTE FOUND"}
              </div>


              <h2>
                {route.destination}
              </h2>


              <div className="route-metrics">

                <div>
                  <strong>
                    {route.distance}m
                  </strong>

                  <span>
                    Distance
                  </span>
                </div>


                <div>
                  <strong>
                    {route.estimated_time}
                    min
                  </strong>

                  <span>
                    Estimated
                  </span>
                </div>

              </div>


              <h3>
                Evacuation Path
              </h3>


              <div className="route-path">

                {route.path.map(
                  (point, index) => (

                    <div
                      key={point}
                      className="path-point"
                    >

                      <span>
                        {index + 1}
                      </span>

                      {point}

                    </div>

                  )
                )}

              </div>


              <div className="guidance">

                🚶

                <div>

                  <strong>
                    Zone-based guidance
                  </strong>

                  <p>
                    Move calmly along the
                    highlighted path and
                    assemble at the designated
                    safe zone.
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </>

  );


  // --------------------------------------------------
  // INCIDENT PAGE
  // --------------------------------------------------

  const Incidents = () => (

    <>

      <div className="topbar">

        <div>

          <span>
            INCIDENT MANAGEMENT
          </span>

          <h1>
            Emergency Command Center
          </h1>

        </div>

      </div>


      <div className="command-grid">

        <div className="command-card">

          <span>
            ACTIVE INCIDENTS
          </span>

          <strong>
            {incident ? "01" : "00"}
          </strong>

        </div>


        <div className="command-card">

          <span>
            HAZARD ZONES
          </span>

          <strong>
            {hazards.length}
          </strong>

        </div>


        <div className="command-card">

          <span>
            PEOPLE MONITORED
          </span>

          <strong>
            {crowd.total_people}
          </strong>

        </div>


        <div className="command-card">

          <span>
            RESPONSE STATUS
          </span>

          <strong className="green-text">
            READY
          </strong>

        </div>

      </div>


      <div className="incident-log">

        <h2>
          Emergency Event Log
        </h2>


        {incident ? (

          <div className="log-entry">

            <span>
              🚨
            </span>

            <div>

              <strong>
                {incident.type}
              </strong>

              <p>
                Emergency detected at
                {" "}{incident.time}
              </p>

            </div>

            <b>
              HIGH
            </b>

          </div>

        ) : (

          <div className="empty-log">

            ✓

            <h3>
              No active emergencies
            </h3>

            <p>
              Campus emergency network is
              monitoring continuously.
            </p>

          </div>

        )}

      </div>

    </>

  );


  // --------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------

  return (

    <div className="app">

      <Sidebar />


      <main className="main-content">

        {offlineMode && (

          <div className="offline-banner">

            📡 OFFLINE / LOW-BANDWIDTH MODE —
            Cached evacuation guidance active

          </div>

        )}


        {activePage === "dashboard" &&
          <Dashboard />}

        {activePage === "monitoring" &&
          <Monitoring />}

        {activePage === "routing" &&
          <Routing />}

        {activePage === "incidents" &&
          <Incidents />}


        <footer>

          🛡️ CampusSafe AI

          <span>
            • Multimodal Smart Campus Emergency Response
          </span>

        </footer>

      </main>

    </div>

  );

}

export default App;