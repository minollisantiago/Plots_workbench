import yaml
from pathlib import Path
from typing import Iterable
from functools import cached_property
from dataclasses import dataclass, field

@dataclass(frozen = True)
class FigureStyle:

    '''
    ## Description
    Used to create plotly layout dictionaries, combining layout
    and style configs for each plot class.

    Layout config files contain layout specific configs,
    and style config files contain *style* specific configs,
    like color palettes and font styles.

    ## Usage
    To use it, initialize it with a template indicating the name of
    the style .yaml file that follows the structure of the plotly
    framework: https://plotly.com/python/.

    Call on the class method merge_layouts() to merge custom
    layout and style dictionaries, or initialize the class
    to use the preset array of layout and style dictionaries.

    ## Adding new templates
    To add new templates you need to create a new .yaml file
    with the style_ prefix, and add the new template name after
    the underscore, like so: "style_darkest"

    When adding new style .yaml files to the plotstyles folder, you
    should include the name of the new file into the _style_list
    class attribute of this class (without the .yaml extension)

    ## Attributes
    #### template: *string, optional*
    The name of the style .yaml file (without extension)
    needed to define color palette and font styles for all plot
    layouts.

    ## Methods
    #### merge_layouts()
    In the scope of this class, we use this method to merge
    every plot type generic layout with a style dictionary.
    The style dictionary will be instantiated with this class and should
    point to a .yaml file with a pre-defined style config.
    '''


    _style_list: list[str] = field(
        init = False,
        default_factory=lambda:[
            'layout_line',
            'layout_bar',
            'layout_hist_h',
            'layout_hist_v',
            'layout_scatter',
            'style_dark',
            'style_light',
        ]
    )

    plotstyles_path: Path
    template: str = 'dark'


    def __post_init__(self):
        '''Input validation for template'''
        available_templates = ['dark', 'light']
        if self.template not in available_templates:
            raise ValueError(
                f'''
                Invalid value for 'template'.
                Must be: {[template for template in available_templates]}
                '''
            )


    @staticmethod
    def merge_layouts(dict_set: Iterable[dict]) -> dict[str, None | bool | float | dict]:

        '''
        Merges multiple dictionaries, unpacking any elements
        contained in common keys between the dict_set argument
        and also works with keys that contain single values.
        '''

        result = dict()
        keys = set().union(*[set(Dict) for Dict in dict_set])

        for key in keys:
            vals = [Dict.get(key, {}) for Dict in dict_set]
            checks = [not isinstance(Dict.get(key, {}), dict) for Dict in dict_set]

            if any(checks):

                if sum(checks) > 1:
                    print(
                        f'''
                        The {key} property is present either as a single value
                        on multiple dictionaries or as a value on one or more
                        and a dictionary on another.
                        Only the first instance of the property will be used.
                        '''
                    )
                vals_index = checks.index(True)
                result[key] = vals[vals_index]

            elif not any(checks):

                result[key] = {key: val for Dict in vals for key, val in Dict.items()}

        return result


    @cached_property
    def style_dump(self) -> dict:
        '''Complete set of style and layout dictionaries, cached'''
        style_dump = dict()
        for style in self._style_list:
            with open(Path(self.plotstyles_path, style + '.yaml')) as file:
                style_dump[style] = yaml.load(file, Loader = yaml.FullLoader)
        return style_dump


    @cached_property
    def template_style(self) -> dict:
        return self.style_dump[f'style_{self.template}']


    @cached_property
    def style_line(self) -> dict:
        return self.merge_layouts(
            [self.template_style, self.style_dump['layout_line']]
        )


    @cached_property
    def style_bar(self) -> dict:
        return self.merge_layouts(
            [self.template_style, self.style_dump['layout_bar']]
        )


    @cached_property
    def style_hist_h(self) -> dict:
        return self.merge_layouts(
            [self.template_style, self.style_dump['layout_hist_h']]
        )


    @cached_property
    def style_hist_v(self) -> dict:
        return self.merge_layouts(
            [self.template_style, self.style_dump['layout_hist_v']]
        )


    @cached_property
    def style_scatter(self) -> dict:
        return self.merge_layouts(
            [self.template_style, self.style_dump['layout_scatter']]
        )


