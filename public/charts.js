loadNav();

fetch('/values')
  .then(response => response.text())
  .then(text => {
    console.log('Response text:', text);
    return JSON.parse(text);
  })
  .then(data => {
    // Parse the data and create the chart
    const chartData = {};

    // Process student data
    data.data.forEach(student => {
      if (!chartData[student.id]) {
        chartData[student.id] = {
          label: student.id,
          data: [],
          borderColor: `hsl(${student.id * 36}, 70%, 50%)`,
          pointBackgroundColor: `hsl(${student.id * 36}, 70%, 50%)`,
          pointRadius: 5,
          pointHoverRadius: 8,
        };
      }

      chartData[student.id].data.push({
        x: student.confidence,
        y: student.prompt,
      });
    });

    // Create the chart
    new Chart('scatter-chart', {
      type: 'scatter',
      data: {
        datasets: Object.values(chartData),
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
