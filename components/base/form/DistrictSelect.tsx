import { useState, useEffect } from "react";
import SelectField from "./SelectField";
import InputField from "./InputField";
import BeninDistricts from "../data/BeninDistricts";

interface AddressSelectProps {
  onChange: (value: {
    city: string;
    district: string | undefined;
    country: string;
    latitude?: string;
    longitude?: string;
  }) => void;
  value?: any;
  errorMessage?: { city?: string; district?: string };
  showLatLng?: boolean;
}

const AddressSelect: React.FC<AddressSelectProps> = ({
  onChange,
  value,
  errorMessage,
  showLatLng = false,
}) => {
  const [selectedCity, setSelectedCity] = useState(value?.city || undefined);
  const [selectedDistrict, setSelectedDistrict] = useState(
    value?.district || undefined
  );
  const [latitude, setLatitude] = useState(value?.latitude || "");
  const [longitude, setLongitude] = useState(value?.longitude || "");

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict(undefined);
    const result: any = {
      city: city,
      district: undefined,
      country: "BJ",
    };
    if (latitude && latitude.trim() !== "") result.latitude = latitude;
    if (longitude && longitude.trim() !== "") result.longitude = longitude;
    onChange(result);
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    const result: any = {
      city: selectedCity!,
      district: district,
      country: "BJ",
    };
    if (latitude && latitude.trim() !== "") result.latitude = latitude;
    if (longitude && longitude.trim() !== "") result.longitude = longitude;
    onChange(result);
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatitude(e.target.value);
    const result: any = {
      city: selectedCity!,
      district: selectedDistrict,
      country: "BJ",
    };
    if (e.target.value && e.target.value.trim() !== "")
      result.latitude = e.target.value;
    if (longitude && longitude.trim() !== "") result.longitude = longitude;
    onChange(result);
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(e.target.value);
    const result: any = {
      city: selectedCity!,
      district: selectedDistrict,
      country: "BJ",
    };
    if (latitude && latitude.trim() !== "") result.latitude = latitude;
    if (e.target.value && e.target.value.trim() !== "")
      result.longitude = e.target.value;
    onChange(result);
  };

  const city = BeninDistricts.find(
    (district) => district.city === selectedCity
  );
  const districtOptions = city
    ? city.districts.map((district) => ({
        value: district,
        label: district,
      }))
    : [];

  useEffect(() => {
    if (value) {
      setSelectedCity(value.city);
      setSelectedDistrict(value.district);
      setLatitude(value.latitude || "");
      setLongitude(value.longitude || "");
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2 w-full mb-4">
      <div className="flex gap-2 xs:gap-4 w-full *:w-1/2">
        <SelectField
          label="Ville"
          value={selectedCity}
          onChange={handleCityChange}
          options={BeninDistricts.map((district) => ({
            value: district.city,
            label: district.city,
          }))}
          isSearchable={true}
          errorMessage={errorMessage?.city}
          className="!w-full"
          inputClassName="!py-[10px]"
          cardClassName="!z-30"
          isRequired
        />
        <SelectField
          label="Quartier"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          options={districtOptions}
          isSearchable={true}
          errorMessage={errorMessage?.district}
          inputClassName="!py-[10px]"
          cardClassName="!z-30"
          isDisabled={!selectedCity}
          isRequired
        />
      </div>

      {showLatLng && (
        <div className="flex gap-4 w-full *:w-1/2 my-2">
          <InputField
            label="Latitude"
            name="latitude"
            value={latitude}
            onChange={handleLatitudeChange}
            placeholder="Latitude"
            className="w-1/2"
          />
          <InputField
            label="Longitude"
            name="longitude"
            value={longitude}
            onChange={handleLongitudeChange}
            placeholder="Longitude"
            className="w-1/2"
          />
        </div>
      )}
    </div>
  );
};

export default AddressSelect;
