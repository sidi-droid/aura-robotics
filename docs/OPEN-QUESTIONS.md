# Open Questions and Unresolved Decisions

Items that must be settled before the BOM is frozen and CAD begins. These are
recorded rather than silently resolved, because each one changes downstream work.

---

## 1. Drive motor type (blocking — affects BOM, controllers and firmware)

| Source | Specification |
|---|---|
| Project proposal / BOM | 6 × **planetary BLDC motors** with encoders + 6 × BLDC motor controllers (₹36,000 + ₹18,000) |
| Most recent direction | **High-torque brushed DC gear motors** with encoders, driven through a motor driver |

**Why it matters**

- **Controllers differ.** BLDC needs commutation-capable ESCs. Brushed DC needs a
  simpler H-bridge style driver.
- **Firmware differs.** BLDC control involves commutation and often vector control
  or an observer for speed feedback. Brushed DC is a PWM command with encoder
  feedback and a PID loop.
- **Cost differs.** The BLDC line items total ₹54,000 in the current BOM.
- **Power design differs.** Current draw profiles and driver rails are not the same.

**Action:** confirm the motor class, then update the BOM, the electronics plan,
and the firmware approach together.

---

## 2. IMU redundancy

The BOM lists a discrete **9-axis IMU**, and the **Intel RealSense D455 already
contains its own IMU**.

Decide whether to:

- use the D455 internal IMU and drop the discrete part, or
- keep the discrete IMU as the primary source for robot orientation and treat the
  camera IMU as camera-frame only.

If both are used, time synchronisation and frame transforms must be defined
explicitly. Resolve before the wiring diagram is frozen.

---

## 3. Ten pre-CAD questions (from the proposal, still unanswered)

1. Final dimensions
2. Wheel size
3. Motor selection *(blocked by item 1)*
4. Battery location
5. Sensor locations
6. Jetson location
7. ESP32 location
8. LiDAR location
9. Future arm mounting
10. Cable routing

CAD should not begin until these are answered.

---

## 4. Relationship between AURA and ITS Project 40

Two related but distinct efforts appear in the project documentation:

- **AURA** — a 6WD indoor rover platform on a 36 V pack with a Jetson Orin Nano.
- **ITS Project 40** — a "Mini Self-Driving Car Platform" integrated capstone,
  an Ackermann-steered vehicle with lane and traffic-sign following.

They share compute and camera choices but differ in chassis, drive
configuration, and mission. Clarify whether AURA is the delivery vehicle for the
Project 40 capstone, or whether they are separate deliverables that share parts.
This determines whether they belong in one repository or two.

---

## 5. Licence

The proposal states an intent to maintain AURA as an open-source platform, but no
licence has been selected. Until a `LICENSE` file exists, default copyright
applies and no reuse rights are granted.

---

## 6. Course specification document

`ITS_Projects_36-40_Specifications.pdf` (authored by the course instructor) was
deliberately **not committed**. It is third-party material and its redistribution
terms are unknown. Add it manually if the team confirms that is acceptable.
