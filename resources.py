from flask_restful import Resource, request
from models import Product, db
from schemas import product_schema, products_schema
from http import HTTPStatus
from marshmallow import ValidationError
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = 'static/uploads'

class ProductListResource(Resource):
    def get(self):
        try:
            products = Product.query.all()
            return products_schema.dump(products), HTTPStatus.OK
        except Exception as e:
            return {'message': str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR

    def post(self):
        try:
            name = request.form.get('name')
            category = request.form.get('category')
            price = float(request.form.get('price'))
            image = request.files.get('image')

            filename = None
            if image:
                filename = secure_filename(image.filename)
                image.save(os.path.join(UPLOAD_FOLDER, filename))

            product = Product(
                name=name,
                category=category,
                price=price,
                image_url=f"/{UPLOAD_FOLDER}/{filename}" if filename else None
            )
            db.session.add(product)
            db.session.commit()
            return product_schema.dump(product), HTTPStatus.CREATED
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR

class ProductResource(Resource):
    def get(self, product_id):
        try:
            product = Product.query.get_or_404(product_id)
            return product_schema.dump(product), HTTPStatus.OK
        except Exception as e:
            return {'message': str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR

    def put(self, product_id):
        try:
            product = Product.query.get_or_404(product_id)

            # Get form data
            name = request.form.get('name', product.name)
            category = request.form.get('category', product.category)
            price = request.form.get('price')
            price = float(price) if price else product.price
            image = request.files.get('image')

            product.name = name
            product.category = category
            product.price = price

            if image:
                filename = secure_filename(image.filename)
                image.save(os.path.join(UPLOAD_FOLDER, filename))
                product.image_url = f"/{UPLOAD_FOLDER}/{filename}"

            db.session.commit()
            return product_schema.dump(product), HTTPStatus.OK
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR

    def delete(self, product_id):
        try:
            product = Product.query.get_or_404(product_id)
            db.session.delete(product)
            db.session.commit()
            return {'message': f"Produk '{product.name}' telah dihapus."}, HTTPStatus.OK
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR
