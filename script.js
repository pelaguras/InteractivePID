class PID {
  constructor(kp, ki, kd, setpoint) {
    this.kp = kp;
    this.ki = ki;
    this.kd = kd;
    this.setpoint = setpoint;
    this.previousError = 0;
    this.integral = 0;
  }

  update(currentValue, dt) {
    const error = this.setpoint - currentValue;

    this.integral += error * dt;
    this.previousError = error;

    const proportional = error;
    const integral = this.integral;
    const derivative = (error - this.previousError) / dt;

    return (
      this.kp * proportional + this.ki * integral + (this.kd / dt) * derivative
    );
  }
}

// Simulation Parameters
let kp = 1.0,
  ki = 0.1,
  kd = 0.05,
  setpoint = 25,
  initialValue = 15,
  time = 20,
  delay = 10;
const dt = 0.1;

function updateSliderValues() {
  document.getElementById("kp-value").textContent = kp.toFixed(1);
  document.getElementById("ki-value").textContent = ki.toFixed(2);
  document.getElementById("kd-value").textContent = kd.toFixed(2);
  document.getElementById("setpoint-value").textContent = setpoint.toFixed(0);
  document.getElementById("initial-value-value").textContent =
    initialValue.toFixed(0);
  document.getElementById("time-value").textContent = time.toFixed(0);
  document.getElementById("delay-value").textContent = delay.toFixed(0);
}

function simulatePID() {
  const pid = new PID(kp, ki, kd, setpoint);
  const timeSteps = [];
  const values = [];
  let currentValue = initialValue;
  const controlSignals = Array(20).fill(0);

  for (let t = 0; t <= time; t += dt) {
    const controlSignal = pid.update(currentValue, dt);
    currentValue += controlSignal * dt;
    controlSignals.pop();
    controlSignals.push(controlSignal);
    timeSteps.push(t);

    // Simulating a simple, linear system response. Would need to be adjusted for a more complex model
    const mean =
      controlSignals.reduce((sum, value) => sum + value, 0) /
      controlSignals.length;
    currentValue += mean * dt;
    values.push(currentValue);
  }

  return { timeSteps, values };
}

// Render Plot using Plotly
function renderPlot() {
  const { timeSteps, values } = simulatePID();

  const trace = {
    x: timeSteps,
    y: values,
    type: "scatter",
    mode: "lines",
    line: { color: "blue" },
    name: "PID Output",
  };

  const setpointTrace = {
    x: timeSteps,
    y: Array(timeSteps.length).fill(setpoint),
    type: "scatter",
    mode: "lines",
    line: { color: "red", dash: "dash" },
    name: "Setpoint",
  };

  const layout = {
    title: "PID Controller Simulation",
    xaxis: { title: "Time (s)" },
    yaxis: { title: "Output" },
    margin: { l: 50, r: 30, t: 50, b: 50 },
    showlegend: true,
  };

  Plotly.newPlot("plot", [trace, setpointTrace], layout);
}

// Attach Event Listeners for Sliders
document.getElementById("kp").addEventListener("input", (e) => {
  kp = parseFloat(e.target.value);
  updateSliderValues();
  renderPlot();
});

document.getElementById("ki").addEventListener("input", (e) => {
  ki = parseFloat(e.target.value);
  updateSliderValues();
  renderPlot();
});

document.getElementById("kd").addEventListener("input", (e) => {
  kd = parseFloat(e.target.value);
  updateSliderValues();
  renderPlot();
});

document.getElementById("setpoint").addEventListener("input", (e) => {
  setpoint = parseFloat(e.target.value);
  updateSliderValues();
  renderPlot();
});

// Initialize
updateSliderValues();
renderPlot();
