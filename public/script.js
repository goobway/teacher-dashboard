// script.js
// Call loadNav to load the navigation menu
loadNav();

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
function createStudentProfiles(studentData) {
  const studentProfilesContainer = document.querySelector('.student-profiles');

  // Create a set of unique student IDs
  const uniqueStudentIds = new Set(studentData.map(student => student.studentId));

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
