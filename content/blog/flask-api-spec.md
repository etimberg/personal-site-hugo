---
title: "Self Documenting APIs with Flask and Swagger"
date: 2019-10-24T20:06:03-04:00
tags: ["python", "swagger", "apispec", "open-api"]
---
[Flask](https://palletsprojects.com/p/flask/) is a simple Python framework for creating web applications. It can be used to create API servers in a microservices architecture. When doing so, it is helpful to provide API documentation that ships with your service. This post outlines a technique for shipping OpenAPI v3 documentation from your service while co-locating the documentation with the API implementation.

Keeping the documentation with the route definition ensures that it is easy to update, updates can be clearly identified during code review, and it helps to onboard new developers to a project. There are a few Flask plugins that can acheive this, but the best is [apispec](https://github.com/marshmallow-code/apispec)
along with the associated [Flask plugin](https://github.com/marshmallow-code/apispec-webframeworks).
The major advantages of `apispec` over other libraries are that it supports Marshmallow schemas directly and the OpenAPI Specification v3.

## Documenting a Route

Documenting a route is as simple as providing a comment at the start of the Flask view function. In the example below, we have a simple web server that responds to a `/version` API with some JSON information regarding the service. The service also provides a `/spec` route that returns the OpenAPI documentation for the service.

{{< highlight python3 >}}
import os

from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from apispec_webframeworks.flask import FlaskPlugin
from flask import Flask, jsonify

app = Flask(__name__)

spec = APISpec(
    title="Swagger Example",
    version="1.0.0",
    openapi_version="3.0.2",
    plugins=[FlaskPlugin(), MarshmallowPlugin()],
)

@app.route("/version")
def get_info():
    """
    Get info on our server
    ---
    get:
        description: Get the version information for our service
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                version:
                                    type: string
                                    description: Version number of our service
    """
    return jsonify({
        "version": os.environ.get("VERSION"),
    })


# Need to register the path
with app.test_request_context():
    spec.path(view=get_info)


@app.route("/spec")
def get_apispec():
    return jsonify(spec.to_dict())

{{< /highlight >}}

<br>
Now, if we load up a swagger UI client and point it to our service we can see the definition for our API.

![Displayed API Spec](/img/swagger.png)

## Integration with Flask Blueprints

As Flask applications start to get bigger, it is common to switch to using [Blueprints](https://flask.palletsprojects.com/en/1.1.x/blueprints/) to help organize the code. Blueprints can be adapted to work with `apispec` using a derived class. The blueprint automatically loads the route into the `spec` object. There is a [pull request](https://github.com/marshmallow-code/apispec-webframeworks/pull/27) to the `apispec-webframeworks` project to add a `DocumentedBlueprint` but in the meantime, one must copy the implementation to your project. 

To get around the need to pass the `APISpec` object to each instance of the Blueprint, you can partial the Blueprint constructor as shown below.

{{< highlight python3 >}}
from functools import partial
from document_blueprint import DocumentedBlueprint as RawBlueprint

spec = APISpec(
    title="Swagger Example",
    version="1.0.0",
    openapi_version="3.0.2",
    plugins=[FlaskPlugin(), MarshmallowPlugin()],
)

# Use this DocumentedBlueprint to avoid needing to set the spec everywhere
DocumentedBlueprint = partial(RawBlueprint, spec=spec)
{{< /highlight >}}

## Use with Webargs

The webargs project provides a more convenient way to use marshmallow than creating schema objects. To use it with apispec, the following helper can be used to create an apispec schema object that will appear in the Open API spec response.

{{< highlight python3 >}}
def create_schema_from_web_args(name: str, args: dict):
    klass = Schema.from_dict(args)
    spec.components.schema(name, schema=klass)
{{< /highlight >}}

## Custom Schemas

In addition to Marshmallow, it can be useful to define custom schemas using YAML rather than being forced to use Marshmallow objects. A simple helper makes this possible.

{{< highlight python3 >}}
from yaml import safe_load

def add_schema(spec: APISpec, name: str, schema_str: str):
    schema = safe_load(schema_str)
    spec.schema(name, schema)
{{< /highlight >}}

