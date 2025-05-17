<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AtlasMind - C Programming Courses</title>
    <link rel="stylesheet" href="styleshome.css">
    <script>
        // JavaScript to handle logout function
        function logout() {
            window.location.href = "logout.html";
        }

        // JavaScript to show level options
        function showLevelOptions(level) {
            const options = document.getElementById('level-options');
            options.style.display = 'block';
            document.getElementById('selected-level').innerText = level;
            document.getElementById('level-dropdown').innerHTML = `
                <select onchange="handleSelection('${level}', this.value)">
                    <option value="">Select an option</option>
                    <option value="notes">Notes</option>
                    <option value="tutorial">YouTube Tutorial</option>
                    <option value="question-bank">Question Bank</option>
                    <option value="answer-sheet">Answer Sheet</option>
                </select>`;
        }

        // Handle selection from dropdown
        function handleSelection(level, option) {
            let links = {
                'Beginner': {
                    'notes': 'beginner notes.pdf',
                    'tutorial': 'https://youtu.be/KJgsSFOSQv0?si=41-Hl5rMJfWQPSiW',
                    'question-bank': 'path/to/beginner_question_bank.pdf',
                    'answer-sheet': 'path/to/beginner_answer_sheet.pdf'
                },
                'Intermediate': {
                    'notes': 'middle notes.pdf',
                    'tutorial': 'https://youtu.be/zuegQmMdy8M?si=oCNODut4PZdZovsq',
                    'question-bank': 'path/to/intermediate_question_bank.pdf',
                    'answer-sheet': 'path/to/intermediate_answer_sheet.pdf'
                },
                'Advanced': {
                    'notes': 'advanced notes.pdf',
                    'tutorial': 'https://youtu.be/B31LgI4Y4DQ?si=Y4cdbEhaC60Z6d-l',
                    'question-bank': 'path/to/advanced_question_bank.pdf',
                    'answer-sheet': 'path/to/advanced_answer_sheet.pdf'
                }
            };
            if (links[level][option]) {
                window.open(links[level][option], '_blank');
            } else {
                alert("Please select a valid option.");
            }
        }

        // JavaScript to hide level options
        function hideLevelOptions() {
            const options = document.getElementById('level-options');
            options.style.display = 'none';
        }

        // Email Validation Functions
        function validateForm() {
            var email = document.getElementById('email').value;
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return false; // Prevent form submission
            }
            return true; // Allow form submission
        }
        
        function validateEmail(email) {
            var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    </script>
    </head>
