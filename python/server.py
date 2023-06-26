import torch
import cv2
import os
import numpy as np
import sys
import glob
import uuid
import json
import socket

class SocketServer:
    def __init__(self, host, port):
        self.handler = Handler()
        self.host = host
        self.port = port
        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server.bind((self.host, self.port))
        self.server.listen(1)

    def start(self):
        print("Server listening on port " + str(self.port))
        while True:
            self.client, address = self.server.accept()
            while True:
                data = self.client.recv(4096)
                if not data:
                    break

                self.handler.run(json.loads(data.decode("utf-8")))
            self.client.close()

    def send(self, data):
        message = json.dumps(data)
        self.client.sendall(message.encode("utf-8"))


class Handler:
    def __init__(self):
        self.ia = IA()
        self.switcher = {
            'images': self.images
        }

    def run(self, message):
        func = self.switcher.get(message["type"], lambda message: server.send({'type': 'error', 'message': 'invalid_message'}))
        func(message)

    def images(self, message):
        self.ia.predict(message["files"])
        server.send({'type': 'finished'})

class IA:
    def __init__(self):
        self.model = torch.hub.load('ultralytics/yolov5', 'custom', path=os.path.dirname(__file__) + '/datasets/best_1.pt')

    def predict(self, files):
        for file in files:
            print(f'predict file: {file}')
            img = cv2.imread(file)

            results = self.model(img)
            boxs = []

            for *box, label, score in results.xyxy[0]:
                x1, y1, x2, y2 = map(int, box)
                boxs.append({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2})

            server.send({'filename': file, 'boxs': boxs, 'type': 'boxs'})

server = SocketServer("localhost", 1234)
server.start()