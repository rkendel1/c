from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import SearchQuery
from .serializers import SearchQuerySerializer
import requests

class SearchQueryViewSet(viewsets.ModelViewSet):
    queryset = SearchQuery.objects.all()
    serializer_class = SearchQuerySerializer

    @action(detail=False, methods=['post'])
    def search(self, request):
        query = request.data.get('query')
        if not query:
            return Response({"error": "Query is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Search the local database first
        local_response = self.search_local_database(query)
        if local_response:
            return Response({"response": local_response}, status=status.HTTP_200_OK)

        # If no local response, call the LLM
        response = self.call_llm(query)
        search_query = SearchQuery.objects.create(query=query, response=response)
        serializer = self.get_serializer(search_query)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def search_local_database(self, query):
        try:
            search_query = SearchQuery.objects.get(query=query)
            return search_query.response
        except SearchQuery.DoesNotExist:
            return None

    def call_llm(self, query):
        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={"model": "llm", "prompt": query, "stream": False},
                timeout=30
            )
            response.raise_for_status()
            return response.json().get("response", "")
        except requests.RequestException as e:
            return f"Error contacting LLM model: {str(e)}"
