// Helper function to generate dates for the last n days
const generateDates = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Generate 30 days of mock data
const dates = generateDates(30);


export const mockTimeSeriesData = {
  series: [
    {
      // Metadata
      id: "1",
      label: "NVDA",
      subLabel: "Share Price",
      color: "#E9EC89",
      group: "Tech",
      // Plot data
      plotData: {
        x: dates,
        y: dates.map(() => Math.random() * 800 + 400),
        name: "NVDA",
        line: {
          color: "#E9EC89"
        }
      }
    },
    {
      id: "2",
      label: "AMZN",
      subLabel: "Share Price",
      color: "#489FFA",
      group: "Consumer",
      plotData: {
        x: dates,
        y: dates.map(() => Math.random() * 150 + 120),
        name: "AMZN",
        line: {
          color: "#489FFA"
        }
      }
    },
    {
      id: "3",
      label: "TSLA",
      subLabel: "Share Price",
      color: "#C88FCF",
      group: "Tech",
      plotData: {
        x: dates,
        y: dates.map(() => Math.random() * 100 + 150),
        name: "TSLA",
        line: {
          color: "#C88FCF"
        }
      }
    },
  ]
};
