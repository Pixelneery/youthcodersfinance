# LearnQuest - Code for Finance Hackathon Project

## Project Description

This project, LearnQuest, was developed for the YouthCoders Code for Finance Hackathon. It aims to provide a fun and engaging way to learn high-value skills related to finance, presented in a easy to understand interface. The application uses gamification to make the learning process more enjoyable and effective.

## Key Features & Benefits

*   **Interactive Learning:** Provides interactive exercises and challenges to enhance the learning experience.
*   **Gamified Interface:** Employs a user-friendly, Duolingo-inspired design to keep users motivated.
*   **Skill Development:** Focuses on teaching practical skills in areas like language, logic, and arithmetic related to finance.
*   **Progress Tracking:** Tracks user progress and rewards achievements with virtual stars and awards.
*   **Customizable Difficulty:** Allows users to adjust the difficulty level to match their current skill set.

## Technologies

*   **Languages:** JavaScript, HTML, CSS

## Published Link

https://learnquestpix.netlify.app/

## Prerequisites & Dependencies

To edit this project, you will need:

*   A web browser (e.g., Chrome, Firefox, Safari)
*   A text editor (e.g., VS Code, Sublime Text)

## Installation & Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Pixelneery/youthcodersfinance.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd youthcodersfinance
    ```

3.  **Open `index.html` in your web browser:**

    Simply double-click the `index.html` file or right-click and choose "Open with" your preferred browser.

## Project Structure

```
youthcodersfinance/
├── README.md      // This file
├── index.html     // Main HTML file
├── script.js      // JavaScript logic
└── styles.css     // CSS styling
```

## Usage Examples & API Documentation

This project is a front-end application, meaning there is no backend API involved. The `script.js` file contains the logic for the game, including state management, screen transitions, and award handling.

Here's a brief overview of the main JavaScript functions:

*   **`state` object:** Holds the application's global state, including user stars, unlocked awards, current game, and difficulty level.
*   **`screens` object:** References the main HTML elements representing different screens (menu, maze, language, logic, arithmetic).
*   **`modals` object:** References the HTML elements representing modal dialogs (difficulty, awards).

Example usage from `script.js`:

```javascript
// Example of updating the global state
state.stars = 10;

// Example of showing a screen
screens.menu.style.display = 'block';

// Example of hiding a modal
modals.difficulty.style.display = 'none';
```

## Configuration Options

The difficulty level can be configured by interacting with the difficulty modal within the application's user interface. There are no external configuration files or environment variables needed for this project. The settings are handled directly through user interactions in the browser.

## Contributing Guidelines

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch with a descriptive name (e.g., `feature/new-feature` or `bugfix/issue-123`).
3.  Make your changes and commit them with clear, concise messages.
4.  Push your branch to your forked repository.
5.  Submit a pull request to the main repository.

Please ensure your code adheres to the existing style and conventions.

## License Information

No license specified. All rights reserved by Pixelneery.

## Acknowledgments

*   Thanks to YouthCoders for organizing the Code for Finance Hackathon.
