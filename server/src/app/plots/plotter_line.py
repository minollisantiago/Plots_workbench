import pandas as pd
import plotly.graph_objs as go
from dataclasses import dataclass, field
from functools import cached_property

@dataclass(frozen = True)
class PlotterLine:

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
    #### mode: *string, optional*
    Plotly arg, defaults to 'lines' for more options see plotly
    figure reference: https://plotly.com/python/reference/.
    #### opacity: *float, optional*
    Plotly arg, sets the plots traces opacity, defaults to 0.9.
    #### line_with: *float, optional*
    Plotly arg, sets the traces line width, defaults to 2.
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
    mode: str = 'lines'
    opacity: float = 0.9
    line_width: int = 2
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


    def plot(self) -> list[go.Scatter]:

        if self.data is None:
            return [go.Scatter(x = [], y = [],  name = None)]
        else:
            return [
                go.Scatter(
                    x = self.data.index,
                    y = (
                        self.data
                        if isinstance(self.data, pd.Series) else
                        self.data[self.names_[i]]
                    ),
                    name = self.names_[i],
                    mode = self.mode,
                    opacity = self.opacity,
                    line_color = self.colors[i],
                    line_width = self.line_width,
                    showlegend = self.showlegend,
                    hoverinfo = 'all' if self.hover_label is None else 'text',
                    text = "" if self.hover_label is None else self.hover_label,
                ) for i in range(len(self.names_))
            ]


