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

    // Compute PID components
    const proportional = error;
    const integral = this.integral;
    const derivative = (error - this.previousError) / dt;

    // Update integral and previous error
    this.integral += error * dt;
    this.previousError = error;

    // Return control signal
    return this.kp * proportional + this.ki * integral + this.kd * derivative;
  }
}

function simulatePID(kp, ki, kd, setpoint, initialValue, time, delay, dt) {
  const pid = new PID(kp, ki, kd, setpoint);
  const values = [initialValue];
  const timeSteps = [];
  const controlSignals = Array(delay).fill(0);

  for (let t = 0; t <= time; t += dt) {
    const currentValue = values[values.length - 1];
    const controlSignal = pid.update(currentValue, dt);

    // Update control signals and calculate mean
    controlSignals.shift();
    controlSignals.push(controlSignal);
    const meanControlSignal =
      controlSignals.reduce((sum, value) => sum + value, 0) /
      controlSignals.length;

    // Update current value and store results
    const newValue = currentValue + meanControlSignal * dt;
    values.push(newValue);
    timeSteps.push(t);
  }

  return { timeSteps, values };
}

function updateSliderLabels() {
  // Update the labels to reflect the current slider values
  document.getElementById("kp-value").textContent = parseFloat(
    document.getElementById("kp").value
  ).toFixed(1);

  document.getElementById("ki-value").textContent = parseFloat(
    document.getElementById("ki").value
  ).toFixed(2);

  document.getElementById("kd-value").textContent = parseFloat(
    document.getElementById("kd").value
  ).toFixed(2);

  document.getElementById("setpoint-value").textContent = parseFloat(
    document.getElementById("setpoint").value
  ).toFixed(0);

  document.getElementById("initial-value-value").textContent = parseFloat(
    document.getElementById("initial-value").value
  ).toFixed(0);

  document.getElementById("time-value").textContent = parseFloat(
    document.getElementById("time").value
  ).toFixed(0);

  document.getElementById("delay-value").textContent = parseInt(
    document.getElementById("delay").value
  ).toFixed(0);
}

function updateSliderLabels() {
  // Update the labels to reflect the current slider values
  document.getElementById("kp-value").textContent = parseFloat(
    document.getElementById("kp").value
  ).toFixed(1);

  document.getElementById("ki-value").textContent = parseFloat(
    document.getElementById("ki").value
  ).toFixed(2);

  document.getElementById("kd-value").textContent = parseFloat(
    document.getElementById("kd").value
  ).toFixed(2);

  document.getElementById("setpoint-value").textContent = parseFloat(
    document.getElementById("setpoint").value
  ).toFixed(0);

  document.getElementById("initial-value-value").textContent = parseFloat(
    document.getElementById("initial-value").value
  ).toFixed(0);

  document.getElementById("time-value").textContent = parseFloat(
    document.getElementById("time").value
  ).toFixed(0);

  document.getElementById("delay-value").textContent = parseInt(
    document.getElementById("delay").value
  ).toFixed(0);
}

function renderPlot() {
  // Update the labels before rendering the plot
  updateSliderLabels();

  const kp = parseFloat(document.getElementById("kp").value);
  const ki = parseFloat(document.getElementById("ki").value);
  const kd = parseFloat(document.getElementById("kd").value);
  const setpoint = parseFloat(document.getElementById("setpoint").value);
  const initialValue = parseFloat(
    document.getElementById("initial-value").value
  );
  const time = parseFloat(document.getElementById("time").value);
  const delay = parseInt(document.getElementById("delay").value);
  const dt = 0.1;

  const { timeSteps, values } = simulatePID(
    kp,
    ki,
    kd,
    setpoint,
    initialValue,
    time,
    delay,
    dt
  );

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
document.querySelectorAll("input").forEach((slider) => {
  slider.addEventListener("input", renderPlot);
});

// Initialize
renderPlot();
