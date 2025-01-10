import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";

interface ColorPickerProps {
  initialColor?: string;
  onChange?: (color: string) => void;
}

const ColorPicker = ({ initialColor = "#000000", onChange }: ColorPickerProps) => {
  const [color, setColor] = useState(initialColor);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  return (

    <Popover>
      <PopoverTrigger>
        <div className="w-12 h-12 border border-zinc-600 cursor-pointer" style={{ backgroundColor: color }}></div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="flex flex-col gap-2">
          <HexColorPicker color={color} onChange={handleChange} />
          <div className="flex items-center justify-center">
            <span className="text-sm">{color}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>

  );
};

export default ColorPicker;
