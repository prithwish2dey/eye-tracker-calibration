// // ================= GLOBALS =================
// let pointsData = [];
// let mediaRecorder, screenRecorder;
// let recordedChunks = [], screenChunks = [];


// // ================= START =================
// // async function start() {
// //     const name = nameInput();
// //     const age = ageInput();
// //     const location = locationInput();

// //     if (!name || !age || !location) {
// //         alert("Fill all fields");
// //         return;
// //     }

// //     try {
// //         toggleUI(false);

// //         const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

// //         await enterFullscreen();

// //         resetData();
// //         await startRecording(screenStream);

// //         runCalibration(name, age, location);

// //     } catch (err) {
// //         console.error(err);
// //         alert("Permission required!");
// //         toggleUI(true);
// //     }
// // }
// async function start() {
//     const name = nameInput();
//     const age = ageInput();
//     const location = locationInput();

//     if (!name || !age || !location) {
//         alert("Fill all fields");
//         return;
//     }

//     let screenStream;

//     try {
//         screenStream = await navigator.mediaDevices.getDisplayMedia({
//             video: true
//         });
//     } catch (err) {
//         alert("Screen permission required!");
//         return;
//     }

//     try {
//         // 🔥 ACTIVATE CALIBRATION MODE
//         document.body.classList.add("calibration-active");

//         await enterFullscreen();

//         resetData();
//         await startRecording(screenStream);

//         runCalibration(name, age, location);

//     } catch (err) {
//         console.error(err);
//         alert("Error starting calibration");
//     }
// }


// // ================= RECORD =================
// // async function startRecording(screenStream) {

// //     const camStream = await navigator.mediaDevices.getUserMedia({ video: true });

// //     mediaRecorder = new MediaRecorder(camStream, { videoBitsPerSecond: 300000 });
// //     recordedChunks = [];

// //     mediaRecorder.ondataavailable = e => {
// //         if (e.data.size) recordedChunks.push(e.data);
// //     };

// //     mediaRecorder.start(100);


// //     screenRecorder = new MediaRecorder(screenStream, { videoBitsPerSecond: 500000 });
// //     screenChunks = [];

// //     screenRecorder.ondataavailable = e => {
// //         if (e.data.size) screenChunks.push(e.data);
// //     };

// //     screenRecorder.start(100);
// // }


// async function startRecording(screenStream) {

//     // 🎥 CAMERA STREAM
//     const camStream = await navigator.mediaDevices.getUserMedia({
//         video: {
//             width: { ideal: 1920 },   // ✅ Full HD
//             height: { ideal: 1080 },
//             frameRate: { ideal: 30, max: 60 }
//         },
//         audio: false
//     });

//     // ✅ HIGH QUALITY CAMERA RECORDING
//     mediaRecorder = new MediaRecorder(camStream, {
//         mimeType: "video/webm; codecs=vp9",
//         videoBitsPerSecond: 8000000   // 🔥 8 Mbps
//     });

//     recordedChunks = [];

//     mediaRecorder.ondataavailable = e => {
//         if (e.data.size > 0) recordedChunks.push(e.data);
//     };

//     mediaRecorder.start(1000);  // ✅ better chunk size



//     // 🖥 SCREEN RECORDING
//     screenRecorder = new MediaRecorder(screenStream, {
//         mimeType: "video/webm; codecs=vp9",
//         videoBitsPerSecond: 8000000   // 🔥 same high quality
//     });

//     screenChunks = [];

//     screenRecorder.ondataavailable = e => {
//         if (e.data.size > 0) screenChunks.push(e.data);
//     };

//     screenRecorder.start(1000);  // ✅ better chunk size
// }



// // ================= CALIBRATION =================
// function generateCalibrationPoints() {
//     const w = window.innerWidth;
//     const h = window.innerHeight;

//     const cellW = w / 3;
//     const cellH = h / 3;

//     const spread = 5 * Math.PI / 180;

//     let pts = [{ x: w / 2, y: h / 2 }];

//     const order = [
//         [0,0],[0,1],[0,2],
//         [1,2],[2,2],[2,1],
//         [2,0],[1,0]
//     ];

//     for (let [r,c] of order) {

//         let cx = c * cellW + cellW / 2;
//         let cy = r * cellH + cellH / 2;

//         let tx = c === 0 ? 0 : (c === 2 ? w : w/2);
//         let ty = r === 0 ? 0 : (r === 2 ? h : h/2);

//         let angle = Math.atan2(ty - cy, tx - cx);
//         angle += (Math.random()*2 - 1) * spread;

//         let dx = Math.cos(angle);
//         let dy = Math.sin(angle);

//         let tX = dx > 0 ? (w - cx)/dx : -cx/dx;
//         let tY = dy > 0 ? (h - cy)/dy : -cy/dy;

//         let rMax = Math.min(Math.abs(tX), Math.abs(tY)) * 0.85;

//         pts.push({ x: cx + dx*rMax, y: cy + dy*rMax });
//     }

//     return pts;
// }


// function runCalibration(name, age, location) {
//     const screen = document.getElementById("screen");
//     const pts = generateCalibrationPoints();

//     let i = 0;

//     function show() {
//         if (i >= pts.length) return finish(name, age, location);

//         screen.innerHTML = "";

//         const p = pts[i];

//         let dot = document.createElement("div");
//         dot.className = "point";
//         dot.style.left = p.x + "px";
//         dot.style.top = p.y + "px";

//         screen.appendChild(dot);

//         pointsData.push({ index: i, ...p, time: new Date().toISOString() });

//         i++;
//         setTimeout(show, 4000);
//     }

//     show();
// }


// // ================= FINISH =================
// // function finish(name, age, location) {

// //     const camPromise = recordToBase64(mediaRecorder, recordedChunks);
// //     const screenPromise = recordToBase64(screenRecorder, screenChunks);

// //     mediaRecorder.stop();
// //     screenRecorder.stop();

// //     Promise.all([camPromise, screenPromise])
// //     .then(async ([camData, screenData]) => {

// //         // 1️⃣ SAVE LOG
// //         const res = await fetch("/save_log", {
// //             method: "POST",
// //             headers: {"Content-Type":"application/json"},
// //             body: JSON.stringify({ name, age, location, points: pointsData })
// //         });

// //         const { folder } = await res.json();

// //         // 2️⃣ SAVE CAMERA
// //         await fetch("/save_camera", {
// //             method: "POST",
// //             headers: {"Content-Type":"application/json"},
// //             body: JSON.stringify({ folder, video: camData })
// //         });

// //         // 3️⃣ SAVE SCREEN
// //         await fetch("/save_screen", {
// //             method: "POST",
// //             headers: {"Content-Type":"application/json"},
// //             body: JSON.stringify({ folder, video: screenData })
// //         });

// //         await exitFullscreen();
// //         resetUI();

// //         alert("✅ All Saved Successfully!");
// //         location.reload();
// //     });
// // }
// function finish(name, age, location) {

//     if (!mediaRecorder || !screenRecorder) {
//         console.error("Recorders not initialized");
//         return;
//     }

//     // 🎥 Convert camera recording
//     const camPromise = new Promise(resolve => {
//         mediaRecorder.onstop = () => {
//             const blob = new Blob(recordedChunks, { type: "video/webm" });
//             const reader = new FileReader();

//             reader.onloadend = () => resolve(reader.result);
//             reader.readAsDataURL(blob);
//         };
//     });

//     // 🖥 Convert screen recording
//     const screenPromise = new Promise(resolve => {
//         screenRecorder.onstop = () => {
//             const blob = new Blob(screenChunks, { type: "video/webm" });
//             const reader = new FileReader();

//             reader.onloadend = () => resolve(reader.result);
//             reader.readAsDataURL(blob);
//         };
//     });

//     // 🔥 STOP AFTER attaching handlers
//     mediaRecorder.stop();
//     screenRecorder.stop();

//     Promise.all([camPromise, screenPromise])
//         .then(async ([camData, screenData]) => {

//             try {
//                 console.log("Points collected:", pointsData.length);

//                 // 1️⃣ SAVE LOG
//                 const res = await fetch("/save_log", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         name,
//                         age,
//                         location,
//                         points: pointsData
//                     })
//                 });

//                 const { folder } = await res.json();

//                 // 2️⃣ SAVE CAMERA
//                 await fetch("/save_camera", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         folder,
//                         video: camData
//                     })
//                 });

//                 // 3️⃣ SAVE SCREEN
//                 await fetch("/save_screen", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         folder,
//                         video: screenData
//                     })
//                 });

//                 // ✅ EXIT FULLSCREEN
//                 await exitFullscreen();

//                 // ✅ REMOVE CALIBRATION MODE (VERY IMPORTANT)
//                 document.body.classList.remove("calibration-active");

//                 // ✅ RESET UI
//                 resetUI();

//                 alert("✅ All Saved Successfully!");
//                 location.reload();

//             } catch (err) {
//                 console.error("❌ Save error:", err);
//                 alert("Error saving data");

//                 // fallback cleanup
//                 document.body.classList.remove("calibration-active");
//                 await exitFullscreen();
//             }
//         })
//         .catch(err => {
//             console.error("❌ Recording error:", err);
//             alert("Recording failed");

//             document.body.classList.remove("calibration-active");
//         });
// }

// // ================= HELPERS =================
// function recordToBase64(recorder, chunks) {
//     return new Promise(resolve => {
//         recorder.onstop = () => {
//             const blob = new Blob(chunks);
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result);
//             reader.readAsDataURL(blob);
//         };
//     });
// }

// function resetData() {
//     pointsData = [];
//     recordedChunks = [];
//     screenChunks = [];
// }

// function toggleUI(show) {
//     document.getElementById("formContainer").style.display = show ? "block" : "none";
//     document.getElementById("banner").style.display = show ? "block" : "none";
// }

// function resetUI() {
//     toggleUI(true);
//     document.getElementById("screen").innerHTML = "";
// }

// function nameInput(){ return document.getElementById("name").value.trim(); }
// function ageInput(){ return document.getElementById("age").value.trim(); }
// function locationInput(){ return document.getElementById("location").value.trim(); }

// async function enterFullscreen(){
//     if(!document.fullscreenElement)
//         await document.documentElement.requestFullscreen();
// }

// async function exitFullscreen(){
//     if(document.fullscreenElement)
//         await document.exitFullscreen();
// }












// ================= GLOBALS =================
let pointsData = [];
let mediaRecorder = null, screenRecorder = null;
let recordedChunks = [], screenChunks = [];
let globalCamStream = null;
let globalScrStream = null;

// ================= STEP 1: PRE-FLIGHT (TABLET FRIENDLY) =================
async function requestPermissionsManual() {
    const permBtn = document.getElementById("permBtn");
    const statusText = document.getElementById("statusText");
    const preview = document.getElementById("preview");
    const startBtn = document.getElementById("startBtn");

    try {
        // Request Camera (Front-facing for tablets)
        globalCamStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
        });

        // Show Preview so user can align eyes
        preview.srcObject = globalCamStream;
        preview.style.display = "block";
        
        statusText.innerHTML = "✅ Camera Ready. <br>Step 2: (Optional) Screen Share";
        permBtn.innerText = "Allow Screen Recording";
        
        // Switch functionality of button to Screen Sharing
        permBtn.onclick = async () => {
            try {
                if (navigator.mediaDevices.getDisplayMedia) {
                    globalScrStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                    statusText.innerHTML = "✅ All Systems Ready!";
                }
            } catch (e) {
                statusText.innerHTML = "⚠️ Screen skipped (Fine for Tablets)";
            }
            permBtn.style.display = "none";
        };

        // Enable the main start button
        startBtn.disabled = false;
        startBtn.style.opacity = "1";

    } catch (err) {
        console.error(err);
        statusText.innerText = "❌ Camera Access Denied";
    }
}

// ================= STEP 2: START =================
async function start() {
    const name = nameInput();
    const age = ageInput();
    const locationVal = locationInput();

    if (!name || !age || !locationVal) {
        alert("Fill all fields");
        return;
    }

    // Enter Fullscreen immediately on click
    await enterFullscreen();

    try {
        document.body.classList.add("calibration-active");
        resetData();

        // Use the global streams we already opened
        startRecording(globalCamStream, globalScrStream);

        runCalibration(name, age, locationVal);

    } catch (err) {
        console.error("Start error:", err);
        runCalibration(name, age, locationVal);
    }
}

// ================= RECORDING =================
function startRecording(camStream, scrStream) {
    if (camStream) {
        mediaRecorder = new MediaRecorder(camStream);
        recordedChunks = [];
        mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
        mediaRecorder.start();
    }

    if (scrStream) {
        screenRecorder = new MediaRecorder(scrStream);
        screenChunks = [];
        screenRecorder.ondataavailable = e => { if (e.data.size > 0) screenChunks.push(e.data); };
        screenRecorder.start();
    }
}

// ================= CALIBRATION (ORIGINAL LOGIC) =================
// function generateCalibrationPoints() {
//     const w = window.innerWidth;
//     const h = window.innerHeight;
//     const cellW = w / 3;
//     const cellH = h / 3;
//     const spread = 5 * Math.PI / 180;
//     let pts = []; //[{ x: w / 2, y: h / 2 }];
//     const order = [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]];

//     for (let [r,c] of order) {
//         let cx = c * cellW + cellW / 2;
//         let cy = r * cellH + cellH / 2;
//         let tx = c === 0 ? 0 : (c === 2 ? w : w/2);
//         let ty = r === 0 ? 0 : (r === 2 ? h : h/2);
//         let angle = Math.atan2(ty - cy, tx - cx);
//         angle += (Math.random()*2 - 1) * spread;
//         let dx = Math.cos(angle);
//         let dy = Math.sin(angle);
//         let tX = dx > 0 ? (w - cx)/dx : -cx/dx;
//         let tY = dy > 0 ? (h - cy)/dy : -cy/dy;
//         let rMax = Math.min(Math.abs(tX), Math.abs(tY)) * 0.85;
//         pts.push({ x: cx + dx*rMax, y: cy + dy*rMax });
//     }
//     return pts;
// }

function generateCalibrationPoints() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const cellW = w / 3;
    const cellH = h / 3;

    const spread = 5 * Math.PI / 180;

    // ✅ Initialize empty (NO midpoint first)
    let pts = [];

    // ✅ Your desired order
    const order = [
        [0,0],[0,1],[0,2],
        [1,0],[1,1],[1,2],
        [2,0],[2,1],[2,2]
    ];

    for (let [r, c] of order) {

        if (r === 1 && c === 1) {
            pts.push({ x: w / 2, y: h / 2 });
            continue;
        }
        let cx = c * cellW + cellW / 2;
        let cy = r * cellH + cellH / 2;

        let tx = c === 0 ? 0 : (c === 2 ? w : w/2);
        let ty = r === 0 ? 0 : (r === 2 ? h : h/2);

        let angle = Math.atan2(ty - cy, tx - cx);
        angle += (Math.random() * 2 - 1) * spread;

        let dx = Math.cos(angle);
        let dy = Math.sin(angle);

        let tX = dx > 0 ? (w - cx)/dx : -cx/dx;
        let tY = dy > 0 ? (h - cy)/dy : -cy/dy;

        let rMax = Math.min(Math.abs(tX), Math.abs(tY)) * 0.85;

        pts.push({
            x: cx + dx * rMax,
            y: cy + dy * rMax
        });
    }

    return pts;
}

function runCalibration(name, age, locationVal) {
    const screen = document.getElementById("screen");
    const pts = generateCalibrationPoints();
    let i = 0;

    function show() {
        if (i >= pts.length) return finish(name, age, locationVal);
        screen.innerHTML = "";
        const p = pts[i];
        let dot = document.createElement("div");
        dot.className = "point";
        dot.style.left = Math.floor(p.x) + "px"; // Floor for tablet density
        dot.style.top = Math.floor(p.y) + "px";
        screen.appendChild(dot);
        pointsData.push({ index: i, ...p, time: new Date().toISOString() });
        i++;
        setTimeout(show, 4000);
    }
    show();
}

// ================= FINISH =================
function finish(name, age, locationVal) {
    // 🛑 Stop hardware tracks to release camera light on Tablet
    if (globalCamStream) globalCamStream.getTracks().forEach(t => t.stop());
    if (globalScrStream) globalScrStream.getTracks().forEach(t => t.stop());

    const getBase64 = (recorder, chunks) => new Promise(resolve => {
        if (!recorder) return resolve(null);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        };
        recorder.stop();
    });

    Promise.all([getBase64(mediaRecorder, recordedChunks), getBase64(screenRecorder, screenChunks)])
        .then(async ([camData, screenData]) => {
            try {
                const res = await fetch("/save_log", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, age, location: locationVal, points: pointsData })
                });
                const logData = await res.json();
                const folder = logData.folder || "default";

                if (camData) await fetch("/save_camera", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ folder, video: camData })
                });

                if (screenData) await fetch("/save_screen", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ folder, video: screenData })
                });

                await exitFullscreen();
                document.body.classList.remove("calibration-active");
                alert("✅ Saved Successfully!");
                location.reload();
            } catch (err) {
                console.error("Save error:", err);
                location.reload();
            }
        });
}

// ================= HELPERS =================
function resetData() { pointsData = []; recordedChunks = []; screenChunks = []; }
function toggleUI(show) { document.getElementById("formContainer").style.display = show ? "block" : "none"; }
function resetUI() { toggleUI(true); document.getElementById("screen").innerHTML = ""; }
function nameInput(){ return document.getElementById("name").value.trim(); }
function ageInput(){ return document.getElementById("age").value.trim(); }
function locationInput(){ return document.getElementById("location").value.trim(); }

async function enterFullscreen(){
    try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    } catch (e) { console.warn("Fullscreen denied"); }
}
async function exitFullscreen(){ if (document.fullscreenElement) await document.exitFullscreen(); }