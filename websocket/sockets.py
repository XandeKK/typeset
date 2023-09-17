from flask_socketio import SocketIO, emit
from lib.ai import Handler, glob_json
import os
import json
import time

socketio = SocketIO()
handler = Handler()

@socketio.on('connect')
def handle_connect():
	print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
	print('Client disconnected')

@socketio.on('works')
def handle_works(data):
	handler.handler(data, emit)

@socketio.on('load')
def handle_load(data):
	files = glob_json(data)
	for file in files:
		with open(file, 'r') as f:
			objects = f.read()
		time.sleep(0.2)
		emit('load', {
			'objects': objects
		})


