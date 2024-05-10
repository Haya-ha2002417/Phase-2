
import Chart from 'chart.js/auto';

const Graph = ({ data }) => {

    if (data && data.length > 0) {
      const labels = data.map(item => item.label);
      const values = data.map(item => item.value);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const container = document.querySelector('.graph-container');
      if (container) {
        container.appendChild(canvas);

        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Statistics',
              data: values,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
 

  return <div className="graph-container"></div>;
};

export default Graph;
