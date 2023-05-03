// script.js
// Call loadNav to load the navigation menu
loadNav();

let studentData; // declare the global studentData variable

fetch('/values')
  .then(response => response.text())
  .then(text => {
    console.log('Response text:', text);
    return JSON.parse(text);
  })
  .then(data => {
    studentData = data.data;

    // Create student profiles
    if (document.querySelector('.student-profiles')) {
      createStudentProfiles(studentData);
    }
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });

fetch('/values')
  .then(response => response.text())
  .then(text => {
    console.log('Response text:', text);
    return JSON.parse(text);
  })
  .then(data => {
    studentData = data.data;

    // Call createTable to create the student data table
    if (document.getElementById('student-data')) {
      createTable(studentData);
    }
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });

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

function getStudentDetailsById(id) {
  const studentDetails = [
    { id: 0, name: 'Arlene', grade: 'Kindergarten', teacher: 'Duarte' },
    { id: 1, name: 'Bret', grade: 'Kindergarten', teacher: 'Duarte' },
    { id: 2, name: 'Cindy', grade: 'Kindergarten', teacher: 'Duarte' },
    { id: 3, name: 'Don', grade: 'Kindergarten', teacher: 'Duarte' },
    { id: 4, name: 'Emily', grade: 'Kindergarten', teacher: 'Duarte' },
    { id: 5, name: 'Franklin', grade: 'Kindergarten', teacher: 'Duarte' },
    { id: 6, name: 'Gert', grade: 'Kindergarten', teacher: 'Duarte' },
    { id: 7, name: 'Harold', grade: 'Kindergarten', teacher: 'Duarte' },
    { id: 8, name: 'Idalia', grade: 'Kindergarten', teacher: 'Duarte' },
    { id: 9, name: 'Jose', grade: 'Kindergarten', teacher: 'Duarte' },
  ];

  return studentDetails.find(student => student.id === id);
}

// Function for displaying student profiles
function createStudentProfiles() {
  const studentProfilesContainer = document.querySelector('.student-profiles');
  console.log(window.studentData); // Debugging line
  const uniqueStudentIds = new Set(window.studentData.map(student => student.studentId));

  const studentNameMap = {
    0: 'Arlene',
    1: 'Bret',
    2: 'Cindy',
    3: 'Don',
    4: 'Emily',
    5: 'Franklin',
    6: 'Gert',
    7: 'Harold',
    8: 'Idalia',
    9: 'Jose'
  };

  // Process student data
  const studentProfiles = studentData.reduce((acc, item) => {
    if (!acc[item.studentId]) {
      acc[item.studentId] = {
        id: item.studentId,
        name: studentNameMap[item.studentId],
        grade: "Kindergarten",
        teacher: "Duarte",
        correct: 0,
        total: 0,
        prompts: {},
      };
    }

    acc[item.studentId].total++;
    if (item.prompt === item.classification) {
      acc[item.studentId].correct++;
    }

    if (!acc[item.studentId].prompts[item.prompt]) {
      acc[item.studentId].prompts[item.prompt] = {
        correct: 0,
        total: 0,
      };
    }

    acc[item.studentId].prompts[item.prompt].total++;
    if (item.prompt === item.classification) {
      acc[item.studentId].prompts[item.prompt].correct++;
    }

    return acc;
  }, {});

  // Calculate overall scores, strengths, and areas of improvement
  Object.values(studentProfiles).forEach((student) => {
    student.overallScore = (student.correct / student.total) * 100;

    const promptPerformance = Object.entries(student.prompts).map(([prompt, { correct, total }]) => ({
      prompt,
      score: (correct / total) * 100,
    }));

    promptPerformance.sort((a, b) => b.score - a.score);

    student.strengths = promptPerformance.slice(0, 3).map((item) => item.prompt);
    student.areasOfImprovement = promptPerformance.slice(-3).map((item) => item.prompt);
  });

  // Create student profile elements
  Object.values(studentProfiles).forEach((student) => {
    const profileDiv = document.createElement('div');
    profileDiv.className = 'student-profile';
    profileDiv.addEventListener('click', () => {
      displayDrawingsModal(student.id, studentData);
    });

    const studentName = document.createElement('h3');
    studentName.textContent = student.name;

    const studentId = document.createElement('p');
    studentId.textContent = `ID: ${student.id}`;

    const studentGrade = document.createElement('p');
    studentGrade.textContent = `Grade: ${student.grade}`;

    const studentTeacher = document.createElement('p');
    studentTeacher.textContent = `Teacher: ${student.teacher}`;

    const studentOverallScore = document.createElement('p');
    studentOverallScore.textContent = `Overall Score: ${student.overallScore.toFixed(2)}%`;

    const studentStrengths = document.createElement('p');
    studentStrengths.textContent = `Strengths: ${student.strengths.join(', ')}`;

    const studentAreasOfImprovement = document.createElement('p');
    studentAreasOfImprovement.textContent = `Areas of Improvement: ${student.areasOfImprovement.join(', ')}`;

    profileDiv.appendChild(studentName);
    profileDiv.appendChild(studentId);
    profileDiv.appendChild(studentGrade);
    profileDiv.appendChild(studentTeacher);
    profileDiv.appendChild(studentOverallScore);
    profileDiv.appendChild(studentStrengths);
    profileDiv.appendChild(studentAreasOfImprovement);

    studentProfilesContainer.appendChild(profileDiv);
  });
}

// Function to display modal with student drawings
// function displayDrawingsModal(studentId, studentData) {
//   const studentDrawings = studentData.filter(item => item.studentId === studentId);
//   const modalOverlay = document.createElement('div');
//   modalOverlay.classList.add('modal-overlay');

//   const modal = document.createElement('div');
//   modal.classList.add('modal');

//   const closeButton = document.createElement('button');
//   closeButton.classList.add('modal-close-button');
//   closeButton.textContent = 'X';
//   closeButton.addEventListener('click', () => {
//     modalOverlay.remove();
//   });

//   const drawingGrid = document.createElement('div');
//   drawingGrid.classList.add('drawing-grid');

//   studentIds.forEach(studentId => {
//     const studentDrawings = studentData.filter(item => item.studentId === studentId);

//     const drawingDiv = document.createElement('div');
//     drawingDiv.classList.add('drawing');

//     studentDrawings.forEach(item => {
//       const imageURL = matrixToDataURL(item.matrix);

//       const drawingImg = document.createElement('img');
//       drawingImg.src = imageURL;

//       drawingImg.addEventListener('mouseenter', () => {
//         const promptOverlay = document.createElement('div');
//         promptOverlay.classList.add('prompt-overlay');
//         promptOverlay.textContent = item.prompt;
//         drawingDiv.appendChild(promptOverlay);
//       });
//       drawingImg.addEventListener('mouseleave', () => {
//         const promptOverlay = drawingDiv.querySelector('.prompt-overlay');
//         if (promptOverlay) {
//           promptOverlay.remove();
//         }
//       });

//       drawingDiv.appendChild(drawingImg);
//     });

//     drawingGrid.appendChild(drawingDiv);
//   });

//   modal.appendChild(closeButton);
//   modal.appendChild(drawingGrid);
//   modalOverlay.appendChild(modal);

//   document.body.appendChild(modalOverlay);
// }
function displayDrawingsModal() {
  const studentId = new Set(window.studentData.map(student => student.studentId));
  const studentDrawings = window.studentData.filter(item => item.studentId === studentId);
  const modalOverlay = document.createElement('div');
  modalOverlay.classList.add('modal-overlay');

  const modal = document.createElement('div');
  modal.classList.add('modal');

  const closeButton = document.createElement('button');
  closeButton.classList.add('modal-close-button');
  closeButton.textContent = 'X';
  closeButton.addEventListener('click', () => {
    modalOverlay.remove();
  });

  const drawingGrid = document.createElement('div');
  drawingGrid.classList.add('drawing-grid');

  studentDrawings.forEach(item => {
    const imageURL = matrixToDataURL(item.matrix);

    const drawingDiv = document.createElement('div');
    drawingDiv.classList.add('drawing');
    drawingDiv.addEventListener('mouseenter', () => {
      const promptOverlay = document.createElement('div');
      promptOverlay.classList.add('prompt-overlay');
      promptOverlay.textContent = item.prompt;
      drawingDiv.appendChild(promptOverlay);
    });
    drawingDiv.addEventListener('mouseleave', () => {
      const promptOverlay = drawingDiv.querySelector('.prompt-overlay');
      if (promptOverlay) {
        promptOverlay.remove();
      }
    });

    const drawingImg = document.createElement('img');
    drawingImg.src = imageURL;

    drawingDiv.appendChild(drawingImg);
    drawingGrid.appendChild(drawingDiv);
  });

  modal.appendChild(closeButton);
  modal.appendChild(drawingGrid);
  modalOverlay.appendChild(modal);

  document.body.appendChild(modalOverlay);
}
