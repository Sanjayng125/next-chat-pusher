import { X } from "lucide-react";
import Image from "next/image";
import React from "react";

const Pill = ({
  image,
  text,
  onClick,
}: {
  image: string;
  text: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex items-center justify-between gap-1 rounded-md p-1  border cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        <Image
          src={image}
          alt={text}
          width={20}
          height={20}
          className="rounded-full w-6 h-6"
        />
        <p>{text}</p>
      </div>
      <X />
    </div>
  );
};

export default Pill;
