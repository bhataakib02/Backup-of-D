from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.document_routes import document_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(document_bp, url_prefix='/api/documents')


@app.route('/')
def home():
    return "AI Document Analytics Backend Running"

if __name__ == '__main__':
    app.run(debug=True)
