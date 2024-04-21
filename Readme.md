# Codevengers

This project is an e-learning platform designed to empower users with coding skills. It offers a user-friendly interface for learning, discussing, and sharing coding knowledge. Users can enroll in coding courses, publish articles and manage their profiles. With a focus on user engagement and interactive learning, the platform aims to foster a vibrant community of learners and educators in the field of programming.

## How to Use

This project consists of a backend and a frontend. Here's how you can run them:

### Backend

1. Navigate to the `Backend` directory:

    ```bash
    cd Backend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the backend server:

    ```bash
    npm run dev
    ```

### Frontend

1. Navigate to the `Frontend` directory:

    ```bash
    cd ../Frontend
    ```

2. Open the `index.html` file in your browser. You can do this by running a local server on ports `5500` or `5501`. <br> If you're using the Live Server extension in Visual Studio Code, it will automatically choose an available port when you open the `index.html` file with the `Open with Live Server` option.

## For Windows

After installing the dependencies in `Backend`, you have to install `bcrypt` library acc. to your architecture.

1.  Uninstall the bcrypt library
    ```bash
    npm uninstall bcrypt
    ```

2.  Install the bcrypt library

    1. **For 64-bit Windows**
    ```bash
    npm install bcrypt --save --platform=win32
    ```
    2. **For 32-bit Windows**
    ```bash
    npm install bcrypt --save --platform=ia32
    ```

3. Then you can start the backend server
    ```bash
    npm run dev
    ```

The instructions for `Frontend` remain as previously mentioned.

## For Mac OS

After installing the dependencies in `Backend`, you have to reinstall `bcrypt` library.

1.  Uninstall the bcrypt library
    ```bash
    npm uninstall bcrypt
    ```

2.  Install the bcrypt library for win32
    ```bash
    npm install bcrypt
    ```

3. Then you can start the backend server
    ```bash
    npm run dev
    ```

The instructions for `Frontend` remain as previously mentioned.