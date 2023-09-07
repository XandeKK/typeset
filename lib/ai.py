import numpy as np
import torch
import cv2
import os
import sys
import glob
import uuid
import json
import pickle
import hashlib
import time

class Handler:
	def __init__(self):
		self.ai = AI()

	def handler(self, data, emit):
		start = data.get('start', 0)
		end = data.get('end', None)

		if start == -1:
			files = []
			files.extend(glob.glob(os.path.join(data["path"], "raw/*.png")))
			files.extend(glob.glob(os.path.join(data["path"], "raw/*.jpg")))
		else:
			files = []
			for i in range(start, end + 1):
				jpg_path = os.path.join(data["path"], f'raw/{i}.jpg')
				png_path = os.path.join(data["path"], f'raw/{i}.png')
				if os.path.exists(jpg_path):
					files.append(jpg_path)
				elif os.path.exists(png_path):
					files.append(png_path)

		files = sorted(files, key=lambda x: int(os.path.splitext(os.path.basename(x))[0]))
		self.ai.predict(files, data["type_style"], emit)
		emit('response', files)
		time.sleep(1)
		emit('finished')

class AI:
	def __init__(self):
		self.manga = torch.hub.load('ultralytics/yolov5', 'custom', path=os.path.dirname(__file__) + f'/models/manga.pt')
		self.manhwa = torch.hub.load('ultralytics/yolov5', 'custom', path=os.path.dirname(__file__) + f'/models/manhwa.pt')
		self.cache = self.load_cache()

	def predict(self, files, type_style, emit):
		for file in files:
			print(f'predict file: {file}')
			file_hash = self.calculate_md5(file)
			if file_hash in self.cache:
				boxs = self.cache[file_hash]
				time.sleep(1.5)
			else:
				img = cv2.imread(file)
				if type_style == 'manga':
					results = self.manga(img)
				elif type_style == 'manhwa':
					results = self.manhwa(img)
				boxs = []
				for *box, label, score in results.xyxy[0]:
					x1, y1, x2, y2 = map(int, box)
					boxs.append({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2})
				self.cache[file_hash] = boxs
				self.save_cache()
			emit('boxs', {'filename': file, 'boxs': boxs})

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


def glob_json(msg):
	start = msg.get('start', 0)
	end = msg.get('end', None)

	if start == -1:
		files = glob.glob(os.path.join(msg['path'], 'json', '*.json'))
	else:
		files = []
		for i in range(start, end + 1):
			json_path = os.path.join(msg['path'], 'json', f'{i}.json')
			if os.path.exists(json_path):
				files.append(json_path)

	files.sort(key=lambda x: int(os.path.splitext(os.path.basename(x))[0]))

	return files