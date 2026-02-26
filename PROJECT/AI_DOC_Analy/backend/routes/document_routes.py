from flask import Blueprint, request, jsonify
from backend.utils.nlp_utils import analyze_text

document_bp = Blueprint('documents', __name__)

@document_bp.route('/upload', methods=['POST'])
def upload_document():
    file = request.files.get('file')
    if file:
        content = file.read().decode('utf-8')
        analysis = analyze_text(content)
        return jsonify({'message': f'{file.filename} uploaded', 'analysis': analysis})
    return jsonify({'error': 'No file provided'}), 400
