import { PlotCanvas } from '@/components/plots/plot-canvas'
import './styles/style.css'

function App() {

  return (
    <div id="mainContainer" className="content-grid place-content-center h-screen w-screen relative">
      <PlotCanvas title="Line Plot" />
    </div>
  )
}

export default App
