# Kotek - eCommerce Website

Kotek is an eCommerce platform dedicated to selling a variety of computer equipment. Built with modern technologies, it offers a user-friendly interface and a seamless shopping experience.

## Features

- **User Authentication**: Secure login and registration for users.
- **Role-Based Access**: Admins can manage products and orders efficiently.
- **Product Management**: Admins can create, update, and delete products.
- **Analytics**: Admins can view a detailed analysis about their business.
- **Shopping Cart**: Users can add, remove, and update products in their cart.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Toast Notifications**: Real-time feedback for user actions.

## Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn
- **Backend**:
  - Next.js
  - Prisma
  - PostgreSQL
- **Authentication**:
  - NextAuth.js

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)

### Installation

1. Clone the repository:

   ```bash

   git clone https://github.com/yourusername/kotek.git

   ```

2. Navigate to the project directory:

   ```bash
   cd kotek
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   bun install
   ```

4. Set up your PostgreSQL database and update the environment variables in the `.env` file:

   ```plaintext
   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME
   NEXTAUTH_SECRET=your_secret_key
   ```

5. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any feature requests or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any inquiries, please reach out via [your email or contact method].

---

Thank you for checking out Kotek! We hope you enjoy your shopping experience.
