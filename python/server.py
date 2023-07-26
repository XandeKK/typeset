import torch
import cv2
import os
import numpy as np
import sys
import glob
import uuid
import json
import socket
import pickle
import hashlib
import time

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
                data = self.client.recv(8192)
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
        start = message.get('start', 0)
        end = message.get('end', None)

        if start == -1:
            files = glob.glob(os.path.join(message["path"], "raw/*"))
        else:
            files = []
            for i in range(start, end + 1):
                jpg_path = os.path.join(message["path"], f'raw/{i}.jpg')
                png_path = os.path.join(message["path"], f'raw/{i}.png')
                if os.path.exists(jpg_path):
                    files.append(jpg_path)
                elif os.path.exists(png_path):
                    files.append(png_path)

        files = sorted(files)
        self.ia.predict(files, message["type_style"])
        time.sleep(1)
        server.send({'type': 'finished'})




class IA:
    def __init__(self):
        self.model = torch.hub.load('ultralytics/yolov5', 'custom', path=os.path.dirname(__file__) + '/datasets/best_1.pt')
        self.cache = self.load_cache()

    def predict(self, files, type_style):
        for file in files:
            print(f'predict file: {file}')
            file_hash = self.calculate_md5(file)
            if file_hash in self.cache:
                boxs = self.cache[file_hash]
                time.sleep(0.5)
            else:
                img = cv2.imread(file)
                results = self.model(img)
                boxs = []
                for *box, label, score in results.xyxy[0]:
                    x1, y1, x2, y2 = map(int, box)
                    boxs.append({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2})
                self.cache[file_hash] = boxs
                self.save_cache()
            server.send({'filename': file, 'boxs': boxs, 'type': 'boxs', 'type_style': type_style})

    def calculate_md5(self, file):
        with open(file, 'rb') as f:
            data = f.read()
        return hashlib.md5(data).hexdigest()

    def load_cache(self):
        try:
            with open('cache.pickle', 'rb') as f:
                return pickle.load(f)
        except FileNotFoundError:
            return {}

    def save_cache(self):
        with open('cache.pickle', 'wb') as f:
            pickle.dump(self.cache, f)


server = SocketServer("localhost", 1234)
server.start()
