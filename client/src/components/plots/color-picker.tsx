import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"
import { useState } from "react"

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

    <div className="flex items-center justify-center w-16 h-16">
      <Popover>
        <PopoverTrigger>
          <div className="w-12 h-12 border-2 border-muted rounded-md cursor-pointer" style={{ backgroundColor: color }}></div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="center">
          <div className="custom-color-picker w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px] xl:w-[260px] flex flex-col gap-2">
            <HexColorPicker color={color} onChange={handleChange} className="border [&>div]:!rounded-none" />
            <div className="flex items-center justify-center">
              <span className="text-base text-muted-foreground font-mono">{color}</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>

  );
};

export default ColorPicker;
