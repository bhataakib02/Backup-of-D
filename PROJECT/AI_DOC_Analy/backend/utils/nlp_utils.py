def analyze_text(text):
    words = text.split()
    return {
        'num_words': len(words),
        'num_lines': text.count('\n')+1,
        'sample_text': text[:100]
    }
