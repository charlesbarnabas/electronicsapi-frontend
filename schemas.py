from flask_marshmallow import Marshmallow
from models import Product
from models import db

ma = Marshmallow()

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        sqla_session = db.session
        model = Product
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field(required=True)
    category = ma.auto_field(required=True)
    price = ma.auto_field(required=True)

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)