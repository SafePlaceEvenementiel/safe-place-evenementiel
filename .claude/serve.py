import http.server
import os

os.chdir("/Users/user/Desktop/safe-place-evenementiel")

handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(("", 3000), handler)
print("Serving at http://localhost:3000")
httpd.serve_forever()
