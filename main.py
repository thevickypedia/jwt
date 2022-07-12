import jwt

key = "secret"
payload = {'username': 'Jarvis'}
token = jwt.encode(payload, key)
print("Encoded token: %s" % token)
try:
    decoded = jwt.decode(jwt=token, key=key, options={"verify_signature": True}, algorithms="HS256")
    print("Decoded token: %s" % decoded)
except jwt.exceptions.DecodeError as error:
    print(error)
