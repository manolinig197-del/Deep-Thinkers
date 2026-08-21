import { useState } from "react";
import "./App.css";

function App() {
  const [incident, setIncident] = useState(null);
  const [message, setMessage] = useState("");

  const reportEmergency = (type) => {
    const newIncident = {
      type,
      time: new Date().toLocaleTimeString(),
    };

    setIncident(newIncident);
    setMessage(
      `${type} emergency reported successfully. Emergency response team has been notified.`
    );
  };

  const clearEmergency = () => {
    setIncident(null);
    setMessage("");
  };

  const testBackend = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/");
      const data = await response.json();

      setMessage(`Backend connected: ${data.message}`);
    } catch (error) {
      setMessage(
        "Backend connection failed. Make sure FastAPI is running on port 8000."
      );
    }
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="shield">🛡️</div>

          <div>
            <h1>CampusSafe AI</h1>
            <p>Smart Campus Emergency Response</p>
          </div>
        </div>

        <div className="online">
          <span></span>
          ONLINE
        </div>
      </header>

      {/* HERO */}
      <main>

        <section className="hero">
          <div className="badge">
            🛡️ AI-POWERED CAMPUS SAFETY
          </div>

          <h2>
            Stay Safe.
            <br />
            <span>Respond Fast.</span>
          </h2>

          <p className="hero-text">
            CampusSafe AI helps students and staff receive emergency
            warnings, understand incidents, and find the safest evacuation
            route.
          </p>

          <button className="test-button" onClick={testBackend}>
            🚨 TEST BACKEND CONNECTION
          </button>

          {message && (
            <div
              className={
                incident ? "alert-message danger" : "alert-message success"
              }
            >
              <strong>{incident ? "🚨 ACTIVE EMERGENCY" : "✓ SYSTEM MESSAGE"}</strong>
              <p>{message}</p>
            </div>
          )}
        </section>

        {/* DASHBOARD */}
        <section className="dashboard">

          <div className="section-heading">
            <p>EMERGENCY CONTROL CENTER</p>
            <h2>Emergency Dashboard</h2>
            <span>
              Report an incident and receive an immediate response.
            </span>
          </div>

          {/* EMERGENCY BUTTONS */}
          <div className="emergency-grid">

            <button
              className="emergency-card fire"
              onClick={() => reportEmergency("🔥 FIRE")}
            >
              <div className="card-icon">🔥</div>
              <h3>Fire Emergency</h3>
              <p>Report fire or smoke</p>
            </button>

            <button
              className="emergency-card medical"
              onClick={() => reportEmergency("🏥 MEDICAL")}
            >
              <div className="card-icon">🏥</div>
              <h3>Medical Emergency</h3>
              <p>Request medical assistance</p>
            </button>

            <button
              className="emergency-card threat"
              onClick={() => reportEmergency("⚠️ SECURITY THREAT")}
            >
              <div className="card-icon">⚠️</div>
              <h3>Security Threat</h3>
              <p>Report suspicious activity</p>
            </button>

            <button
              className="emergency-card flood"
              onClick={() => reportEmergency("🌊 FLOOD")}
            >
              <div className="card-icon">🌊</div>
              <h3>Flood Emergency</h3>
              <p>Report flooding</p>
            </button>

          </div>

          {/* INCIDENT STATUS */}
          <div className="status-panel">

            <div className="panel-title">
              <div>
                <p>LIVE RESPONSE</p>
                <h2>Incident Status</h2>
              </div>

              <div className="status-online">
                <span></span>
                System Operational
              </div>
            </div>

            {incident ? (
              <div className="active-incident">

                <div className="incident-icon">
                  🚨
                </div>

                <div className="incident-info">
                  <h3>{incident.type}</h3>

                  <p>
                    Emergency reported at{" "}
                    <strong>{incident.time}</strong>
                  </p>

                  <div className="response-status">
                    <span></span>
                    Response team notified
                  </div>
                </div>

                <button
                  className="resolve-button"
                  onClick={clearEmergency}
                >
                  RESOLVE INCIDENT
                </button>

              </div>
            ) : (
              <div className="no-incident">
                <div>🟢</div>
                <h3>No Active Emergencies</h3>
                <p>
                  Campus emergency systems are monitoring for incidents.
                </p>
              </div>
            )}

          </div>

          {/* CAMPUS MAP */}
          <div className="map-section">

            <div className="section-heading left">
              <p>EVACUATION ROUTER</p>
              <h2>Campus Safety Map</h2>
              <span>
                Find the safest evacuation area during an emergency.
              </span>
            </div>

            <div className="campus-map">

              <div className="map-road road-one"></div>
              <div className="map-road road-two"></div>

              <div className="building building-one">
                🏫
                <span>Main Building</span>
              </div>

              <div className="building building-two">
                🧪
                <span>Science Block</span>
              </div>

              <div className="building building-three">
                📚
                <span>Library</span>
              </div>

              <div className="building building-four">
                🏥
                <span>Medical Center</span>
              </div>

              <div className="safe-zone">
                <div>✓</div>
                <span>SAFE ZONE</span>
              </div>

              <div className="you-are-here">
                <div>📍</div>
                <span>You are here</span>
              </div>

            </div>

            <div className="map-legend">
              <span>
                <i className="legend-blue"></i>
                Campus Building
              </span>

              <span>
                <i className="legend-green"></i>
                Safe Zone
              </span>

              <span>
                <i className="legend-red"></i>
                Emergency
              </span>
            </div>

          </div>

          {/* FEATURES */}
          <section className="features">

            <div className="feature">
              <div>⚡</div>
              <h3>Early Warning</h3>
              <p>
                Detect emergency situations quickly and notify campus users.
              </p>
            </div>

            <div className="feature">
              <div>🗺️</div>
              <h3>Evacuation Router</h3>
              <p>
                Find safer routes and emergency assembly points.
              </p>
            </div>

            <div className="feature">
              <div>📢</div>
              <h3>Instant Alerts</h3>
              <p>
                Notify students, staff and emergency teams immediately.
              </p>
            </div>

          </section>

        </section>

      </main>

      {/* FOOTER */}
      <footer>
        <p>
          🛡️ CampusSafe AI • Smart Campus Emergency Response
        </p>

        <span>
          Built for safer campuses
        </span>
      </footer>

    </div>
  );
}

export default App;