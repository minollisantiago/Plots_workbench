import pandas as pd
import plotly.graph_objs as go
from dataclasses import dataclass, field
from functools import cached_property

@dataclass(frozen = True)
class PlotterHist:

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
    Plotly arg, sets the traces line width, defaults to 1.
    #### line_color: *str, optional*
    Plotly arg, sets the traces line width, defaults to 1.
    #### vertical: *str*
    If True the histogram bars will be vertical (x-axis),
    if False the histogram bars will be horizontal (y-axis).
    #### names: *list of strings, optional*
    List of names for each trace. If data is a pandas DataFrame,
    then the names are taken from the DataFrame columns.
    #### colors: *list of strings, optional*
    List of colors, supports str, hex and rgb formats.
    #### hover_label: *list of strings, optional*
    Plotly arg, defaults to None. Specifies a custom hover label
    #### showlegend: *bool*
    Display the plot legend, defaults to None.
    for each point of the trace(s) as a list of strings.

    ## Methods
    #### plot()
    Creates the plotly plot object, returns a list with a plotly
    Scatter object, that can be handled like a dictionary/JSON.
    This method is a wrapper for both the plot_vertical() and
    plot_horizontal() methods, that will be called based on the
    vertical attribute.
    '''

    data: pd.DataFrame | pd.Series | None
    opacity: float = 0.9
    line_width: int = 1
    line_color: str | None = '#303136'
    vertical: bool = True
    names: list[str] = field(default_factory=lambda:[''])
    colors: list[str] = field(default_factory=lambda:[''])
    hover_label: list[str] | None = field(default_factory=lambda:None)
    showlegend: bool = False


    @cached_property
    def names_(self) -> list[str]:
        if isinstance(self.data, pd.DataFrame):
            return [str(col) for col in self.data.columns]
        else:
            return self.names


    def plot_vertical(self) -> list[go.Histogram]:

        '''Create the plotly plot object: vertical histogram'''

        if self.data is None:
            return [go.Histogram(x = [],  name = None)]
        else:
            return [
                go.Histogram(
                    x = (
                        self.data
                        if isinstance(self.data, pd.Series) else
                        self.data[self.names_[i]]
                    ),
                    name = self.names_[i],
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


    def plot_horizontal(self) -> list[go.Histogram]:

        '''Create the plotly plot object: horizontal histogram'''

        if self.data is None:
            return [go.Histogram(y = [],  name = None)]
        else:
            return [
                go.Histogram(
                    y = (
                        self.data
                        if isinstance(self.data, pd.Series) else
                        self.data[self.names_[i]]
                    ),
                    name = self.names_[i],
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


    def plot(self) -> list[go.Histogram]:
        '''Create the plotly plot object: wrapper'''
        if self.vertical:
            return self.plot_vertical()
        else:
            return self.plot_horizontal()


