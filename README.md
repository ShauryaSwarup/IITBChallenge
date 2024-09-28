# Chemical Management Web Application

## Overview

This web application provides a user-friendly interface for managing a list of chemicals. It allows users to view, sort, and edit details about various chemicals, making it an essential tool for laboratories and research facilities.

## Features

- **Display Chemicals**: A table that lists all chemicals with their details.
- **Sorting**: Users can sort the chemicals by different criteria for easy navigation.
- **Editing Functionality**: Users can edit chemical details directly in the table.
- **Responsive Design**: The application is designed to work on various devices.
- **PWA (Progressive Web App)**: Implemented a progressive web application suitable for mobile , desktop and cross browsers.

## Technologies Used

- **HTML**: For structuring the webpage.
- **CSS**: For styling the application.
- **TypeScript/JavaScript**: For implementing interactive functionalities without frameworks.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShauryaSwarup/IITBChallenge
   ```
2. Open the index.html file in your web browser.

## Usage

- Open the application in a web browser.
- Use the toolbar to sort and edit chemicals as needed.
- Double click on row to edit row
- Click on checkboxes to select

## Advantages of Using TypeScript

Using TypeScript instead of plain JavaScript offers significant benefits, particularly in developing structured web applications like the `ChemicalSuppliesApp`. One of the key advantages is static typing, which allows developers to catch errors at compile time rather than runtime. By defining the structure of `Chemical` objects with an interface, TypeScript ensures that any instance adheres to this defined structure, reducing bugs and improving overall code quality. Additionally, TypeScript provides enhanced support in integrated development environments (IDEs) with features such as autocompletion and inline documentation, making the development experience more productive. With its compile-time error checking, TypeScript helps developers identify type-related errors early in the development phase, leading to more robust and reliable applications.

## Object-Oriented Programming (OOP) Principles

The `ChemicalSuppliesApp` class effectively demonstrates several core Object-Oriented Programming (OOP) principles. Encapsulation is utilized by keeping properties like `chemicals`, `table`, and overlays private, preventing direct access from outside the class and ensuring control over the application's state. This design promotes abstraction, allowing complex operations to be hidden behind simple method interfaces like `loadData`, `renderTable`, and `saveEdit`. The modular structure of the class enhances readability and maintainability since changes to one method do not directly affect others. By organizing functionality within a class, the code is not only reusable but can also be extended in the future, promoting efficient development practices. While inheritance is not explicitly used in this example, it could be leveraged for creating related classes, thereby enhancing code reuse and reducing duplication.

## Screenshots
#### Table Interface with toolbar
![Table UI](https://github.com/user-attachments/assets/43862a10-ac25-4737-b260-f9e8c47cbc1e)
#### Edit Chemical Overlay (double click on row)
![Edit Chemical Overlay](https://github.com/user-attachments/assets/43fd1f18-789c-4ec4-8518-64bb7c3464d0)
#### Add Chemical Overlay
![Add Chemical Overlay](https://github.com/user-attachments/assets/776af89e-7abc-40cf-a6ad-57e35393af1f)
#### Sorting on Quantity (click column header)
![Sorting on Quantity](https://github.com/user-attachments/assets/e0799eb7-9a4f-4027-89b9-be537045cddd)

## Notes

> Saving functionality is currently not implemented as the challenge did not require us to persist data in a database/datastore.
