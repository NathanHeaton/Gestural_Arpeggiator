from flask import Flask, render_template
from flask_socketio import SocketIO
import time
import os

SENSOR_MODE = os.getenv("live", "mock")  # default to mock on PC

if SENSOR_MODE == "live":
    from gpiozero import DistanceSensor
    sensor = DistanceSensor(echo=27, trigger=17)

app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading')

@app.route("/")
def index():
    return render_template("index.html")  # p5.js frontend
    
	
def gatherData():
    while True:
        if SENSOR_MODE == "live":
            dis = sensor.distance * 100
            print('Distance: {:.2f} cm'.format(dis))
            socketio.emit("distance", dis)
            time.sleep(0.3)

if __name__ == "__main__":
    socketio.start_background_task(gatherData)
    socketio.run(app, host="0.0.0.0", port=5000)


