from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
import sqlite3
import json
import os

class ServidorDChio(BaseHTTPRequestHandler):

    def conectar_db(self):
        return sqlite3.connect("usuarios.db")

    def do_GET(self):
        self.path = urllib.parse.unquote(self.path)

        if self.path == "/":
            self.servir_archivo("index.html")

        elif self.path.startswith("/obtener_perfil"):
            params = urllib.parse.urlparse(self.path).query
            user_id = urllib.parse.parse_qs(params).get("id", [""])[0]

            conn = self.conectar_db()
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM usuarios WHERE id = ?", (user_id,))
            res = cursor.fetchone()
            conn.close()

            if res:
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(dict(res)).encode())
        
        else:
            clean_path = self.path.split('?')[0].lstrip('/')
            self.servir_archivo(clean_path)

    def servir_archivo(self, ruta):
        try:
            if os.path.exists(ruta) and os.path.isfile(ruta):
                with open(ruta, 'rb') as file:
                    self.send_response(200)
                    
                    if ruta.endswith(".html"): self.send_header("Content-type", "text/html")
                    elif ruta.endswith(".css"): self.send_header("Content-type", "text/css")
                    elif ruta.endswith(".js"): self.send_header("Content-type", "application/javascript")
                    elif ruta.endswith(".png"): self.send_header("Content-type", "image/png")
                    elif ruta.endswith(".jpg") or ruta.endswith(".jpeg"): self.send_header("Content-type", "image/jpeg")
                    elif ruta.endswith(".gif"): self.send_header("Content-type", "image/gif")
                    elif ruta.endswith(".ico"): self.send_header("Content-type", "image/x-icon")
                    
                    self.end_headers()
                    self.wfile.write(file.read())
            else:
                print(f"Archivo no encontrado: {os.path.abspath(ruta)}")
                self.send_error(404, "Archivo no encontrado")
        except Exception as e:
            print(f"Error al leer archivo {ruta}: {e}")
            self.send_error(500, f"Error interno: {e}")

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length).decode('utf-8')
        data = urllib.parse.parse_qs(body)


        if self.path == "/registro":
            nombre = data.get("nombre", [""])[0]
            apellido = data.get("apellido", [""])[0]
            telefono = data.get("telefono", [""])[0]
            correo = data.get("correo", [""])[0]
            direccion = data.get("direccion", [""])[0]
            password = data.get("password", [""])[0]

            conn = self.conectar_db()
            cursor = conn.cursor()
            cursor.execute("INSERT INTO usuarios (nombre, apellido, telefono, correo, direccion, password) VALUES (?,?,?,?,?,?)",
                           (nombre, apellido, telefono, correo, direccion, password))
            conn.commit()
            conn.close()

            self.send_response(303)
            self.send_header("Location", "/login.html")
            self.end_headers()

        elif self.path == "/login":
            email = data.get("email", [""])[0]
            password = data.get("password", [""])[0]

            conn = self.conectar_db()
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM usuarios WHERE correo = ? AND password = ?", (email, password))
            user = cursor.fetchone()
            conn.close()

            if user:
                self.send_response(303)
                self.send_header("Location", f"/perfil.html?id={user[0]}")
                self.end_headers()
            else:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Credenciales incorrectas")

if __name__ == "__main__":
    server = HTTPServer(("localhost", 8000), ServidorDChio)
    print("Servidor D'CHIO activo en http://localhost:8000")
    server.serve_forever()