
# ChronoFlow - Intelligent Calendar & Scheduling Assistant

ChronoFlow is a modern, AI-powered calendar application built with Next.js, React, ShadCN UI, Tailwind CSS, and Genkit. It aims to provide an intuitive and intelligent way to manage your schedule.

## ✨ Features

*   **Multiple Calendar Views:**
    *   **Month View:** See an overview of your events for the entire month.
    *   **Week View:** (Placeholder) Planned for detailed weekly scheduling.
    *   **Day View:** (Placeholder) Planned for focused daily planning.
*   **Event Management:**
    *   Create, edit, and delete events with ease.
    *   Specify event title, description, start and end dates/times.
    *   Mark events as "All-day".
    *   Choose a custom color for each event for better visual organization.
*   **Smart Scheduler (AI-Powered):**
    *   Leverages Genkit to analyze your existing schedule (in iCal format).
    *   Suggests optimal time slots for new events based on duration, title, and desired date range.
    *   Provides reasons for each suggestion.
*   **iCalendar Support:**
    *   **Import:** (Placeholder) Functionality to import events from iCal files.
    *   **Export:** (Placeholder) Functionality to export your calendar to an iCal file.
*   **Responsive Design:** Adapts to various screen sizes for a seamless experience on desktop and mobile.
*   **Dark Theme:** Offers a visually comfortable dark mode.
*   **Modern Tech Stack:**
    *   **Next.js:** React framework for server-side rendering and static site generation.
    *   **React & TypeScript:** For building robust and maintainable UI components.
    *   **ShadCN UI:** Beautifully designed, accessible, and customizable UI components.
    *   **Tailwind CSS:** Utility-first CSS framework for rapid styling.
    *   **Genkit (Firebase):** For integrating generative AI capabilities (Smart Scheduler).
    *   **date-fns:** For reliable date and time manipulations.
    *   **React Hook Form & Zod:** For robust form handling and validation.

## 🚀 Getting Started

Follow these instructions to get the ChronoFlow app up and running on your local machine.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### Setup

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

3.  **Set up Environment Variables:**
    The application uses Genkit for AI features, which typically requires API keys for services like Google AI (Gemini).
    *   Create a `.env` file in the root of your project.
    *   Add your API keys and any other necessary environment variables. For example:
        ```env
        GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY
        # Add other variables as needed
        ```
    *   The `src/ai/genkit.ts` file is configured to use these variables.

4.  **Run the Development Server:**
    To start the Next.js development server:
    ```bash
    npm run dev
    ```
    Or using yarn:
    ```bash
    yarn dev
    ```
    The application will typically be available at `http://localhost:9002`.

5.  **Run the Genkit Development Server (for AI features):**
    For the Smart Scheduler and other AI functionalities to work, you need to run the Genkit development server in a separate terminal:
    ```bash
    npm run genkit:dev
    ```
    Or using yarn (if you prefer to have it watch for changes):
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit server, typically on port `4000` or another available port if `4000` is in use.

### Building for Production

To build the application for production:
```bash
npm run build
```
Or using yarn:
```bash
yarn build
```
Then, to start the production server:
```bash
npm run start
```
Or using yarn:
```bash
yarn start
```

## 🔧 Tech Stack

*   **Frontend:** Next.js, React, TypeScript
*   **UI Components:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **AI Integration:** Genkit (with Google AI plugin for Gemini)
*   **State Management:** React Context API
*   **Date/Time:** date-fns
*   **Form Handling:** React Hook Form, Zod

## 📄 Project Structure (Key Directories)

*   `src/app/`: Main application pages and layout (Next.js App Router).
*   `src/components/`: Reusable UI components.
    *   `src/components/chronoflow/`: Components specific to the ChronoFlow app.
    *   `src/components/ui/`: ShadCN UI components.
*   `src/ai/`: Genkit related code.
    *   `src/ai/flows/`: Genkit flows for AI features (e.g., `suggest-optimal-event-times.ts`).
    *   `src/ai/genkit.ts`: Genkit initialization and configuration.
*   `src/contexts/`: React context for global state management (e.g., `CalendarContext.tsx`).
*   `src/lib/`: Utility functions, type definitions, and constants.
*   `public/`: Static assets.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

Please make sure to update tests as appropriate.

## 📜 License

This project is licensed under the [MIT License](LICENSE.md) (assuming you will add one).
```
