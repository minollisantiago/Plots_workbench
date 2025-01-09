import plotly.graph_objs as go
from functools import cached_property
from dataclasses import dataclass, field
from plots import PlotterLine, PlotterScatter, PlotterBar, PlotterHist

@dataclass(frozen = True)
class FigureWrapper:

    '''
    ## Description
    Composite class of the plotter classes.
    It can be initialized with any of the plotter component classes:
    PlotterLine, PlotterBar, PlotterHist and PlotterScatter, which are
    wrappers around plotly Bar, Histogram and Scatter traces for convenience
    purposes.

    All figures returned are of type go.Figure class instances.
    Plotly framework @: https://plotly.com/python/.

    ## Attributes
    #### plot: *object, optional*
    Plotter component class instance, i.e.: an instance of the Plotter_Line,
    Plotter_Bar, Plotter_Hist, etc class
    #### title: *string, optional*
    The title for the plot.
    #### title_y: *string, optional*
    Plotly arg, defaults to 0.92. Sets the vertical position of the title.
    #### xaxis_label: *string, optional*
    Label for the x axis.
    #### yaxis_label: *string, optional*
    Label for the y axis.
    #### yaxis2_label: *string, optional*
    Label for the secondary y axis.
    #### autosize: *bool, optional*
    Determines whether or not a layout width or height that has
    been left undefined by the user is initialized on each relayout,
    defaults to True.
    #### height: *float, optional*
    Set's the figures height in pixels, defaults to None (autosize = True).
    Plotly's default is 450px.
    #### width: *float, optional*
    Set's the figures width in pixels, defaults to None (autosize = True).
    Plotly's default is 700px.
    #### style: *dict, optional*
    Dictionary with a custom layout for the plotly figure. If
    unspecified, uses plotly's default layout.
    '''


    plots: list[PlotterLine | PlotterBar | PlotterHist | PlotterScatter]
    title: str = ''
    title_y: float = 0.92
    xaxis_label: str = ''
    yaxis_label: str = ''
    yaxis2_label: str = ''
    autosize: bool = True
    height: float | None = None
    width: float | None = None
    style: dict = field(default_factory=lambda:dict())


    @cached_property
    def instance_layout(self) -> dict[str, None | bool | float | dict]:
        return {
            'title': {'text': self.title, 'y': self.title_y},
            'xaxis': {'title': {'text': self.xaxis_label}},
            'yaxis': {'title': {'text': self.yaxis_label}},
            'yaxis2': {'title': {'text': self.yaxis2_label}},
            'autosize': self.autosize,
            'height': self.height,
            'width': self.width,
        }


    def plots_(self) -> list[go.Scatter | go.Bar | go.Histogram]:
        '''Returns a list of plotly plots, for the go.Figure class.'''
        return [plot_element  for plot in self.plots for plot_element in plot.plot()]


    def figure(self) -> go.Figure:
        '''Returns the plotly figure for visualization.'''
        figure_ = go.Figure(self.plots_(), go.Layout(**self.style))
        figure_.update_layout(self.instance_layout)
        return figure_

