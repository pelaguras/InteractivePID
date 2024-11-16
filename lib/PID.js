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
