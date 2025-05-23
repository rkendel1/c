# OpenAPI Integration Documentation

## Purpose

The purpose of integrating OpenAPI into this project is to provide a standardized way to document and test the API endpoints. OpenAPI, also known as Swagger, allows developers to understand and interact with the API without needing to read through the source code or documentation. It provides a user-friendly interface for exploring the API, making requests, and viewing responses.

## Usage

### Accessing the OpenAPI Documentation

Once the project is running, you can access the OpenAPI documentation by navigating to the following URLs:

- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

These interfaces provide a visual representation of the API endpoints, their parameters, request bodies, and responses.

### Testing API Endpoints

The Swagger UI allows you to test the API endpoints directly from the browser. You can make GET, POST, PUT, DELETE, and other types of requests, and view the responses in real-time. This is useful for debugging and verifying the functionality of the API.

### Configuration

The OpenAPI integration is configured in the following files:

- `backend/backend/settings.py`: Contains the OpenAPI-related configurations, including the `drf_yasg` app and `SWAGGER_SETTINGS`.
- `backend/backend/urls.py`: Defines the URL patterns for accessing the Swagger UI and ReDoc.
- `backend/chatbot/views.py`: Includes `swagger_auto_schema` decorators to document the API endpoints.

### Example

Here is an example of how the `swagger_auto_schema` decorator is used in the `ChatMessageViewSet`:

```python
from drf_yasg.utils import swagger_auto_schema

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(operation_description="Create a new chat message")
    def perform_create(self, serializer):
        # Integrate ollama mistral for processing chat messages
        mistral = Mistral()
        response = mistral.process_message(serializer.validated_data['message'])
        serializer.save(response=response)
```

In this example, the `swagger_auto_schema` decorator is used to provide a description for the `perform_create` method, which creates a new chat message.

## Conclusion

Integrating OpenAPI into the project enhances the developer experience by providing a standardized way to document and test the API. It simplifies the process of understanding and interacting with the API, making it easier to develop and maintain the project.
