function simulatePID(kp, ki, kd, setpoint, initialValue, time, delay, dt) {
  const pid = new PID(kp, ki, kd, setpoint);
  const values = [initialValue];
  const timeSteps = [];
  const controlSignals = Array(delay).fill(0);
  let mean = 0;

  for (let t = 0; t <= time; t += dt) {
    const currentValue = values[values.length - 1];
    const controlSignal = pid.update(currentValue, dt);

    // Update control signals and calculate mean
    const oldSignal = controlSignals.shift();
    controlSignals.push(controlSignal);
    mean =
      mean -
      oldSignal / controlSignals.length +
      controlSignal / controlSignals.length;

    // Update current value and store results
    const newValue = currentValue + mean * dt;
    values.push(newValue);
    timeSteps.push(t);
  }

  return { timeSteps, values };
}

function renderPlot() {
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
    xaxis: { title: "Time (s)" },
    yaxis: { title: "Output" },
    margin: { l: 80, r: 40, t: 80, b: 80 },
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
