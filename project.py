from flask import Flask, render_template
from flask_socketio import SocketIO
import time
import os

from collections import deque
import threading 

import cv2
import numpy as np
from ai_edge_litert.interpreter import Interpreter

SENSOR_MODE = os.getenv("live", "mock")  # default to mock on PC

SENSOR_MODE = "live"

# teachable model =================
model_path = "model_unquant.tflite"
interpreter = Interpreter(model_path=model_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

with open("labels.txt", "r") as f:
    class_names = [line.strip() for line in f.readlines()]
    
camera = cv2.VideoCapture(0)
current_key = None
toggled = False
ticks = 0
tick_per_check = 10

lock = threading.Lock()

if SENSOR_MODE == "live":
	print("Sensor mode is live")
	from gpiozero import DistanceSensor
	sensor = DistanceSensor(echo=27, trigger=17)

app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading')

@app.route("/")
def index():
    return render_template("index.html")  # p5.js frontend
    
	
def gatherDistanceData():
	while True:
		if SENSOR_MODE == "live":
			dis = sensor.distance * 100
			
			with lock:
				socketio.emit("distance", dis)
				
			time.sleep(0.3)
            
def gatherCameraData():
	if SENSOR_MODE != "live":
		return

	previousIndex = 0

	while True:
		ret, image = camera.read()
		if not ret: 
			break
		
		# Pre-processing
		input_img = cv2.resize(image, (224, 224), interpolation=cv2.INTER_AREA)
		input_img = np.expand_dims(input_img, axis=0).astype(np.float32)
		input_img = (input_img / 127.5) - 1 # Normalize to [-1, 1]
		
		# Inference
		interpreter.set_tensor(input_details[0]['index'], input_img)
		interpreter.invoke()
		output_data = interpreter.get_tensor(output_details[0]['index'])
		
		index = np.argmax(output_data[0])
		label = class_names[index]
		confidence = output_data[0][index]
			
		if confidence > 0.9:
			if previousIndex != index:
				with lock:
					value = int(index)
					print("emiting data", index)
					socketio.emit("hand_gesture", value)

		previousIndex = index
		time.sleep(0.3)

				          
            
threads = [ threading.Thread(target=gatherDistanceData, daemon=True),
			threading.Thread(target=gatherCameraData, daemon=True)]
	
def program():
			
	for thread in threads:
		thread.start()

	for thread in threads:
		thread.join()	
		
if __name__ == "__main__":
    socketio.start_background_task(program)
    socketio.run(app, host="0.0.0.0", port=5000)


if current_key:
	keyboard.release(current_key)
	camera.release()
	cv2.destroyAllWindows()
