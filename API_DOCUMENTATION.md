# API Documentation - Family Survey System

Base URL: `http://localhost:5000/api`

## 📋 Table of Contents
1. [Members Endpoints](#members-endpoints)
2. [Families Endpoints](#families-endpoints)
3. [Statistics Endpoints](#statistics-endpoints)
4. [Request/Response Examples](#examples)

---

## Members Endpoints

### 1. Get All Members
**GET** `/members`

Returns all family members in the system.

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": 1,
      "family_id": 1,
      "name": "राजेश पाटील",
      "age": 45,
      "gender": "Male",
      "relation": "प्रमुख",
      "dob": "1979-03-15",
      "created_at": "2024-04-12T10:30:00.000Z",
      "updated_at": "2024-04-12T10:30:00.000Z"
    }
    // ... more members
  ]
}
```

---

### 2. Get Filtered Members
**GET** `/members/filter`

Filter members by various criteria.

**Query Parameters:**
- `ageMin` (optional) - Minimum age
- `ageMax` (optional) - Maximum age
- `gender` (optional) - "Male" or "Female" or "all"
- `relation` (optional) - Relation type
- `search` (optional) - Search by name or family_id

**Examples:**
```
GET /members/filter?ageMin=0&ageMax=5
GET /members/filter?gender=Female&ageMin=10&ageMax=18
GET /members/filter?search=पाटील
GET /members/filter?ageMin=0&ageMax=1&gender=Male
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "filters": {
    "ageMin": "0",
    "ageMax": "5",
    "gender": "all"
  },
  "data": [
    // Filtered members
  ]
}
```

---

### 3. Get Single Member
**GET** `/members/:id`

Get details of a specific member.

**Example:**
```
GET /members/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "family_id": 1,
    "name": "राजेश पाटील",
    "age": 45,
    "gender": "Male",
    "relation": "प्रमुख",
    "dob": "1979-03-15"
  }
}
```

---

### 4. Create New Member
**POST** `/members`

Add a new family member.

**Request Body:**
```json
{
  "family_id": 6,
  "name": "नवीन सदस्य",
  "gender": "Male",
  "relation": "प्रमुख",
  "dob": "1990-05-15"
}
```

**Note:** Age is automatically calculated from DOB.

**Response:**
```json
{
  "success": true,
  "message": "Member added successfully",
  "data": {
    "id": 26,
    "family_id": 6,
    "name": "नवीन सदस्य",
    "age": 34,
    "gender": "Male",
    "relation": "प्रमुख",
    "dob": "1990-05-15"
  }
}
```

---

### 5. Update Member
**PUT** `/members/:id`

Update an existing member's details.

**Request Body:**
```json
{
  "family_id": 1,
  "name": "अपडेट केलेले नाव",
  "gender": "Male",
  "relation": "मुलगा",
  "dob": "2000-01-01"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Member updated successfully",
  "data": {
    "id": 1,
    "family_id": 1,
    "name": "अपडेट केलेले नाव",
    "age": 24,
    "gender": "Male",
    "relation": "मुलगा",
    "dob": "2000-01-01"
  }
}
```

---

### 6. Delete Member
**DELETE** `/members/:id`

Delete a family member.

**Example:**
```
DELETE /members/26
```

**Response:**
```json
{
  "success": true,
  "message": "Member deleted successfully"
}
```

---

## Families Endpoints

### Get All Families (Grouped)
**GET** `/members/families`

Get all members grouped by family.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "family_id": 1,
      "total_members": 5,
      "members": [
        {
          "id": 1,
          "family_id": 1,
          "name": "राजेश पाटील",
          "age": 45,
          "gender": "Male",
          "relation": "प्रमुख",
          "dob": "1979-03-15"
        }
        // ... other family members
      ]
    }
    // ... other families
  ]
}
```

---

## Statistics Endpoints

### Get Overview Statistics
**GET** `/members/stats/overview`

Get overall statistics of the survey data.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMembers": 25,
    "totalFamilies": 5,
    "maleCount": 13,
    "femaleCount": 12,
    "childrenCount": 10,
    "infantsCount": 2
  }
}
```

---

## Examples

### Example 1: Filter Infants (0-1 year)
```bash
curl -X GET "http://localhost:5000/api/members/filter?ageMin=0&ageMax=1"
```

### Example 2: Filter Teenage Girls (10-18)
```bash
curl -X GET "http://localhost:5000/api/members/filter?gender=Female&ageMin=10&ageMax=18"
```

### Example 3: Add New Member
```bash
curl -X POST "http://localhost:5000/api/members" \
  -H "Content-Type: application/json" \
  -d '{
    "family_id": 1,
    "name": "नवीन सदस्य",
    "gender": "Male",
    "relation": "मुलगा",
    "dob": "2015-03-20"
  }'
```

### Example 4: Search by Name
```bash
curl -X GET "http://localhost:5000/api/members/filter?search=पाटील"
```

### Example 5: Complex Filter (Young Children, Female)
```bash
curl -X GET "http://localhost:5000/api/members/filter?ageMin=0&ageMax=5&gender=Female"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "All fields are required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Member not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error fetching members",
  "error": "Database connection failed"
}
```

---

## Health Check

### Check API Status
**GET** `/health`

**Response:**
```json
{
  "success": true,
  "message": "Family Survey API is running",
  "timestamp": "2024-04-12T10:30:00.000Z"
}
```

---

## Testing with Postman

1. Import the base URL: `http://localhost:5000/api`
2. Create requests for each endpoint
3. Set headers: `Content-Type: application/json`
4. Test CRUD operations in order

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- Express rate limit middleware
- Request throttling
- API authentication

---

## Authentication (Future)

Currently, the API is open. For production:
- Implement JWT authentication
- Add role-based access control
- Secure sensitive endpoints

---

## Notes

- All dates are in ISO 8601 format (YYYY-MM-DD)
- Age is automatically calculated from DOB
- Gender is ENUM ('Male', 'Female')
- All responses include `success` field
- Timestamps are in UTC
