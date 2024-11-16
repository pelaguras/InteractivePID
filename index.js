// PID Controller Class
class PIDController {
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
    const proportional = this.kp * error;
    this.integral += error * dt;
    const integral = this.ki * this.integral;
    const derivative = (this.kd * (error - this.previousError)) / dt;
    this.previousError = error;
    return proportional + integral + derivative;
  }
}

// Simulation Parameters
let kp = 1.0,
  ki = 0.1,
  kd = 0.05,
  setpoint = 10;
const dt = 0.1;
let values = [0]; // Initial value

// Canvas Setup
const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");

// Update Sliders
function updateSliderValues() {
  document.getElementById("kp-value").textContent = kp.toFixed(1);
  document.getElementById("ki-value").textContent = ki.toFixed(2);
  document.getElementById("kd-value").textContent = kd.toFixed(2);
  document.getElementById("setpoint-value").textContent = setpoint.toFixed(1);
}

// Draw Graph
function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - values[0] * 20);

  for (let i = 1; i < values.length; i++) {
    ctx.lineTo(i * (canvas.width / 100), canvas.height - values[i] * 20);
  }

  ctx.strokeStyle = "blue";
  ctx.stroke();

  // Draw Setpoint
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - setpoint * 20);
  ctx.lineTo(canvas.width, canvas.height - setpoint * 20);
  ctx.strokeStyle = "red";
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Simulation Loop
function simulate() {
  const pid = new PIDController(kp, ki, kd, setpoint);

  function loop() {
    const currentValue = values[values.length - 1];
    const controlSignal = pid.update(currentValue, dt);
    values.push(currentValue + controlSignal * dt);

    if (values.length > 100) {
      values.shift();
    }

    drawGraph();
    requestAnimationFrame(loop);
  }

  loop();
}

// Attach Event Listeners
document.getElementById("kp").addEventListener("input", (e) => {
  kp = parseFloat(e.target.value);
  updateSliderValues();
});

document.getElementById("ki").addEventListener("input", (e) => {
  ki = parseFloat(e.target.value);
  updateSliderValues();
});

document.getElementById("kd").addEventListener("input", (e) => {
  kd = parseFloat(e.target.value);
  updateSliderValues();
});

document.getElementById("setpoint").addEventListener("input", (e) => {
  setpoint = parseFloat(e.target.value);
  updateSliderValues();
});

// Initialize
updateSliderValues();
simulate();
