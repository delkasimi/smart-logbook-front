import React from "react";
import "../../style/DeviceFrame.css";

const DeviceFrame = ({ children, deviceType = "phone" }) => {
  return <div className={`device-frame ${deviceType}`}>{children}</div>;
};

export default DeviceFrame;
