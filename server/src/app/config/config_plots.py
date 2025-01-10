import os
from pathlib import Path
from src.app.plots import FigureStyle

plotstyles_path = Path(os.getcwd(), 'src', 'app', 'plots', 'styles')
styler_dark = FigureStyle(plotstyles_path = plotstyles_path, template = 'dark')
styler_light = FigureStyle(plotstyles_path = plotstyles_path, template = 'light')
