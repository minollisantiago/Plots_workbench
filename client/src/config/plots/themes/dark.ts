import type { PlotTheme } from '@/config/plots/models';

export const darkTheme: PlotTheme = {
  base: {
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    font: {
      family: "Geist Mono, FiraCode Nerd Font Mono",
      color: "#9E9EAA",
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
        color: "#D5D8DD"
      }
    },
    legend: {
      bgcolor: "rgba(0, 0, 0, 0)",
      font: {
        color: "#9E9EAA",
        family: "Geist Mono, FiraCode Nerd Font Mono",
        size: 16
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
        family: "Geist Mono, FiraCode Nerd Font Mono",
        size: 13
      }
    }
  }
};
