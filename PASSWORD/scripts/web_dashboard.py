from flask import Flask, request, render_template, send_file
from flask_socketio import SocketIO, emit
import os
from scripts.aegis_audit import analyze_password, audit_file

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    filepath = os.path.join('inputs', file.filename)
    file.save(filepath)
    audit_file(filepath)
    socketio.emit('status', {'message': 'Audit complete!'})
    return render_template('results.html')

@socketio.on('check_password')
def check_password_socket(data):
    pwd = data.get('password', '')
    result = analyze_password(pwd)
    result['ai_suggestion'] = get_ai_suggestion(pwd) if result['score'] < 50 else "Strong enough!"
    emit('strength_update', result)

@socketio.on('connect')
def connect():
    emit('status', {'message': 'Connected to real-time dashboard'})

if __name__ == '__main__':
    socketio.run(app, debug=True)