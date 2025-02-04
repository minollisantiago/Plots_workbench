import type { PlotTheme } from '@/types/plots';

export const lightTheme: PlotTheme = {
  base: {
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "#D5D8DD",
    font: {
      family: "Geist Sans, FiraCode Nerd Font Mono",
      color: "#1E2326",
      size: 13
    }
  },
  components: {
    title: {
      font: {
        size: 14
      }
    },
    hoverlabel: {
      bgcolor: "#111",
      bordercolor: "#363940",
      font: {
        color: "#D5D8DD",
        family: "Geist Mono, FiraCode Nerd Font Mono"
      }
    },
    legend: {
      bgcolor: "rgba(0, 0, 0, 0)",
      font: {
        color: "#1E2326",
        family: "Geist Mono, FiraCode Nerd Font Mono",
        size: 13
      }
    },
    modebar: {
      bgcolor: "rgba(0, 0, 0, 0)",
      color: "#1E2326",
      orientation: "v"
    },
    axis: {
      color: "#1E2326",
      linecolor: "rgba(83, 83, 95, 0.3)",
      gridcolor: "#303136",
      spikecolor: "#DE2369",
      tickcolor: "#303136",
      font: {
        color: "#1E2326",
        family: "Geist Mono, FiraCode Nerd Font Mono",
        size: 13
      }
    }
  }
};
