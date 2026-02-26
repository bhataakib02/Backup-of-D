from transformers import pipeline

def get_ai_suggestion(weak_pwd):
         generator = pipeline('text-generation', model='gpt2')
         prompt = f"Generate a strong password based on: {weak_pwd}"
         return generator(prompt, max_length=20, num_return_sequences=1)[0]['generated_text']