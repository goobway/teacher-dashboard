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
      <th>New Student ID</th>
      <th>Student ID</th>
      <th>Prompt</th>
      <th>Classification</th>
      <th>Confidence</th>
      <th>Image</th>
    `;

  const tbody = document.createElement('tbody');
  studentData.forEach(item => {
    const row = tbody.insertRow(0); // Insert the new row at the beginning of the table body

    // Create a dropdown menu for the new student ID
    const newStudentIdCell = row.insertCell();
    const newStudentIdSelect = document.createElement('select');
    for (let i = 0; i < 10; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.text = i;
      newStudentIdSelect.appendChild(option);
    }
    newStudentIdCell.appendChild(newStudentIdSelect);

    row.innerHTML += `
        <td>${item.studentId}</td>
        <td>${item.prompt}</td>
        <td>${item.classification}</td>
        <td>${(item.confidence * 100).toFixed(2)}%</td>
      `;

    const imageURL = matrixToDataURL(item.matrix);
    const imageCell = row.insertCell();
    const image = new Image(32, 32);
    image.src = imageURL;
    imageCell.appendChild(image);

    // Add a button to update the student ID
    const updateButton = document.createElement('button');
    updateButton.innerText = 'Update';
    updateButton.addEventListener('click', () => {
      const newStudentId = Number(newStudentIdSelect.value);
      const itemId = item._id;
      console.log('Updating submission ID:', itemId, 'with new student ID:', newStudentId);
      fetch(`/values/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: newStudentId }),
      })
        .then(response => response.text())
        .then(text => {
          console.log('Response text:', text);
          // Reload the table to reflect the updated data
          fetch('/values')
            .then(response => response.text())
            .then(text => {
              console.log('Response text:', text);
              const data = JSON.parse(text).data;
              table.innerHTML = '';
              createTable(data);
            })
            .catch(error => {
              console.error('Error fetching student data:', error);
            });
        })
        .catch(error => {
          console.error('Error updating student data:', error);
        });
    });
    const buttonCell = row.insertCell();
    buttonCell.appendChild(updateButton);
  });

  table.appendChild(tbody);
  document.getElementById('student-data').appendChild(table);
}

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