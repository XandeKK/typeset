from flask import render_template, request, send_file, jsonify, Blueprint
from werkzeug.utils import secure_filename
from lib.fonts import find_fonts
import json
import os

routes_blueprint = Blueprint('routes', __name__)

@routes_blueprint.route('/')
def index():
    return render_template('home.html')

@routes_blueprint.route('/file')
def file():
    file_path = request.args.get('path')

    if file_path is not None:
        if os.path.exists(file_path):
            return send_file(file_path)
        else:
            return "File not found", 404
    else:
        return "Path is None", 400

@routes_blueprint.route('/fonts')
def fonts():
    return jsonify(find_fonts('static/fonts')), 200

@routes_blueprint.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return 'No image file', 400
    image = request.files['image']
    if image.filename == '':
        return 'No selected file', 400
    save_path = request.form.get('path')
    if not save_path:
        return 'No save path provided', 400
    json_data = request.form.get('json_data')
    if not json_data:
        return 'No JSON data provided', 400

    filename = secure_filename(image.filename)
    image.save(os.path.join(save_path, filename))

    json_dir = os.path.join(save_path, 'json')
    os.makedirs(json_dir, exist_ok=True)
    
    json_filename = os.path.splitext(filename)[0] + '.json'
    with open(os.path.join(json_dir, json_filename), 'w') as f:
        f.write(json_data)
    
    return 'Image and JSON data uploaded!', 200
