# Nuerelo + Node + Socket.IO + React (Vite)

This project is a full-stack application that leverages the power of Nuerelo, Node.js, and Socket.IO to provide real-time, bi-directional communication between the client and the server.

## Project Structure and Description

The project is divided into two main parts: the client and the server.

A mini-application that allows event hosts to check people into an event.

The home page of the application displays the following components:

- An event selector (`select`) that allows the user to choose from a list of events. By default, it displays the text "Select an event" and is populated with event names from the communities collection.
- A list of people who are registered for the selected event, displayed in the people collection.

The list of people includes the following information for each person:

- Full name (first and last name)
- Company name
- Title
- Check-in date and time, displayed in the format "MM/DD/YYYY, HH:mm" or "N/A" if not checked in
- Check-out date and time, displayed in the format "MM/DD/YYYY, HH:mm" or "N/A" if not checked out

The event host has the following capabilities:

- Check people into the event by clicking the "Check-in {person firstName and lastName}" button.
- If a person has been checked in for more than five seconds, a "Check-out {person firstName and lastName}" button is displayed for them.

In addition to the event selector and the list of people, there is a summary section that displays the following information:

- Number of people currently in the event: 10
- Number of people from each company currently in the event: Green Group (10), Hoppe Group (5)
- Number of people who have not checked in: 200

The page is designed to be reactive, meaning that the latest data is automatically displayed without the need for manual refresh.

### Client

Located in the [client](client) directory, this is a front-end application built with React. It includes the following key files:

- [App.jsx](client/src/App.jsx): The main React component.
- [socket.js](client/src/socket.js): Handles Socket.IO connections.
- [reducer.js](client/src/reducer.js): Contains the reducer function for state management.

### Server

Located in the [server](server) directory, this is a back-end application built with Node.js. It includes the following key files:

- [index.js](server/index.js): The main server file.
- [customMethods.js](server/customMethods.js): Contains custom methods used throughout the server.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository.
2. Install the dependencies in both the root, client and server directories using `npm install`, also make sure to download your sdk after step 4, place your sdk at the /server directory then run `npm i neurelo-sdk-typescript-xxx_xxxxxx`.
3. Make sure you use the .env.example file to create a .env file in the server directory with the prescribed environment variables.
4. There is a `seed.js` file that helps you populate your database with some initial data. You can run this file using `node seed.js` in the server directory. The function `loadInitialData(emptyDB = false)` does the magic. If the `emptyDB` argument is true, it attempts to empty the database (which is false by default).
5. After population, head over to [nuerelo.com](https://nuerelo.com) to register and configure sdk.
6. Start both the client and server using `npm start` in the root directory.

## License

This project is licensed under the terms of the [MIT License](LICENSE).

## Demo

A Demo video for the app can be found [here](https://www.loom.com/share/ff02cfb854604e1aa6b7894426837285?sid=0450a84e-9d9c-4ec8-b1b6-793b272f9bce).