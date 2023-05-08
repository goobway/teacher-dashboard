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

let studentData = [];

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
  studentData.forEach((item, index) => {
    const row = tbody.insertRow();
    const imageURL = matrixToDataURL(item.matrix);
    const studentIdCell = document.createElement('td');
    console.log('Item studentId:', item.studentId);
    const studentIdSelect = createStudentIdSelect(item.studentId, index);
    studentIdCell.appendChild(studentIdSelect);
    row.appendChild(studentIdCell);

    row.innerHTML += `
    <td>${item.prompt}</td>
    <td>${item.classification}</td>
    <td>${(item.confidence * 100).toFixed(2)}%</td>
    <td><img src="${imageURL}" width="32" height="32" alt="Image"></td>
  `;

  });

  table.appendChild(tbody);
  document.getElementById('student-data').appendChild(table);
}

function createStudentIdSelect(selectedId, index) {
  console.log('SelectedId:', selectedId);
  const select = document.createElement('select');
  for (let i = 1; i <= 10; i++) { // Change the loop start value to 1 and end value to 10
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    if (i === selectedId) {
      option.selected = true;
    }
    select.appendChild(option);
  }

  select.addEventListener('change', function (event) {
    const newStudentId = parseInt(event.target.value);
    updateStudentId(index, newStudentId);
  });

  return select;
}

function updateStudentId(index, newStudentId) {
  const item = studentData[index];

  // Update the student ID in the local studentData array
  item.studentId = newStudentId;

  // Send the updated data to the server
  fetch(`/values/${item.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      studentId: newStudentId
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Student ID updated successfully:', data);
    })
    .catch(error => {
      console.error('Error updating student ID:', error);
    });
}

fetch('/values')
  .then(response => response.text())
  .then(text => {
    console.log('Response text:', text);
    return JSON.parse(text);
  })
  .then(data => {
    studentData = data.data;
    createTable(studentData);
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });
