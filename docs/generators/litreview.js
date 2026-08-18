const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, PageBreak, ExternalHyperlink, TabStopType, TabStopPosition,
  Table, TableRow, TableCell, WidthType, ShadingType, VerticalAlign, PageOrientation
} = require('docx');
const fs = require('fs');

const NAVY = "123A63";
const BLUE = "1A5691";
const GREY = "555555";

const papers = [
  {
    n: 1,
    title: "RTAB-Map as an Open-Source Lidar and Visual Simultaneous Localization and Mapping Library for Large-Scale and Long-Term Online Operation",
    authors: "Mathieu Labbé, François Michaud",
    year: "2019",
    venue: "Journal of Field Robotics, Vol. 36, Issue 2, pp. 416–446",
    publisher: "Wiley (Journal of Field Robotics)",
    doi: "https://doi.org/10.1002/rob.21831",
    introduction: "Simultaneous Localization and Mapping (SLAM) is a fundamental capability for autonomous mobile robots because the robot must simultaneously estimate its own position and construct a representation of an unknown environment. The authors present RTAB-Map as an open-source SLAM framework capable of supporting different sensor configurations, including visual and LiDAR-based systems.",
    objective: "The objective is to provide a flexible SLAM framework that can operate on different robotic platforms while supporting both visual and LiDAR sensing, long-term operation, loop-closure detection, and large-scale mapping.",
    methodology: [
      ["Sensors/Platforms", "RGB-D cameras, stereo cameras, LiDAR sensors, and mobile robotic platforms."],
      ["SLAM Framework", "RTAB-Map uses appearance-based loop-closure detection combined with graph-based optimization."],
      ["Visual SLAM", "RGB-D and stereo visual information are used to estimate motion and construct maps."],
      ["LiDAR SLAM", "Laser scans can be incorporated for 2D or 3D mapping and localization."],
      ["Memory Management", "RTAB-Map uses memory-management techniques to support long-term operation and large environments."],
      ["Evaluation", "The system is evaluated quantitatively and qualitatively using several real-world datasets, including KITTI, EuRoC, TUM RGB-D, and datasets collected using a PR2 robot."]
    ],
    results: "The study demonstrates that RTAB-Map can support different SLAM configurations depending on the available sensors and computational constraints. The authors compare visual and LiDAR approaches and show that the most suitable configuration depends on the robot, sensor setup, environment, computational resources, and required accuracy.",
    advantages: [
      "Supports both visual and LiDAR SLAM within one framework.",
      "Suitable for RGB-D cameras such as the Intel RealSense D455 used in our project.",
      "Supports large-scale and long-term mapping.",
      "Open-source and designed for integration with different robotic platforms.",
      "Provides loop-closure detection, which helps reduce accumulated localization drift."
    ],
    limitations: [
      "Different sensor configurations have different computational requirements.",
      "Visual SLAM performance can degrade in environments with poor visual features.",
      "LiDAR-based approaches can be computationally expensive for detailed 3D mapping.",
      "Performance depends heavily on sensor calibration and accurate TF transformations."
    ],
    critical: "This is one of the most directly relevant papers to our proposed autonomous rover because our system combines a LiDAR sensor with an RGB-D camera and an external IMU. RTAB-Map provides a practical framework for combining these sensing modalities rather than requiring separate SLAM systems. Its open-source implementation also makes it appropriate for deployment on embedded robotic computers.",
    relevance: "RTAB-Map is proposed as the primary SLAM and localization framework for our autonomous rover. The RealSense D455 provides RGB-D information, while the LiDAR provides additional geometric information for mapping and localization. The external IMU can provide inertial information to improve motion estimation.",
    conclusion: "This paper demonstrates RTAB-Map as a flexible open-source SLAM framework supporting visual and LiDAR sensing for autonomous robots. Its multi-sensor capabilities and compatibility with RGB-D cameras make it highly relevant to our proposed autonomous navigation system.",
    reference: "Labbé, M., & Michaud, F. (2019). RTAB-Map as an open-source lidar and visual simultaneous localization and mapping library for large-scale and long-term online operation. Journal of Field Robotics, 36(2), 416–446. https://doi.org/10.1002/rob.21831"
  },
  {
    n: 2,
    title: "ORB-SLAM3: An Accurate Open-Source Library for Visual, Visual-Inertial, and Multimap SLAM",
    authors: "Carlos Campos, Richard Elvira, Juan J. Gómez Rodríguez, José M. M. Montiel, Juan D. Tardós",
    year: "2021",
    venue: "IEEE Transactions on Robotics, Vol. 37, Issue 6",
    publisher: "IEEE",
    doi: "https://doi.org/10.1109/TRO.2021.3075644",
    introduction: "Reliable localization is essential for autonomous robots because navigation depends on knowing the robot's position and orientation. Visual-inertial SLAM combines camera observations with inertial measurements to improve robustness and localization accuracy. ORB-SLAM3 extends previous visual SLAM systems to support visual, visual-inertial, and multi-map configurations.",
    objective: "The objective is to develop a robust SLAM system capable of operating with monocular, stereo, and RGB-D cameras, with or without inertial measurements, while maintaining accurate localization in both indoor and outdoor environments.",
    methodology: [
      ["Sensors", "Monocular, stereo, and RGB-D cameras with optional IMU measurements."],
      ["Visual Features", "ORB features are used for visual tracking and map construction."],
      ["Visual-Inertial SLAM", "Camera observations are tightly integrated with IMU measurements using maximum-a-posteriori estimation."],
      ["Multi-Map System", "Multiple maps can be maintained and later merged when previously visited areas are recognized."],
      ["Loop Closure", "Place recognition is used to detect previously visited locations and correct accumulated drift."],
      ["Evaluation", "The system is evaluated using EuRoC and TUM-VI datasets under multiple sensor configurations."]
    ],
    results: "The authors report that ORB-SLAM3 provides robust performance across different sensor configurations. The visual-inertial configuration achieves high localization accuracy, including an average accuracy of approximately 3.5 cm on the EuRoC drone dataset and 9 mm for a specific TUM-VI handheld sequence.",
    advantages: [
      "Supports RGB-D cameras.",
      "Supports external IMU integration.",
      "Provides visual-inertial SLAM.",
      "Supports multiple maps.",
      "Provides loop-closure and place-recognition capabilities.",
      "Demonstrates strong localization accuracy."
    ],
    limitations: [
      "Visual SLAM depends on sufficient visual features.",
      "IMU calibration and synchronization are important for reliable visual-inertial operation.",
      "The system can require significant computational resources.",
      "Dynamic environments containing many moving objects can negatively affect visual feature tracking."
    ],
    critical: "ORB-SLAM3 is particularly valuable for understanding how an external IMU can complement camera-based localization. Although our primary proposed SLAM framework is RTAB-Map, ORB-SLAM3 provides an important alternative and theoretical reference for visual-inertial localization. It also supports the decision to integrate the external IMU rather than depending entirely on the D455's internal motion sensor.",
    relevance: "The paper is relevant to the proposed rover because our system includes an RGB-D camera and an external IMU. Visual-inertial techniques can potentially improve localization when visual information alone becomes unreliable.",
    conclusion: "ORB-SLAM3 demonstrates that combining visual information with IMU measurements can provide robust and accurate localization. Its support for RGB-D cameras and external inertial sensing makes it an important reference for the localization architecture of our autonomous rover.",
    reference: "Campos, C., Elvira, R., Gómez Rodríguez, J. J., Montiel, J. M. M., & Tardós, J. D. (2021). ORB-SLAM3: An accurate open-source library for visual, visual-inertial, and multimap SLAM. IEEE Transactions on Robotics, 37(6), 1874–1890. https://doi.org/10.1109/TRO.2021.3075644"
  },
  {
    n: 3,
    title: "Benchmarking YOLOv8–YOLOv12 for Real-Time Object Detection on Single-Board Computers",
    authors: "Omar Shalash, Esraa Khatab, Ahmed El-Agamy, Loay Elmokadem, Yasmin Abouelsaad, Jasser Zaki, Mohamed El-Sayed, Hany Said",
    year: "2026",
    venue: "Machine Learning and Knowledge Extraction, Vol. 8, Issue 7, Article 204",
    publisher: "MDPI (Machine Learning and Knowledge Extraction)",
    doi: "https://doi.org/10.3390/make8070204",
    introduction: "Real-time object detection is an essential capability for autonomous robots operating on embedded hardware, where detection must run alongside navigation and control under strict compute and power budgets. The YOLO family has evolved rapidly, while single-board computers (SBCs) have advanced to support increasingly complex AI models at the edge. This study benchmarks recent YOLO versions across several SBC platforms to guide practical edge deployment.",
    objective: "The objective is to provide a comprehensive benchmark of YOLO versions 8 through 12 across a range of single-board computers under different power modes, so that developers can select the optimal YOLO variant and hardware configuration for real-time edge object detection.",
    methodology: [
      ["Models", "YOLOv8, YOLOv9, YOLOv10, YOLOv11 and YOLOv12 object-detection models are evaluated."],
      ["Platforms", "Single-board computers including Raspberry Pi 4/5, NVIDIA Jetson Nano, NVIDIA Jetson Orin and LattePanda, tested under different power modes."],
      ["Dataset", "The COCO (Common Objects in Context) dataset is used for evaluation."],
      ["Metrics", "Inference speed (FPS), detection accuracy (mAP), RAM usage and computational complexity (FLOPs) are measured."],
      ["Analysis", "Trade-offs between detection quality, speed, memory and power are compared across model–platform combinations."]
    ],
    results: "The study reports the comparative speed, accuracy, memory and power characteristics of each YOLO version on each board, showing that the best configuration depends on balancing performance requirements against system and power constraints. It identifies which YOLO variants and SBC configurations are most suitable for real-time edge deployment.",
    advantages: [
      "Benchmarks the most recent YOLO versions (v8–v12) rather than a single model.",
      "Directly evaluates NVIDIA Jetson platforms, including Jetson Orin, relevant to our compute hardware.",
      "Reports practical edge metrics — FPS, mAP, RAM and FLOPs — under different power modes.",
      "Provides concrete guidance for selecting a model and board for real-time deployment.",
      "Published as a peer-reviewed journal article."
    ],
    limitations: [
      "Evaluation uses the general COCO dataset, so project-specific objects may require fine-tuning.",
      "Results are tied to the specific boards and power modes tested.",
      "It does not evaluate our exact Jetson Orin Nano configuration or sensor pipeline.",
      "Detection accuracy still trades off against speed and memory on constrained hardware."
    ],
    critical: "This paper is highly relevant because it directly addresses the practical question our project faces: which YOLO model can run in real time on an embedded Jetson platform. Rather than reporting accuracy on powerful desktop GPUs, it provides empirical FPS, memory and accuracy figures on Jetson-class hardware, which is exactly the constraint governing our perception design.",
    relevance: "The benchmark guides the selection of a YOLO version for real-time person and object detection on our Jetson Orin Nano. Detected objects can then be associated with RealSense depth information to estimate distance and position relative to the rover, with model choice constrained by the measured speed and memory limits.",
    conclusion: "The study demonstrates that selecting a YOLO model for edge deployment requires balancing speed, accuracy, memory and power across specific hardware. Its Jetson-focused benchmarks provide an appropriate, up-to-date reference for implementing real-time perception on our autonomous rover.",
    reference: "Shalash, O., Khatab, E., El-Agamy, A., Elmokadem, L., Abouelsaad, Y., Zaki, J., El-Sayed, M., & Said, H. (2026). Benchmarking YOLOv8–YOLOv12 for real-time object detection on single-board computers. Machine Learning and Knowledge Extraction, 8(7), 204. https://doi.org/10.3390/make8070204"
  },
  {
    n: 4,
    title: "ROS-Based Navigation and Obstacle Avoidance: A Study of Architectures, Methods, and Trends",
    authors: "Zhe Wei, Sen Wang, Kangyelin Chen, Fang Wang",
    year: "2025",
    venue: "Sensors, Vol. 25, Issue 14, Article 4306",
    publisher: "MDPI (Sensors)",
    doi: "https://doi.org/10.3390/s25144306",
    introduction: "Autonomous navigation requires a robot to localize itself, model its environment, plan safe paths and avoid obstacles while executing those paths. ROS provides a modular framework for integrating these capabilities, and its navigation stack has become a standard reference architecture. This paper reviews the architectures, methods and trends of ROS-based navigation and obstacle avoidance.",
    objective: "The objective is to provide a systematic examination of the ROS-based navigation stack and its obstacle-avoidance mechanisms, analysing the architecture and implementation principles of the core modules and comparing widely used local planners.",
    methodology: [
      ["Approach", "A structured review and analysis of the ROS-based navigation stack architecture and its core modules."],
      ["Modules", "Global planning, local planning, localization, costmaps and recovery behaviours are examined."],
      ["Local Planners", "Common local planners such as the Dynamic Window Approach (DWA) and Timed Elastic Band (TEB) are compared."],
      ["Obstacle Avoidance", "Obstacle-avoidance mechanisms and their integration into the navigation pipeline are analysed."],
      ["Trends", "Methods and research trends across ROS-based navigation systems are surveyed."]
    ],
    results: "The study clarifies how the modules of a ROS navigation stack fit together, compares the behaviour and trade-offs of common local planners, and identifies methodological trends. It provides a consolidated reference for understanding how planning, localization and obstacle avoidance are implemented within ROS.",
    advantages: [
      "Provides a comprehensive, peer-reviewed overview of ROS-based navigation, including the Nav2-style stack.",
      "Compares local planners (DWA, TEB) relevant to our path-planning choices.",
      "Explains the architecture and role of each navigation module.",
      "Consolidates methods and trends useful for design decisions.",
      "Published as a journal article rather than a single conference case study."
    ],
    limitations: [
      "As a review, it does not implement navigation on our specific rover or sensors.",
      "It covers ROS-based navigation broadly rather than solely ROS 2 / Nav2.",
      "It does not address our particular RealSense D455, LiDAR and external IMU combination.",
      "General findings still require validation on our own hardware and environment."
    ],
    critical: "This paper is valuable for our project because it provides the architectural grounding for the navigation layer of our rover. Understanding how the ROS navigation modules interact, and how local planners such as DWA and TEB differ, directly informs how we configure Nav2 and select a planner for safe indoor path following.",
    relevance: "The reviewed architecture maps onto the navigation layer of our rover: SLAM/localization supplies the pose and map, while the navigation stack uses costmaps and a local planner to generate safe paths. The comparison of planners guides our configuration of Nav2 for obstacle avoidance.",
    conclusion: "The paper provides a systematic, journal-reviewed account of ROS-based navigation architectures, planners and obstacle-avoidance methods. It offers a strong architectural and methodological reference for implementing autonomous navigation on our Jetson-based rover.",
    reference: "Wei, Z., Wang, S., Chen, K., & Wang, F. (2025). ROS-based navigation and obstacle avoidance: A study of architectures, methods, and trends. Sensors, 25(14), 4306. https://doi.org/10.3390/s25144306"
  },
  {
    n: 5,
    title: "Research and Implementation of Autonomous Navigation for Mobile Robots Based on SLAM Algorithm under ROS",
    authors: "Jianwei Zhao, Shengyi Liu, Jinyu Li",
    year: "2022",
    venue: "Sensors, Vol. 22, Issue 11, Article 4172",
    publisher: "MDPI (Sensors)",
    doi: "https://doi.org/10.3390/s22114172",
    introduction: "Autonomous navigation of an indoor mobile robot depends on accurate mapping, reliable localization and efficient path planning. Developing and testing these capabilities in a simulator before deploying to hardware reduces risk and speeds development. This paper studies and implements SLAM-based autonomous navigation for an indoor mobile robot under ROS.",
    objective: "The objective is to address problems of low mapping accuracy, slow path-planning efficiency and high radar-frequency requirements during indoor mapping and navigation, and to implement an improved SLAM and navigation pipeline for a mobile robot under ROS.",
    methodology: [
      ["Middleware", "The system is built under the Robot Operating System (ROS)."],
      ["Simulation", "A map environment is constructed and tested in the Gazebo simulator."],
      ["Sensing", "LiDAR and odometry data are integrated to build the map and support localization."],
      ["SLAM", "A SLAM algorithm performs scanning, mapping and localization of the indoor environment."],
      ["Path Planning", "An improved A* algorithm is used for global path planning, with obstacle-avoidance navigation."],
      ["Evaluation", "Mapping accuracy, path-planning efficiency and autonomous navigation are evaluated through simulation experiments."]
    ],
    results: "The study reports improved mapping accuracy and path-planning efficiency and demonstrates autonomous obstacle-avoidance navigation for an indoor mobile robot. It shows that a Gazebo-based simulation workflow with LiDAR and odometry can validate SLAM and navigation before physical deployment.",
    advantages: [
      "Demonstrates a Gazebo simulation workflow for SLAM and navigation.",
      "Integrates LiDAR and odometry for indoor mapping and localization, as in our rover.",
      "Uses an improved A* planner to increase path-planning efficiency.",
      "Focuses on indoor autonomous navigation, matching our use case.",
      "Published as a peer-reviewed journal article."
    ],
    limitations: [
      "The work is implemented under ROS 1 rather than ROS 2 / Nav2.",
      "It is validated primarily in simulation on a specific platform.",
      "It focuses on LiDAR-based navigation and does not include RGB-D or neural-network perception.",
      "Real-world performance still depends on sensor calibration and robot-specific parameters."
    ],
    critical: "This paper is valuable because it supports our simulation-first development strategy. Building the map and testing SLAM and navigation in Gazebo before deploying to the physical rover reduces trial-and-error on hardware, and its LiDAR-plus-odometry indoor mapping closely parallels our own sensing approach.",
    relevance: "The paper supports our proposed workflow of developing the rover's robot model, SLAM, localization and navigation in simulation before transferring to the physical Jetson-based platform. It is particularly relevant to our indoor LiDAR-based mapping and path planning.",
    conclusion: "The paper demonstrates that SLAM-based autonomous navigation can be developed and validated in a ROS/Gazebo simulation and applied to indoor mobile robots. It provides a practical, journal-reviewed development methodology for our autonomous rover project.",
    reference: "Zhao, J., Liu, S., & Li, J. (2022). Research and implementation of autonomous navigation for mobile robots based on SLAM algorithm under ROS. Sensors, 22(11), 4172. https://doi.org/10.3390/s22114172"
  }
];

// ---------- helpers ----------
function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 200, after: 60 },
    children: [new TextRun({ text, bold: true, size: 24, color: NAVY })]
  });
}
function body(text) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 22 })]
  });
}
function bullet(text, extraRuns) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40, line: 264 },
    children: extraRuns || [new TextRun({ text, size: 22 })]
  });
}
function labelBullet(label, text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40, line: 264 },
    children: [
      new TextRun({ text: label + ": ", bold: true, size: 22, color: BLUE }),
      new TextRun({ text, size: 22 })
    ]
  });
}
function kv(label, value, isLink) {
  const runs = [new TextRun({ text: label + ": ", bold: true, size: 22, color: BLUE })];
  if (isLink) {
    runs.push(new ExternalHyperlink({
      link: value,
      children: [new TextRun({ text: value, size: 22, color: "0563C1", underline: {} })]
    }));
  } else {
    runs.push(new TextRun({ text: value, size: 22 }));
  }
  return new Paragraph({ spacing: { after: 40 }, children: runs });
}

// ---- Title block (portrait section) ----
const titleChildren = [];
titleChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 1200, after: 60 },
  children: [new TextRun({ text: "Literature Review", bold: true, size: 52, color: NAVY })]
}));
titleChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 40 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "4F9BD9", space: 8 } },
  children: [new TextRun({ text: "SLAM, Perception and ROS 2 Navigation for an Autonomous Indoor Rover", italics: true, size: 26, color: GREY })]
}));
titleChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 300, after: 0 },
  children: [new TextRun({ text: "Siddhant Amin", bold: true, size: 26 })]
}));
titleChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 0 },
  children: [new TextRun({ text: "Registration No. 2404447", size: 22, color: GREY })]
}));
titleChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 0 },
  children: [new TextRun({ text: "Course: Hadoop", size: 22, color: GREY })]
}));

// ---- Summary table (landscape section) ----
const COLS = [1600, 2500, 1750, 2500, 2400, 2930]; // sum = 13680
const HEADERS = ["Author / Year", "Method", "Sensors / Platform", "Reported Result", "Limitation", "Relevance to Our Project"];
const tableRows = [
  {
    ay: "Labbé & Michaud, 2019 (J. Field Robotics, DOI: 10.1002/rob.21831)",
    method: "RTAB-Map: appearance-based loop-closure detection + graph-based optimization; unifies visual (RGB-D/stereo) and LiDAR SLAM; memory management for long-term, large-scale operation.",
    sensors: "RGB-D, stereo and LiDAR sensors; mobile platforms (incl. PR2).",
    result: "Supports multiple SLAM configurations; the best setup depends on robot, sensors, environment, compute and required accuracy. Evaluated on KITTI, EuRoC, TUM RGB-D and PR2 datasets.",
    limitation: "Compute cost varies by configuration; visual SLAM degrades with poor features; detailed 3D LiDAR mapping is expensive; sensitive to calibration and TF accuracy.",
    relevance: "Primary SLAM/localization framework — fuses our RealSense D455 (RGB-D), LiDAR and external IMU within one open-source stack."
  },
  {
    ay: "Campos et al., 2021 (IEEE TRO, DOI: 10.1109/TRO.2021.3075644)",
    method: "ORB-SLAM3: ORB-feature visual and visual-inertial SLAM; tight IMU fusion via MAP estimation; multi-map merging; place-recognition loop closure.",
    sensors: "Monocular, stereo and RGB-D cameras with optional IMU.",
    result: "Robust across configurations; ~3.5 cm average accuracy on EuRoC (drone) and ~9 mm on a TUM-VI handheld sequence.",
    limitation: "Requires sufficient visual features; IMU calibration/synchronisation critical; computationally demanding; degrades in dynamic scenes.",
    relevance: "Key reference for visual-inertial localization; supports pairing an external IMU with the D455 as a fallback when vision alone is unreliable."
  },
  {
    ay: "Shalash et al., 2026 (MDPI Mach. Learn. Knowl. Extr., DOI: 10.3390/make8070204)",
    method: "Comprehensive benchmark of YOLOv8–YOLOv12 across single-board computers under different power modes; predicts object locations/classes directly from images.",
    sensors: "RGB camera; SBCs incl. Raspberry Pi 4/5, Jetson Nano, Jetson Orin, LattePanda; COCO dataset.",
    result: "Reports comparative FPS, mAP, RAM and FLOPs per model/board; best configuration depends on balancing performance against system and power constraints.",
    limitation: "General COCO dataset (may need fine-tuning); results tied to tested boards/power modes; does not cover our exact Jetson Orin Nano pipeline; accuracy trades off with speed/memory.",
    relevance: "Guides selecting a YOLO version for real-time person/object detection on our Jetson Orin Nano; detections fused with RealSense depth for distance/position."
  },
  {
    ay: "Wei et al., 2025 (MDPI Sensors, DOI: 10.3390/s25144306)",
    method: "Systematic review of the ROS navigation stack architecture and obstacle-avoidance modules; compares local planners (DWA, TEB) and surveys methods/trends.",
    sensors: "Review of ROS-based navigation systems (architecture-level).",
    result: "Clarifies how navigation modules interact, compares planner trade-offs, and identifies methodological trends across ROS navigation.",
    limitation: "Review, not an implementation on our rover; covers ROS navigation broadly rather than solely ROS 2 / Nav2; does not address our D455 + LiDAR + IMU combination.",
    relevance: "Architectural grounding for our Nav2 navigation layer; planner comparison (DWA vs. TEB) informs our path-planning and obstacle-avoidance configuration."
  },
  {
    ay: "Zhao, Liu & Li, 2022 (MDPI Sensors, DOI: 10.3390/s22114172)",
    method: "SLAM-based autonomous navigation under ROS; map built and tested in Gazebo; LiDAR + odometry fusion; improved A* global path planning.",
    sensors: "Indoor mobile robot; ROS; Gazebo; LiDAR + odometry.",
    result: "Improved mapping accuracy and path-planning efficiency; demonstrates autonomous obstacle-avoidance navigation validated in simulation.",
    limitation: "Implemented under ROS 1 (not ROS 2 / Nav2); validated mainly in simulation; LiDAR-only (no RGB-D / neural perception); depends on calibration and parameters.",
    relevance: "Supports our sim-first workflow — build the robot model, SLAM and navigation in Gazebo before deploying; directly relevant to indoor LiDAR mapping and path planning."
  }
];

function tCell(content, w, opts) {
  opts = opts || {};
  const runs = [new TextRun({
    text: content,
    size: opts.header ? 20 : 18,
    bold: !!opts.header,
    color: opts.header ? "FFFFFF" : "222222"
  })];
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    shading: { type: ShadingType.CLEAR, fill: opts.fill || "FFFFFF" },
    margins: { top: 80, bottom: 80, left: 110, right: 110 },
    children: [new Paragraph({
      spacing: { after: 0, line: 240 },
      alignment: opts.header ? AlignmentType.LEFT : AlignmentType.LEFT,
      children: runs
    })]
  });
}

const headerRow = new TableRow({
  tableHeader: true,
  children: HEADERS.map((h, i) => tCell(h, COLS[i], { header: true, fill: NAVY }))
});
const bodyRows = tableRows.map((r, ri) => {
  const fill = ri % 2 === 1 ? "F4F6F9" : "FFFFFF";
  return new TableRow({ children: [
    tCell(r.ay, COLS[0], { fill }),
    tCell(r.method, COLS[1], { fill }),
    tCell(r.sensors, COLS[2], { fill }),
    tCell(r.result, COLS[3], { fill }),
    tCell(r.limitation, COLS[4], { fill }),
    tCell(r.relevance, COLS[5], { fill })
  ]});
});

const summaryTable = new Table({
  columnWidths: COLS,
  width: { size: 13680, type: WidthType.DXA },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 4, color: "B9C2CE" },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: "B9C2CE" },
    left: { style: BorderStyle.SINGLE, size: 4, color: "B9C2CE" },
    right: { style: BorderStyle.SINGLE, size: 4, color: "B9C2CE" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "B9C2CE" },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "B9C2CE" }
  },
  rows: [headerRow, ...bodyRows]
});

const tableChildren = [
  new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text: "Table 1 — Summary of Reviewed Literature (SLAM, Perception & Navigation)", bold: true, size: 30, color: NAVY })]
  }),
  summaryTable,
  new Paragraph({
    spacing: { before: 160 },
    children: [new TextRun({
      text: "Sources: Labbé & Michaud (2019); Campos et al. (2021); Shalash et al. (2026); Wei et al. (2025); Zhao, Liu & Li (2022).",
      italics: true, size: 18, color: GREY
    })]
  })
];

// ---- Papers (portrait section) ----
const children = [];
papers.forEach((p, idx) => {
  if (idx > 0) children.push(new Paragraph({ children: [new PageBreak()] }));

  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 40 },
    children: [new TextRun({ text: "Paper " + p.n, bold: true, size: 30, color: NAVY })]
  }));
  children.push(new Paragraph({
    spacing: { after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "D0D8E2", space: 6 } },
    children: [new TextRun({ text: p.title, bold: true, italics: true, size: 24, color: BLUE })]
  }));

  children.push(sectionHeading("1.  Title of the Paper"));
  children.push(body(p.title));

  children.push(sectionHeading("2.  Authors and Publication Details"));
  children.push(kv("Authors", p.authors));
  children.push(kv("Year", p.year));
  children.push(kv("Journal / Conference", p.venue));
  children.push(kv("Publisher", p.publisher));
  children.push(kv("DOI / Link", p.doi, true));

  children.push(sectionHeading("3.  Introduction"));
  children.push(body(p.introduction));

  children.push(sectionHeading("4.  Objective"));
  children.push(body(p.objective));

  children.push(sectionHeading("5.  Methodology"));
  p.methodology.forEach(([l, t]) => children.push(labelBullet(l, t)));

  children.push(sectionHeading("6.  Results and Findings"));
  children.push(body(p.results));

  children.push(sectionHeading("7.  Advantages"));
  p.advantages.forEach(t => children.push(bullet(t)));

  children.push(sectionHeading("8.  Limitations"));
  p.limitations.forEach(t => children.push(bullet(t)));

  children.push(sectionHeading("9.  Critical Analysis"));
  children.push(body(p.critical));

  children.push(sectionHeading("10.  Relevance to the Proposed Project"));
  children.push(body(p.relevance));

  children.push(sectionHeading("11.  Conclusion"));
  children.push(body(p.conclusion));

  children.push(sectionHeading("12.  Reference (APA)"));
  children.push(new Paragraph({
    spacing: { after: 120, line: 276 },
    indent: { left: 720, hanging: 720 },
    children: [new TextRun({ text: p.reference, size: 22 })]
  }));
});

const portraitPage = {
  size: { width: 12240, height: 15840 },
  margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
};
const landscapePage = {
  size: { orientation: PageOrientation.LANDSCAPE, width: 12240, height: 15840 },
  margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 }
};

const doc = new Document({
  creator: "Siddhant Amin",
  title: "Literature Review",
  styles: {
    default: { document: { run: { font: "Calibri" } } }
  },
  sections: [
    { properties: { page: portraitPage }, children: titleChildren },
    { properties: { page: portraitPage }, children },
    { properties: { page: landscapePage }, children: tableChildren }
  ]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("AURA_Literature_Review.docx", buf);
  console.log("written", buf.length);
});
