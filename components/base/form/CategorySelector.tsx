"use client";

import React, { useState, useEffect } from "react";
import MultiSelectField from "./MultiSelectField";
import { useGetCategories } from "@/api/category/CategoryServices";
import SelectField from "./SelectField";
import useUserStore from "@/store/userStore";
import { cn } from "@/utils/utils";

type CategorySelectorProps = {
  value: (string)[] | null;
  onChange: (value: (string | null)[]) => void;
  errorMessage?: string | null;
  className?: string;
  hideParentCategorySelect?: boolean;
  parentValue: string | null;
};

const CategorySelector = ({
  value = [],
  parentValue,
  onChange,
  errorMessage,
  className,
  hideParentCategorySelect = false,
}: CategorySelectorProps) => {
  const company = useUserStore((state) => state.company);
  const [parentCategoryId, setParentCategoryId] = useState<string | null>(
    parentValue ?? null
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<
    string[] | null
  >(value);

  const { categories: parentCategories } = useGetCategories({
    parentOnly: "true",
  });

  const { categories: subCategories } = useGetCategories(
    parentCategoryId ? { parentId: parentCategoryId } : {}
  );

  useEffect(() => {
    const newValues = [
      parentCategoryId,
      ...(selectedSubCategories || []),
    ].filter(Boolean);

    if (JSON.stringify(newValues) !== JSON.stringify(value)) {
      onChange(newValues);
    }
  }, [parentCategoryId, selectedSubCategories, onChange, value]);

  useEffect(() => {
    if (company?.mainCategory?.id) {
      setParentCategoryId(company.mainCategory.id);
    } else if (value && value.length > 0 && parentCategories?.length > 0) {
      const parentCategoryIds = parentCategories.map((cat: Category) => cat.id);
      const matchedParentId = value.find((id) =>
        parentCategoryIds.includes(id)
      );

      if (matchedParentId) {
        setParentCategoryId(matchedParentId);
      }
    }
  }, [company, value, parentCategories]);

  const handleParentCategoryChange = (id: string) => {
    if (id !== parentCategoryId) {
      setParentCategoryId(id);
      setSelectedSubCategories([]);
    }
  };

  return (
    <div className={cn("", className)}>
      {!hideParentCategorySelect && parentCategories && (
        <SelectField
          label="Choisir votre catégorie"
          value={parentCategoryId}
          onChange={handleParentCategoryChange}
          options={parentCategories?.map((category: Category) => ({
            value: category.id,
            label: category.name,
          }))}
          placeholder="Sélectionner une grande catégorie"
          className="mb-2"
        />
      )}

      {parentCategoryId && subCategories && (
        <MultiSelectField
          label="Sous Catégories: Cliquez sur au moins 1"
          options={subCategories.map((category: Category) => ({
            value: category.id,
            label: category.name,
            ...category,
          }))}
          value={selectedSubCategories}
          onChange={setSelectedSubCategories}
          errorMessage={errorMessage}
          maxSelections={4}
        />
      )}
    </div>
  );
};

export default CategorySelector;
