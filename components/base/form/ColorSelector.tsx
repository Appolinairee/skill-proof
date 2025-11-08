import React, { useState, useEffect, useRef } from "react";
import { IoColorPaletteOutline } from "react-icons/io5";
import { EditIcon, DeleteIcon } from "@/public/assets/icons/interactionsIcons";
import { MdCheck, MdClose } from "react-icons/md";

interface ColorWithName {
  hex: string;
  name: string;
}

interface ColorSelectorProps {
  label?: string;
  errorMessage?: string | null;
  onChange: (selectedColors: string) => void;
  className?: string;
  text: string;
  defaultColors?: string;
  maxColors?: number;
}

const BASE_COLORS: ColorWithName[] = [
  { hex: "#FF5733", name: "Rouge Corail" },
  { hex: "#33C1FF", name: "Bleu Ciel" },
  { hex: "#28A745", name: "Vert Emeraude" },
  { hex: "#FFC300", name: "Jaune Or" },
  { hex: "#6F42C1", name: "Violet Royal" },
  { hex: "#FD7E14", name: "Orange Vif" },
  { hex: "#007BFF", name: "Bleu Azure" },
  { hex: "#DC3545", name: "Rouge Crimson" },
  { hex: "#FF0000", name: "Rouge" },
  { hex: "#00FF00", name: "Vert" },
  { hex: "#0000FF", name: "Bleu" },
  { hex: "#FFFF00", name: "Jaune" },
  { hex: "#FFA500", name: "Orange" },
  { hex: "#8B00FF", name: "Violet" },
  { hex: "#FFC0CB", name: "Rose" },
  { hex: "#000000", name: "Noir" },
  { hex: "#FFFFFF", name: "Blanc" },
  { hex: "#808080", name: "Gris" },
];

// Composant pour afficher une couleur sélectionnée
const SelectedColorItem = ({
  color,
  index,
  editingIndex,
  editName,
  setEditName,
  onEditStart,
  onEditSubmit,
  onEditCancel,
  onRemove,
}: {
  color: ColorWithName;
  index: number;
  editingIndex: number | null;
  editName: string;
  setEditName: (name: string) => void;
  onEditStart: (index: number, name: string) => void;
  onEditSubmit: () => void;
  onEditCancel: () => void;
  onRemove: (index: number) => void;
}) => (
  <div className="flex items-center gap-3">
    <div
      className="w-6 h-6 rounded-full border border-gray-300"
      style={{ backgroundColor: color.hex }}
    />
    <div className="flex-1">
      {editingIndex === index ? (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="text-sm border-2 border-blue-300 rounded-[10px] px-2 py-1 w-full max-w-[150px] focus:border-primary focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white shadow-sm"
          maxLength={15}
          onKeyDown={(e) => {
            if (e.key === "Enter") onEditSubmit();
            if (e.key === "Escape") onEditCancel();
          }}
          autoFocus
        />
      ) : (
        <span className="text-sm font-medium cursor-default">{color.name}</span>
      )}
    </div>
    <div className="flex items-center gap-1">
      {editingIndex === index ? (
        <>
          <button
            onClick={onEditSubmit}
            className="p-1 text-green-600 hover:bg-green-100 rounded cursor-pointer transition-colors"
            title="Valider"
          >
            <MdCheck size={16} />
          </button>
          <button
            onClick={onEditCancel}
            className="p-1 text-red-600 hover:bg-red-100 rounded cursor-pointer transition-colors"
            title="Annuler"
          >
            <MdClose size={16} />
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => onEditStart(index, color.name)}
            className="p-1 text-gray-500 hover:bg-gray-200 rounded cursor-pointer transition-colors"
            title="Modifier le nom"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(index)}
            className="p-1 text-red-500 hover:bg-red-100 rounded cursor-pointer transition-colors"
            title="Supprimer"
          >
            <DeleteIcon className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  </div>
);

// Composant pour la zone de nommage unifié
const ColorNamingSection = ({
  color,
  name,
  nameInputRef,
  onNameChange,
  onSubmit,
  onCancel,
}: {
  color: string;
  name: string;
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) => (
  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
    <div className="flex items-center gap-3 mb-2">
      <div
        className="w-8 h-8 rounded-full border border-gray-300"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm font-medium">Nommer cette couleur :</span>
    </div>
    <div className="flex items-center gap-2">
      <input
        ref={nameInputRef}
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Nom de la couleur..."
        className="flex-1 border-2 border-gray-300 rounded-[10px] px-3 py-1 text-sm focus:border-primary focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white shadow-sm"
        maxLength={15}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
          if (e.key === "Escape") onCancel();
        }}
      />
      <button
        onClick={onSubmit}
        disabled={!name.trim()}
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer hover:bg-primary/90 transition-colors shadow-sm"
      >
        Valider
      </button>
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-400 transition-colors shadow-sm"
      >
        Annuler
      </button>
    </div>
  </div>
);

const ColorSelector = ({
  errorMessage,
  onChange,
  className,
  text,
  defaultColors,
  maxColors = 2,
}: ColorSelectorProps) => {
  const [selectedColors, setSelectedColors] = useState<ColorWithName[]>([]);
  const [newColor, setNewColor] = useState("#000000");
  const [pendingColor, setPendingColor] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const colorInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const parseColorsFromString = (colorString: string): ColorWithName[] => {
    if (!colorString) return [];
    return colorString
      .split("|")
      .map((colorPair) => {
        const [hex, name] = colorPair.split(":");
        return { hex: hex || "", name: name || "" };
      })
      .filter((color) => color.hex && color.name);
  };

  const formatColorsToString = (colors: ColorWithName[]): string => {
    return colors.map((color) => `${color.hex}:${color.name}`).join("|");
  };

  const getSuggestedName = (hex: string): string => {
    const baseColor = BASE_COLORS.find(
      (color) => color.hex.toLowerCase() === hex.toLowerCase()
    );
    return baseColor ? baseColor.name : "";
  };

  const getAvailableColors = (): ColorWithName[] => {
    const selectedHexes = selectedColors.map((c) => c.hex.toLowerCase());
    return BASE_COLORS.filter(
      (color) => !selectedHexes.includes(color.hex.toLowerCase())
    );
  };

  useEffect(() => {
    if (defaultColors) {
      const parsedColors = parseColorsFromString(defaultColors);
      setSelectedColors(parsedColors);
    }
  }, [defaultColors]);

  const handleColorSelect = (hex: string) => {
    const alreadySelected = selectedColors.find(
      (c) => c.hex.toLowerCase() === hex.toLowerCase()
    );
    if (alreadySelected) return;

    // Vérifier limite
    if (selectedColors.length >= maxColors) return;

    setPendingColor(hex);
    setPendingName(getSuggestedName(hex));
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const handleNameSubmit = () => {
    if (!pendingColor || !pendingName.trim()) return;

    const newColor: ColorWithName = {
      hex: pendingColor,
      name: pendingName.trim().slice(0, 15), // Limite à 15 caractères
    };

    const newSelectedColors = [newColor, ...selectedColors];
    setSelectedColors(newSelectedColors);
    onChange(formatColorsToString(newSelectedColors));

    // Reset
    setPendingColor(null);
    setPendingName("");
  };

  const handleNameCancel = () => {
    setPendingColor(null);
    setPendingName("");
  };

  const handleRemoveColor = (indexToRemove: number) => {
    const newSelectedColors = selectedColors.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedColors(newSelectedColors);
    onChange(formatColorsToString(newSelectedColors));
  };

  const handleEditStart = (index: number, currentName: string) => {
    setEditingIndex(index);
    setEditName(currentName);
  };

  const handleEditSubmit = () => {
    if (editingIndex === null || !editName.trim()) return;

    const newSelectedColors = selectedColors.map((color, index) =>
      index === editingIndex
        ? { ...color, name: editName.trim().slice(0, 15) }
        : color
    );

    setSelectedColors(newSelectedColors);
    onChange(formatColorsToString(newSelectedColors));
    setEditingIndex(null);
    setEditName("");
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditName("");
  };

  const handleCustomColorAdd = (hex: string) => {
    if (
      !hex ||
      selectedColors.find((c) => c.hex.toLowerCase() === hex.toLowerCase())
    )
      return;
    if (selectedColors.length >= maxColors) return;

    setPendingColor(hex);
    setPendingName(getSuggestedName(hex));
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setNewColor(color);
    handleCustomColorAdd(color);
  };

  const openColorPicker = () => {
    colorInputRef.current?.click();
  };

  return (
    <div
      className={`${className} bg-white px-3 py-2 w-full text-[16px] relative rounded-[18px] overflow-hidden`}
    >
      <div className="flex items-center gap-2 font-medium mb-3">
        <IoColorPaletteOutline className="w-5 h-5 text-primary" />
        <span>{text}</span>
      </div>

      {selectedColors.length > 0 && (
        <div className="mb-4">
          <div className="space-y-2">
            {selectedColors.map((color, index) => (
              <SelectedColorItem
                key={`${color.hex}-${index}`}
                color={color}
                index={index}
                editingIndex={editingIndex}
                editName={editName}
                setEditName={setEditName}
                onEditStart={handleEditStart}
                onEditSubmit={handleEditSubmit}
                onEditCancel={handleEditCancel}
                onRemove={handleRemoveColor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Zone de nommage en cours */}
      {pendingColor && (
        <ColorNamingSection
          color={pendingColor}
          name={pendingName}
          nameInputRef={nameInputRef}
          onNameChange={setPendingName}
          onSubmit={handleNameSubmit}
          onCancel={handleNameCancel}
        />
      )}

      {/* Séparateur */}
      {selectedColors.length > 0 && (
        <div className="border-t border-gray-200 my-4"></div>
      )}

      {/* Zone des couleurs disponibles */}
      <div className="flex flex-wrap gap-3 mb-3 items-center">
        {getAvailableColors().map((color) => (
          <div
            key={color.hex}
            onClick={() =>
              selectedColors.length < maxColors
                ? handleColorSelect(color.hex)
                : null
            }
            className={`w-8 h-8 rounded-full transition-all border border-gray-300 flex items-center justify-center group relative ${
              selectedColors.length >= maxColors
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110 cursor-pointer"
            }`}
            style={{ backgroundColor: color.hex }}
            aria-label={`Couleur ${color.name}`}
            role="button"
            tabIndex={selectedColors.length < maxColors ? 0 : -1}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                selectedColors.length < maxColors
              ) {
                handleColorSelect(color.hex);
              }
            }}
          >
            {/* Tooltip avec le nom */}
            <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {color.name}
            </div>
          </div>
        ))}

        {/* Bouton pour couleur personnalisée */}
        <button
          type="button"
          onClick={openColorPicker}
          className={`w-8 h-8 rounded-full border-2 border-dashed border-primary flex items-center justify-center text-primary font-bold transition text-xs ${
            selectedColors.length >= maxColors
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-primary/10"
          }`}
          aria-label="Ajouter une nouvelle couleur"
          title="Ajouter une nouvelle couleur"
          disabled={selectedColors.length >= maxColors}
        >
          +
        </button>

        <input
          type="color"
          ref={colorInputRef}
          value={newColor}
          onChange={handleColorInputChange}
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {/* Messages d'état */}
      {selectedColors.length >= maxColors && (
        <p className="text-amber-600 text-sm mt-2">
          Maximum de {maxColors} couleurs atteint
        </p>
      )}

      {errorMessage && (
        <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default ColorSelector;
