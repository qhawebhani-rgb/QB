// ==================== KNOWLEDGE BASE ====================
const QB_BRAIN = {
  "Math": {
    "Algebra": [
      { q: "Solve: 2x + 5 = 13", a: ["3", "4", "5", "6"], c: 1 },
      { q: "What is 3² + 4²?", a: ["12", "25", "7", "49"], c: 1 },
      { q: "Simplify: (x²)(x³)", a: ["x⁵", "x⁶", "x¹", "2x⁵"], c: 0 }
    ],
    "Calculus": [
      { q: "What is the derivative of x²?", a: ["x", "2x", "x/2", "2x²"], c: 1 },
      { q: "What is the integral of 2x?", a: ["x²", "x² + C", "2x² + C", "x + C"], c: 1 }
    ],
    "Geometry": [
      { q: "What is the area of a circle with radius 5?", a: ["25π", "10π", "15π", "50π"], c: 0 },
      { q: "A triangle has angles 60°, 60°, and ?", a: ["60°", "90°", "45°", "30°"], c: 0 }
    ]
  },
  "Science": {
    "Physics": [
      { q: "What is Newton's 2nd Law?", a: ["F=ma", "E=mc²", "V=IR", "P=IV"], c: 0 },
      { q: "What is the speed of light?", a: ["3×10⁸ m/s", "2×10⁸ m/s", "4×10⁸ m/s", "1×10⁸ m/s"], c: 0 }
    ],
    "Chemistry": [
      { q: "What is the atomic number of Carbon?", a: ["4", "6", "8", "12"], c: 1 },
      { q: "What is pH at neutral?", a: ["7", "1", "14", "0"], c: 0 }
    ],
    "Biology": [
      { q: "What is the basic unit of life?", a: ["Tissue", "Cell", "Organ", "System"], c: 1 },
      { q: "Which organelle is the powerhouse of the cell?", a: ["Nucleus", "Mitochondria", "Ribosome", "Lysosome"], c: 1 }
    ]
  },
  "Exams": {
    "ICFES": [
      { q: "ICFES tests are standardized exams in which country?", a: ["Mexico", "Colombia", "Argentina", "Chile"], c: 1 }
    ],
    "Finals": [
      { q: "Finals are typically held at the end of which period?", a: ["Month", "Semester", "Week", "Year"], c: 1 }
    ],
    "Midterms": [
      { q: "Midterms occur approximately how far into the term?", a: ["25%", "50%", "75%", "10%"], c: 1 }
    ]
  }
};

// Function to get questions by category/subcategory
function getQuestionsByTopic(category, subcategory = null) {
  if (!QB_BRAIN[category]) {
    // Fallback to first available category if not found
    const firstCategory = Object.keys(QB_BRAIN)[0];
    return getRandomQuestions(QB_BRAIN[firstCategory], 5);
  }

  const categoryData = QB_BRAIN[category];
  
  if (subcategory && categoryData[subcategory]) {
    return categoryData[subcategory];
  } else if (subcategory) {
    // If subcategory not found, get from first available
    const firstSub = Object.keys(categoryData)[0];
    return categoryData[firstSub];
  } else {
    // Get from all subcategories if no specific one provided
    let allQuestions = [];
    for (let sub in categoryData) {
      allQuestions = allQuestions.concat(categoryData[sub]);
    }
    return allQuestions;
  }
}

// Function to get random questions
function getRandomQuestions(questions, count) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Function to get all available categories
function getAllCategories() {
  return Object.keys(QB_BRAIN);
}

// Function to get subcategories for a category
function getSubcategories(category) {
  if (QB_BRAIN[category]) {
    return Object.keys(QB_BRAIN[category]);
  }
  return [];
}
