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
    const studentIdSelect = createStudentIdSelect(item.studentId);
    studentIdCell.appendChild(studentIdSelect);
    row.appendChild(studentIdCell);

    row.innerHTML += `
      <td>${item.prompt}</td>
      <td>${item.classification}</td>
      <td>${(item.confidence * 100).toFixed(2)}%</td>
      <td><img src="${imageURL}" width="32" height="32" alt="Image"></td>
    `;

    // Add an event listener for the select element
    studentIdSelect.addEventListener("change", (e) => {
      updateStudentId(item._id, parseInt(e.target.value));
    });
  });

  table.appendChild(tbody);
  document.getElementById('student-data').appendChild(table);
}

function createStudentIdSelect(selectedId) {
  const select = document.createElement('select');
  for (let i = 0; i < 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    if (i === selectedId) {
      option.selected = true;
    }
    select.appendChild(option);
  }

  return select;
}

async function updateStudentId(submissionId, newStudentId) {
  try {
    const response = await fetch(`/update/${submissionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId: newStudentId }),
    });

    if (!response.ok) {
      throw new Error("Error updating student ID");
    }

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error(error);
  }
}

fetch('/values')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.text();
  })
  .then(text => {
    console.log('Response text:', text);
    return JSON.parse(text);
  })
  .then(data => {
    studentData = data.data;
    console.log('Student data:', studentData);
    createTable(studentData);
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });
