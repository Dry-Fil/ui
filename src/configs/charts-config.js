export const chartsConfig = {
  chart: {
    height: 350, // Set a default height, can be overridden
    type: 'line', // Ensure default type is line
    dropShadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.5
    },
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false,
    },
  },
  title: {
    show: true,
    align: 'left' 
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      datetimeUTC: false, // Ensure local time is used
      format: 'HH:mm:ss', // Format for time display
      formatter: function (value, timestamp) {
        return new Date(timestamp).toLocaleTimeString();
      },
      style: {
        colors: "#37474f",
        fontSize: "13px",
        fontFamily: "inherit",
        fontWeight: 300,
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#37474f",
        fontSize: "13px",
        fontFamily: "inherit",
        fontWeight: 300,
      },
    },
  },
  grid: {
    show: true,
    borderColor: '#e7e7e7', 
    row: {
      colors: ['#f3f3f3', 'transparent'], // Alternating row colors
      opacity: 0.5
    },
    strokeDashArray: 5,
    xaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 5,
      right: 20,
    },
  },
  markers: {
    size: 1, 
    hover: {
      size: 7,
      sizeOffset: 2,
    },
  },
  tooltip: {
    theme: "dark",
  },
  legend: { 
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
};

export default chartsConfig;
