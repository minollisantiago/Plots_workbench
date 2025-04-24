import { TimeSeriesData } from "@/components/plots/models";

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

// Generate n days of mock data
export const dates = generateDates(90);

export const mockTimeSeriesData: { series: TimeSeriesData[] } = {
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
    {
      id: "4",
      label: "GOOG",
      subLabel: "Share Price",
      color: "#D84F68",
      group: "Tech",
      plotData: {
        x: dates,
        y: dates.map(() => Math.random() * 120 + 200),
        name: "GOOG",
        line: {
          color: "#D84F68"
        }
      }
    },
    {
      id: "5",
      label: "MSFT",
      subLabel: "Share Price",
      color: "#4DBE95",
      group: "Tech",
      plotData: {
        x: dates,
        y: dates.map(() => Math.random() * 250 + 300),
        name: "MSFT",
        line: {
          color: "#4DBE95"
        }
      }
    },
    {
      id: "6",
      label: "AAPL",
      subLabel: "Share Price",
      color: "#F6C86A",
      group: "Tech",
      plotData: {
        x: dates,
        y: dates.map(() => Math.random() * 180 + 150),
        name: "AAPL",
        line: {
          color: "#F6C86A"
        }
      }
    },
    {
      id: "7",
      label: "META",
      subLabel: "Share Price",
      color: "#8085FF",
      group: "Tech",
      plotData: {
        x: dates,
        y: dates.map(() => Math.random() * 200 + 250),
        name: "META",
        line: {
          color: "#8085FF"
        }
      }
    }

  ]
};
