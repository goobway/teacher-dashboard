// script.js
fetch('/values')
  .then(response => response.json())
  .then(data => {
    const studentData = data.data;
    
    // Assuming you have bar chart data in the following format
    // const barChartData = [
    //   { studentId: 0, correctCount: 10 },
    //   { studentId: 1, correctCount: 15 },
    //   // ...
    // ];
    // createBarChart(barChartData);
    createTable(studentData);
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });
