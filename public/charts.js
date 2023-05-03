fetch('/values')
  .then(response => response.text())
  .then(text => {
    console.log('Response text:', text);
    return JSON.parse(text);
  })
  .then(data => {
    // Parse the data and create the chart
    const chartData = data.data.map(student => ({
      x: student.confidence,
      y: student.prompt,
      borderColor: `hsl(${student.id * 36}, 70%, 50%)`,
      pointBackgroundColor: `hsl(${student.id * 36}, 70%, 50%)`,
      pointRadius: 5,
      pointHoverRadius: 8,
    }));

    new Chart('scatter-chart', {
      type: 'scatter',
      data: {
        datasets: [{
          data: chartData,
        }],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Confidence Level',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Prompt',
            },
          },
        },
      },
    });
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });