import numpy as np
import pandas as pd
import plotly.graph_objs as go
from typing import Iterable, Union
from dataclasses import dataclass

@dataclass(frozen = True)
class PlotterScatter:

    '''
    ## Description
    Wrapper for plotting time series. Supports single pandas Series
    or multiple series in a pandas DataFrame.
    Plotly framework @: https://plotly.com/python/.

    ## How to Use
    Creates and plotly plot object, to be passed as argument for the
    FigureWrapper wrapper class.

    ## Attributes
    #### data_x: *pandas Series or numpy array*
    if no data is provided the plot() method will output an empty plot.
    #### data_y: *pandas Series or numpy array*
    if no data is provided the plot() method will output an empty plot.
    #### mode: *string, optional*
    Plotly arg, defaults to 'markers' for more options see plotly
    figure reference: https://plotly.com/python/reference/.
    #### visible: *bool, optional*
    Defaults to True, if set to False the trace will not be displayed
    when the figure is rendered.
    #### opacity: *float, optional*
    Plotly arg, sets the plots traces opacity, defaults to 0.9.
    #### line_with: *float, optional*
    Plotly arg, sets the traces line width, defaults to 2.
    Only used if we use this class to plot a line plot.
    #### line_color: *str, optional*
    Plotly arg, sets the traces line color, defaults to #303136.
    Only used if we use this class to plot a line plot.
    #### marker_...:
    All market_x attributes are straightforward.
    #### hover_label: *list of strings, optional*
    Plotly arg, defaults to None. Specifies a custom hover label
    for each point of the trace(s) as a list of strings.
    #### showlegend: *bool*
    Display the plot legend, defaults to None.

    ## Methods
    #### plot()
    Creates the plotly plot object, returns a list with a plotly
    Scatter object, that can be handled like a dictionary/JSON.
    '''

    data_x: pd.Series | np.ndarray | Iterable[Union[int, float]] | None
    data_y: pd.Series | np.ndarray | Iterable[Union[int, float]] | None
    mode: str = 'markers'
    visible: bool = True
    opacity: float = 0.9
    line_width: int = 2
    line_color: str = '#fb7185'
    marker_symbol: str = 'circle'
    marker_color: str = 'rgba(0, 0, 0, 0)'
    marker_size: float = 12
    marker_opacity: float = 0.8
    marker_line_width: int = 2
    marker_line_color: str = '#fb7185'
    hover_label: list[str] | None = None
    showlegend: bool = False
    legend_label: str | None = None


    def plot(self) -> list[go.Scatter]:

        if any(input is None for input in [self.data_x, self.data_y]):
            return [go.Scatter(x = [], y = [],  name = None)]
        else:
            return [
                go.Scatter(
                    x = self.data_x,
                    y = self.data_y,
                    mode = self.mode,
                    visible = self.visible,
                    showlegend = self.showlegend,
                    name = self.legend_label,
                    marker_symbol = self.marker_symbol,
                    marker_size = self.marker_size,
                    marker_color = self.marker_color,
                    marker_opacity = self.marker_opacity,
                    marker_line_width = self.marker_line_width,
                    marker_line_color = self.marker_line_color,
                    opacity = self.opacity,
                    line_color = self.line_color,
                    line_width = self.line_width,
                    hoveron = 'points',
                    hoverinfo = 'all' if self.hover_label is None else 'text',
                    text = "" if self.hover_label is None else self.hover_label,
                )
            ]


