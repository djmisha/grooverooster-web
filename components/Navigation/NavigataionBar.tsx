"use client";

import LocationSelectModal from "./LocationSelectModal";
import Hamburger from "@/components/Hamburger/Hamburger";
import UserGreeting from "@/components/User/UserGreeting";
import { Location } from "@/types";

interface NavigationBarProps {
  setSearchTerm?: (term: string) => void;
  locationData: Location[];
}

const NavigationBar = ({
  setSearchTerm: _setSearchTerm,
  locationData: _locationData,
}: NavigationBarProps) => {
  return (
    <div className="h-[60px] w-full relative bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="flex flex-nowrap items-center justify-around relative left-0 h-[60px] pb-0 bg-white dark:bg-gray-900 md:m-0">
        <div className="flex justify-between w-full pr-2.5 mx-auto">
          <Hamburger />
          <div className="min-w-[60px] h-[60px] flex items-center justify-center">
            <LocationSelectModal text="Location" />
          </div>
          <UserGreeting />
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
