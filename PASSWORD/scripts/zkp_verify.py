import pynacl.secret

def zkp_verify_password(pwd):
    box = pynacl.secret.SecretBox(b'32_byte_key_for_demo_1234567890')
    try:
        encrypted = box.encrypt(pwd.encode())
        return True
    except:
        return False