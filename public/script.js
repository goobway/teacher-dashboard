// script.js
// Call loadNav to load the navigation menu
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

const promptMapping = {
  // uppercase
  A_upper: 'A',
  B_upper: 'B',
  C_upper: 'C',
  D_upper: 'D',
  E_upper: 'E',
  F_upper: 'F',
  G_upper: 'G',
  H_upper: 'H',
  I_upper: 'I',
  J_upper: 'J',
  K_upper: 'K',
  L_upper: 'L',
  M_upper: 'M',
  N_upper: 'N',
  O_upper: 'O',
  P_upper: 'P',
  Q_upper: 'Q',
  R_upper: 'R',
  S_upper: 'S',
  T_upper: 'T',
  U_upper: 'U',
  V_upper: 'V',
  W_upper: 'W',
  X_upper: 'X',
  Y_upper: 'Y',
  Z_upper: 'Z',
  // lowercase
  a_lower: 'a',
  b_lower: 'b',
  c_lower: 'c',
  d_lower: 'd',
  e_lower: 'e',
  f_lower: 'f',
  g_lower: 'g',
  h_lower: 'h',
  i_lower: 'i',
  j_lower: 'j',
  k_lower: 'k',
  l_lower: 'l',
  m_lower: 'm',
  n_lower: 'n',
  o_lower: 'o',
  p_lower: 'p',
  q_lower: 'q',
  r_lower: 'r',
  s_lower: 's',
  t_lower: 't',
  u_lower: 'u',
  v_lower: 'v',
  w_lower: 'w',
  x_lower: 'x',
  y_lower: 'y',
  z_lower: 'z',
  // numbers
  '0_number': '0',
  '1_number': '1',
  '2_number': '2',
  '3_number': '3',
  '4_number': '4',
  '5_number': '5',
  '6_number': '6',
  '7_number': '7',
  '8_number': '8',
  '9_number': '9'
};

// Function for displaying student profiles
function createStudentProfiles() {
  const studentProfilesContainer = document.querySelector('.student-profiles');
  const uniqueStudentIds = new Set(studentData.map(student => student.studentId));

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
    studentStrengths.textContent = `Strengths: ${student.strengths.map(prompt => promptMapping[prompt] || prompt).join(', ')}`;

    const studentAreasOfImprovement = document.createElement('p');
    studentAreasOfImprovement.textContent = `Areas of Improvement: ${student.areasOfImprovement.map(prompt => promptMapping[prompt] || prompt).join(', ')}`;

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

let studentData; // declare the global studentData variable

fetch('/values')
  .then(response => response.text())
  .then(text => {
    console.log('Response text:', text);
    return JSON.parse(text);
  })
  .then(data => {
    studentData = data.data; // assign the fetched data to the global variable

    // Create student profiles
    if (document.querySelector('.student-profiles')) {
      createStudentProfiles();
    }
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });
