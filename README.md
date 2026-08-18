# AURA — Autonomous Utility Rover Architecture

A modular, AI-powered autonomous mobile robotics platform for intelligent indoor
navigation, designed to be extended into a mobile manipulator without redesigning
the mobility base.

> **Project status: pre-implementation (Phase 0 / Phase 1).**
> This repository currently contains **planning and design documentation only**.
> No ROS 2 packages, firmware, CAD models, or simulation assets have been written
> yet. The directory tree below is an **empty scaffold** matching the structure
> defined in the project proposal, provided so that code can be dropped into
> agreed locations. See [Current Implementation Status](#current-implementation-status)
> for an explicit accounting of what does and does not exist.

---

## What AURA Is

Most educational autonomous vehicle projects target a single capability such as
lane following, parking, or obstacle avoidance. AURA is instead scoped as a
complete robotics *platform*: a six-wheel rover that can map an unknown indoor
environment, localize itself within it, plan and execute safe paths, detect and
follow people, and run missions autonomously.

The design priority is modularity. Robotic arms, teleoperation, exoskeleton
control, and offline conversational AI are planned as later additions, and the
chassis, power system, and software architecture are intended to accommodate them
without a rebuild.

**Project philosophy: build once, upgrade forever.**

---

## Versioned Scope

### Version 1.0 (target: October) — the only features in scope before release

| Domain | Capability |
|---|---|
| Mobility | 6WD rover; Manual, Assisted and Autonomous modes |
| Navigation | Indoor SLAM, mapping, localization, path planning, waypoint navigation, Return Home |
| Perception | YOLO object detection, person detection, follow a registered user |
| Hardware | Pan-tilt sensor head, RealSense, LiDAR, IMU, wheel encoders |
| Interface | Basic dashboard (live feed, map, pose, battery, compute load, mode, e-stop, logs) |

### Version 2.0 (November onwards) — deliberately deferred

Dual SO-101 robotic arms · DIY exoskeleton controller · DJI teleoperation ·
head tracking · voice interaction · local LLM · Learning from Demonstration.

> Version 1 will not be delayed to implement Version 2 features. The chassis is
> nevertheless designed with mounting points and cable routes so these can be
> added later.

---

## System Architecture

Mission commands flow from the operator through the Jetson compute layer, which
handles perception, navigation, and planning, down to the ESP32 and motor
controllers that drive the rover.

```
Human Operator
      ↓
Mission Commands
      ↓
Jetson Orin Nano  ──  Perception → Navigation
      ↓
    ESP32
      ↓
Motor Controllers
      ↓
   6WD Rover
```

### Software manager layout (Version 1)

Deliberately simplified for the October milestone:

```
Mission Manager
├── Navigation Manager
├── Perception Manager
├── Hardware Manager
├── Dashboard Manager
└── Safety Manager
```

Not implemented in V1 (planned, not deleted): **Manipulation Manager**,
**Teleoperation Manager**.

### Perception design note

Cameras are intended to run **simultaneously** rather than switching. A
Perception Manager arbitrates which camera has priority for the current task
while the others remain streaming in the background — the RealSense handles
global scene and navigation, and future wrist cameras are processed only while
their arm is manipulating.

---

## Hardware

| Component | Qty | Role |
|---|---|---|
| NVIDIA Jetson Orin Nano | 1 | ROS 2, AI, SLAM, navigation, path/mission planning |
| ESP32 | 1 | Motor and servo control, sensor reads, emergency control |
| Intel RealSense D455 | 1 | RGB-D perception, object/person detection (stereo depth) |
| 2D LiDAR | 1 | Mapping, localization, obstacle detection |
| 9-axis IMU | 1 | Orientation, angular velocity, stability |
| Wheel encoders | 6 | Odometry, speed and distance measurement |
| Drive motors with encoders | 6 | Six-wheel drive |
| Motor controllers | 6 | Motor stage |
| 150 mm rubber wheels | 6 | Traction |
| 36 V battery pack + BMS + charger | 1 | Power |
| DC-DC buck converters | 2 | Rail generation |
| Power distribution board | 1 | Distribution |
| Emergency stop | 1 | Independent safety cutoff |
| Custom modular aluminium chassis | 1 | Structure, modular bays, future arm mounts |
| 2-DOF pan-tilt head | 1 | Sensor head articulation |

Indicative Version 1 build cost: **₹1.90–2.00 lakh** (excluding the Jetson Orin
Nano, which is already owned). Full itemised BOM is in the project proposal.

Already available and excluded from cost: Jetson Orin Nano, DJI Goggles 3,
DJI O4 Pro Air Unit, 3D printer and printing materials.

> ⚠️ **Unresolved hardware discrepancy — needs a decision before BOM freeze.**
> The written proposal specifies **planetary BLDC motors** (6 ×), while the most
> recent verbal direction was **high-torque brushed DC gear motors with encoders
> driven through a motor driver**. These imply different motor controllers,
> different firmware, and different BOM lines. This repository does not silently
> pick one. See [`docs/OPEN-QUESTIONS.md`](docs/OPEN-QUESTIONS.md).

---

## Software Stack

| Layer | Technology |
|---|---|
| OS | Ubuntu 22.04 |
| Middleware | ROS 2 Humble |
| Navigation | Nav2 |
| SLAM | RTAB-Map |
| Vision | OpenCV, Ultralytics YOLO |
| Simulation | Gazebo Harmonic |
| CAD | Fusion 360 |
| Languages | Python, C++ |
| Embedded | Arduino IDE / PlatformIO / ESP-IDF |
| Version control | Git + GitHub |

Planned for later stages, not required for V1: NVIDIA Isaac ROS, Isaac Sim,
TensorRT optimisation, MoveIt 2, Hugging Face LeRobot, offline voice AI, local LLMs.

### Machine learning strategy

Core algorithms are **not** trained from scratch. Nav2, RTAB-Map, pre-trained
YOLO models, and OpenCV are used as-is. Custom training is deferred to V2
(custom detection classes, Learning from Demonstration, imitation learning).

---

## Repository Structure

```
AURA/
├── docs/              Proposal, literature reviews, research, notes, reports
│   ├── proposal/      AURA_Project_Proposal.pdf
│   ├── literature/    Literature reviews (AURA + ITS Project 40)
│   └── generators/    Scripts that generate the documents above
├── cad/               Chassis, head, mounts, drawings          [empty]
├── electronics/       Schematics, PCB, power, BOM              [empty]
├── firmware/esp32/    ESP32 motor, servo, safety firmware      [empty]
├── software/
│   ├── ros2_ws/src/   ROS 2 workspace packages                 [empty]
│   ├── navigation/    Nav2 configuration                       [empty]
│   ├── slam/          RTAB-Map configuration                   [empty]
│   ├── perception/    YOLO / OpenCV perception nodes           [empty]
│   ├── mission_manager/  Mission FSM                           [empty]
│   └── utils/                                                  [empty]
├── simulation/        URDF/Xacro, meshes, worlds, Gazebo       [empty]
├── ai/                YOLO configs, datasets, model weights    [empty]
├── testing/           Test logs and trial matrices             [empty]
├── media/             Images, videos, renders                  [empty]
└── resources/                                                  [empty]
```

Directories marked `[empty]` contain only a `.gitkeep`. They are placeholders
derived from the structure specified in the project proposal, not evidence of
existing work.

---

## Development Environment Setup

> These are the **intended** setup steps for the planned stack. They are not yet
> verified against a working build, because no buildable code exists in this
> repository yet.

### 1. Base system

```bash
# Ubuntu 22.04 on the development machine and the Jetson Orin Nano
sudo apt update && sudo apt upgrade -y
```

### 2. ROS 2 Humble

```bash
sudo apt install -y software-properties-common curl
sudo add-apt-repository universe
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key \
  -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] \
  http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" \
  | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

sudo apt update
sudo apt install -y ros-humble-desktop ros-dev-tools
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

### 3. Navigation, SLAM and drivers

```bash
sudo apt install -y \
  ros-humble-navigation2 ros-humble-nav2-bringup \
  ros-humble-rtabmap-ros \
  ros-humble-realsense2-camera \
  ros-humble-robot-localization \
  ros-humble-xacro ros-humble-joint-state-publisher
```

### 4. Python dependencies

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install opencv-python ultralytics numpy
```

### 5. Clone and build

```bash
git clone git@github.com:sidi-droid/aura-robotics.git
cd aura-robotics/software/ros2_ws
colcon build --symlink-install     # no packages to build yet
source install/setup.bash
```

---

## Build and Run

⚠️ **Nothing is runnable yet.** The commands below record the *intended*
entry points once the corresponding packages exist. They will fail today.

```bash
# Simulation
ros2 launch aura_simulation gazebo.launch.py

# SLAM (mapping a new environment)
ros2 launch aura_slam rtabmap.launch.py

# Navigation on a saved map
ros2 launch aura_navigation nav2.launch.py map:=maps/lab.yaml

# Full stack
ros2 launch aura_bringup aura.launch.py
```

---

## Current Implementation Status

### ✅ What exists in this repository

- **Project proposal** (`docs/proposal/`) — 22-page engineering proposal covering
  vision, objectives, architecture, hardware, software stack, sensor
  responsibilities, robot modes, navigation workflow, development timeline,
  full BOM and costing, team roles, milestones, coding standards, success
  criteria, and the long-term roadmap.
- **Literature reviews** (`docs/literature/`) — two reviews, each covering five
  peer-reviewed journal papers with full 12-part analyses and comparison matrices.
- **Document generators** (`docs/generators/`) — the working HTML/CSS and
  Node.js (`docx`) scripts that produce the PDFs and Word documents above. These
  are the only executable code currently in the repository.
- **Repository scaffold and `.gitignore`** tuned for the planned stack.

### ❌ What does NOT exist yet

| Area | Status |
|---|---|
| ROS 2 packages / nodes | Not started |
| Launch files | Not started |
| ESP32 firmware | Not started |
| URDF / Xacro robot model | Not started |
| Gazebo worlds and simulation | Not started |
| Nav2 / RTAB-Map configuration | Not started |
| Perception (YOLO/OpenCV) code | Not started |
| Mission Manager FSM | Not started |
| Dashboard | Not started |
| CAD models and drawings | Not started |
| Wiring diagrams / schematics | Not started |
| Physical hardware assembly | Not started |

### Immediate next steps (Phase 1)

1. Resolve the motor discrepancy and freeze the BOM.
2. Answer the ten pre-CAD questions (dimensions, wheel size, motor selection,
   battery/sensor/Jetson/ESP32/LiDAR placement, arm mounting, cable routing).
3. Build the Fusion 360 chassis concept.
4. Author URDF/Xacro and spawn the robot in Gazebo Harmonic.
5. Stand up the ROS 2 workspace and verify simulated movement.

Target for end of the first working week: a digital AURA driving in simulation.

---

## Configuration Requirements

Nothing in this repository currently requires secrets, API keys, or tokens, and
none are committed. As the project grows, keep the following out of Git — the
`.gitignore` already blocks them:

- Any `.env` file with device addresses, credentials, or cloud keys. Commit a
  `.env.example` with **placeholder** values instead.
- SSH and private keys used to reach the Jetson.
- Trained model weights (`.pt`, `.onnx`, `.engine`) — use Git LFS or an external
  artifact store.
- ROS bags, generated maps, and `build/`, `install/`, `log/` directories.

Machine-specific settings that will need documenting once hardware exists:
serial device paths for the ESP32, camera serial numbers, LiDAR baud rate, and
the ROS domain ID.

---

## Coding Standards

- Commit frequently with meaningful messages.
- Every new feature gets its own branch.
- Never commit broken code to `main`.
- Document all major changes.
- Keep wiring diagrams, CAD files, and documentation inside the repository.

---

## Team

Three members, with the following split defined in the proposal:

| Member | Responsibility | Deliverables |
|---|---|---|
| 1 | Mechanical & CAD | CAD assembly, manufacturing drawings, mechanical BOM |
| 2 | Electronics & Embedded | Wiring diagram, electrical BOM, power system, firmware |
| 3 | AI, Navigation & Software | ROS 2 packages, navigation stack, AI stack, documentation |

---

## Licence

Not yet chosen. The proposal states an intent to maintain AURA as an open-source
platform; the specific licence remains a decision for the team. Until a
`LICENSE` file is added, default copyright applies and no reuse rights are granted.
