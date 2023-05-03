// studentDataScript.js
loadNav();

function matrixToDataURL(matrix) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const size = 32;

  canvas.width = size;
  canvas.height = size;
  const imageData = ctx.createImageData(size, size);

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const pixelIndex = (i * size + j) * 4;
      const value = matrix[i][j] * 255;

      imageData.data[pixelIndex] = 255 - value;
      imageData.data[pixelIndex + 1] = 255 - value;
      imageData.data[pixelIndex + 2] = 255 - value;
      imageData.data[pixelIndex + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

function createTable(studentData) {
  const table = document.createElement('table');
  table.style.width = '100%';
  table.setAttribute('border', '1');

  const header = table.createTHead();
  const headerRow = header.insertRow();
  headerRow.innerHTML = `
      <th>Student ID</th>
      <th>Prompt</th>
      <th>Classification</th>
      <th>Confidence</th>
      <th>Image</th>
    `;

  const tbody = document.createElement('tbody');
  studentData.forEach(item => {
    const row = tbody.insertRow();
    const imageURL = matrixToDataURL(item.matrix);
    row.innerHTML = `
        <td>${item.studentId}</td>
        <td>${item.prompt}</td>
        <td>${(item.classification * 100)}</td>
        <td>${item.confidence.toFixed(2)}%</td>
        <td><img src="${imageURL}" width="32" height="32" alt="Image"></td>
      `;
  });

  table.appendChild(tbody);
  document.getElementById('student-data').appendChild(table);
}

// Fetch values for student data table
fetch('/values')
  .then(response => response.text())
  .then(text => {
    console.log('Response text:', text);
    return JSON.parse(text);
  })
  .then(data => {
    const studentData = data.data;
    createTable(studentData);
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });
