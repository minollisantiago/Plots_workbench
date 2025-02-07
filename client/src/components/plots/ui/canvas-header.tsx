
interface Props {
  title?: string
}

export const CanvasHeader = ({ title }: Props) => {

  return (
    <div className="flex items-center h-8">
      <h3 className="text-medium font-semibold">{title}</h3>
    </div>
  )
}
