import { useState } from "react";
import { PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";

interface Props {
  title?: string
  onTitleChange?: (newTitle: string) => void
}

export const CanvasHeader = ({ title, onTitleChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)

  const handleSubmit = () => {
    setIsEditing(false)
    if (!editedTitle?.trim()) {
      setEditedTitle(title)
      return
    }
    if (onTitleChange) {
      onTitleChange(editedTitle)
    }
  }

  return (
    <div className="flex items-center h-8 w-full pr-3 overflow-auto group">
      {isEditing ? (
        <Input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="h-8 p-0 bg-background text-medium font-semibold border-0 border-b focus-visible:ring-0 rounded-none"
          autoFocus
        />
      ) : (
        <h3 className="text-lg font-semibold truncate">{editedTitle ?? title}</h3>
      )}
      <Toggle
        aria-label="Toggle italic"
        size="sm"
        pressed={isEditing}
        onPressedChange={setIsEditing}
        className="data-[state=on]:bg-transparent hover:bg-transparent [&>svg]:hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <PencilLine className="h-4 w-4 text-muted-foreground" />
      </Toggle>
    </div>
  )
}
