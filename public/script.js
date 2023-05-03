// script.js
// Call loadNav to load the navigation menu
loadNav();

// Function for displaying student profiles
function createStudentProfiles(studentData) {
  const studentProfilesContainer = document.querySelector('.student-profiles');
  const studentProfiles = [
    { id: 0, name: 'Arlene', grade: 'Kindergarten', teacher: 'XX', overallScore: 'XX', strengths: 'XX', areasOfImprovement: 'XX' },
    { id: 1, name: 'Bret', grade: 'Kindergarten', teacher: 'XX', overallScore: 'XX', strengths: 'XX', areasOfImprovement: 'XX' },
    { id: 2, name: 'Cindy', grade: 'Kindergarten', teacher: 'XX', overallScore: 'XX', strengths: 'XX', areasOfImprovement: 'XX' },
    { id: 3, name: 'Don', grade: 'Kindergarten', teacher: 'XX', overallScore: 'XX', strengths: 'XX', areasOfImprovement: 'XX' },
    { id: 4, name: 'Emily', grade: 'Kindergarten', teacher: 'XX', overallScore: 'XX', strengths: 'XX', areasOfImprovement: 'XX' },
    { id: 5, name: 'Franklin', grade: 'Kindergarten', teacher: 'XX', overallScore: 'XX', strengths: 'XX', areasOfImprovement: 'XX' },
    { id: 6, name: 'Gert', grade: 'Kindergarten', teacher: 'XX', overallScore: 'XX', strengths: 'XX', areasOfImprovement: 'XX' },
    { id: 7, name: 'Harold', grade: 'Kindergarten', teacher: 'XX', overallScore: 'XX', strengths: 'XX', areasOfImprovement: 'XX' },
    { id: 8, name: 'Idalia', grade: 'Kindergarten', teacher: 'XX', overallScore: 'XX', strengths: 'XX', areasOfImprovement: 'XX' },
    { id: 9, name: 'Jose', grade: 'Kindergarten', teacher: 'XX', overallScore: 'XX', strengths: 'XX', areasOfImprovement: 'XX' },

    // Add other students with their details here
  ];

  studentProfiles.forEach(student => {
    const profileDiv = document.createElement('div');
    profileDiv.className = 'student-profile';

    const studentName = document.createElement('h3');
    studentName.textContent = student.name;

    const studentId = document.createElement('p');
    studentId.textContent = `ID: ${student.id}`;

    const studentGrade = document.createElement('p');
    studentGrade.textContent = `Grade: ${student.grade}`;

    const studentTeacher = document.createElement('p');
    studentTeacher.textContent = `Teacher: ${student.teacher}`;

    const studentOverallScore = document.createElement('p');
    studentOverallScore.textContent = `Overall Score: ${student.overallScore}`;

    const studentStrengths = document.createElement('p');
    studentStrengths.textContent = `Strengths: ${student.strengths}`;

    const studentAreasOfImprovement = document.createElement('p');
    studentAreasOfImprovement.textContent = `Areas of Improvement: ${student.areasOfImprovement}`;

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

fetch('/values')
  .then(response => response.text())
  .then(text => {
    console.log('Response text:', text);
    return JSON.parse(text);
  })
  .then(data => {
    const studentData = data.data;

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
    const studentData = data.data;

    // Call createTable to create the student data table
    if (document.getElementById('student-data')) {
      createTable(studentData);
    }
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });
