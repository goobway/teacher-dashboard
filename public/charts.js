loadNav();

loadNav();

fetch('/values')
  .then(response => response.text())
  .then(text => {
    console.log('Response text:', text);
    return JSON.parse(text);
  })
  .then(data => {
    // Define a function to generate colors based on student ID
    const getColor = (id) => `hsl(${id * 36}, 70%, 50%)`;

    // Parse the data and create the chart
    const chartData = data.data.map(student => ({
      x: student.prompt,
      y: student.confidence,
      pointBackgroundColor: getColor(student.id),
      pointBorderColor: getColor(student.id),
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
              text: 'Prompt',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Confidence Level',
            },
          },
        },
      },
    });
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });
