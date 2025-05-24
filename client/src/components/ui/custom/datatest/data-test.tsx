import { useState, useEffect } from "react";
//import { TimeSeriesData } from "@/components/plots/models";
import { LoadingContent } from "@/components/ui/custom/loading/loading-content";

interface TimeSeriesData {
  id: string;
  label: string;
  subLabel: string;
  plotData: {
    x: string[];
    y: number[];
    name: string;
  };
}

interface TimeSeriesResponse {
  series: TimeSeriesData[]
};

export const DataTest = () => {
  const [data, setData] = useState<TimeSeriesResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServerStatus = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/bdtest");
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError("Cannot reach server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServerStatus();
  }, []);

  return (
    <LoadingContent loading={loading} error={error ? { error: error } : undefined}>
      <div className="flex flex-col gap-2 p-2 place-content-center overflow-scroll">
        {data && data.series.map((series) => (
          <div key={series.id} className="border p-4 rounded">
            <h3 className="font-semibold">{series.label}</h3>
            <p className="text-sm text-gray-600">{series.subLabel}</p>
            <div className="mt-2">
              <p className="text-sm">Data points: {series.plotData.x.length}</p>
              <p className="text-sm">First value: {series.plotData.y[0]}</p>
              <p className="text-sm">Last value: {series.plotData.y[series.plotData.y.length - 1]}</p>
            </div>
          </div>
        ))}
      </div>
    </LoadingContent>
  );
};
