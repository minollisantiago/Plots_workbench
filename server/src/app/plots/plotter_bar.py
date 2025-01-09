import pandas as pd
import plotly.graph_objs as go
from dataclasses import dataclass, field
from functools import cached_property

@dataclass(frozen = True)
class PlotterBar:

    '''
    ## Description
    Wrapper for plotting time series. Supports single pandas Series
    or multiple series in a pandas DataFrame.
    Plotly framework @: https://plotly.com/python/.

    ## How to Use
    Creates and plotly plot object, to be passed as argument for the
    FigureWrapper wrapper class.

    ## Attributes
    #### data: *pandas data frame or series, optional*
    Supports both data frames and series, if no data is provided
    the plot() method will output an empty plot.
    #### opacity: *float, optional*
    Plotly arg, sets the plots traces opacity, defaults to 0.9.
    #### line_with: *float, optional*
    plotly arg, sets the traces marker_line_width, defaults to 1.
    #### line_color: *str, optional*
    plotly arg, sets the marker_line_color, defaults to #303136.
    #### names: *list of strings, optional*
    List of names for each trace. If data is a pandas DataFrame,
    then the names are taken from the DataFrame columns.
    #### colors: *list of strings, optional*
    List of colors, supports str, hex and rgb formats.
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


    data: pd.DataFrame | pd.Series | None
    opacity: float = 1
    line_width: int = 0
    line_color: str = '#303136'
    vertical: bool = True
    names: list[str] = field(default_factory=lambda:[''])
    colors: list[str] = field(default_factory=lambda:[''])
    hover_label: list[str] | None = field(default_factory=lambda:None)
    showlegend: bool = False
    visible: bool = True


    @cached_property
    def names_(self) -> list[str]:
        if isinstance(self.data, pd.DataFrame):
            return [str(col) for col in self.data.columns]
        else:
            return self.names


    @cached_property
    def visible_(self) -> list[bool]:
        if isinstance(self.data, pd.DataFrame):
            return [True] * len(self.data.columns)
        else:
            return [self.visible]


    def plot_vertical(self) -> list[go.Bar]:

        '''Create the plotly plot object: vertical barplot'''

        if self.data is None:
            return [go.Bar(x = [], y = [],  name = None)]
        else:
            return [
                go.Bar(
                    x = self.data.index,
                    y = (
                        self.data
                        if isinstance(self.data, pd.Series) else
                        self.data[self.names_[i]]
                    ),
                    name = self.names_[i],
                    visible = self.visible_[i],
                    opacity = self.opacity,
                    marker_color = self.colors[i],
                    marker_line_width = self.line_width,
                    marker_line_color = self.line_color,
                    orientation = 'v',
                    showlegend = self.showlegend,
                    hoverinfo = 'all' if self.hover_label is None else 'text',
                    text = "" if self.hover_label is None else self.hover_label,
                ) for i in range(len(self.names_))
            ]


    def plot_horizontal(self) -> list[go.Bar]:

        '''Create the plotly plot object: vertical barplot'''

        if self.data is None:
            return [go.Bar(x = [], y = [],  name = None)]
        else:
            return [
                go.Bar(
                    y = self.data.index,
                    x = (
                        self.data
                        if isinstance(self.data, pd.Series) else
                        self.data[self.names_[i]]
                    ),
                    name = self.names_[i],
                    visible = self.visible_[i],
                    opacity = self.opacity,
                    marker_color = self.colors[i],
                    marker_line_width = self.line_width,
                    marker_line_color = self.line_color,
                    orientation = 'h',
                    showlegend = self.showlegend,
                    hoverinfo = 'all' if self.hover_label is None else 'text',
                    text = "" if self.hover_label is None else self.hover_label,
                ) for i in range(len(self.names_))
            ]


    def plot(self) -> list[go.Bar]:
        '''Create the plotly plot object: wrapper'''
        if self.vertical:
            return self.plot_vertical()
        else:
            return self.plot_horizontal()


