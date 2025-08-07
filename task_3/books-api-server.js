const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware for cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// In-memory storage for books
let books = [
  { id: 1, title: "The Pragmatic Programmer", author: "David Thomas, Andrew Hunt", year: 1999, genre: "Programming" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", year: 2008, genre: "Programming" },
  { id: 3, title: "System Design Interview", author: "Alex Xu", year: 2020, genre: "Technology" }
];

let nextId = 4;

// Utility functions
const findBookById = (id) => books.find(book => book.id === parseInt(id));
const findBookIndex = (id) => books.findIndex(book => book.id === parseInt(id));

// Validation middleware
const validateBook = (req, res, next) => {
  const { title, author } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      error: 'Title is required and must be a non-empty string',
      code: 'VALIDATION_ERROR'
    });
  }
  
  if (!author || typeof author !== 'string' || author.trim().length === 0) {
    return res.status(400).json({
      error: 'Author is required and must be a non-empty string',
      code: 'VALIDATION_ERROR'
    });
  }
  
  // Optional fields validation
  if (req.body.year && (!Number.isInteger(req.body.year) || req.body.year < 0 || req.body.year > new Date().getFullYear())) {
    return res.status(400).json({
      error: 'Year must be a valid integer between 0 and current year',
      code: 'VALIDATION_ERROR'
    });
  }
  
  if (req.body.genre && (typeof req.body.genre !== 'string' || req.body.genre.trim().length === 0)) {
    return res.status(400).json({
      error: 'Genre must be a non-empty string if provided',
      code: 'VALIDATION_ERROR'
    });
  }
  
  next();
};

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// GET /books - Retrieve all books with optional filtering and pagination
app.get('/books', (req, res) => {
  try {
    let filteredBooks = [...books];
    
    // Filter by author
    if (req.query.author) {
      const authorQuery = req.query.author.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.author.toLowerCase().includes(authorQuery)
      );
    }
    
    // Filter by genre
    if (req.query.genre) {
      const genreQuery = req.query.genre.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.genre && book.genre.toLowerCase().includes(genreQuery)
      );
    }
    
    // Filter by year
    if (req.query.year) {
      const year = parseInt(req.query.year);
      if (!isNaN(year)) {
        filteredBooks = filteredBooks.filter(book => book.year === year);
      }
    }
    
    // Search in title
    if (req.query.search) {
      const searchQuery = req.query.search.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery)
      );
    }
    
    // Sorting
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      
      filteredBooks.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    
    res.json({
      books: paginatedBooks,
      pagination: {
        currentPage: page,
        totalBooks: filteredBooks.length,
        totalPages: Math.ceil(filteredBooks.length / limit),
        hasNextPage: endIndex < filteredBooks.length,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// GET /books/:id - Retrieve a specific book by ID
app.get('/books/:id', (req, res) => {
  try {
    const book = findBookById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        error: 'Book not found',
        code: 'BOOK_NOT_FOUND'
      });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// POST /books - Add a new book
app.post('/books', validateBook, (req, res) => {
  try {
    const { title, author, year, genre } = req.body;
    
    // Check for duplicate titles by same author
    const duplicate = books.find(book => 
      book.title.toLowerCase() === title.toLowerCase() && 
      book.author.toLowerCase() === author.toLowerCase()
    );
    
    if (duplicate) {
      return res.status(409).json({
        error: 'Book with same title and author already exists',
        code: 'DUPLICATE_BOOK'
      });
    }
    
    const newBook = {
      id: nextId++,
      title: title.trim(),
      author: author.trim(),
      year: year || null,
      genre: genre ? genre.trim() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    books.push(newBook);
    
    res.status(201).json({
      message: 'Book created successfully',
      book: newBook
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// PUT /books/:id - Update a book by ID
app.put('/books/:id', validateBook, (req, res) => {
  try {
    const bookIndex = findBookIndex(req.params.id);
    
    if (bookIndex === -1) {
      return res.status(404).json({
        error: 'Book not found',
        code: 'BOOK_NOT_FOUND'
      });
    }
    
    const { title, author, year, genre } = req.body;
    
    // Check for duplicate titles by same author (excluding current book)
    const duplicate = books.find(book => 
      book.id !== parseInt(req.params.id) &&
      book.title.toLowerCase() === title.toLowerCase() && 
      book.author.toLowerCase() === author.toLowerCase()
    );
    
    if (duplicate) {
      return res.status(409).json({
        error: 'Book with same title and author already exists',
        code: 'DUPLICATE_BOOK'
      });
    }
    
    // Update the book
    books[bookIndex] = {
      ...books[bookIndex],
      title: title.trim(),
      author: author.trim(),
      year: year || books[bookIndex].year,
      genre: genre ? genre.trim() : books[bookIndex].genre,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      message: 'Book updated successfully',
      book: books[bookIndex]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// PATCH /books/:id - Partially update a book by ID
app.patch('/books/:id', (req, res) => {
  try {
    const bookIndex = findBookIndex(req.params.id);
    
    if (bookIndex === -1) {
      return res.status(404).json({
        error: 'Book not found',
        code: 'BOOK_NOT_FOUND'
      });
    }
    
    const allowedFields = ['title', 'author', 'year', 'genre'];
    const updates = {};
    
    // Validate and collect updates
    for (const field of allowedFields) {
      if (req.body.hasOwnProperty(field)) {
        if (field === 'title' || field === 'author') {
          if (!req.body[field] || typeof req.body[field] !== 'string' || req.body[field].trim().length === 0) {
            return res.status(400).json({
              error: `${field} must be a non-empty string`,
              code: 'VALIDATION_ERROR'
            });
          }
          updates[field] = req.body[field].trim();
        } else if (field === 'year') {
          if (req.body[field] && (!Number.isInteger(req.body[field]) || req.body[field] < 0 || req.body[field] > new Date().getFullYear())) {
            return res.status(400).json({
              error: 'Year must be a valid integer between 0 and current year',
              code: 'VALIDATION_ERROR'
            });
          }
          updates[field] = req.body[field];
        } else if (field === 'genre') {
          if (req.body[field] && (typeof req.body[field] !== 'string' || req.body[field].trim().length === 0)) {
            return res.status(400).json({
              error: 'Genre must be a non-empty string if provided',
              code: 'VALIDATION_ERROR'
            });
          }
          updates[field] = req.body[field] ? req.body[field].trim() : null;
        }
      }
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'No valid fields provided for update',
        code: 'NO_UPDATES'
      });
    }
    
    // Update the book
    books[bookIndex] = {
      ...books[bookIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      message: 'Book updated successfully',
      book: books[bookIndex]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// DELETE /books/:id - Delete a book by ID
app.delete('/books/:id', (req, res) => {
  try {
    const bookIndex = findBookIndex(req.params.id);
    
    if (bookIndex === -1) {
      return res.status(404).json({
        error: 'Book not found',
        code: 'BOOK_NOT_FOUND'
      });
    }
    
    const deletedBook = books.splice(bookIndex, 1)[0];
    
    res.json({
      message: 'Book deleted successfully',
      book: deletedBook
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// DELETE /books - Delete all books (bulk delete with confirmation)
app.delete('/books', (req, res) => {
  try {
    if (req.query.confirm !== 'true') {
      return res.status(400).json({
        error: 'Add ?confirm=true to confirm bulk deletion',
        code: 'CONFIRMATION_REQUIRED'
      });
    }
    
    const deletedCount = books.length;
    books = [];
    nextId = 1;
    
    res.json({
      message: `Successfully deleted ${deletedCount} books`,
      deletedCount
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// GET /stats - Get statistics about the book collection
app.get('/stats', (req, res) => {
  try {
    const stats = {
      totalBooks: books.length,
      uniqueAuthors: new Set(books.map(book => book.author)).size,
      genreDistribution: books.reduce((acc, book) => {
        const genre = book.genre || 'Unknown';
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {}),
      yearRange: books.length > 0 ? {
        earliest: Math.min(...books.filter(book => book.year).map(book => book.year)),
        latest: Math.max(...books.filter(book => book.year).map(book => book.year))
      } : null,
      averageYear: books.filter(book => book.year).length > 0 
        ? Math.round(books.filter(book => book.year).reduce((sum, book) => sum + book.year, 0) / books.filter(book => book.year).length)
        : null
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    availableEndpoints: [
      'GET /health',
      'GET /books',
      'GET /books/:id',
      'POST /books',
      'PUT /books/:id',
      'PATCH /books/:id',
      'DELETE /books/:id',
      'DELETE /books?confirm=true',
      'GET /stats'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    code: 'SERVER_ERROR'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Books REST API Server running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;