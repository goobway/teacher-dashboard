// script.js
// Call loadNav to load the navigation menu
loadNav();

// Function for displaying student profiles
function createStudentProfiles(studentData) {
  const studentProfiles = [
    { id: 0, name: 'Arlene' },
    { id: 1, name: 'Bret' },
    { id: 2, name: 'Cindy' },
    { id: 3, name: 'Don' },
    { id: 4, name: 'Emily' },
    { id: 5, name: 'Franklin' },
    { id: 6, name: 'Gert' },
    { id: 7, name: 'Harold' },
    { id: 8, name: 'Idalia' },
    { id: 9, name: 'Jose' },
  ];

  const container = document.querySelector('.student-profiles');

  studentProfiles.forEach(student => {
    const profile = document.createElement('div');
    profile.className = 'student-profile';

    // Get the most recent drawing submitted by the student
    const recentDrawing = studentData
      .filter(entry => entry.studentId === student.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    const image = document.createElement('img');
    image.src = matrixToDataURL(recentDrawing.matrix);
    image.alt = 'Submitted drawing';
    image.className = 'submitted-drawing';

    profile.innerHTML = `
        <h3>${student.name} (ID: ${student.id})</h3>
        <p>Most recent submission:</p>
      `;
    profile.appendChild(image);

    container.appendChild(profile);
  });
}

fetch('/values')
  .then(response => response.json())
  .then(data => {
    const studentData = data.data;

    // Call initStudentDataTable to create the student data table
    if (document.getElementById('student-data')) {
      initStudentDataTable();
    }

    // Create student summaries
    if (document.querySelector('.student-profiles')) {
      createStudentProfiles(studentData);
    }
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });
