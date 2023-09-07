import os

def find_fonts(start_path, result=None):
    if result is None:
        result = {}
    for file in os.listdir(start_path):
        file_path = os.path.join(start_path, file)
        if os.path.isdir(file_path):
            find_fonts(file_path, result)
        elif os.path.splitext(file)[1] in ['.otf', '.ttf']:
            result[file] = file_path.replace(os.path.join(os.path.dirname(__file__), '../static'), '')
    return result

