# User Insertion Scripts

This directory contains scripts to insert users into the database for the Camtel application.

## Scripts

### 1. JavaScript Version (`insert-users.js`)

- **Usage**: `node scripts/insert-users.js`
- **Dependencies**: Node.js native modules
- **Features**: Basic user insertion with sample data

### 2. TypeScript Version (`insert-users.ts`)

- **Usage**: `npx tsx scripts/insert-users.ts`
- **Dependencies**: TypeScript support via tsx
- **Features**: Enhanced version with additional options

## Usage Examples

### Basic Usage

```bash
# JavaScript version
node scripts/insert-users.js

# TypeScript version
npx tsx scripts/insert-users.ts
```

### Advanced Options (TypeScript version only)

```bash
# Show help
npx tsx scripts/insert-users.ts --help

# Dry run - preview what will be inserted
npx tsx scripts/insert-users.ts --dry-run

# Generate 5 random test users
npx tsx scripts/insert-users.ts --count 5

# Create admin user only
npx tsx scripts/insert-users.ts --admin
```

## Environment Variables

Required:

- `DATABASE_URL`: PostgreSQL connection string

Optional:

- `NODE_ENV`: Set to 'production' for production SSL settings

## Default Users

The scripts create these default users:

1. **Admin User**
   - Email: `admin@camtel.cm`
   - Password: `admin123`
   - Role: `admin`
   - Must change password: No

2. **John Doe**
   - Email: `john.doe@camtel.cm`
   - Password: `user123`
   - Role: `user`
   - Must change password: Yes

3. **Jane Smith**
   - Email: `jane.smith@camtel.cm`
   - Password: `user123`
   - Role: `user`
   - Must change password: Yes

## Customization

### Modify User Data

Edit the `sampleUsers` array in either script to customize the default users:

```javascript
const sampleUsers = [
  {
    name: 'Your Name',
    email: 'your.email@camtel.cm',
    role: 'admin', // or 'user'
    serviceId: 'CAM001',
    idCardNumber: 'ID123456789',
    locationPlan: 'Plan_A',
    mustChangePassword: false,
    password: 'your-password',
  },
];
```

### Add Custom Fields

Both scripts support these optional fields:

- `phoneNumber`: User's phone number
- `image`: Profile image URL/path

## Database Schema

The scripts work with the following database tables:

- `user`: Main user information
- `account`: Authentication credentials (passwords)
- `user_phone_numbers`: Multiple phone numbers support

## Security Notes

- Passwords are automatically hashed using bcrypt
- The scripts check for existing users to avoid duplicates
- In production, ensure SSL is properly configured
- Change default passwords before deploying to production

## Troubleshooting

### Common Issues

1. **DATABASE_URL not set**

   ```
   DATABASE_URL environment variable is not set
   ```

   Solution: Set the environment variable or check your `.env` file

2. **Permission denied**

   ```
   Error: permission denied for database
   ```

   Solution: Ensure your database user has INSERT permissions

3. **Connection refused**
   ```
   Error: connect ECONNREFUSED
   ```
   Solution: Check if your database server is running and accessible

### Debug Mode

For debugging, you can modify the scripts to add more logging or use the `--dry-run` flag to preview operations.
