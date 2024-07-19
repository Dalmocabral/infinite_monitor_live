# Infinite Monitor Live
![Alternative text image](https://i.ibb.co/m8ryvzs/Captura-de-tela-2024-07-19-111957.png)

## Overview

Infinite Monitor Live is a monitoring project based on [Infinite Flight](https://infiniteflight.com/), developed as a base for study and learning in React. This project was inspired by the site [IVAO Webeye](https://webeye.ivao.aero/), and aims to provide a user-friendly interface for monitoring flight sessions in real time.

## Features

- **Map View**: Real-time monitoring of flights and ATCs on an interactive map.
- **Detailed Information**: Details of each flight and ATC with informative popups.
- **Automatic Update**: Data automatically updated every 2 minutes.
- **View Filters**: Differentiation of ATC types and flights with different colors and markers.

## Project Status

This project is currently in the alpha version. We are continuously adding new features and improvements.

### Planned Features

- **User Login**: Authentication and personalized experience for registered users.
- **Distinct Colors**: Visual differentiation for developers, moderators, and Twitch and YouTube streamers.
- **Custom Markers**: Implementation of custom markers to differentiate specific types of users and activities.

## How It Works

1. **Interactive Map**: The map uses the `react-leaflet` library to display flights and ATCs in real time.
2. **Infinite Flight API**: Data is obtained via calls to the public Infinite Flight API.
3. **Dynamic Update**: The application makes periodic requests to update flight and ATC information.

## Technologies Used

- **React**: Main library for building the interface.
- **Leaflet**: JavaScript library for interactive maps.
- **Axios**: Used to make HTTP requests to the Infinite Flight API.
- **CSS**: Interface styling.

## Installation and Execution

To run the project locally, follow the instructions below:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/infinite-monitor-live.git
   ```
