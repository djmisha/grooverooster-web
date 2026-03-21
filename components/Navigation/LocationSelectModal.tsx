import React, { useState } from "react";
import LocationManager from "@/components/LocationManager/LocationManager";
import Modal from "@/components/Modal/Modal";
import MenuTrigger from "@/components/ui/MenuTrigger";
import { useLocation } from "@/hooks/useLocation";
import { Location } from "@/types";

interface LocationSelectModalProps {
  text?: string;
}

const LocationSelectModal = ({
  text = "Location",
}: LocationSelectModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentLocation, hasLocation } = useLocation();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLocationChanged = (_location: Location) => {
    // Close modal after location is selected
    setIsModalOpen(false);
  };

  // Create LocationManager component for the modal
  const LocationManagerComponent = () => (
    <LocationManager
      onLocationChanged={handleLocationChanged}
      title="Choose Location"
      showCurrentLocation={true}
      showShareButton={true}
      showLocationSwitch={true}
      className="max-w-lg w-full p-0"
    />
  );

  // Display current location or default text
  const displayText =
    hasLocation && currentLocation
      ? currentLocation.city
        ? `${currentLocation.city}, ${
            currentLocation.stateCode || currentLocation.state
          }`
        : currentLocation.stateCode || currentLocation.state || text
      : text;

  return (
    <div className="relative">
      <MenuTrigger
        icon="map"
        text={displayText}
        onClick={handleOpenModal}
        className={`mt-1 ${hasLocation ? "hasLocationTrigger" : ""}`}
      />

      {isModalOpen && (
        <Modal
          component={LocationManagerComponent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default LocationSelectModal;
