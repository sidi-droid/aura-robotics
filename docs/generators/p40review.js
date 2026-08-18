const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, PageBreak, ExternalHyperlink,
  Table, TableRow, TableCell, WidthType, ShadingType, VerticalAlign, PageOrientation
} = require('docx');
const fs = require('fs');

const NAVY = "123A63";
const BLUE = "1A5691";
const GREY = "555555";

const papers = [
  {
    n: 1,
    area: "Lane Detection (Perception)",
    title: "Research on Lane Line Detection Algorithm Based on Instance Segmentation",
    authors: "Wangfeng Cheng, Xuanyao Wang, Bangguo Mao",
    year: "2023",
    venue: "Sensors, Vol. 23, Issue 2, Article 789",
    publisher: "MDPI (Sensors)",
    doi: "https://doi.org/10.3390/s23020789",
    introduction: "Lane detection in complex traffic scenes remains difficult when lane lines are blocked by shadows, roads are blurred, or markings are sparse, which lowers detection accuracy and slows real-time performance. The authors propose a lane detection algorithm based on instance segmentation that is explicitly designed to run on an embedded NVIDIA Jetson platform, making it directly relevant to GPU-accelerated small vehicles.",
    objective: "The objective is to build a lightweight instance-segmentation lane detection network that stays accurate in complex scenes while running in real time, and to deploy it on the embedded Jetson platform with half-precision TensorRT acceleration.",
    methodology: [
      ["Encoder", "An improved lightweight RepVgg-A0 network encodes road images and expands the receptive field."],
      ["Feature Extraction", "A multi-size asymmetric shuffling convolution model targets the sparse and slender shape of lane lines to strengthen feature extraction."],
      ["Decoder", "An adaptive upsampling model restores the feature map to full resolution for pixel-level classification, with a prediction branch that outputs lane line confidence."],
      ["Deployment", "The full algorithm is deployed on the embedded NVIDIA Jetson Nano and accelerated with half-precision (FP16) using the TensorRT framework."],
      ["Evaluation", "Accuracy and frame rate are measured on desktop GPU and on the embedded Jetson platform."]
    ],
    results: "The instance-segmentation lane detector reached 96.7 percent accuracy with 77.5 FPS on the desktop GPU, and after TensorRT FP16 optimization it ran at 27 FPS on the embedded Jetson Nano, demonstrating that an efficient segmentation CNN can deliver accurate real-time lane detection on Jetson-class hardware.",
    advantages: [
      "Designed for and deployed on an NVIDIA Jetson, the same family as our Jetson Orin Nano.",
      "Shows the full TensorRT FP16 optimization path we plan to use.",
      "Robust to shadows, blur and sparse markings, where classical geometric pipelines fail.",
      "The confidence output branch pairs naturally with confidence-gated steering control.",
      "Published as a peer-reviewed journal article."
    ],
    limitations: [
      "The 27 FPS embedded result is on the older Jetson Nano, so figures transfer only as a conservative floor.",
      "Trained on public road datasets, so our indoor track would need a small custom dataset or retraining.",
      "Segmentation output still needs postprocessing into a lane centreline for steering.",
      "The method is purely monocular, so it does not exploit the stereo depth our RealSense D455 also provides.",
      "TensorRT conversion and calibration add an engineering step to the pipeline."
    ],
    critical: "This paper matches our compute platform choice directly. Since our vehicle carries a Jetson Orin Nano, we can afford a learned lane detector rather than a purely classical one, and this work proves the approach on far weaker Jetson hardware. The Orin Nano is several times faster than the original Jetson Nano used here, so the reported 27 FPS is a comfortable lower bound, leaving GPU headroom for the traffic sign network running alongside. One difference worth noting is that the authors work from a single monocular image, whereas our Intel RealSense D455 is a stereo depth camera. We can therefore run their segmentation approach on the D455 colour stream and additionally use the aligned depth map to reject lane candidates at implausible distances, which is an option their monocular setup does not have.",
    relevance: "The paper provides the design template for our lane detection module: a lightweight segmentation CNN running on the RGB stream of our Intel RealSense D455, optimized with TensorRT FP16 on the Jetson, producing per-lane confidence that feeds both the steering controller and the fusion layer. Its robustness in degraded scenes supports reliable lane keeping under the varied lighting of an indoor course.",
    conclusion: "The study demonstrates accurate, real-time, TensorRT-accelerated lane detection on embedded Jetson hardware. It is a strong reference for the lane perception layer we will run on the RealSense D455 colour stream on our Jetson Orin Nano.",
    reference: "Cheng, W., Wang, X., & Mao, B. (2023). Research on lane line detection algorithm based on instance segmentation. Sensors, 23(2), 789. https://doi.org/10.3390/s23020789"
  },
  {
    n: 2,
    area: "Traffic Sign Recognition (AI Perception)",
    title: "Benchmarking YOLOv8 to YOLOv11 Architectures for Real-Time Traffic Sign Recognition in Embedded 1:10 Scale Autonomous Vehicles",
    authors: "Rafael Reveles-Martínez, Hamurabi Gamboa-Rosales, Erika Sánchez-Femat, Javier Saldívar-Pérez, Teodoro Ibarra-Pérez, Luis Carlos Reveles-Gómez, Omar A. Guirette-Barbosa, Jorge I. Galván-Tejada, Carlos E. Galván-Tejada, Huizilopoztli Luna-García, José M. Celaya-Padilla",
    year: "2025",
    venue: "Technologies, Vol. 13, Issue 11, Article 531",
    publisher: "MDPI (Technologies)",
    doi: "https://doi.org/10.3390/technologies13110531",
    introduction: "Traffic sign recognition remains a challenging part of intelligent vehicle systems, especially when processor and memory resources are limited. This work evaluates modern YOLO detectors for real-time sign recognition on a small-scale autonomous vehicle, which makes it one of the closest published matches to a student-scale self-driving car project.",
    objective: "The objective is to benchmark five YOLO model sizes, from Nano to XLarge, across versions 8 to 11, and identify which architectures give the best balance of accuracy and speed for embedded traffic sign recognition on a 1:10 scale autonomous vehicle.",
    methodology: [
      ["Models", "Twenty model configurations covering YOLOv8 to YOLOv11 in Nano, Small, Medium, Large and XLarge sizes."],
      ["Dataset", "A custom dataset collected in a simulated urban environment designed to replicate FIRA competition tracks."],
      ["Deployment", "Models are deployed on a 1:10 scale autonomous vehicle with a mini PC running the detector in real time."],
      ["Metrics", "Performance is compared using mAP@50-95, F1-score, inference latency, and preprocessing and postprocessing times."],
      ["Training Analysis", "The authors also analyse convergence speed and stopping criteria during training."]
    ],
    results: "YOLOv10 B achieved the highest performance across varying conditions, while YOLOv8 M provided a better balance between speed and accuracy. The results give practitioners concrete guidance for selecting YOLO architectures for embedded sign recognition systems that must run in real time on resource-constrained vehicles.",
    advantages: [
      "Uses a 1:10 scale autonomous vehicle, the same class of platform as our mini car.",
      "Benchmarks recent YOLO versions rather than a single model.",
      "Reports latency and processing overhead, not just accuracy.",
      "Shows how to build and label a custom small-scale track dataset.",
      "Published as a peer-reviewed journal article."
    ],
    limitations: [
      "The onboard mini PC differs from our Jetson Orin Nano, so reported speeds transfer only approximately.",
      "The FIRA-style signs may differ from the signs on our course.",
      "Full YOLO models may be heavier than needed for a small set of sign classes.",
      "TensorRT-optimized deployment on Jetson hardware is not covered."
    ],
    critical: "This is the closest published analogue to the sign recognition task in our project, since it trains a detector on a custom small-track dataset and runs it live on a 1:10 vehicle. Our Jetson Orin Nano with TensorRT acceleration sits in a similar or better performance class than their mini PC, so their accuracy ordering across model sizes is a reliable guide, and we can realistically afford the mid-size models they recommend rather than being forced to the smallest ones. Our Intel RealSense D455 also gives us something their plain camera does not: because the detector returns a bounding box on the colour image, we can read the aligned depth values inside that box to know how far away a sign is, instead of inferring distance from apparent box size.",
    relevance: "The paper guides two concrete decisions in our build: which detector family and size to start from for the traffic sign network running on the RealSense D455 RGB stream, and how to collect and label a custom dataset for our own track. The D455 depth channel can additionally give each detected sign a distance estimate for the behaviour layer. Its latency-focused evaluation matches our acceptance criterion that sign responses must happen in real time during a course run.",
    conclusion: "The study demonstrates real-time sign recognition on a small-scale embedded autonomous vehicle and gives practical model selection guidance. It is a highly relevant, current reference for the traffic sign recognition module of our platform.",
    reference: "Reveles-Martínez, R., Gamboa-Rosales, H., Sánchez-Femat, E., Saldívar-Pérez, J., Ibarra-Pérez, T., Reveles-Gómez, L. C., Guirette-Barbosa, O. A., Galván-Tejada, J. I., Galván-Tejada, C. E., Luna-García, H., & Celaya-Padilla, J. M. (2025). Benchmarking YOLOv8 to YOLOv11 architectures for real-time traffic sign recognition in embedded 1:10 scale autonomous vehicles. Technologies, 13(11), 531. https://doi.org/10.3390/technologies13110531"
  },
  {
    n: 3,
    area: "Sensor Fusion (Vehicle State Estimation)",
    title: "Multi-Sensor Fusion for Wheel-Inertial-Visual Systems Using a Fuzzification-Assisted Iterated Error State Kalman Filter",
    authors: "Guohao Huang, Haibin Huang, Yaning Zhai, Guohao Tang, Ling Zhang, Xingyu Gao, Yang Huang, Guoping Ge",
    year: "2024",
    venue: "Sensors, Vol. 24, Issue 23, Article 7619",
    publisher: "MDPI (Sensors)",
    doi: "https://doi.org/10.3390/s24237619",
    introduction: "A ground vehicle cannot rely on any single motion source: wheel odometry drifts and slips, inertial sensors accumulate error, and visual estimates degrade when the scene is poor. This paper addresses odometry drift in wheeled robots by fusing wheel, inertial and visual measurements inside one estimator, which is the same problem our vehicle state layer must solve.",
    objective: "The objective is to improve pose estimation accuracy and robustness for a wheel-inertial-visual system by using an iterated error state Kalman filter whose behaviour is adapted online with fuzzy logic.",
    methodology: [
      ["Sensors", "Wheel encoders, an inertial measurement unit and a camera provide complementary motion measurements."],
      ["Filter", "An iterated error state Kalman filter fuses the three sources into a single vehicle state estimate."],
      ["Fuzzification", "Fuzzy logic adjusts filter behaviour online, so that less reliable measurements are weighted down as conditions change."],
      ["Framework", "The approach is implemented within a wheel-inertial-visual odometry framework on a wheeled ground robot."],
      ["Evaluation", "Experiments compare the fused estimate against baseline odometry approaches and assess drift and pose accuracy."]
    ],
    results: "The fuzzification-assisted iterated filter reduces odometry drift and improves pose estimation compared with baseline configurations, showing that adaptively weighted fusion of wheel, inertial and visual data gives a more reliable vehicle state than any single source or a fixed-weight filter.",
    advantages: [
      "Fuses exactly the three sources our car carries: encoders, IMU and camera.",
      "The error state Kalman filter design is well suited to low-cost noisy sensors.",
      "Online adaptation handles changing conditions such as wheel slip or poor vision.",
      "A stereo depth camera like our RealSense D455 gives metric scale directly, avoiding the scale ambiguity of monocular visual odometry.",
      "Demonstrated on a real wheeled ground robot.",
      "Published as a peer-reviewed journal article."
    ],
    limitations: [
      "The test platform is a differential-drive robot rather than an Ackermann car.",
      "The full visual odometry pipeline adds GPU and CPU load alongside our perception networks on the Jetson.",
      "Filter and fuzzy parameters require platform-specific tuning.",
      "Performance still depends on sensor calibration and synchronisation."
    ],
    critical: "Our project plans a sensor fusion layer that turns camera, IMU and encoder data into one vehicle state estimate, and this paper is a direct template for that layer. Its most transferable idea is the confidence-aware weighting: rather than trusting all sensors equally, the filter should down-weight whichever source is currently unreliable. Our visual input comes from an Intel RealSense D455, which is a stereo depth camera rather than a single lens, so our version of this pipeline starts from an easier position: depth is measured directly instead of being inferred, which removes the scale drift that troubles monocular visual odometry. The D455 also carries its own inertial unit, so we should be deliberate about whether the filter uses that or a separate IMU, and keep the two properly time-synchronised.",
    relevance: "The paper informs the design of our fusion module, including the choice of an error state formulation, how to combine encoder odometry with IMU heading, and how to keep the estimate stable when the visual measurements from the D455 degrade. A reliable fused state directly benefits our behaviour FSM and PID motion control.",
    conclusion: "The study shows that adaptive wheel-inertial-visual fusion with an iterated error state Kalman filter meaningfully reduces drift on a real robot. It is a strong reference for the vehicle state estimation layer of our mini self-driving car.",
    reference: "Huang, G., Huang, H., Zhai, Y., Tang, G., Zhang, L., Gao, X., Huang, Y., & Ge, G. (2024). Multi-sensor fusion for wheel-inertial-visual systems using a fuzzification-assisted iterated error state Kalman filter. Sensors, 24(23), 7619. https://doi.org/10.3390/s24237619"
  },
  {
    n: 4,
    area: "Lane Keeping and Steering Control",
    title: "Run-Level Evaluation of a Confidence-Gated Kalman Lane-Keeping Architecture for a 1:10-Scale Autonomous Vehicle",
    authors: "Rafael Reveles-Martínez, Hamurabi Gamboa-Rosales, Huizilopoztli Luna-García, Erika Sánchez-Femat, Javier Saldívar-Pérez, Flabio D. Mirelez-Delgado, Umanel A. Hernández-González, Carlos E. Galván-Tejada, Jorge I. Galván-Tejada, José M. Celaya-Padilla",
    year: "2026",
    venue: "Automation, Vol. 7, Issue 4, Article 129",
    publisher: "MDPI (Automation)",
    doi: "https://doi.org/10.3390/automation7040129",
    introduction: "Lane keeping becomes difficult when the camera cannot be trusted, for example in poor lighting, yet most work improves either the lane detector or the motion estimator separately. This paper instead studies how unreliable visual measurements should change the interaction between the estimator and the steering controller in a real closed-loop vehicle, using a 1:10 scale car.",
    objective: "The objective is to design and evaluate a confidence-gated Kalman lane-keeping architecture in which the confidence of each lane measurement directly controls how strongly it influences the state estimate that drives the steering controller.",
    methodology: [
      ["Architecture", "Visual confidence, state estimation and steering control are directly coupled: unreliable lane measurements are down-weighted through confidence-dependent measurement noise, while the propagated lane-relative state stays available to the controller."],
      ["Platform", "A 1:10 scale autonomous vehicle with a camera and an inertial measurement unit."],
      ["Experiment Design", "The primary experimental unit is the run, defined as one logged lap under one control configuration, which gives a reproducible run-level evaluation."],
      ["Comparisons", "Autonomous vision, IMU-feedforward and Kalman filter configurations are compared against a human driving baseline."],
      ["Analysis", "Run-level mean absolute error, signed bias and confidence intervals are used to separate supported findings from observational ones."]
    ],
    results: "The first Kalman filter generation achieved lower mean absolute error than the human baseline, and shifted the mean signed bias closer to the lane reference than the vision and IMU configurations, though with more spread between runs than vision alone. Later filter generations are reported only as observational or descriptive cases, and the authors are careful to state which claims their data supports.",
    advantages: [
      "Uses a 1:10 scale car with camera plus IMU, nearly identical to our platform class.",
      "Treats degraded vision as a first-class design problem instead of assuming good detections.",
      "Confidence gating is simple to implement inside a standard Kalman filter.",
      "The run-based evaluation method maps directly onto our 10-run acceptance testing.",
      "Very recent peer-reviewed journal article."
    ],
    limitations: [
      "The inertial prediction pathway was inactive in the logged filter runs, so the full fusion benefit is not demonstrated.",
      "Later filter generations have only observational or single-run evidence.",
      "Results come from one track and one vehicle.",
      "Confidence is derived from a single camera view, so stereo depth is not used as an additional reliability cue.",
      "Steering-specific tuning would be needed for our Ackermann geometry and servo."
    ],
    critical: "This paper connects our perception and control layers. Our lane detector will sometimes produce weak or wrong estimates, and the natural failure mode is jerky or unsafe steering. The confidence-gating idea, where poor measurements simply carry higher noise instead of being switched off, gives our controller a smooth and principled way to ride through bad frames. It also pairs naturally with our segmentation lane detector, whose confidence output branch can drive the gate directly. Because our Intel RealSense D455 is a stereo camera, we can strengthen the gate further by treating depth validity as a second reliability signal, lowering confidence when the depth map in the lane region is noisy or invalid. The honest run-level statistics are a model for how we should report our own course-run results.",
    relevance: "We can apply confidence-gated filtering between our lane detector and the steering PID, using the network's per-lane confidence as the gate. The paper also validates our evaluation plan, since our acceptance criteria already define success over repeated full course runs rather than single frames.",
    conclusion: "The study demonstrates a practical way to couple visual confidence, estimation and steering control on a small autonomous car, evaluated honestly at the run level. It is directly relevant to the lane-keeping control loop of our project.",
    reference: "Reveles-Martínez, R., Gamboa-Rosales, H., Luna-García, H., Sánchez-Femat, E., Saldívar-Pérez, J., Mirelez-Delgado, F. D., Hernández-González, U. A., Galván-Tejada, C. E., Galván-Tejada, J. I., & Celaya-Padilla, J. M. (2026). Run-level evaluation of a confidence-gated Kalman lane-keeping architecture for a 1:10-scale autonomous vehicle. Automation, 7(4), 129. https://doi.org/10.3390/automation7040129"
  },
  {
    n: 5,
    area: "Ultrasonic Obstacle Avoidance and Motor Control (Safety Layer)",
    title: "Ultrasonic Obstacle Avoidance and Full-Speed-Range Hybrid Control for Intelligent Garages",
    authors: "Lijie Wang, Xianwen Zhu, Ziyi Li, Shuchao Li",
    year: "2024",
    venue: "Sensors, Vol. 24, Issue 17, Article 5694",
    publisher: "MDPI (Sensors)",
    doi: "https://doi.org/10.3390/s24175694",
    introduction: "Safe operation of an automated guided vehicle depends on trustworthy obstacle distance measurement and stable speed control. This paper proposes an obstacle avoidance measurement and control scheme for an AGV parking robot, combining Kalman-filtered ultrasonic sensing with a hybrid motor control strategy that stays stable across the full speed range.",
    objective: "The objective is to achieve high-precision ultrasonic distance detection for obstacle avoidance, and to design a motor control system that keeps speed regulation accurate and robust from low speeds to high speeds.",
    methodology: [
      ["Obstacle Sensing", "Ultrasonic distance measurements are filtered with a Kalman filter to obtain high-precision, low-noise distance estimates for avoidance decisions."],
      ["Motor Model", "A mathematical model of a brushless DC motor is established with full-speed-range hybrid control."],
      ["Low and Medium Speeds", "Dual closed-loop vector control regulates the motor with photoelectric encoders providing speed feedback."],
      ["High Speeds", "Speed feedback switches to a sliding mode observer to remove the jitter seen with sensor-based feedback at high speed."],
      ["Evaluation", "The control model is built and tested in MATLAB and Simulink, with experiments confirming the observer-based improvement."]
    ],
    results: "At low to medium speeds the control system achieved a maximum overshoot of 1.5 percent with a response time of 0.01 seconds. At high speeds the sliding mode observer significantly reduced speed waveform jitter, and the overall system met the AGV control and safety requirements with strong robustness.",
    advantages: [
      "Shows how Kalman filtering turns noisy ultrasonic readings into distances reliable enough for safety decisions.",
      "Closed-loop speed control with encoder feedback parallels our own drive design, where high-torque brushed DC gear motors with encoders run through a motor driver.",
      "Quantifies control quality with overshoot and response time, giving us reference targets for tuning our PID speed loop.",
      "Addresses obstacle avoidance and actuation together, like our safety layer and motion control.",
      "Published as a peer-reviewed journal article."
    ],
    limitations: [
      "The application is an indoor parking AGV rather than a lane-following car.",
      "The motors are brushless DC driven by vector control, whereas our car uses high-torque brushed DC gear motors with encoders driven through a motor driver, so the commutation and observer techniques do not carry over.",
      "Much of the validation is simulation-based in Simulink.",
      "Vision-based obstacle perception is not considered."
    ],
    critical: "Our safety layer depends on ultrasonic sensors, and raw ultrasonic readings are notoriously noisy. The main lesson we take from this paper is to filter those distances before acting on them, so the ESP32 brakes on real obstacles rather than on measurement spikes. Our vehicle is better placed than their setup in one respect: the Intel RealSense D455 provides a dense stereo depth map, so obstacle distance can be cross-checked between two independent sensing methods. That said, keeping the ultrasonic path on the ESP32 remains the right design, because the safety stop should not depend on the Jetson, the camera pipeline, or good lighting. On the actuation side the match is partial and worth stating plainly. The authors control brushless DC motors, where vector control and a sliding mode observer exist to solve commutation and sensorless feedback problems that simply do not arise for us. We drive high-torque brushed DC gear motors through a motor driver, so our speed loop is a much simpler PWM command with encoder feedback. What does transfer is the structural lesson: close the loop on measured encoder speed rather than commanding PWM open-loop, and treat their overshoot and settling figures as quality targets for our own tuning.",
    relevance: "The paper supports two parts of our design: the obstacle sensing chain, where filtered ultrasonic distances feed the independent ESP32 safety layer that must stop the car on hazards, with D455 depth available as a complementary check on the Jetson side, and the motion control chain, where encoder feedback from our brushed DC gear motors closes a PID speed loop that keeps the car steady through turns and stops.",
    conclusion: "The study demonstrates that filtered ultrasonic sensing combined with well-designed closed-loop motor control can meet strict safety and control requirements on an automated vehicle. Allowing for the difference in motor type, it is a useful reference for the safety layer and encoder-based speed control of our platform.",
    reference: "Wang, L., Zhu, X., Li, Z., & Li, S. (2024). Ultrasonic obstacle avoidance and full-speed-range hybrid control for intelligent garages. Sensors, 24(17), 5694. https://doi.org/10.3390/s24175694"
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
function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40, line: 264 },
    children: [new TextRun({ text, size: 22 })]
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

// ---- Title block ----
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
  children: [new TextRun({ text: "ITS Project 40: Mini Self-Driving Car Platform (Integrated Capstone)", italics: true, size: 26, color: GREY })]
}));
titleChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text: "Perception, Sensor Fusion and Control on a Jetson Orin Nano with Intel RealSense D455", size: 22, color: GREY })]
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

// ---- Papers ----
const children = [];
papers.forEach((p, idx) => {
  if (idx > 0) children.push(new Paragraph({ children: [new PageBreak()] }));

  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 20 },
    children: [new TextRun({ text: "Paper " + p.n, bold: true, size: 30, color: NAVY })]
  }));
  children.push(new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: "Focus Area: " + p.area, bold: true, size: 22, color: "4F9BD9" })]
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
  children.push(kv("Journal", p.venue));
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

// ---- Summary matrix (landscape) ----
const COLS = [1600, 2500, 1750, 2500, 2400, 2930];
const HEADERS = ["Author / Year", "Method", "Sensors / Platform", "Reported Result", "Limitation", "Relevance to Our Project"];
const tableRows = [
  {
    ay: "Cheng, Wang & Mao, 2023 (MDPI Sensors, DOI: 10.3390/s23020789)",
    method: "Lightweight instance-segmentation lane detection: improved RepVgg-A0 encoder, multi-size asymmetric shuffling convolution, adaptive upsampling decoder with lane confidence branch; TensorRT FP16 deployment.",
    sensors: "Monocular camera; NVIDIA Jetson Nano with TensorRT (FP16).",
    result: "96.7 percent accuracy at 77.5 FPS on desktop GPU; 27 FPS on the embedded Jetson Nano after TensorRT optimization; robust to shadows, blur and sparse markings.",
    limitation: "Embedded result is on the older Jetson Nano; trained on public road data, so our track needs a small custom dataset; monocular only, so it does not use the stereo depth our D455 provides.",
    relevance: "Design template for our lane detector on the Jetson Orin Nano: segmentation CNN + TensorRT FP16 on the RealSense D455 colour stream, with the 27 FPS Nano result as a conservative floor, the confidence branch feeding gated steering, and aligned depth available to reject implausible lane candidates."
  },
  {
    ay: "Reveles-Martinez et al., 2025 (MDPI Technologies, DOI: 10.3390/technologies13110531)",
    method: "Benchmark of YOLOv8 to YOLOv11 in five sizes for traffic sign recognition; custom FIRA-style track dataset; real-time deployment on a small vehicle.",
    sensors: "Camera + mini PC on a 1:10 scale autonomous vehicle.",
    result: "YOLOv10 B highest overall performance; YOLOv8 M best balance of speed and accuracy; latency and pre/post processing reported per model.",
    limitation: "Mini PC differs from our Jetson Orin Nano, so speeds transfer approximately; FIRA signs may differ from our course; TensorRT deployment not covered.",
    relevance: "Guides model choice for our sign network on the Orin Nano, where mid-size models are affordable with TensorRT; the D455 depth aligned to each detection box gives true sign distance for the behaviour FSM; shows how to build a custom sign dataset for a small track."
  },
  {
    ay: "Huang et al., 2024 (MDPI Sensors, DOI: 10.3390/s24237619)",
    method: "Iterated error state Kalman filter fusing wheel odometry, IMU and visual data, with fuzzy logic adapting filter weights online.",
    sensors: "Wheel encoders, IMU and camera on a wheeled ground robot.",
    result: "Reduced odometry drift and improved pose accuracy versus baseline odometry and fixed-weight fusion.",
    limitation: "Differential-drive platform, not Ackermann; visual odometry adds load alongside our perception networks on the Jetson; needs platform-specific tuning and calibration.",
    relevance: "Direct template for fusing our D455, IMU and encoders into one vehicle state; the adaptive weighting handles degraded sensors, and D455 stereo depth supplies metric scale that monocular visual odometry lacks."
  },
  {
    ay: "Reveles-Martinez et al., 2026 (MDPI Automation, DOI: 10.3390/automation7040129)",
    method: "Confidence-gated Kalman lane keeping: lane measurement confidence sets measurement noise, coupling vision, estimation and steering control; run-level evaluation.",
    sensors: "Camera + IMU on a 1:10 scale autonomous vehicle.",
    result: "First filter generation beat the human baseline on mean absolute error and shifted bias closer to the lane reference than vision or IMU alone.",
    limitation: "Inertial prediction path inactive in logged runs; later generations only observational; single track and vehicle.",
    relevance: "Shows how our steering PID should ride through weak lane detections via confidence gating, which we can strengthen using D455 depth validity as a second reliability cue; its run-based evaluation mirrors our 8-of-10 course-run acceptance test."
  },
  {
    ay: "Wang et al., 2024 (MDPI Sensors, DOI: 10.3390/s24175694)",
    method: "Kalman-filtered ultrasonic distance sensing for obstacle avoidance plus full-speed-range hybrid motor control (dual closed-loop with encoders, sliding mode observer at high speed).",
    sensors: "Ultrasonic sensors, encoders, BLDC motor on an AGV parking robot; MATLAB/Simulink.",
    result: "1.5 percent maximum overshoot and 0.01 s response at low to medium speeds; observer removes high-speed jitter; meets AGV safety requirements.",
    limitation: "Garage AGV context; BLDC with vector control, whereas we use brushed DC gear motors through a driver, so commutation methods do not carry over; largely simulation-based; no vision sensing.",
    relevance: "Justifies filtering our ultrasonic readings before the ESP32 brakes on them, with D455 depth as a cross-check while the stop path stays camera-independent; supports closing our speed loop on encoder feedback, with their overshoot figures as tuning targets."
  }
];

function tCell(content, w, opts) {
  opts = opts || {};
  const runs = [new TextRun({
    text: content,
    size: opts.header ? 19 : 16,
    bold: !!opts.header,
    color: opts.header ? "FFFFFF" : "222222"
  })];
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    shading: { type: ShadingType.CLEAR, fill: opts.fill || "FFFFFF" },
    margins: { top: 55, bottom: 55, left: 95, right: 95 },
    children: [new Paragraph({
      spacing: { after: 0, line: 215 },
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
    children: [new TextRun({ text: "Table 1: Literature Matrix for the Mini Self-Driving Car Platform (Perception, Fusion, Control and Safety)", bold: true, size: 30, color: NAVY })]
  }),
  summaryTable,
  new Paragraph({
    spacing: { before: 160 },
    children: [new TextRun({
      text: "Sources: Cheng, Wang & Mao (2023); Reveles-Martinez et al. (2025); Huang et al. (2024); Reveles-Martinez et al. (2026); Wang et al. (2024).",
      italics: true, size: 18, color: GREY
    })]
  })
];

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
  title: "Project 40 Literature Review",
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
  fs.writeFileSync("Project40_Literature_Review.docx", buf);
  console.log("written", buf.length);
});
