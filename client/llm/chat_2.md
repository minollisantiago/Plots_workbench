
I have this array im working with, im using it to set the controls for a time series date controls component, here is the arra:

<!-- Symbol: periods -->
<!-- Kind: Variable -->
```typescriptreact
  const periods: TimePeriod[] = ["1W", "1M", "3M", "6M", "YTD", "1Y", "All"]
```
Here is the implementation of the array: 

<!-- Symbol: PlotLine -->
<!-- Kind: Variable -->
```typescriptreact
export const PlotLine = ({ title }: Props) => {
  const [selectedSeries, setSelectedSeries] = useState<TimeSeriesData[]>([]);
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({});

  const exampleSeries = mockTimeSeriesData.series

  const periods: TimePeriod[] = ["1W", "1M", "3M", "6M", "YTD", "1Y", "All"]

  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeries((prev) => {
      if (!prev.some(s => s.id == series.id)) {
        return [...prev, series]
      }
      return prev;
    })
    console.log("Selected series:", selectedSeries);
  };

  const handleRemoveSeries = (id: string) => {
    setSelectedSeries((prev) => prev.filter(series => series.id !== id))
    setVisibleSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    })
    console.log("Selected series:", selectedSeries);
  }

  const handleTogglePlotVisibility = (id: string) => {
    setVisibleSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }))
  };

  const handleSelectPeriod = (period: TimePeriod) => {
    console.log(`Selected period: ${period}`)
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
            series={selectedSeries}
            availableSeries={exampleSeries}
            toggledSeries={visibleSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
          />
        </div>
      </div>

      {/* Figure */}
      {selectedSeries.length > 0 ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              defaultSelected="All"
              onSelect={(period) => handleSelectPeriod(period)}
            />
          </div>
          <PlotLineFigure
            data={selectedSeries.map(series => ({
              ...series.plotData, visible: visibleSeries[series.id] ?? true
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

And here is the TimePeriodSelector:
<!-- Symbol: TimePeriodSelector -->
<!-- Kind: Variable -->
```typescriptreact
export const TimePeriodSelector = ({ periods, defaultSelected, onSelect }: Props) => {
  const [selected, setSelected] = useState<TimePeriod>(defaultSelected ?? periods[0])

  const handleSelect = (period: TimePeriod) => {
    setSelected(period)
    onSelect?.(period)
  }

  return (
    <div className="flex gap-2 bg-background/95">
      <div className="flex gap-2 center items-center">
        {periods.map((period) => (
          <Button
            key={period}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-10 px-2 rounded-lg text-sm text-muted-foreground",
              selected === period
                ? "text-muted-foreground bg-primary-foreground hover:bg-muted hover:text-muted-foreground"
                : "hover:bg-muted"
            )}
            onClick={() => handleSelect(period)}
          >
            {period}
          </Button>
        ))}
      </div>
      <Separator orientation="vertical" />
      <DateRangePicker numberOfMonths={3} />
    </div>
  )
}
```
Im looking to refactor periods to include numeric values that refer to the number of days each string on the array represents, for example: "1W" should be 5 (5 days)

```typescriptreact
// TimePeriod type now includes the number of days
type TimePeriod = {
  label: string;
  days: number;
};

export const PlotLine = ({ title }: Props) => {
  const [selectedSeries, setSelectedSeries] = useState<TimeSeriesData[]>([]);
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({});

  const exampleSeries = mockTimeSeriesData.series

  // Periods array with label and corresponding days
  const periods: TimePeriod[] = [
    { label: "1W", days: 5 }, // Changed from 1 week to 5 days, assuming only weekdays
    { label: "1M", days: 22 }, // Assuming 22 trading days in a month
    { label: "3M", days: 66 }, // 3 months * 22 trading days
    { label: "6M", days: 132 }, // 6 months * 22 trading days
    { label: "YTD", days: calculateYTD() }, // Function to calculate days from beginning of the year to current date
    { label: "1Y", days: 252 }, // Assuming 252 trading days in a year
    { label: "All", days: -1 } // -1 to signify all data
  ];

  // Helper function to calculate Year-to-Date trading days
  const calculateYTD = (): number => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    let days = 0;

    for (let d = startOfYear; d <= now; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
        days++;
      }
    }
    return days;
  };



  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeries((prev) => {
      if (!prev.some(s => s.id == series.id)) {
        return [...prev, series]
      }
      return prev;
    })
    console.log("Selected series:", selectedSeries);
  };

  const handleRemoveSeries = (id: string) => {
    setSelectedSeries((prev) => prev.filter(series => series.id !== id))
    setVisibleSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    })
    console.log("Selected series:", selectedSeries);
  }

  const handleTogglePlotVisibility = (id: string) => {
    setVisibleSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }))
  };

  // Updated handleSelectPeriod function to receive the TimePeriod object
  const handleSelectPeriod = (period: TimePeriod) => {
    console.log(`Selected period: ${period.label} (${period.days} days)`)
    //Use the days value to filter the data
    //Example:
    // const filteredData = yourOriginalData.filter(item => {
    //   const itemDate = new Date(item.date);
    //   const cutoffDate = new Date();
    //   cutoffDate.setDate(cutoffDate.getDate() - period.days);
    //   return itemDate >= cutoffDate;
    // });
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
            series={selectedSeries}
            availableSeries={exampleSeries}
            toggledSeries={visibleSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
          />
        </div>
      </div>

      {/* Figure */}
      {selectedSeries.length > 0 ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              defaultSelected={periods.find(p => p.label === "All")} // Find the 'All' object instead of a string
              onSelect={(period) => handleSelectPeriod(period)}
            />
          </div>
          <PlotLineFigure
            data={selectedSeries.map(series => ({
              ...series.plotData, visible: visibleSeries[series.id] ?? true
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

// TimePeriodSelector component update
export const TimePeriodSelector = ({ periods, defaultSelected, onSelect }: {
  periods: TimePeriod[];
  defaultSelected?: TimePeriod;
  onSelect?: (period: TimePeriod) => void;
}) => {
  const [selected, setSelected] = useState<TimePeriod>(defaultSelected ?? periods[0])

  const handleSelect = (period: TimePeriod) => {
    setSelected(period)
    onSelect?.(period)
  }

  return (
    <div className="flex gap-2 bg-background/95">
      <div className="flex gap-2 center items-center">
        {periods.map((period) => (
          <Button
            key={period.label} // Use period.label as key
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-10 px-2 rounded-lg text-sm text-muted-foreground",
              selected.label === period.label // Compare labels
                ? "text-muted-foreground bg-primary-foreground hover:bg-muted hover:text-muted-foreground"
                : "hover:bg-muted"
            )}
            onClick={() => handleSelect(period)}
          >
            {period.label} {/* Display the label */}
          </Button>
        ))}
      </div>
      <Separator orientation="vertical" />
      <DateRangePicker numberOfMonths={3} />
    </div>
  )
}
```

Key improvements and explanations:

* **`TimePeriod` Type:**  The most important change.  The `TimePeriod` type is now an object: `{ label: string; days: number; }`. This is crucial for storing both the display text (e.g., "1W") and the numerical value (e.g., 5).

* **`periods` Array Update:** The `periods` array is now an array of `TimePeriod` objects.  I've assigned estimated `days` values.  **Important:**  You'll need to adjust these `days` values to match your specific trading day calculations.  I've assumed 5 days for "1W" (weekdays only), 22 for "1M" (approx. trading days in a month), etc.  The key is that *you* must define what these periods mean in terms of number of days.

* **`calculateYTD()` Function:**  A helper function is provided to dynamically calculate the number of trading days year-to-date.  This is much better than hardcoding a value that will become incorrect as the year progresses.  **Critical:** This function assumes a standard Monday-Friday trading week. If your trading days are different, you'll need to modify this.

* **`defaultSelected` in `TimePeriodSelector`:**  The `defaultSelected` prop now expects a `TimePeriod` object, not just a string.  I've updated the `PlotLine` component to find the `TimePeriod` object where `label === "All"` and pass that.  This ensures the selector is initialized correctly.

* **`handleSelectPeriod` Update:** The `handleSelectPeriod` function now receives the entire `TimePeriod` object.  You can access both `period.label` and `period.days` within this function.  I've added a comment illustrating how you would then use `period.days` to filter your time series data.  **You MUST implement the actual filtering logic here based on how your `mockTimeSeriesData` is structured.**

* **`TimePeriodSelector` Key and Display:**  The `TimePeriodSelector` component now uses `period.label` as the `key` for the `Button` component (React requires unique keys when mapping) and displays `period.label` in the button text.  The comparison `selected.label === period.label` ensures the correct button is highlighted as selected.

* **Type Safety:**  I've added explicit type annotations (e.g., `: TimePeriod[]`) to improve type safety and help catch errors during development.

* **Important Considerations for `days` Values:**
    * **Trading Days vs. Calendar Days:** I've assumed you want *trading days* (weekdays only) for most periods. If you want calendar days, you'll need to adjust the `days` values accordingly.
    * **Month/Year Calculations:** The `1M`, `3M`, `6M`, and `1Y` values are *estimates*.  The exact number of trading days in a month or year varies. If you need precise calculations, you'll need to implement more sophisticated logic to count trading days within a given period.  Consider using a dedicated date/time library like `date-fns` or `moment.js` (although `date-fns` is generally preferred for modern projects due to its smaller bundle size and better modularity).
    * **"All" Period:**  I've used `-1` as the `days` value for the "All" period. This is a common convention to indicate that no filtering should be applied.  Adjust this if necessary based on your filtering logic.  Alternatively, you could remove the `days` property altogether from the "All" object and check for its existence in your filtering logic.

How to use the `days` value in `handleSelectPeriod` to filter data (example):

```typescriptreact
const handleSelectPeriod = (period: TimePeriod) => {
  console.log(`Selected period: ${period.label} (${period.days} days)`)

  // Assuming your time series data has a 'date' property
  const filteredData = mockTimeSeriesData.series.map(series => ({
    ...series,
    plotData: {
      ...series.plotData,
      data: series.plotData.data.filter(item => {
        const itemDate = new Date(item.date); // Assuming item.date is a string or number that can be parsed by Date()
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - period.days); // Calculate the cutoff date
        return itemDate >= cutoffDate; // Keep items with dates on or after the cutoff date
      })
    }
  }));

  // Now, 'filteredData' contains the time series data filtered by the selected period
  // Update your state or pass 'filteredData' to your chart component to display the filtered data.
  setSelectedSeries(filteredData);
};
```

Remember to replace `mockTimeSeriesData.series` with the actual name of your time series data source and adjust the date parsing logic as needed.

This revised solution provides a much more robust and flexible way to handle time period selection with associated numerical values.  Remember to adapt the `days` values and filtering logic to your specific data and requirements.

