# 25-04-2025

### QUESTION

Let me show you the entire component and its dependencies and then ill ask you a question about this implementation to highlight series: 


Here is the plotLine component: 

```typescriptreact
import { useState } from "react";
import { useFilteredTimeSeries } from "@/hooks";
import { PlotLineFigure } from "./plot-line-figure";
import { LineControls } from "./plot-line-controls";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";

interface Props {
  title: string;
};

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

export const PlotLine = ({ title }: Props) => {
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  const [highlightedSeries, setHighlightedSeries] = useState<Record<string, number>>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === "All")!);


  const filteredSeries = useFilteredTimeSeries({
    allSeries: exampleSeries,
    selectedSeriesIds: selectedSeriesIds,
    period: timePeriod,
  });

  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeriesIds((prev) => (
      prev.includes(series.id) ? prev : [...prev, series.id]
    ));
  };

  const handleRemoveSeries = (id: string) => {
    setSelectedSeriesIds((prev) => prev.filter(seriesId => seriesId !== id))
    setHiddenSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    });
  };

  const handleTogglePlotVisibility = (id: string) => {
    setHiddenSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }));
  };

  const handleTogglePlotHighlight = (id: string) => {
    setHighlightedSeries(prev => {
      const newHighlightedSeries: Record<string, number> = {};

      // Iterate through existing series and set values
      for (const key in prev) {
        if (key === id) {
          newHighlightedSeries[key] = 1;
        } else {
          newHighlightedSeries[key] = 0.2;
        }
      }

      // If the id is new (wasn't in prev), initialize others to 0.5
      if (!(id in prev)) {
        newHighlightedSeries[id] = 1;
        for (const key of Object.keys(prev)) {
          if (key !== id) newHighlightedSeries[key] = 0.2;
        }
      }
      console.log('opacity - current: ', newHighlightedSeries);
      return newHighlightedSeries;
    });
  };

  const handleResetHighlight = () => {
    console.log('opacity: ', highlightedSeries);
  };


  const handleSelectPeriod = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  return (

    <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
        <CanvasHeader title={title} />
        <div className="flex-1 min-h-0">
          < LineControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={filteredSeries}
            availableSeries={exampleSeries}
            toggledSeries={hiddenSeries}
            highlightedSeries={highlightedSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
            onTogglePlotHighlight={handleTogglePlotHighlight}
            onToggleResetHighlight={handleResetHighlight}
          />
        </div>
      </div>

      {/* Figure */}
      {filteredSeries.length > 0 ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              defaultSelected={periods.find(p => p.label === "All")}
              onSelect={handleSelectPeriod}
            />
          </div>
          <PlotLineFigure
            data={filteredSeries.map(series => ({
              ...series.plotData,
              opacity: highlightedSeries[series.id] ?? 1,
              line: { color: series.color },
              visible: hiddenSeries[series.id] ?? true,
            }))}
            theme="dark"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          Select Series to display the plot
        </div>
      )}
    </div>
  )
}

```

Here are the controls: 

```typescriptreact

import { SeriesCard } from "@/components/plots/ui";
import { SeriesSearch } from "@/components/plots/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeSeriesData } from "@/components/plots/models";

interface Props {
  header: string;
  searchTriggerLabel: string;
  searchPlaceholder: string;
  series: TimeSeriesData[];
  availableSeries: TimeSeriesData[];
  toggledSeries: Record<string, boolean>;
  highlightedSeries: Record<string, number>;
  onRemoveSeries: (id: string) => void;
  onAddSeries: (series: TimeSeriesData) => void;
  onTogglePlotVisibility: (id: string) => void;
  onTogglePlotHighlight: (id: string) => void;
  onToggleResetHighlight: () => void;
}

export const LineControls = ({
  header, searchTriggerLabel, searchPlaceholder, series, availableSeries, toggledSeries,
  onRemoveSeries, onAddSeries, onTogglePlotVisibility, onTogglePlotHighlight, onToggleResetHighlight
}: Props) => {
  return (
    <div className="flex flex-col space-y-4 h-full bg-background">

      {/* Series Search */}
      <div className="pr-3">
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeries(selectedSeries as TimeSeriesData)}
          searchPlaceholder={searchPlaceholder}
          triggerLabel={searchTriggerLabel}
        />
      </div>

      {/* Selected series group */}
      <div className="flex flex-col space-y-2 overflow-hidden">
        {series.length > 0 &&
          <>
            <h2 className="text-xs font-medium text-muted-foreground">{header}</h2>
            <ScrollArea className="h-full w-full pr-3">
              <div className="space-y-2">
                {/* Selected series card */}
                {series.map((item) => (
                  <SeriesCard
                    key={item.id}
                    label={item.label}
                    subLabel={item.subLabel}
                    color={item.color}
                    toggled={toggledSeries[item.id] ?? true}
                    onRemove={() => onRemoveSeries(item.id)}
                    onToggleVisibility={() => onTogglePlotVisibility(item.id)}
                    onHighlight={() => onTogglePlotHighlight(item.id)}
                    onResetHighlight={onToggleResetHighlight}
                  />
                ))}
              </div>
            </ScrollArea>
          </>
        }
      </div>
    </div>
  )
}

```

Here is the series cards: 

```typescriptreact

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface Props {
  label: string;
  subLabel?: string;
  color: string;
  toggled?: boolean;
  onRemove?: () => void;
  onToggleVisibility?: () => void;
  onHighlight?: () => void;
  onResetHighlight?: () => void;
}

export const SeriesCard = ({
  label, subLabel, color, toggled, onRemove, onToggleVisibility, onHighlight, onResetHighlight
}: Props) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleRemove = (e: React.MouseEvent) => {
    // Stop propagation to avoid triggering onToggleVisibility
    e.stopPropagation();
    setIsVisible(false);
    // Wait for animation to complete before calling onRemove
    // The state change triggers a re-render of the card with the close animation
    if (onRemove) {
      setTimeout(onRemove, 100);
    }
  }

  const getRgbaBackground = (hexColor: string) => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  }

  return (
    <Card
      className={cn(
        "relative flex items-center gap-3 p-2 pl-0 pr-8 rounded-lg border-0 h-8 cursor-pointer",
        isVisible
          ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          : "animate-out fade-out-0 zoom-out-95",
        !toggled && "opacity-50"
      )}
      style={{ backgroundColor: getRgbaBackground(color) }}
      onClick={onToggleVisibility}
      onMouseEnter={onHighlight}
      onMouseLeave={onResetHighlight}
    >

      {/* Color indicator */}
      <div className="absolute w-[0.60rem] h-full rounded-l-lg" style={{ backgroundColor: color }} />

      {/* Label */}
      <div className="flex flex-row items-center gap-2 ml-6">
        <span className="text-sm font-medium">{label}</span>
        {subLabel && (<span className="text-sm text-muted-foreground">{subLabel}</span>)}
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button onClick={handleRemove} className="absolute right-2 p-1 hover:bg-accent rounded-sm">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </Card>
  )
}

```
Right now, when i the mouse enters the specific series card (Card component) the handleTogglePlotHighlight function triggers and alters the highlightedSeries state:

<!-- Symbol: handleTogglePlotHighlight -->
<!-- Kind: Variable -->
```typescriptreact
  const handleTogglePlotHighlight = (id: string) => {
    setHighlightedSeries(prev => {
      const newHighlightedSeries: Record<string, number> = {};

      // Iterate through existing series and set values
      for (const key in prev) {
        if (key === id) {
          newHighlightedSeries[key] = 1;
        } else {
          newHighlightedSeries[key] = 0.2;
        }
      }

      // If the id is new (wasn't in prev), initialize others to 0.5
      if (!(id in prev)) {
        newHighlightedSeries[id] = 1;
        for (const key of Object.keys(prev)) {
          if (key !== id) newHighlightedSeries[key] = 0.2;
        }
      }
      console.log('opacity - current: ', newHighlightedSeries);
      return newHighlightedSeries;
    });
  };
```
Now, the issue im having is that when the onMouseEnter event triggers for the first time, the handleTogglePlotHighlight function updates the highlightedSeries state collection but only with the first initial card im hovering over. So the rest of the series available do not get their opacity reduced.

This process is incrementa, once i hover over another card, now the first one, because it is present on the state array, will get its opacity set to 0.2, but if the set of plotted series includes other ones, they will not have their opacity updated. I basically need to have the initial highlightedSeries state collection to include all of the available series in order for the highlighting process to work correctly.

You're on the right track! The issue is indeed that `highlightedSeries` isn't initialized with all possible series IDs. When you hover over the first card, it only knows about *that* series, so it only updates that one.  Here's how you can fix this, along with explanations:

**1. Initialize `highlightedSeries` with all series IDs:**

   You need to ensure that `highlightedSeries` contains *all* the series IDs when the component initially renders.  The best place to do this is within `PlotLine`, after fetching/defining `exampleSeries`.

   ```typescriptreact
   import { useState, useEffect } from "react"; // Import useEffect
   import { useFilteredTimeSeries } from "@/hooks";
   import { PlotLineFigure } from "./plot-line-figure";
   import { LineControls } from "./plot-line-controls";
   import { mockTimeSeriesData } from "@/data/mock/time-series-data";
   import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
   import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";

   interface Props {
     title: string;
   };

   // Example data
   const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

   export const PlotLine = ({ title }: Props) => {
     const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
     const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
     const [highlightedSeries, setHighlightedSeries] = useState<Record<string, number>>({});
     const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === "All")!);


     const filteredSeries = useFilteredTimeSeries({
       allSeries: exampleSeries,
       selectedSeriesIds: selectedSeriesIds,
       period: timePeriod,
     });

     // Initialize highlightedSeries with all IDs from exampleSeries
     useEffect(() => {
       const initialHighlighted: Record<string, number> = {};
       exampleSeries.forEach(series => {
         initialHighlighted[series.id] = 1; // Or 0.2 if you want them all initially dimmed
       });
       setHighlightedSeries(initialHighlighted);
     }, [exampleSeries]); // Dependency array ensures it only runs when exampleSeries changes (if it ever does)


     const handleAddSeries = (series: TimeSeriesData) => {
       setSelectedSeriesIds((prev) => (
         prev.includes(series.id) ? prev : [...prev, series.id]
       ));
     };

     const handleRemoveSeries = (id: string) => {
       setSelectedSeriesIds((prev) => prev.filter(seriesId => seriesId !== id))
       setHiddenSeries((prev) => {
         const { [id]: _, ...rest } = prev
         return rest
       });
     };

     const handleTogglePlotVisibility = (id: string) => {
       setHiddenSeries(prev => ({
         ...prev, [id]: !(prev[id] ?? true)
       }));
     };

     const handleTogglePlotHighlight = (id: string) => {
       setHighlightedSeries(prev => {
         const newHighlightedSeries: Record<string, number> = { ...prev }; // Copy the previous state

         // Iterate through existing series and set values
         for (const key in newHighlightedSeries) {
           if (key === id) {
             newHighlightedSeries[key] = 1;
           } else {
             newHighlightedSeries[key] = 0.2;
           }
         }

         // No need to check if id exists, as it should always exist now
         console.log('opacity - current: ', newHighlightedSeries);
         return newHighlightedSeries;
       });
     };

     const handleResetHighlight = () => {
       setHighlightedSeries(prev => {
         const newHighlightedSeries: Record<string, number> = { ...prev }; // Copy the previous state

         // Iterate through existing series and set values
         for (const key in newHighlightedSeries) {
           newHighlightedSeries[key] = 1;
         }
         return newHighlightedSeries;
       });
       console.log('opacity: ', highlightedSeries);
     };


     const handleSelectPeriod = (period: TimePeriod) => {
       setTimePeriod(period);
     };

     return (

       <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

         {/* Controls */}
         <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
           <CanvasHeader title={title} />
           <div className="flex-1 min-h-0">
             < LineControls
               header="Strategies"
               searchTriggerLabel="Add strategies"
               searchPlaceholder="Search strategies"
               series={filteredSeries}
               availableSeries={exampleSeries}
               toggledSeries={hiddenSeries}
               highlightedSeries={highlightedSeries}
               onAddSeries={handleAddSeries}
               onRemoveSeries={handleRemoveSeries}
               onTogglePlotVisibility={handleTogglePlotVisibility}
               onTogglePlotHighlight={handleTogglePlotHighlight}
               onToggleResetHighlight={handleResetHighlight}
             />
           </div>
         </div>

         {/* Figure */}
         {filteredSeries.length > 0 ? (
           <div className="flex flex-col space-y-4 p-2 h-full">
             <div className="flex justify-end">
               <TimePeriodSelector
                 periods={periods}
                 defaultSelected={periods.find(p => p.label === "All")}
                 onSelect={handleSelectPeriod}
               />
             </div>
             <PlotLineFigure
               data={filteredSeries.map(series => ({
                 ...series.plotData,
                 opacity: highlightedSeries[series.id] ?? 1,
                 line: { color: series.color },
                 visible: hiddenSeries[series.id] ?? true,
               }))}
               theme="dark"
             />
           </div>
         ) : (
           <div className="flex items-center justify-center text-muted-foreground">
             Select Series to display the plot
           </div>
         )}
       </div>
     )
   }
   ```

   * **`useEffect` Hook:**  We use `useEffect` to perform this initialization after the component has mounted and `exampleSeries` is available.  The empty dependency array `[]` ensures it only runs once on initial render.
   * **`initialHighlighted` Object:** We create a new object to store the initial highlighted state.
   * **Loop through `exampleSeries`:**  We iterate through each series in `exampleSeries` and add an entry to `initialHighlighted` with the series ID as the key and an initial opacity value (1 for fully visible, 0.2 for dimmed) as the value.
   * **`setHighlightedSeries`:** Finally, we update the `highlightedSeries` state with the `initialHighlighted` object.

**2. Simplify `handleTogglePlotHighlight`:**

   Now that `highlightedSeries` always contains all IDs, you can simplify `handleTogglePlotHighlight`.  Importantly, *copy* the previous state *before* modifying it.

   ```typescriptreact
   const handleTogglePlotHighlight = (id: string) => {
     setHighlightedSeries(prev => {
       const newHighlightedSeries: Record<string, number> = { ...prev }; // Copy the previous state

       // Iterate through existing series and set values
       for (const key in newHighlightedSeries) {
         if (key === id) {
           newHighlightedSeries[key] = 1;
         } else {
           newHighlightedSeries[key] = 0.2;
         }
       }

       // No need to check if id exists, as it should always exist now
       console.log('opacity - current: ', newHighlightedSeries);
       return newHighlightedSeries;
     });
   };
   ```

**3. Update `handleResetHighlight`:**

   The `handleResetHighlight` function also needs to be updated to properly reset all opacities to 1. You should also copy the previous state before modifying it.

   ```typescriptreact
   const handleResetHighlight = () => {
     setHighlightedSeries(prev => {
       const newHighlightedSeries: Record<string, number> = { ...prev }; // Copy the previous state

       // Iterate through existing series and set values
       for (const key in newHighlightedSeries) {
         newHighlightedSeries[key] = 1;
       }
       return newHighlightedSeries;
     });
     console.log('opacity: ', highlightedSeries);
   };
   ```

**Key Improvements and Explanations:**

* **Initialization:**  The `useEffect` hook ensures that your state is properly initialized with all available series IDs. This is crucial for the highlighting logic to work correctly.
* **State Updates:**  Always copy the previous state when updating state based on the previous value.  This prevents unexpected side effects and ensures that React can properly track changes.  Use the spread operator (`...prev`) to create a shallow copy of the previous state object.
* **Clarity:** The simplified `handleTogglePlotHighlight` function is now more readable and efficient.

With these changes, the highlighting should work as expected: hovering over any series card will highlight that series and dim all the others. The reset functionality will also bring all series back to full opacity. Remember to test thoroughly!


### QUESTION

The implementation was great, now i want to improve the UX. Right now, when the users mouse exits the card but is moving towards another card, i get this flickering effect where all series get their opacities set to one but the mouse is very quickly highlighting another card, which adjusts opacities once more. 

I would like for us to debouce the handleResetHighlight trigger, is that possible?

Yes, debouncing `handleResetHighlight` is an excellent way to prevent the flickering effect. Here's how to implement debouncing using `setTimeout` within your component:

```typescriptreact
import { useState, useEffect, useRef } from "react"; // Import useRef
import { useFilteredTimeSeries } from "@/hooks";
import { PlotLineFigure } from "./plot-line-figure";
import { LineControls } from "./plot-line-controls";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";

interface Props {
  title: string;
};

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

export const PlotLine = ({ title }: Props) => {
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  const [highlightedSeries, setHighlightedSeries] = useState<Record<string, number>>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === "All")!);

  // Ref to store the timeout ID
  const resetHighlightTimeout = useRef<NodeJS.Timeout | null>(null);

  const filteredSeries = useFilteredTimeSeries({
    allSeries: exampleSeries,
    selectedSeriesIds: selectedSeriesIds,
    period: timePeriod,
  });

  // Initialize highlightedSeries with all IDs from exampleSeries
  useEffect(() => {
    const initialHighlighted: Record<string, number> = {};
    exampleSeries.forEach(series => {
      initialHighlighted[series.id] = 1; // Or 0.2 if you want them all initially dimmed
    });
    setHighlightedSeries(initialHighlighted);
  }, [exampleSeries]); // Dependency array ensures it only runs when exampleSeries changes (if it ever does)


  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeriesIds((prev) => (
      prev.includes(series.id) ? prev : [...prev, series.id]
    ));
  };

  const handleRemoveSeries = (id: string) => {
    setSelectedSeriesIds((prev) => prev.filter(seriesId => seriesId !== id))
    setHiddenSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    });
  };

  const handleTogglePlotVisibility = (id: string) => {
    setHiddenSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }));
  };

  const handleTogglePlotHighlight = (id: string) => {
    // Clear any existing timeout
    if (resetHighlightTimeout.current) {
      clearTimeout(resetHighlightTimeout.current);
    }

    setHighlightedSeries(prev => {
      const newHighlightedSeries: Record<string, number> = { ...prev }; // Copy the previous state

      // Iterate through existing series and set values
      for (const key in newHighlightedSeries) {
        if (key === id) {
          newHighlightedSeries[key] = 1;
        } else {
          newHighlightedSeries[key] = 0.2;
        }
      }

      // No need to check if id exists, as it should always exist now
      console.log('opacity - current: ', newHighlightedSeries);
      return newHighlightedSeries;
    });
  };

  const handleResetHighlight = () => {
    setHighlightedSeries(prev => {
      const newHighlightedSeries: Record<string, number> = { ...prev }; // Copy the previous state

      // Iterate through existing series and set values
      for (const key in newHighlightedSeries) {
        newHighlightedSeries[key] = 1;
      }
      return newHighlightedSeries;
    });
    console.log('opacity: ', highlightedSeries);
  };

  const debouncedHandleResetHighlight = () => {
    // Set a timeout to reset the highlight after a delay
    resetHighlightTimeout.current = setTimeout(() => {
      handleResetHighlight();
      resetHighlightTimeout.current = null; // Clear the timeout
    }, 100); // Adjust the delay (100ms) as needed
  };


  const handleSelectPeriod = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  return (

    <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
        <CanvasHeader title={title} />
        <div className="flex-1 min-h-0">
          < LineControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={filteredSeries}
            availableSeries={exampleSeries}
            toggledSeries={hiddenSeries}
            highlightedSeries={highlightedSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
            onTogglePlotHighlight={handleTogglePlotHighlight}
            onToggleResetHighlight={debouncedHandleResetHighlight} // Pass the debounced function
          />
        </div>
      </div>

      {/* Figure */}
      {filteredSeries.length > 0 ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              defaultSelected={periods.find(p => p.label === "All")}
              onSelect={handleSelectPeriod}
            />
          </div>
          <PlotLineFigure
            data={filteredSeries.map(series => ({
              ...series.plotData,
              opacity: highlightedSeries[series.id] ?? 1,
              line: { color: series.color },
              visible: hiddenSeries[series.id] ?? true,
            }))}
            theme="dark"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          Select Series to display the plot
        </div>
      )}
    </div>
  )
}

```

And then update the LineControls component to accept the debounced function:

```typescriptreact
import { SeriesCard } from "@/components/plots/ui";
import { SeriesSearch } from "@/components/plots/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeSeriesData } from "@/components/plots/models";

interface Props {
  header: string;
  searchTriggerLabel: string;
  searchPlaceholder: string;
  series: TimeSeriesData[];
  availableSeries: TimeSeriesData[];
  toggledSeries: Record<string, boolean>;
  highlightedSeries: Record<string, number>;
  onRemoveSeries: (id: string) => void;
  onAddSeries: (series: TimeSeriesData) => void;
  onTogglePlotVisibility: (id: string) => void;
  onTogglePlotHighlight: (id: string) => void;
  onToggleResetHighlight: () => void; // <- changed the type here to no longer be optional
}

export const LineControls = ({
  header, searchTriggerLabel, searchPlaceholder, series, availableSeries, toggledSeries,
  onRemoveSeries, onAddSeries, onTogglePlotVisibility, onTogglePlotHighlight, onToggleResetHighlight
}: Props) => {
  return (
    <div className="flex flex-col space-y-4 h-full bg-background">

      {/* Series Search */}
      <div className="pr-3">
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeries(selectedSeries as TimeSeriesData)}
          searchPlaceholder={searchPlaceholder}
          triggerLabel={searchTriggerLabel}
        />
      </div>

      {/* Selected series group */}
      <div className="flex flex-col space-y-2 overflow-hidden">
        {series.length > 0 &&
          <>
            <h2 className="text-xs font-medium text-muted-foreground">{header}</h2>
            <ScrollArea className="h-full w-full pr-3">
              <div className="space-y-2">
                {/* Selected series card */}
                {series.map((item) => (
                  <SeriesCard
                    key={item.id}
                    label={item.label}
                    subLabel={item.subLabel}
                    color={item.color}
                    toggled={toggledSeries[item.id] ?? true}
                    onRemove={() => onRemoveSeries(item.id)}
                    onToggleVisibility={() => onTogglePlotVisibility(item.id)}
                    onHighlight={() => onTogglePlotHighlight(item.id)}
                    onResetHighlight={onToggleResetHighlight}
                  />
                ))}
              </div>
            </ScrollArea>
          </>
        }
      </div>
    </div>
  )
}
```

Finally, the series card: 

```typescriptreact
import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface Props {
  label: string;
  subLabel?: string;
  color: string;
  toggled?: boolean;
  onRemove?: () => void;
  onToggleVisibility?: () => void;
  onHighlight?: () => void;
  onResetHighlight: () => void; // <- changed the type here to no longer be optional
}

export const SeriesCard = ({
  label, subLabel, color, toggled, onRemove, onToggleVisibility, onHighlight, onResetHighlight
}: Props) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleRemove = (e: React.MouseEvent) => {
    // Stop propagation to avoid triggering onToggleVisibility
    e.stopPropagation();
    setIsVisible(false);
    // Wait for animation to complete before calling onRemove
    // The state change triggers a re-render of the card with the close animation
    if (onRemove) {
      setTimeout(onRemove, 100);
    }
  }

  const getRgbaBackground = (hexColor: string) => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  }

  return (
    <Card
      className={cn(
        "relative flex items-center gap-3 p-2 pl-0 pr-8 rounded-lg border-0 h-8 cursor-pointer",
        isVisible
          ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          : "animate-out fade-out-0 zoom-out-95",
        !toggled && "opacity-50"
      )}
      style={{ backgroundColor: getRgbaBackground(color) }}
      onClick={onToggleVisibility}
      onMouseEnter={onHighlight}
      onMouseLeave={onResetHighlight} // Call the debounced function
    >

      {/* Color indicator */}
      <div className="absolute w-[0.60rem] h-full rounded-l-lg" style={{ backgroundColor: color }} />

      {/* Label */}
      <div className="flex flex-row items-center gap-2 ml-6">
        <span className="text-sm font-medium">{label}</span>
        {subLabel && (<span className="text-sm text-muted-foreground">{subLabel}</span>)}
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button onClick={handleRemove} className="absolute right-2 p-1 hover:bg-accent rounded-sm">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </Card>
  )
}
```

Key changes and explanations:

*   **`useRef` Hook:**  We use `useRef` to create a persistent reference to the timeout ID.  This is important because the timeout ID needs to persist across re-renders of the component.  We initialize it to `null`.
*   **`debouncedHandleResetHighlight` function:** This function now wraps the original `handleResetHighlight` in a `setTimeout`.
    *   **Clear Existing Timeout:**  Before setting a new timeout, we clear any existing timeout using `clearTimeout(resetHighlightTimeout.current)`. This prevents multiple `handleResetHighlight` calls from being queued up if the user moves the mouse quickly between cards.
    *   **Set New Timeout:** We set a new timeout using `setTimeout`.  The timeout will call `handleResetHighlight` after a specified delay (in this case, 100ms).  Adjust the delay to suit your needs.
    *   **Update `resetHighlightTimeout.current`:**  We store the timeout ID in `resetHighlightTimeout.current` so that we can clear it later.  We also set it to `null` after the timeout has executed.
*   **`onMouseLeave` Prop:** In the `SeriesCard` component, we pass the `debouncedHandleResetHighlight` function to the `onMouseLeave` prop of the `Card` component.  This ensures that the debounced function is called when the mouse leaves the card.
*   **Type enforcement**: I've enforced the type of the `onResetHighlight` function to be a regular function instead of optional, this will ensure that there is no scenario where this prop is undefined.

**How it works:**

1.  **Mouse Enters Card:**  `onMouseEnter` calls `onTogglePlotHighlight`, which immediately highlights the current card and dims the others.  Any pending `handleResetHighlight` calls are cleared.
2.  **Mouse Leaves Card:**  `onMouseLeave` calls `debouncedHandleResetHighlight`.  This function sets a timeout to call `handleResetHighlight` after a delay.
3.  **Mouse Enters Another Card *Before* the Delay:**  `onMouseEnter` is called on the new card.  This *clears* the pending timeout from the previous card.  The `handleResetHighlight` function is *not* called.
4.  **Mouse Leaves Card and Stays Off Cards for the Delay:** The timeout expires, and `handleResetHighlight` is called, resetting the opacities to 1.

This approach effectively debounces the `handleResetHighlight` function, preventing the flickering effect when the user quickly moves the mouse between cards. Adjust the delay (100ms in this example) to find the optimal value for your application.  A longer delay will reduce flickering but might make the highlighting feel less responsive.

### QUESTION

Why do you create a new function instead of wrapping the HandleResetHighlight?

That's a great question! Creating a new function (`debouncedHandleResetHighlight`) instead of directly wrapping `handleResetHighlight` within the `SeriesCard` component offers several advantages related to component re-renders, prop stability, and overall performance in React:

1.  **Preventing Unnecessary Re-renders in `SeriesCard`:**

    *   **Prop Stability:** When you pass a new inline function (e.g., `onMouseLeave={() => setTimeout(handleResetHighlight, 100)}`) as a prop to a child compo memory allocation and garbage collection overhead.

3.  **Cleaner and More Maintainable Code:** component remains focused on its core responsibility of rendering a series card and handling basic user interactions.
    *   **Readability:**  The code becomes easier to read and understand because the intent is clearer.

**In summary:**

Creating `debouncedHandleResetHighlight` as a separate function ensures that the `SeriesCard` component only re-renders when necessary, leading to better performance and a more efficient React application. It also keeps the code cleaner and more maintainable by separating the debouncing logic from the rendering logic of the `SeriesCard` component.


    *   **Separation of Concerns:**  The debouncing logic is encapsulated within the `PlotLine` component, where it belongs (since it's related to managing the highlighting state). The `SeriesCard`nent, React treats it as a *different* prop value on every render of the parent component. This causes the child component (`SeriesCard` in this case) to re-render unnecessarily, even if its other props haven't changed.
    *   **`debouncedHandleResetHighlight` is Stable:** By defining `debouncedHandleResetHighlight` *outside* the `SeriesCard` component and passing *that* function as the `onResetHighlight` prop, you ensure that the prop value remains the same across re-renders of the parent (`PlotLine`). This prevents `SeriesCard` from re-rendering unless it truly needs to.

2.  **Improved Performance and Reduced Memory Usage:**

    *   **Fewer Function Creations:**  Creating inline functions within JSX can lead to a lot of function objects being created and garbage collected on each render.
    *   **Single Debounced Function:**  The `debouncedHandleResetHighlight` function is created only *once* when the `PlotLine` component mounts.  This reduces
    o


### QUESTION

I want to up the alpha on the SeriesCard when its being hovered over, check out the updated version of it: 

```typescriptreact

import { SeriesCard } from "@/components/plots/ui";
import { SeriesSearch } from "@/components/plots/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeSeriesData } from "@/components/plots/models";

interface Props {
  header: string;
  searchTriggerLabel: string;
  searchPlaceholder: string;
  series: TimeSeriesData[];
  availableSeries: TimeSeriesData[];
  toggledSeries: Record<string, boolean>;
  highlightedSeries: Record<string, number>;
  onRemoveSeries: (id: string) => void;
  onAddSeries: (series: TimeSeriesData) => void;
  onTogglePlotVisibility: (id: string) => void;
  onTogglePlotHighlight: (id: string) => void;
  onToggleResetHighlight: () => void;
}

export const LineControls = ({
  header, searchTriggerLabel, searchPlaceholder, series, availableSeries, toggledSeries,
  onRemoveSeries, onAddSeries, onTogglePlotVisibility, onTogglePlotHighlight, onToggleResetHighlight
}: Props) => {
  return (
    <div className="flex flex-col space-y-4 h-full bg-background">

      {/* Series Search */}
      <div className="pr-3">
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeries(selectedSeries as TimeSeriesData)}
          searchPlaceholder={searchPlaceholder}
          triggerLabel={searchTriggerLabel}
        />
      </div>

      {/* Selected series group */}
      <div className="flex flex-col space-y-2 overflow-hidden">
        {series.length > 0 &&
          <>
            <h2 className="text-xs font-medium text-muted-foreground">{header}</h2>
            <ScrollArea className="h-full w-full pr-3">
              <div className="space-y-2">
                {/* Selected series card */}
                {series.map((item) => (
                  <SeriesCard
                    key={item.id}
                    label={item.label}
                    subLabel={item.subLabel}
                    color={item.color}
                    toggled={toggledSeries[item.id] ?? true}
                    onRemove={() => onRemoveSeries(item.id)}
                    onToggleVisibility={() => onTogglePlotVisibility(item.id)}
                    onHighlight={() => onTogglePlotHighlight(item.id)}
                    onResetHighlight={onToggleResetHighlight}
                  />
                ))}
              </div>
            </ScrollArea>
          </>
        }
      </div>
    </div>
  )
}

```

```typescriptreact
import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface Props {
  label: string;
  subLabel?: string;
  color: string;
  toggled?: boolean;
  onRemove?: () => void;
  onToggleVisibility?: () => void;
  onHighlight?: () => void;
  onResetHighlight: () => void;
}

export const SeriesCard = ({
  label, subLabel, color, toggled, onRemove, onToggleVisibility, onHighlight, onResetHighlight
}: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false); // <-- Add this state

  const handleRemove = (e: React.MouseEvent) => {
    // Stop propagation to avoid triggering onToggleVisibility
    e.stopPropagation();
    setIsVisible(false);
    // Wait for animation to complete before calling onRemove
    // The state change triggers a re-render of the card with the close animation
    if (onRemove) {
      setTimeout(onRemove, 100);
    }
  }

  const getRgbaBackground = (hexColor: string, alpha: number = 0.15) => { // <-- Modify this function
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <Card
      className={cn(
        "relative flex items-center gap-3 p-2 pl-0 pr-8 rounded-lg border-0 h-8 cursor-pointer",
        isVisible
          ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          : "animate-out fade-out-0 zoom-out-95",
        !toggled && "opacity-50"
      )}
      style={{ backgroundColor: getRgbaBackground(color, isHovered ? 0.3 : 0.15) }} // <-- Modify this line
      onClick={onToggleVisibility}
      onMouseEnter={() => {
        setIsHovered(true); // <-- Set isHovered to true
        onHighlight();
      }}
      onMouseLeave={() => {
        setIsHovered(false); // <-- Set isHovered to false
        onResetHighlight();
      }}
    >

      {/* Color indicator */}
      <div className="absolute w-[0.60rem] h-full rounded-l-lg" style={{ backgroundColor: color }} />

      {/* Label */}
      <div className="flex flex-row items-center gap-2 ml-6">
        <span className="text-sm font-medium">{label}</span>
        {subLabel && (<span className="text-sm text-muted-foreground">{subLabel}</span>)}
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button onClick={handleRemove} className="absolute right-2 p-1 hover:bg-accent rounded-sm">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </Card>
  )
}
```

Key Changes and Explanations:

1.  **`isHovered` State:**
    *   We introduce a new state variable `isHovered` using `useState(false)`. This state tracks whether the mouse is currently hovering over the `SeriesCard`.

2.  **Modified `getRgbaBackground` Function:**
    *   The `getRgbaBackground` function is updated to accept an optional `alpha` parameter with a default value of `0.15`.  This allows us to control the alpha value of the background color.

3.  **Conditional Alpha Value in `style`:**
    *   The `style` prop of the `Card` component is modified to use the `getRgbaBackground` function with a conditional alpha value:
        *   `isHovered ? 0.3 : 0.15`:  If `isHovered` is `true` (the mouse is hovering), the alpha value is set to `0.3` (more opaque). Otherwise, it's set to `0.15` (less opaque).

4.  **`onMouseEnter` and `onMouseLeave` Handlers:**
    *   The `onMouseEnter` and `onMouseLeave` event handlers are updated to set the `isHovered` state:
        *   `onMouseEnter`: Sets `isHovered` to `true` when the mouse enters the card.
        *   `onMouseLeave`: Sets `isHovered` to `false` when the mouse leaves the card.
    *   The `onHighlight` and `onResetHighlight` functions are called within these handlers, ensuring that the highlighting logic is still triggered correctly.  We use arrow functions for these event handlers to pass the events.

**How it works:**

*   When the mouse enters the `SeriesCard`, the `onMouseEnter` handler is called, setting `isHovered` to `true`. This triggers a re-render of the `Card` component.
*   During the re-render, the `style` prop is updated to use `getRgbaBackground` with an alpha value of `0.3`, making the card's background more opaque.
*   When the mouse leaves the `SeriesCard`, the `onMouseLeave` handler is called, setting `isHovered` to `false`. This triggers another re-render.
*   During this re-render, the `style` prop is updated to use `getRgbaBackground` with an alpha value of `0.15`, making the card's background less opaque.

This approach provides a smooth visual indication of which `SeriesCard` is currently being hovered over, enhancing the user experience.


### QUESTION
Is this not doable with css/tailwind?

Yes, absolutely! You're right, this effect is very easily achievable with CSS and Tailwind CSS, and it's generally the preferred approach for simple hover effects like this. Using CSS/Tailwind is more performant because it avoids unnecessary React state updates and re-renders.

Here's how you can achieve the same effect using Tailwind CSS:

**1. Modify the `SeriesCard` Component:**

   Remove the `isHovered` state and the inline `style` prop, and instead use Tailwind's `hover:` modifier classes.

   ```typescriptreact
   import { useState } from "react";
   import { X } from "lucide-react";
   import { cn } from "@/lib/utils";
   import { Card } from "@/components/ui/card";

   interface Props {
     label: string;
     subLabel?: string;
     color: string;
     toggled?: boolean;
     onRemove?: () => void;
     onToggleVisibility?: () => void;
     onHighlight?: () => void;
     onResetHighlight: () => void;
   }

   export const SeriesCard = ({
     label, subLabel, color, toggled, onRemove, onToggleVisibility, onHighlight, onResetHighlight
   }: Props) => {
     const [isVisible, setIsVisible] = useState(true);

     const handleRemove = (e: React.MouseEvent) => {
       // Stop propagation to avoid triggering onToggleVisibility
       e.stopPropagation();
       setIsVisible(false);
       // Wait for animation to complete before calling onRemove
       // The state change triggers a re-render of the card with the close animation
       if (onRemove) {
         setTimeout(onRemove, 100);
       }
     }

     const getRgbaBackground = (hexColor: string, alpha: number = 0.15) => {
       const hex = hexColor.replace("#", "");
       const r = parseInt(hex.substring(0, 2), 16);
       const g = parseInt(hex.substring(2, 4), 16);
       const b = parseInt(hex.substring(4, 6), 16);
       return `rgba(${r}, ${g}, ${b}, ${alpha})`;
     }

     return (
       <Card
         className={cn(
           "relative flex items-center gap-3 p-2 pl-0 pr-8 rounded-lg border-0 h-8 cursor-pointer",
           isVisible
             ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
             : "animate-out fade-out-0 zoom-out-95",
           !toggled && "opacity-50",
           "hover:bg-opacity-30" // <-- Add this line
         )}
         style={{ backgroundColor: getRgbaBackground(color) }} //  Keep this line
         onClick={onToggleVisibility}
         onMouseEnter={onHighlight} // Call the highlight function
         onMouseLeave={onResetHighlight} // Call the reset highlight function
       >

         {/* Color indicator */}
         <div className="absolute w-[0.60rem] h-full rounded-l-lg" style={{ backgroundColor: color }} />

         {/* Label */}
         <div className="flex flex-row items-center gap-2 ml-6">
           <span className="text-sm font-medium">{label}</span>
           {subLabel && (<span className="text-sm text-muted-foreground">{subLabel}</span>)}
         </div>

         {/* Remove Button */}
         {onRemove && (
           <button onClick={handleRemove} className="absolute right-2 p-1 hover:bg-accent rounded-sm">
             <X className="h-4 w-4 text-muted-foreground" />
           </button>
         )}
       </Card>
     )
   }
   ```

**Explanation:**

*   **`hover:bg-opacity-30`:** This Tailwind class does the following:
    *   `hover:`:  This is the Tailwind modifier that applies the styles only when the element is being hovered over.
    *   `bg-opacity-30`: This sets the background opacity to 30% (which is equivalent to an alpha of 0.3).  It's important to note that this requires you to have defined a background *color* on the element already (which you are doing with the inline style).

**Why this is better:**

*   **Performance:**  CSS hover effects are handled directly by the browser, without involving React re-renders. This is significantly more efficient.
*   **Simplicity:** The code is cleaner and easier to understand.  You're using Tailwind's declarative syntax to express the desired styling.
*   **Maintainability:**  CSS styles are generally easier to maintain and modify than inline styles that are dependent on React state.

**Important Note:**

This approach assumes that the `Card` component (or whatever element you're applying the hover effect to) already has a background color set. The `bg-opacity-*` classes in Tailwind modify the opacity of an existing background color. In this case, the background color is set using the inline style: `style={{ backgroundColor: getRgbaBackground(color) }}`.

This Tailwind CSS solution is the recommended way to implement this type of hover effect in React. It's more performant, cleaner, and easier to maintain than using React state.


