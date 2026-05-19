# 🚀 CrawlGen Intelligence API Documentation

Welcome to the CrawlGen Intelligence API. This documentation provides details on how to integrate with the CrawlGen Intelligence platform programmatically.

## 🔑 Authentication

Most endpoints require authentication. CrawlGen Intelligence supports two methods:
1.  **Session-based**: Used by the web dashboard (handled automatically via cookies).
2.  **API Key**: Used for programmatic access. Provide your key in the header:
    `x-api-key: YOUR_ACCESS_KEY`

---

## 🛰️ Public / News Endpoints

### 1. List News Sources
Retrieve available news sources and their categories.
*   **URL**: `/api/sources`
*   **Method**: `GET`
*   **Auth**: Required (API Key or Session)
*   **Response Example**:
    ```json
    [
      {
        "id": "antara",
        "name": "Antara News",
        "baseUrl": "https://www.antaranews.com",
        "categories": ["terbaru", "politik", "ekonomi"]
      },
      {
        "id": "cnbc",
        "name": "CNBC Indonesia",
        "baseUrl": "https://www.cnbcindonesia.com",
        "categories": ["news", "market"]
      }
    ]
    ```

### 2. List Source Categories
Focused discovery for a single intelligence stream.
*   **URL**: `/api/news/:source/categories`
*   **Method**: `GET`
*   **Response Example**:
    ```json
    {
      "success": true,
      "source": "antara",
      "name": "Antara News",
      "categories": ["terbaru", "politik", "ekonomi"]
    }
    ```

### 3. Fetch News Stream
Retrieve articles from a specific source and category.
*   **URL**: `/api/news/:source/:category`
*   **Method**: `GET`
*   **URL Params**:
    *   `source` (Required): The ID of the source (e.g., `antara`, `cnbc`)
    *   `category` (Optional): The category ID. Defaults to `terbaru`.
*   **Query Params**:
    *   `fetchDetail`: Set to `true` to scrape full content for each article (slower).

### 4. Fetch Article Detail
Extract full content and metadata for a specific article URL.
*   **URL**: `/api/news/:source/detail`
*   **Method**: `GET`
*   **Query Params**:
    *   `url` (Required): The full URL of the article.
*   **Response Example**:
    ```json
    {
      "success": true,
      "data": {
        "content": "Full text...",
        "author": "John Doe",
        "tags": ["Tag1", "Tag2"]
      }
    }
    ```

---

## 🔐 Administrative Endpoints
*Requires Admin Role*


### 5. Create/Update Source
*   **URL**: `/api/sources`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "id": "new-source",
      "name": "New Source Name",
      "baseUrl": "https://example.com",
      "categories": ["cat1", "cat2"],
      "selectors": {
        "list": ".news-item",
        "title": "h1",
        "content": ".content-body"
      }
    }
    ```

---

## 🛠️ Errors

The API uses standard HTTP status codes:
*   `200`: Success
*   `401`: Unauthorized (Missing or invalid API Key)
*   `403`: Forbidden (Insufficient permissions)
*   `404`: Not Found (Invalid source or category)
*   `500`: Internal Server Error

---

© 2026 CrawlGen Intelligence OS
