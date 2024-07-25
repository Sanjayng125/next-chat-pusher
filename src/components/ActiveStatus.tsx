"use client";

import useActiveChannel from "@/context/useActiveChannel";

const ActiveStatus = () => {
  useActiveChannel();
  return null;
};

export default ActiveStatus;
