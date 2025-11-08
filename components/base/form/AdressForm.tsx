"use client";

import React, { useState, useEffect } from "react";

type SimpleCity = {
  id: string;
  name: string;
  districts: Array<{ id: string; name: string }>;
};

interface AdressFormProps {
  register: any;
  errors?: any;
  serverErrors?: any;
  cities: Array<{
    id: string;
    name: string;
    districts: Array<{
      id: string;
      name: string;
    }>;
  }>;
}

const AdressForm = ({
  register,
  errors,
  serverErrors,
  cities,
}: AdressFormProps) => {
  const [selectedCity, setSelectedCity] = useState<SimpleCity | null>(null);
  const [districts, setDistricts] = useState<
    Array<{ id: string; name: string }>
  >([]);

  useEffect(() => {
    if (selectedCity) {
      setDistricts(selectedCity.districts);
    } else {
      setDistricts([]);
    }
  }, [selectedCity]);

  const getFieldError = (
    field: string,
    formErrors?: any,
    serverFormErrors?: any
  ) => {
    return (
      formErrors?.[field]?.message ||
      serverFormErrors?.[field]?.message ||
      undefined
    );
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    const city = cities.find((c) => c.id === cityId) || null;
    setSelectedCity(city);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ville <span className="text-red-500">*</span>
        </label>
        <select
          {...register("address.city")}
          onChange={handleCityChange}
          className="input"
        >
          <option value="">Sélectionnez une ville</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        {getFieldError("address.city", errors, serverErrors) && (
          <p className="input-error-message">
            {getFieldError("address.city", errors, serverErrors)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quartier <span className="text-red-500">*</span>
        </label>
        <select
          {...register("address.district")}
          className="input"
          disabled={!selectedCity}
        >
          <option value="">Sélectionnez un quartier</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
        {getFieldError("address.district", errors, serverErrors) && (
          <p className="input-error-message">
            {getFieldError("address.district", errors, serverErrors)}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdressForm;
