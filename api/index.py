# import os
# import json
# import base64
# from flask import Flask, render_template, request, jsonify
# from datetime import datetime
# from zoneinfo import ZoneInfo

# app = Flask(__name__)

# app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024

# BASE_FOLDER = "static/recordings"
# os.makedirs(BASE_FOLDER, exist_ok=True)


# # ================= HOME =================
# @app.route('/')
# def index():
#     return render_template('index.html')


# # ================= SAVE LOG =================
# @app.route('/save_log', methods=['POST'])
# def save_log():
#     data = request.json

#     name = data["name"]
#     age = data["age"]
#     location = data["location"]
#     points = data["points"]

#     # IST timestamp
#     now_ist = datetime.now(ZoneInfo("Asia/Kolkata"))
#     timestamp = now_ist.strftime("%Y%m%d_%H%M%S")

#     folder_name = f"{name}_{timestamp}"
#     user_folder = os.path.join(BASE_FOLDER, folder_name)
#     os.makedirs(user_folder, exist_ok=True)

#     log_data = {
#         "name": name,
#         "age": age,
#         "location": location,
#         "timestamp_ist": timestamp,
#         "points": points
#     }

#     log_path = os.path.join(user_folder, "log.json")

#     with open(log_path, "w") as f:
#         json.dump(log_data, f, indent=4)

#     return jsonify({"status": "log saved", "folder": folder_name})


# # ================= SAVE CAMERA =================
# @app.route('/save_camera', methods=['POST'])
# def save_camera():
#     data = request.json

#     folder_name = data["folder"]
#     video_data = data["video"]

#     user_folder = os.path.join(BASE_FOLDER, folder_name)

#     cam_path = os.path.join(user_folder, "camera.webm")
#     save_base64(video_data, cam_path)

#     return jsonify({"status": "camera saved"})


# # ================= SAVE SCREEN =================
# @app.route('/save_screen', methods=['POST'])
# def save_screen():
#     data = request.json

#     folder_name = data["folder"]
#     video_data = data["video"]

#     user_folder = os.path.join(BASE_FOLDER, folder_name)

#     screen_path = os.path.join(user_folder, "screen.webm")
#     save_base64(video_data, screen_path)

#     return jsonify({"status": "screen saved"})


# # ================= HELPER =================
# def save_base64(data, path):
#     header, encoded = data.split(",", 1)
#     video_bytes = base64.b64decode(encoded)

#     with open(path, "wb") as f:
#         f.write(video_bytes)


# # ================= RUN =================
# if __name__ == '__main__':
#     app.run(debug=True)











import os
import json
import base64
from flask import Flask, render_template, request, jsonify
from datetime import datetime
from zoneinfo import ZoneInfo

app = Flask(__name__, template_folder='../templates', static_folder='../static')
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  

BASE_FOLDER = "static/recordings"
os.makedirs(BASE_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save_log', methods=['POST'])
def save_log():
    try:
        data = request.get_json()
        name = data.get("name", "user")
        now_ist = datetime.now(ZoneInfo("Asia/Kolkata"))
        timestamp = now_ist.strftime("%Y%m%d_%H%M%S")
        folder_name = f"{name}_{timestamp}"
        user_folder = os.path.join(BASE_FOLDER, folder_name)
        os.makedirs(user_folder, exist_ok=True)

        with open(os.path.join(user_folder, "log.json"), "w") as f:
            json.dump(data, f, indent=4)
        return jsonify({"status": "success", "folder": folder_name}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/save_camera', methods=['POST'])
def save_camera():
    return handle_video_save(request.get_json(), "camera.webm")

@app.route('/save_screen', methods=['POST'])
def save_screen():
    return handle_video_save(request.get_json(), "screen.webm")

def handle_video_save(data, filename):
    try:
        folder = data.get("folder")
        video_data = data.get("video")
        if not folder or not video_data: return jsonify({"status": "skipped"}), 200
        
        path = os.path.join(BASE_FOLDER, folder, filename)
        header, encoded = video_data.split(",", 1)
        
        # Tablet base64 padding fix
        missing_padding = len(encoded) % 4
        if missing_padding: encoded += '=' * (4 - missing_padding)
        
        with open(path, "wb") as f:
            f.write(base64.b64decode(encoded))
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)