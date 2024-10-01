# Filter Rule Configuration System

## Overview

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.6.

This project is a **Filter Rule Configuration System** built with **Angular**, **RxJS**, and **PrimeNG**. The application enables users to dynamically create and manage filter rules, allowing complex filtering operations on datasets. Each rule consists of multiple sub-rules, with customizable conditions depending on the type of field selected (text, number, etc.).

The system provides an intuitive user interface for configuring rules, applying filters, and viewing the results in a data table. The application supports saving, editing, and deleting rules, and all rules are stored locally using the browser's local storage.

## Features
- **Dynamic Rule Creation**: Users can add multiple sub-rules to each rule, specifying fields, conditions, and values.
- **Field Types**: Supports text, number, and boolean field types, with specific conditions available for each type.
- **Conditions for Filtering**:
  - **Text fields**: Contains, Starts With, Ends With, Equals, Not Contains.
  - **Number fields**: Range, Greater Than, Less Than, Equals.
  - **Boolean fields**: True, False (no conditions).
- **Complex Rule Logic**: Sub-rules within a rule can be combined using logical operators (AND/OR).
- **PrimeNG Integration**: The application uses PrimeNG components like `p-table`, `p-dropdown`, and `p-dialog` for a modern, responsive UI.
- **State Management**: Rules and filters are managed using **RxJS** and **Angular Signals**, and stored in local storage for persistence across sessions.
- **Real-Time Table Filtering**: Apply the created rules to filter a dataset (e.g., trade data) in real-time, with visual feedback on the filtering progress.
- **User Notifications**: Success or error notifications are displayed using PrimeNG's `MessageService` for a seamless user experience.

## How It Works
1. **Rule Creation**:
   - The user can create a new rule by selecting a field (e.g., Portfolio, Price, etc.), choosing a condition (e.g., Contains, Greater Than), and providing a value.
   - Multiple sub-rules can be added to a rule, and they can be combined using AND/OR operators.
   
2. **Filter Application**:
   - Once the rules are defined, the user can apply them to filter the data. The data is displayed in a table with real-time filtering applied based on the selected rule.

3. **State Persistence**:
   - The rules are saved in the browser’s local storage, allowing users to retain their rules across sessions. Users can modify, delete, or apply the rules as needed.

4. **Reactivity**:
   - The application uses **RxJS Observables** and **Angular Signals** to ensure reactive updates to the UI whenever the user interacts with the system (e.g., adding a rule, applying a filter).

### Prerequisites
- **Node.js** and **npm** installed.
- **Angular CLI** installed globally.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).