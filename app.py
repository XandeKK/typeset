from flask import Flask
from websocket.sockets import socketio
from routes.routes import routes_blueprint

app = Flask(__name__)
socketio.init_app(app)
app.register_blueprint(routes_blueprint)

if __name__ == '__main__':
    socketio.run(app)
