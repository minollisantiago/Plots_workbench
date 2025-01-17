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
  // Series metadata
  series: [
    {
      id: "1",
      label: "NVDA",
      subLabel: "Share Price",
      color: "#E9EC89",
      group: "Tech",
      data: {
        x: dates,
        y: dates.map(() => Math.random() * 800 + 400), // Random values between 400-1200
        type: 'scatter',
        mode: 'lines+markers',
      }
    },
    {
      id: "2",
      label: "AMZN",
      subLabel: "Share Price",
      color: "#489FFA",
      group: "Consumer",
      data: {
        x: dates,
        y: dates.map(() => Math.random() * 150 + 120), // Random values between 120-270
        type: 'scatter',
        mode: 'lines+markers',
      }
    },
    {
      id: "3",
      label: "TSLA",
      subLabel: "Share Price",
      color: "#C88FCF",
      group: "Tech",
      data: {
        x: dates,
        y: dates.map(() => Math.random() * 100 + 150), // Random values between 150-250
        type: 'scatter',
        mode: 'lines+markers',
      }
    },
  ]
};

// You might also want to define a type for the data structure
export interface TimeSeriesData {
  id: string;
  label: string;
  subLabel: string;
  color: string;
  group: string;
  data: {
    x: string[];
    y: number[];
    type: 'scatter';
    mode: 'lines+markers';
  };
}
