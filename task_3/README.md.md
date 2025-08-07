# Books REST API

A scalable and feature-rich REST API for managing a books collection, built with Node.js and Express. This API provides comprehensive CRUD operations with advanced features like filtering, pagination, search, and bulk operations.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, and Delete books
- **Advanced Filtering**: Filter by author, genre, year, and search by title
- **Pagination**: Efficient data retrieval with customizable page sizes
- **Sorting**: Sort books by any field in ascending or descending order
- **Input Validation**: Comprehensive validation with detailed error messages
- **Duplicate Prevention**: Prevents duplicate books by title and author
- **Partial Updates**: PATCH endpoint for updating specific fields
- **Bulk Operations**: Delete all books with confirmation
- **Statistics**: Get insights about your book collection
- **Error Handling**: Robust error handling with meaningful error codes
- **Health Check**: Monitor API status and uptime
- **CORS Support**: Cross-origin resource sharing enabled
- **Request Logging**: Built-in request logging for monitoring
- **Graceful Shutdown**: Proper server shutdown handling

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Postman or any REST client for testing (optional)

## 🛠️ Installation & Setup

### 1. Initialize the Project

```bash
mkdir books-rest-api
cd books-rest-api
npm init -y
```

### 2. Install Dependencies

```bash
npm install express
npm install --save-dev nodemon
```

### 3. Create the Server

Save the main server code as `server.js` in your project directory.

### 4. Update package.json Scripts

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 5. Start the Server

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
This API currently doesn't require authentication (suitable for development/learning).

## 🔗 Endpoints

### Health Check
- **GET** `/health` - Check API health status

### Books Management

#### Get All Books
- **GET** `/books`
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
  - `author` - Filter by author name
  - `genre` - Filter by genre
  - `year` - Filter by publication year
  - `search` - Search in book titles
  - `sortBy` - Sort field (title, author, year, genre)
  - `sortOrder` - Sort direction (asc, desc)

**Example:** `GET /books?author=martin&sortBy=year&sortOrder=desc&page=1&limit=5`

#### Get Single Book
- **GET** `/books/:id` - Get book by ID

#### Create New Book
- **POST** `/books`
- **Body:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "year": 2023,
  "genre": "Programming"
}
```

#### Update Book (Complete)
- **PUT** `/books/:id`
- **Body:** Same as POST (all fields required)

#### Update Book (Partial)
- **PATCH** `/books/:id`
- **Body:** Only fields to update
```json
{
  "year": 2024,
  "genre": "Technology"
}
```

#### Delete Book
- **DELETE** `/books/:id` - Delete specific book

#### Delete All Books
- **DELETE** `/books?confirm=true` - Delete all books (requires confirmation)

#### Get Collection Statistics
- **GET** `/stats` - Get statistics about the book collection

## 📖 Usage Examples

### Using JavaScript/Fetch

```javascript
// Create a new book
const createBook = async () => {
  try {
    const response = await fetch('http://localhost:3000/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Design Patterns',
        author: 'Gang of Four',
        year: 1994,
        genre: 'Programming'
      })
    });
    
    const result = await response.json();
    console.log('Book created:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get books with filtering
const getFilteredBooks = async () => {
  try {
    const response = await fetch('http://localhost:3000/books?genre=Programming&limit=5');
    const result = await response.json();
    console.log('Filtered books:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🧪 Testing with Postman

### Import Collection
Create a new Postman collection with these requests:

1. **Health Check**
   - Method: GET
   - URL: `{{baseUrl}}/health`

2. **Get All Books**
   - Method: GET
   - URL: `{{baseUrl}}/books`

3. **Create Book**
   - Method: POST
   - URL: `{{baseUrl}}/books`
   - Body (JSON):
   ```json
   {
     "title": "Test Book",
     "author": "Test Author",
     "year": 2023,
     "genre": "Test"
   }
   ```

4. **Get Book by ID**
   - Method: GET
   - URL: `{{baseUrl}}/books/1`

5. **Update Book**
   - Method: PUT
   - URL: `{{baseUrl}}/books/1`

6. **Delete Book**
   - Method: DELETE
   - URL: `{{baseUrl}}/books/1`

Set `baseUrl` environment variable to `http://localhost:3000`.

## 🔧 Error Handling

The API provides comprehensive error handling with structured error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes:
- `VALIDATION_ERROR` - Input validation failed
- `BOOK_NOT_FOUND` - Book doesn't exist
- `DUPLICATE_BOOK` - Book already exists
- `ROUTE_NOT_FOUND` - Invalid endpoint
- `SERVER_ERROR` - Internal server error


## 🔮 Future Enhancements

1. **Database Integration**
   - Add persistent storage
   - Implement database migrations
   - Add connection pooling

2. **Authentication & Authorization**
   - User registration/login
   - Role-based access control
   - API key authentication

3. **Advanced Features**
   - Full-text search with Elasticsearch
   - Book recommendations
   - Reading lists and favorites
   - Book ratings and reviews

4. **Monitoring & Observability**
   - Structured logging with Winston
   - Metrics with Prometheus
   - Health checks and monitoring

5. **API Documentation**
   - OpenAPI/Swagger documentation
   - Interactive API explorer
   - Postman collections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
