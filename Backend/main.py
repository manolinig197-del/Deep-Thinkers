from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional

app = FastAPI(
    title="CampusSafe AI",
    description="Multimodal Campus Emergency Early-Warning & Autonomous Crowd Evacuation Router",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# CAMPUS DATA
# ---------------------------------------------------------

campus = {
    "buildings": [
        {
            "id": "main",
            "name": "Main Building",
            "x": 12,
            "y": 15
        },
        {
            "id": "science",
            "name": "Science Block",
            "x": 78,
            "y": 15
        },
        {
            "id": "library",
            "name": "Library",
            "x": 15,
            "y": 72
        },
        {
            "id": "medical",
            "name": "Medical Center",
            "x": 78,
            "y": 72
        }
    ],
    "safe_zones": [
        {
            "id": "safe-a",
            "name": "Assembly Zone A",
            "x": 50,
            "y": 38,
            "capacity": 500
        },
        {
            "id": "safe-b",
            "name": "Assembly Zone B",
            "x": 52,
            "y": 82,
            "capacity": 300
        }
    ]
}


# ---------------------------------------------------------
# SIMULATED CAMERA INTELLIGENCE
# ---------------------------------------------------------

camera_data = [
    {
        "id": "CAM-01",
        "location": "Main Building",
        "people": 42,
        "density": 35,
        "movement": "Normal",
        "status": "Normal",
        "hazard": None
    },
    {
        "id": "CAM-02",
        "location": "Science Block",
        "people": 87,
        "density": 76,
        "movement": "Fast",
        "status": "Warning",
        "hazard": "Smoke detected"
    },
    {
        "id": "CAM-03",
        "location": "Library Road",
        "people": 31,
        "density": 28,
        "movement": "Normal",
        "status": "Normal",
        "hazard": None
    }
]


# ---------------------------------------------------------
# ROUTE ENGINE
# ---------------------------------------------------------

routes = {
    "main": {
        "safe-a": {
            "distance": 180,
            "time": 3,
            "path": [
                "Main Building",
                "Central Corridor",
                "Assembly Zone A"
            ]
        },
        "safe-b": {
            "distance": 320,
            "time": 6,
            "path": [
                "Main Building",
                "Library Road",
                "Assembly Zone B"
            ]
        }
    },

    "science": {
        "safe-a": {
            "distance": 160,
            "time": 3,
            "path": [
                "Science Block",
                "East Corridor",
                "Assembly Zone A"
            ]
        },
        "safe-b": {
            "distance": 290,
            "time": 5,
            "path": [
                "Science Block",
                "South Road",
                "Assembly Zone B"
            ]
        }
    },

    "library": {
        "safe-a": {
            "distance": 210,
            "time": 4,
            "path": [
                "Library",
                "Central Road",
                "Assembly Zone A"
            ]
        },
        "safe-b": {
            "distance": 140,
            "time": 2,
            "path": [
                "Library",
                "South Corridor",
                "Assembly Zone B"
            ]
        }
    },

    "medical": {
        "safe-a": {
            "distance": 230,
            "time": 4,
            "path": [
                "Medical Center",
                "Central Road",
                "Assembly Zone A"
            ]
        },
        "safe-b": {
            "distance": 170,
            "time": 3,
            "path": [
                "Medical Center",
                "South Corridor",
                "Assembly Zone B"
            ]
        }
    }
}


# ---------------------------------------------------------
# HEALTH
# ---------------------------------------------------------

@app.get("/")
def home():
    return {
        "project": "CampusSafe AI",
        "status": "ONLINE",
        "version": "2.0",
        "message": "Multimodal emergency system is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "CampusSafe AI backend"
    }


# ---------------------------------------------------------
# CAMERA API
# ---------------------------------------------------------

@app.get("/cameras")
def get_cameras():
    return {
        "timestamp": datetime.now().isoformat(),
        "cameras": camera_data
    }


# ---------------------------------------------------------
# CROWD ANALYSIS
# ---------------------------------------------------------

@app.get("/crowd-analysis")
def crowd_analysis():

    total_people = sum(
        camera["people"]
        for camera in camera_data
    )

    average_density = round(
        sum(camera["density"] for camera in camera_data)
        / len(camera_data)
    )

    warnings = [
        camera
        for camera in camera_data
        if camera["density"] >= 70
        or camera["hazard"] is not None
    ]

    return {
        "total_people": total_people,
        "average_density": average_density,
        "high_risk_cameras": len(warnings),
        "analysis": "Crowd movement analyzed successfully",
        "warnings": warnings
    }


# ---------------------------------------------------------
# HAZARDS
# ---------------------------------------------------------

@app.get("/hazards")
def get_hazards():

    hazards = [
        {
            "id": "HZ-001",
            "type": "SMOKE",
            "location": "Science Block",
            "severity": "HIGH",
            "x": 76,
            "y": 17,
            "active": True
        },
        {
            "id": "HZ-002",
            "type": "BLOCKED_ROUTE",
            "location": "East Corridor",
            "severity": "MEDIUM",
            "x": 67,
            "y": 35,
            "active": True
        }
    ]

    return {
        "hazards": hazards
    }


# ---------------------------------------------------------
# EVACUATION ROUTE
# ---------------------------------------------------------

@app.get("/route")
def get_route(
    location: str = "main",
    blocked: bool = False
):

    location = location.lower()

    if location not in routes:
        location = "main"

    if blocked:

        alternative = routes[location]["safe-b"]

        return {
            "status": "REPLANNED",
            "reason": "Primary evacuation route is blocked",
            "destination": "Assembly Zone B",
            "distance": alternative["distance"],
            "estimated_time": alternative["time"],
            "path": alternative["path"]
        }

    primary = routes[location]["safe-a"]

    return {
        "status": "SAFE",
        "reason": "Primary route available",
        "destination": "Assembly Zone A",
        "distance": primary["distance"],
        "estimated_time": primary["time"],
        "path": primary["path"]
    }


# ---------------------------------------------------------
# EMERGENCY TEST
# ---------------------------------------------------------

@app.post("/test-emergency")
def test_emergency():

    return {
        "status": "ALERT",
        "severity": "HIGH",
        "type": "CAMPUS EMERGENCY",
        "message": "Emergency detected. Evacuation routing activated.",
        "instruction": "Move to the nearest safe assembly zone."
    }


# ---------------------------------------------------------
# REPORT INCIDENT
# ---------------------------------------------------------

@app.post("/incident/{incident_type}")
def report_incident(incident_type: str):

    return {
        "status": "ALERT",
        "incident": incident_type.upper(),
        "time": datetime.now().strftime("%H:%M:%S"),
        "message": "Emergency response workflow activated.",
        "response_team": "Notified"
    }