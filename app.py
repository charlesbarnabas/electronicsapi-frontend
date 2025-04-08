from flask import Flask, request, send_from_directory
from flask_restful import Api
from flask_cors import CORS
from config import Config
from models import db
from schemas import ma
from resources import ProductListResource, ProductResource
import os

app = Flask(__name__)
app.config.from_object(Config)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

CORS(app, resources={r"/*": {"origins": "*"}})

db.init_app(app)
ma.init_app(app)
api = Api(app)

api.add_resource(ProductListResource, '/products')
api.add_resource(ProductResource, '/products/<int:product_id>')

@app.before_request
def create_tables():
    db.create_all()

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
