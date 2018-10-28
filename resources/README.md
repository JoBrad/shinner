# Building HTML from OpenAPI spec
Running the commands below will create a static HTML page in the specified directory, from the provided OpenAPI or Swagger spec. 

Options for both Widdershins and shins are set in the index.js file.

To execute:
```sh
node shins.js input_file output_file
```

Example:
```sh
node .\index.js '.\resources\Payments openapi.yaml' .\build\payments.html
node .\index.js '.\resources\Agreements openapi.yaml' .\build\agreements.html
```

## Preview the results
You can use the dockerfile to create a quick web server to view the results. 

```sh
docker run --rm -v $PWD\build:/usr/share/nginx/html -p 8080:80 nginx
```
