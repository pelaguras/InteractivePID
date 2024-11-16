const plotParameters = [
  {
    id: "kp",
    decimalPlaces: 1,
  },
  { id: "ki", decimalPlaces: 2 },
  { id: "kd", decimalPlaces: 2 },
  {
    id: "setpoint",
    decimalPlaces: 0,
  },
  {
    id: "initial-value",
    decimalPlaces: 0,
  },
  {
    id: "time",
    decimalPlaces: 0,
  },
  {
    id: "delay",
    decimalPlaces: 0,
  },
];

function updateSliderLabels() {
  plotParameters.forEach((plotParameter) => {
    document.getElementById(`${plotParameter.id}-label`).textContent =
      parseFloat(document.getElementById(plotParameter.id).value).toFixed(
        plotParameter.decimalPlaces
      );
  });
}
