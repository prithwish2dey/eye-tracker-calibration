----------------- STEPS TO RUN------------------------

1. First, go to the directory by "cd  MRTA_LLM/Micro-Gravity"
2. Then, activate the "llm-mrta" conda environment.
3. Now, run "python app.py"
4. On another terminal, first run "ngrok config add-authtoken 2zcx6OFo1rs4F6sO49WvsqoXX9V_3mjBF7LYpkzXZApiA154Y" and then run the "ngrok http 9090"
5. Copy the global url to use it anywhere.




<!DOCTYPE html>
<html>
<head>
    <title>Eye Tracker Calibration</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
</head>
<body>

<!-- Animated Background -->
<div class="bg-animation"></div>

<!-- Top Banner -->
<div id="banner">
    👁 Smart Eye Tracking Calibration
</div>

<!-- Form -->
<div id="formContainer">
    <h2>Start Calibration</h2>

    <input id="name" type="text" placeholder="Enter Name">
    <input id="age" type="number" placeholder="Enter Age">
    <input id="location" type="text" placeholder="Enter Location">

    <button onclick="start()">Start Calibration</button>
</div>

<div id="screen"></div>

<script src="{{ url_for('static', filename='script.js') }}"></script>

</body>
</html>






<!DOCTYPE html>
<html>
<head>
    <title>Eye Tracker Calibration</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
</head>
<body>

<!-- Background -->
<div class="bg-animation"></div>
<div class="particles"></div>

<!-- Top Banner -->
<div class="top-banner">
    <img src="{{ url_for('static', filename='images/banner_gradio.png') }}" alt="Banner">
</div>

<!-- Eye Animation -->
<div class="eye-container">
    <div class="eye">
        <div class="pupil"></div>
    </div>
</div>

<!-- Form -->
<div id="formContainer">
    <h2>👁 Start Calibration</h2>

    <input id="name" type="text" placeholder="Enter Name">
    <input id="age" type="number" placeholder="Enter Age">
    <input id="location" type="text" placeholder="Enter Location">

    <button onclick="start()">Start Calibration</button>
</div>

<!-- Calibration Screen -->
<div id="screen"></div>

<script src="{{ url_for('static', filename='script.js') }}"></script>

</body>
</html>