import type { PlotTheme } from '@/config/plots/models';

export const darkTheme: PlotTheme = {
  base: {
    paper_bgcolor: "#09090b",
    plot_bgcolor: "#09090b",
    font: {
      family: "Geist, FiraCode Nerd Font Mono",
      color: "#9E9EAA",
      weight: 400,
      size: 12,
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
        family: "Geist, FiraCode Nerd Font Mono",
        size: 12,
      }
    },
    legend: {
      bgcolor: "rgba(0, 0, 0, 0)",
      font: {
        color: "#9E9EAA",
        family: "Geist, FiraCode Nerd Font Mono",
        weight: 400,
        size: 13
      }
    },
    modebar: {
      bgcolor: "rgba(0, 0, 0, 0)",
      color: "#9E9EAA",
      orientation: "v"
    },
    axis: {
      color: "#9E9EAA",
      linecolor: "rgba(83, 83, 95, 0.3)",
      gridcolor: "rgba(83, 83, 95, 0.3)",
      spikecolor: "#DE2369",
      tickcolor: "#303136",
      font: {
        color: "#9E9EAA",
        family: "Geist, FiraCode Nerd Font Mono",
        size: 13
      }
    }
  }
};
