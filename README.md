# API's DOCUMENTATION

### 1) Create a Post

- **Endpoint**: `/posts/`
- **Method**: `POST`
- **Headers**: 
  - `Content-Type`: multipart/data
- **Body**:
```json
{
    "file": "img",
    "title": "nodejs",
    "description": "nodejs description",
    "tags": ["fashion", "products"]
}
```

### 2) Get all posts

- **Endpoint**: `/posts/all`
- **Method**: `GET`

### 3) Get posts based on the queries parameters given

- **Endpoint**: `/posts`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: PageNo
  - `limit`: limit
  - `sort`: sortOrder
  - `keyword`: yourKeyword
  - `tag`: tagToSearch

### 4) Create Tags

- **Endpoint**: `/tags/`
- **Method**: `POST`
- **Headers**: 
  - `Content-Type`: application/json
- **Body**:
```json
{
    "name": "tagname"
}
```

### 5) List all tags

- **Endpoint**: `/tags/`
- **Method**: `GET`
