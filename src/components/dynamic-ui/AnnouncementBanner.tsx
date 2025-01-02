import { Stars } from "lucide-react";
import React from "react";
import { IoSparklesSharp } from "react-icons/io5";

interface AnnouncementBannerProps {
  message: string;
  link: string;
  linkText: string;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  message,
  link,
  linkText,
}) => {
  return (
    <div className="flex items-center gap-2 justify-center relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
      <IoSparklesSharp className="text-indigo-600 w-5 h-5"/>

      {message}
      <a href={link} className="font-semibold text-indigo-600">
        <span aria-hidden="true" className="absolute inset-0" />
        {linkText} <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  );
};

export default AnnouncementBanner;
